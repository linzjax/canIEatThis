var recipeIngredients = [];
//getting the url to put into the xhrequest
var getCurrentTabUrl = function(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
};


//ajax request, scrape to get 'ingredients' class
var getIngredients = function(url){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data){
		if(xhr.readyState === 4 && xhr.status === 200){
			var response = xhr.responseText;
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, 'text/html');
			//if pages are pinterest formatted, they will all have li items with the class "ingredient". Convenient!
			var scrapedIngredients = doc.querySelectorAll('itemprop.ingredients');

			if (scrapedIngredients.length === 0){
				scrapedIngredients = doc.querySelectorAll('li.ingredient');
			}
			
			//if they are not pinterest formatted, allow them to use the form
			if (scrapedIngredients.length === 0){
				document.getElementById('unsafe').innerHTML  = "<h2>Hm... can't find the ingredients.</h2><p>Highlight the recipe ingredients and try again.</p>";
				displayUnsafe();
				return;
			}
			//if the page is pinterest formatted
			else {
				//check and see if there are any links
				deepSearch(scrapedIngredients);
				displayUnsafe();
				return;
			}
		}//end xhr
	};
	xhr.open("GET", url, true);
	xhr.send(null);
};

//check if the ingredients list contains anything other than plain text.
var deepSearch = function(ingredients, fullText){
	var queue = [];
	var results = [];
	var v;
	
	for (var x = 0; x < ingredients.length; x++){
		queue.push(ingredients[x]);
	}

	while (queue.length > 0){
		currentItem = queue.shift();

		if (currentItem.childNodes.length) {
			for (var j = 0; j < currentItem.childNodes.length; j++)
				queue.unshift(currentItem.childNodes[j]);
		} else {
			results.unshift(currentItem);
		}
	}

	results.forEach(function(item){
		if (item.data) {
			result = item.data.replace('\n','');
		} else if (item.text) {
			result = item.text.replace('\n','');
		} else {
			return;
		}
		if (result.match(/\w/))
			recipeIngredients.push(result);
	});
};



//************FORMATTING ********************/


var formatIngredients = function(ingredient){
	//wait, why am I splitting by new line, if I'm formatting each individual ingredient?
	var queue;
	ingredient = ingredient.toLowerCase();

	if (ingredient.match('\\(')){
		ingredient = ingredient.split('(');
		ingredient = ingredient.shift() + ' ' + ingredient[0].split(')').pop();
	}
	

	ingredient = ingredient.split(' ');
	ingredient = ingredient.filter(function(word){
		if (word.match(/[A-Za-z]+/g))
			return word;
	}).join(' ');

	notFoodWords.forEach(function(notFood){
		ingredient = ingredient.replace(notFood, ' ');
	});

	return ingredient;
};


var compareIngredients = function(ingredients){
	var finalList = [];
	var ingredientsToDiplay = '<h2>You should leave these out:</h2>';
	//go through each ingredient scraped
	ingredients.forEach(function(ingredient){
		var cut_ingredient = formatIngredients(ingredient);
		//loop through each category of the dontEat list
		Object.keys(dontEat).forEach(function(group){
			//loop through each food item in the category
			dontEat[group].forEach(function(food){
				var x = 0;
				//if one of the ingredients contains a word that matches a risk item
				if (cut_ingredient.match(food)){
					//after double checking it hasn't already been accounted for;
					finalList.forEach(function(item){
						if (cut_ingredient === item){
							x++;
						}
					});
					exceptions.forEach(function(exception){
						if (cut_ingredient.match(exception)){
							x++;
						}
					});
					//if it's not already displayed, display it.
					if (x === 0){
						finalList.push(cut_ingredient);
						ingredientsToDiplay += "<li>" + cut_ingredient + "</li>";
					}//end if
				}//end if match(food)
			});//end dontEat.forEach
		});//end categories.forEach
	});//end ingredients.forEach

	//were there things in the final list? Update the html!
	document.getElementById('sendRecipe').addEventListener('click', function(e){
		chrome.storage.sync.set({recipe: recipeIngredients});

	});
	if (finalList.length !== 0)
		document.getElementById('unsafe').innerHTML = ingredientsToDiplay;
	if (finalList.length === 0 && recipeIngredients.length !== 0)
		document.getElementById('unsafe').innerHTML = "<h2>Hey, good news:</h2><p>This recipe is totally safe to eat!</p>";
};

var displayUnsafe = function(){
	//if the website is not pinterest formatted
	if (recipeIngredients.length === 0){
		//get the copy and pasted recipe from the form.
		var highlightIngredients;
		chrome.tabs.executeScript({
			code: "window.getSelection().toString();"
		}, function(selection) {
			highlightIngredients = selection[0].split('\n').slice(0).filter(function(item){
				if (item !== "")
					return item;
			});
			compareIngredients(highlightIngredients);
		});
		
	} //if ajax was successful...
	else {
		compareIngredients(recipeIngredients);
	}
	
};

var saveIngredients = function(){
	getCurrentTabUrl(function(url){
		getIngredients(url);
	});
};


chooseDiet.then(
	function(result){
		Object.keys(diets).forEach(function(diet){
			if (diet === result){
				dontEat = diets[diet];
				dontEat = dietBuilder('dontEat', dontEat);
			}
		});
	console.log(result);
	return dontEat;
}, function(err){
	console.log('uuuugh', err);
}).then(function(){
	saveIngredients();
});


