// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..

chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		try {	
			var messageType = message.substring(0,7);
			var messageContent = message.substring(8,message.length);
			
			//alert('background.js-chrome.runtime.onMessage:  ' + messageType + '     : UFC messageContent:' + messageContent);
			switch(messageType) {
				case "killTab":
					chrome.tabs.remove(sender.tab.id);
				break;

				case "refNode":
					//alert('refNode:  ' + messageType + '     : UFC messageContent:' + messageContent);
					//var myPage = chrome.extension.getBackgroundPage();
					//alert(chrome.extension.getBackgroundPage().document.getElementById("linkedNodeList").innerHTML);
					//myPage.find("#linkedNodeList").append('<tr><td>new</td><td>new</td></tr>');
				break;

				case "updtMRF":
					chrome.storage.local.get('nodeRefList', function (result) {
						var nodeRefList = result.nodeRefList;
						
						if(nodeRefList===''){
								nodeRefList = messageContent;
							} else {
								nodeRefList = nodeRefList + ','+ messageContent;
							};
						chrome.storage.local.set({'nodeRefList': nodeRefList }, function() {
        				});
    				});
				break;

				case "updtDLF":
					chrome.storage.local.get('linkedMediaList', function (result) {
						linkedMediaList = result.linkedMediaList;
						if(linkedMediaList===''){
							linkedMediaList = messageContent;
						} else {
							linkedMediaList = linkedMediaList + ',' + messageContent;
						};
						chrome.storage.local.set({'linkedMediaList': linkedMediaList }, function() {
						});
					});
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


