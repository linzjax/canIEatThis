//JUST REALIZED! If everything is hunkydory, it will never remove the form. Need to figure out a way to signify "GOOD TO GO! EAT THAT THANG".


var categories = Object.keys(dontEat);
var recipeIngredients = [];

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
			//if pages are pinterest formatted, they will all have li items with the class "ingredient". Convenient!
			var ingredientClasses = doc.querySelectorAll('[itemprop=ingredients]');
			//if they are not pinterest formatted, allow them to use the form
			if (ingredientClasses.length === 0){
				document.getElementById('unsafe').innerHTML  = "<h2>What are the ingredients?</h2><form id='recipeForm'><textarea></textarea><br><button id='submit'>Double Check</button></form>";
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
		console.log(ingredient[i].childNodes)
		//check if there's more than just text
		if (ingredient[i].childNodes.length > 1){
			var ingredientWithLinks = '';
			for (j = 0; j < ingredient[i].childNodes.length; j++){
				//check if it's not text
				if (!ingredient[i].childNodes[j].data){
					//if it's a link, get it's text
					ingredientWithLinks += ingredient[i].childNodes[j].text;
				} else{
					//if it's text, pull out the data
					ingredientWithLinks += ingredient[i].childNodes[j].data;
				} //end !text
			}//end for(j)
			recipeIngredients.push(ingredientWithLinks);
		//if it's all good and there are no links, go ahead
		} else if (ingredient[i].childNodes.length === 1) {
			recipeIngredients.push(ingredient[i].childNodes[0].data);
		} // end if multiple childNodes
	} //for ingredient length
};

var compareIngredients = function(ingredients){
	var finalList = [];
	var ingredientsToDiplay = '<h2>You should leave these out:</h2>';

	//go through each ingredient scraped
	ingredients.forEach(function(ingredient){
		var cut_ingredient = ingredient;
		//format the ingredients so that they don't list portion amounts
		if (parseInt(ingredient) && ingredient.length > 2){
			cut_ingredient = ingredient.split(' ').slice(2).join(' ').toLowerCase();
			cut_ingredient = cut_ingredient.split(',')[0];
		} else {
			cut_ingredient
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
						if (cut_ingredient === item){
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
		document.getElementById('submit').addEventListener('click', function(event){
			event.preventDefault();
			ingredientsFromForm = document.getElementById("recipeForm").elements[0].value;
			ingredientsFromForm = ingredientsFromForm.split('\n');
			recipeIngredients = ingredientsFromForm.slice(0);
			compareIngredients(recipeIngredients);
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

saveIngredients();
