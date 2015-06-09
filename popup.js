$( document ).ready(function() {

	$('#getDemFields').click(function(){
		var myText = "getDemFields clicked";
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{greeting: "getDemFields"},
				function(response) {
					console.log('contentscript returned ' + response.farewell);
				}
			);
		});
	});
})