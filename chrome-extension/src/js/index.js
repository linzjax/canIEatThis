var displayList = function(){
	
		chrome.storage.sync.get(function(result){
			result.recipe.forEach(function(data){
				var thing = "<li>" + data + "</li>";
				document.getElementById("indexIng").innerHTML += thing;
			});
		});
		
	
};


document.addEventListener('DOMContentLoaded', function(){
	displayList();
});