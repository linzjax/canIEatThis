var categories = Object.keys(dontEat);
var recipeIngredients = [];

var saveIngredients = function(){
	getCurrentTabUrl(function(url){
		getIngredients(url);
	});
};



//check if the ingredients list contains anything other than plain text.
var ingredientsWithLinks = function(ingredient){
	for (i = 0; i < ingredient.length; i++){
		if (ingredient[i].childNodes.length > 1){
			var ingredientWithLinks = '';

			for (j = 0; j < ingredient[i].childNodes.length; j++){
				
				if (!ingredient[i].childNodes[j].data){
					ingredientWithLinks += ingredient[i].childNodes[j].text;

				} else{
					ingredientWithLinks += ingredient[i].childNodes[j].data;
				} //end if not text, try link
			}
			recipeIngredients.push(ingredientWithLinks);

		} else {
			recipeIngredients.push(ingredient[i].childNodes[0].data);
		} // end if multiple childNodes
	} //for ingredient length
};

var getCurrentTabUrl = function(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
};

var getIngredients = function(url){
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.onreadystatechange = function(data){
		if(xhr.readyState === 4 && xhr.status === 200){

			
			var response = xhr.responseText;
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, 'text/html');

			if (!doc.querySelectorAll('li.ingredient')){
				console.log('oh no');
				return;
			}
				

			var ingredient = doc.querySelectorAll('li.ingredient');

			ingredientsWithLinks(ingredient);
			
		}//end xhr
		displayUnsafe(recipeIngredients);
	};

	xhr.open("GET", url, true);
	xhr.send(null);
};




var displayUnsafe = function(ingredients){
	var ingredientsToDisplay = [];

	//go through each ingredient scraped
	ingredients.forEach(function(ingredient){
		var cut_ingredient = ingredient;

		//format the ingredients so that they don't list portion amounts
		if (parseInt(ingredient)){
			cut_ingredient = ingredient.split(' ').slice(2).join(' ');
			cut_ingredient = cut_ingredient.split(',')[0];
		}
		
		//loop through each category of the dontEat list
		categories.forEach(function(group){
			//loop through each food item in the category
			dontEat[group].forEach(function(food){
				var x = 0;
				//if one of the ingredients contains a word that matches a risk item
				if (cut_ingredient.match(food)){
					//after double checking it hasn't already been accounted for;
					ingredientsToDisplay.forEach(function(item){
						if (item === food){
							x++;
						}
					});
					//if it's not already displayed, display it.
					if (x === 0){
						ingredientsToDisplay.push(food);


						document.getElementById('unsafe').innerHTML += "<li>" + food + "</li>";
					}
				}
			});
		});

	});

	

};

saveIngredients();
