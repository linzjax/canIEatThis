"use strict";

var notFoodWords = ['and','of','the','tbsp','tablespoon','tsp','teaspoon','cup','lb',"½","¼",'more','plus'];

var isItFood = function(searchItem){
	return new Promise(function(resolve, reject){
		var url = "http://api.nal.usda.gov/ndb/search/?format=json&q=" + searchItem + "&max=10&api_key=sL2vwCYjA3Dus4EuO7C3O5Zgo4zBYpfgO1khTCKC";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);

		xhr.onreadystatechange = function(){
			if (xhr.status === 404){
				resolve();
			}
			if (xhr.readyState === 4 && xhr.status === 200){
				var counter = 0;
				var	response = JSON.parse(xhr.responseText);
				response.list.item.filter(function(food){
					var thing = food.name.toLowerCase()//.split(' ');
					if (thing.match(searchItem)){
						counter++;
					}
				});
				if (counter > 0){
					resolve(searchItem);
				} else {
					resolve();
				}
			}//end readyState
		};//onreadystatechange

		xhr.onerror = function(){
			resolve();
		};

		xhr.send();
	});
};

var prom = function(ingredients){

	var ingredientsArray = ingredients.toLowerCase().replace('/\W+/g', "").replace(/\r?\n|\r/g,'').split(/[()]+/);
	if (ingredientsArray.length > 1){
		ingredientsArray = ingredientsArray[0] + ' ' + ingredientsArray[2];
	} else {
		ingredientsArray = ingredientsArray[0];
	}
	ingredientsArray = ingredientsArray.split(' ').filter(function(data){
		var counter = 0;
		notFoodWords.forEach(function(word){
			if (word === data)
				counter++;
		});

		if (counter === 0)
			return data;
	}).filter(function(data){
		if (!parseInt(data))
			return data;
	});

	console.log(ingredientsArray);
	return Promise.all(ingredientsArray.map(isItFood)).then(function(values){
		var iString = values.filter(function(item){
			if (item !== '')
				return item;
		}).join(' ');
		console.log(iString);
		return iString;
	});
};




