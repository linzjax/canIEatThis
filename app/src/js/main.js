function getDiet(diet) {
	var base_url = 'http://localhost:3000/api/v1';

	$.get(base_url + '/diet/' + diet, function(results) {
		results.forEach(function(result) {
			$('#results').append('<li>' + result.name + '</li>');
		})
		console.log(results);
	});
}

$(document).ready(function() {
	getDiet('paleo');
});