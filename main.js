var categories = Object.keys(dontEat);
var recipeIngredients = [];

var saveIngredients = function(){
	getCurrentTabUrl(function(url){
		getIngredients(url);
	});
};


//if there is no 'ingredients' class
//accept text from the form as an alternative.


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

//getting the url to put into the xhrequest
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

//ajax request, scrape to get 'ingredients' class
var getIngredients = function(url){
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.onreadystatechange = function(data){
		if(xhr.readyState === 4 && xhr.status === 200){

			
			var response = xhr.responseText;
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, 'text/html');

				

			var ingredient = doc.querySelectorAll('li.ingredient');
			if (ingredient.length === 0){
				displayUnsafe();
				return;
			}
			//does the ingredient have a link
			else {
				//parse out the text
				ingredientsWithLinks(ingredient);
				displayUnsafe();
				return;
			}
			
		}//end xhr
	};

	xhr.open("GET", url, true);
	xhr.send(null);
};

var pinterestFormatted = function(){


//was the page pinterest formatted?
	
};

var compareIngredients = function(ingredients){
	var finalList = [];
	var ingredientsToDiplay = '';
	console.log(ingredients);

	//go through each ingredient scraped
	ingredients.forEach(function(ingredient){
		var cut_ingredient = ingredient;

		//format the ingredients so that they don't list portion amounts
		if (parseInt(ingredient)){
			cut_ingredient = ingredient.split(' ').slice(2).join(' ').toLowerCase();
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
					finalList.forEach(function(item){
						if (item === food){
							x++;
						}
					});
					//if it's not already displayed, display it.
					if (x === 0){
						finalList.push(food);
						ingredientsToDiplay += "<li>" + food + "</li>";
					}
				}
			});
		});

	});
	if (finalList.length !== 0)
		document.getElementById('unsafe').innerHTML = ingredientsToDiplay;
}

var displayUnsafe = function(){
	

	//if the website is not pinterest formatted
	if (recipeIngredients.length === 0){
		//get the copy and pasted recipe from the form.
		document.getElementById('submit').addEventListener('click', function(event){
			event.preventDefault();
			ingredient = document.getElementById("recipeForm").elements[0].value;
			ingredient = ingredient.split('\n');
			recipeIngredients = ingredient.slice(0);
			compareIngredients(recipeIngredients);
		});
	}
	else {
		compareIngredients(recipeIngredients);
	}
	
};





saveIngredients();
