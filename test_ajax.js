"use strict";
var ingredients = ["1", "tablespoon", "vanilla", "sweet","potato"];
var ingredientString = "";


var isItFood = function(searchItem){
	return new Promise(function(resolve, reject){
		var url = "http://api.nal.usda.gov/ndb/search/?format=json&q=" + searchItem + "&api_key=gCd9veMtkhLO0qPpxbfOUP16GJ9s9sQnUdo8Ysl7";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);

		xhr.onreadystatechange = function(){
			if (xhr.status === 404){
				reject(Error("404 Error"));
			}
			if (xhr.readyState === 4 && xhr.status === 200){
				var x = 0;
				var foodName = '';
				var	response = JSON.parse(xhr.responseText);
				response.list.item.filter(function(food){
					var thing = food.name.toLowerCase().split(' ');
					if (thing[0].match(searchItem)){
						x++;
						console.log(thing);
						foodName = thing[0];
					}
				});
				if (x > 0){
					console.log(foodName);
					// resolve(foodName);
				}
			}//end readyState
		};//onreadystatechange

		xhr.onerror = function(){
			reject(Error("Network Error"));
		};

		xhr.send();
	});
};


ingredients.forEach(function(data){
	return isItFood(data)
});






