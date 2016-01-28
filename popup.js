$( document ).ready(function() {
	$( "#tabs" ).tabs();
	$('#getDemFields').click(function(){
		//var myText = "getDemFields clicked";
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
	$('#clearMediaList').click(function(){
		$("#linkedNodeList tr").each().remove();
	});

	/*

	chrome.runtime.onMessage.addListener(
		function(message,sender,sendResponse){
			try {	
				
				var messageType = message.substring(0,7);
				var messageContent = message.substring(8,message.length);
				alert('popup.js:'+messageType);

				//console.log('========UFC messageType:' + messageType + '     : UFC messageContent:' + messageContent);
				$("#linkedNodeList").append('<tr><td>new</td><td>new</td></tr>');
					/*
				switch(messageType) {

					case "refNode":
						console.log('Popup listening on the popup?');
					break;

					default:
						sendResponse({'message':'UFC popup: unhandled Chrome runtime message','senderTabId':sender.tab.id});
					break;

				}
				
			} catch(err) {
				console.log(err);
			}
			
		})
		*/
})