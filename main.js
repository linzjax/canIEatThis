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

			var ingredient = doc.querySelectorAll('li.ingredient');

			for (i = 0; i < ingredient.length; i++){
				if (ingredient[i].childNodes.length > 1){
					var ingredient_url = '';
					for (j = 0; j < ingredient[i].childNodes.length; j++){
						
						if (!ingredient[i].childNodes[j].data){
							ingredient_url += ingredient[i].childNodes[j].text;

						}else{
							ingredient_url += ingredient[i].childNodes[j].data;
						}
					}
					recipe_ingredients.push(ingredient_url);
				}
				else {
					recipe_ingredients.push(ingredient[i].childNodes[0].data);
				}
			}
			console.log(recipe_ingredients);
			displayUnsafe(recipe_ingredients);
		}
	};

	xhr.open("GET", url, true);
	xhr.send(null);
};




var displayUnsafe = function(ingredients){
	ingredients.forEach(function(ingredient){
		categories.forEach(function(group){

			dontEat[group].forEach(function(food){

				if (ingredient.match(food)){
					document.getElementById('unsafe').innerHTML += "<li>" + food + "</li>";
				}
			});
		});

	});

	

};

saveIngredients();
