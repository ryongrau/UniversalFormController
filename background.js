// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..
alert('background.js');
/*
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
		alert('background.js-chrome.runtime.onMessage');

	});
*/

chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		try {	
			var messageType = message.substring(0,7);
			var messageContent = message.substring(8,message.length);
			
			alert('background.js-chrome.runtime.onMessage:  ' + messageType + '     : UFC messageContent:' + messageContent);
			switch(messageType) {
				case "killTab":
					chrome.tabs.remove(sender.tab.id);
				break;

				case "refNode":
					alert('refNode:  ' + messageType + '     : UFC messageContent:' + messageContent);

					//var myPage = chrome.extension.getBackgroundPage();
					//alert(chrome.extension.getBackgroundPage().document.getElementById("linkedNodeList").innerHTML);
					//myPage.find("#linkedNodeList").append('<tr><td>new</td><td>new</td></tr>');


				break;

				default:
					sendResponse({'message':'UFC: unhandled Chrome runtime message','senderTabId':sender.tab.id});
				break;

			}
		} catch(err) {
			alert(err);
		}
	

/*
		if (message === 'close me'){
			chrome.tabs.remove(sender.tab.id);
		}else if (message === 'another'){
		}else{
			sendResponse({'message':'UFC: unhandled Chrome runtime message','senderTabId':sender.tab.id});
		}
		*/
});
