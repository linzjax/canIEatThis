//JUST REALIZED! If everything is hunkydory, it will never remove the form. Need to figure out a way to signify "GOOD TO GO! EAT THAT THANG".


//get a list of ingredients.
//put each new line into an array
//break each line in to an array of individual words
//pass each word through the usda api to see if it's an actual food
//put words that are actually food
//this is then passed through my dontEat filter
//if they are in the dont eat filter, display those words.


var categories = Object.keys(dontEat);
var recipeIngredients = [];
var notFoodWords = ['and','of','the','tbsp','tbsp.','tablespoon','tsp','tsp.','teaspoon','cup','lb',"½","¼",'more','plus'];

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
	xhr.withCredentials = true;
	xhr.onreadystatechange = function(data){
		if(xhr.readyState === 4 && xhr.status === 200){	
			var response = xhr.responseText;
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, 'text/html');
			//if pages are pinterest formatted, they will all have li items with the class "ingredient". Convenient!
			var ingredientClasses = doc.querySelectorAll('[itemprop=ingredients]');
			
			//if they are not pinterest formatted, allow them to use the form
			if (ingredientClasses.length === 0){
				document.getElementById('unsafe').innerHTML  = "<h2>Hm... can't find the ingredients.</h2><p>Highlight the recipe ingredients and try again.</p>";
				displayUnsafe();
				return;
			}
			//if the page is pinterest formatted
			else {
				//check and see if there are any links
				ingredientsWithLinks(ingredientClasses);
				displayUnsafe();
				return;
			}
		}//end xhr
	};
	xhr.open("GET", url, true);
	xhr.send(null);
};

//check if the ingredients list contains anything other than plain text.
var ingredientsWithLinks = function(ingredient){

		for (i = 0; i < ingredient.length; i++){
			//check if there's more than just text
			if (ingredient[i].childNodes.length >= 1){
				var ingredientWithLinks = '';














				for (j = 0; j < ingredient[i].childNodes.length; j++){
					
					//check if it's not text

					if(ingredient[i].childNodes[j].childNodes.length !== 0) {

						if (!ingredient[i].childNodes[j].childNodes[0].text && !ingredient[i].childNodes[j].childNodes[0].data){

							
							ingredientWithLinks += '';
							//if it's a link, get it's text

							
						} else if (!ingredient[i].childNodes[j].childNodes[0].data){
							
							ingredientWithLinks += ingredient[i].childNodes[j].childNodes[0].text;
						}else {
							//if it's text, pull out the data
							
							ingredientWithLinks += ingredient[i].childNodes[j].childNodes[0].data;
						} //end !text
					}
					
					if (!ingredient[i].childNodes[j].text && !ingredient[i].childNodes[j].data){
						ingredientWithLinks += '';

					} else if (!ingredient[i].childNodes[j].data){
						//if it's a link, get it's text
						ingredientWithLinks += ingredient[i].childNodes[j].text;

					} else{
						//if it's text, pull out the data

						ingredientWithLinks += ingredient[i].childNodes[j].data;
					} //end !text
				}//end for(j)
				console.log(ingredientWithLinks);
				recipeIngredients.push(ingredientWithLinks);
			//if it's all good and there are no links, go ahead
			} else if (ingredient[i].childNodes.length === 1) {
				//console.log(ingredient[i].childNodes[0].childNodes[0])
				recipeIngredients.push(ingredient[i].childNodes[0].data);
			} // end if multiple childNodes
		} //for ingredient length
};









//************FORMATTING IS NEW ********************/


var formatIngredients = function(ingredient){
	// console.log(ingredient);
	// if (!ingredient.match(":")){

	// 	var ingredient_array = ingredient.split('\n').join(' ').split(',')//.join(' ').split('.').join(' ');
	// 	if (ingredient_array.length > 1)
	// 		console.log(ingredient_array);
	// }







	var cut_ingredient = ingredient;
	//format the ingredients so that they don't list portion amounts
	notFoodWords.forEach(function(notFood){
		if (cut_ingredient.match(notFood))
			
			cut_ingredient = cut_ingredient.replace(notFood, '');
	});
	
	if (parseInt(ingredient)){
		cut_ingredient = ingredient.split(' ').slice(1).join(' ').toLowerCase();
		cut_ingredient = cut_ingredient.split(',')[0];
	} else {
		cut_ingredient
	}

}











var compareIngredients = function(ingredients){
	var finalList = [];
	var ingredientsToDiplay = '<h2>You should leave these out:</h2>';
	//go through each ingredient scraped
	ingredients.forEach(function(ingredient){
		formatIngredients(ingredient);
		var cut_ingredient = ingredient;












		
		//loop through each category of the dontEat list
		categories.forEach(function(group){
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
	if (finalList.length !== 0)

		

		document.getElementById('unsafe').innerHTML = ingredientsToDiplay;
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
		/*recipeIngredients.forEach(function(data){
			prom(data);
		});*/
		compareIngredients(recipeIngredients);
	}
	
};

var saveIngredients = function(){
	getCurrentTabUrl(function(url){
		getIngredients(url);
	});
};



saveIngredients();
