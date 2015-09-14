var categories = Object.keys(dontEat);
var recipe_ingredients = [];

var saveIngredients = function(){
	getCurrentTabUrl(function(url){
		getIngredients(url);
	});
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

			for (i = 0; i < ingredient.length; i++){
				if (ingredient[i].childNodes.length > 1){
					var ingredient_url = '';
					for (j = 0; j < ingredient[i].childNodes.length; j++){
						
						if (!ingredient[i].childNodes[j].data){
							ingredient_url += ingredient[i].childNodes[j].text;

						} else{
							ingredient_url += ingredient[i].childNodes[j].data;
						} //end if not text, try link
					}
					recipe_ingredients.push(ingredient_url);
				} else {
					recipe_ingredients.push(ingredient[i].childNodes[0].data);
				} // end if multiple childNodes
			} //for ingredient lenth
		}//end xhr
		displayUnsafe(recipe_ingredients);
	}

	xhr.open("GET", url, true);
	xhr.send(null);
};




var displayUnsafe = function(ingredients){
	ingredients.forEach(function(ingredient){
		var cut_ingredient = ingredient;
		if (parseInt(ingredient)){
			cut_ingredient = ingredient.split(' ').slice(2).join(' ');
			cut_ingredient = cut_ingredient.split(',')[0];
		}
		console.log(cut_ingredient);
		categories.forEach(function(group){

			dontEat[group].forEach(function(food){

				if (cut_ingredient.match(food)){
					document.getElementById('unsafe').innerHTML += "<li>" + food + "</li>";
				}
			});
		});

	});

	

};

saveIngredients();
