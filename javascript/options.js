var saveOptions = function(){
	var diet = document.getElementById('diet').value;
	console.log(diet);
	chrome.storage.sync.set({
		currentDiet: diet
	}, function(){
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
};

var restoreOptions = function(){
	chrome.storage.sync.get({
		currentDiet: 'Paleo',
	}, function(items){
		console.log(items.currentDiet);
		document.getElementById('diet').value = items.currentDiet;
	});
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);