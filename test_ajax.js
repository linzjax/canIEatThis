"use strict";


var isItFood = function(searchItem){
	return new Promise(function(resolve, reject){
		var url = "http://api.nal.usda.gov/ndb/search/?format=json&q=" + searchItem + "&max=10&api_key=gCd9veMtkhLO0qPpxbfOUP16GJ9s9sQnUdo8Ysl7";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);

		xhr.onreadystatechange = function(){
			if (xhr.status === 404){
				resolve();
			}
			if (xhr.readyState === 4 && xhr.status === 200){
				var counter = 0;
				var foodName = '';
				var	response = JSON.parse(xhr.responseText);
				response.list.item.filter(function(food){
					var thing = food.name.toLowerCase().split(' ');
					if (thing[0].match(searchItem)){
						counter++;
						foodName = thing[0];
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

	return Promise.all(ingredients.map(isItFood)).then(function(values){
		console.log(values.join(' '));
		var iString = values.filter(function(item){
			if (item !== '')
				return item;
		}).join(' ');
		console.log(iString);

	});
};



prom(['bear','colon','cancer','fruit']);




