class DietBuilder {
	constructor() {
		this.base_url = 'http://localhost:3000/api/v1';
	}

	getDiet(diet) {
		let parent = this;
		$.get(this.base_url + '/diet/' + diet, function(data) {
			$('#results').empty();
			data.forEach(function(ft) {
				$('#results').append('<div class="row" id="' + ft.food_type_id + '"><h4>' + ft.name + '</h4></div>');
				parent.getFoodList(ft);
			});
		});
	}

	getFoodList(ft) {
		$.get(this.base_url + '/foodtype/' + ft.name, function(data) {
			data.forEach(function(result) {
				$('#' + ft.food_type_id).append('<div class="three columns">' + result.name + '</div>');
			});
		});
	}
}

class IngredientScraper {
	createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {

	    // Check if the XMLHttpRequest object has a "withCredentials" property.
	    // "withCredentials" only exists on XMLHTTPRequest2 objects.
	    xhr.open(method, url, true);

	  } else if (typeof XDomainRequest != "undefined") {

	    // Otherwise, check if XDomainRequest.
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);

	  } else {

	    // Otherwise, CORS is not supported by the browser.
	    xhr = null;

	  }
	  return xhr;
	}

	getIngredients(url) {
		var xhr = this.createCORSRequest('GET', url);
		xhr.setRequestHeader(
	    'X-Custom-Header', 'value');
		xhr.setRequestHeader(
			'Access-Control-Allow-Credentials', 'true')
		xhr.setRequestHeader(
			'Access-Control-Allow-Origin', 'http://localhost:3000')


		xhr.onreadystatechange = function(data){
			if(xhr.readyState === 4 && xhr.status === 200){
				var response = xhr.responseText;
				var parser = new DOMParser();
				var doc = parser.parseFromString(response, 'text/html');
				//if pages are pinterest formatted, they will all have li items with the class "ingredient". Convenient!
				var scrapedIngredients = doc.querySelectorAll('li[itemprop="recipeIngredient"]');
				if (scrapedIngredients) {
					$('#results').empty();
					scrapedIngredients.forEach(function(ingredient) {
						$('#results').append('<div class="row"><h4>' + ingredient.innerHTML + '</div>');
					});
				}
			}//end xhr
		};
		xhr.send(null);
	};
}

$(document).ready(function() {
	let db = new DietBuilder();
	let is = new IngredientScraper()

	db.getDiet('paleo');

	$('#diet-choice').on('change', function() { 
		var diet = $('#diet-choice').find(":selected").text();
		db.getDiet(diet)
	});

	$('#recipe-check-form').on('submit', function(e) {
		e.preventDefault();
		is.getIngredients($('#recipe-check').val())
	});
});