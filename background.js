// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..
chrome.runtime.sendMessage('hello from the background');
chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		try {	
			var messageType = message.greeting;
			var messageContent = message.content;
			
			console.log('background.js-chrome.runtime.onMessage:  ' + messageType );
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

				case "updtmrn":
					chrome.storage.local.get('linkedMediaList', function (result) {
						var linkedMediaList = result.linkedMediaList;
						//  look for the file ID, if its not there, add new line, else array it, add in 
						if(linkedMediaList===''){
							linkedMediaList = messageContent;
						} else {
							linkedMediaList = linkedMediaList + ',' + messageContent;
						};
						chrome.storage.local.set({'linkedMediaList': linkedMediaList }, function() {
						});
						console.log("updtmrn: chrome.storage.local.set: linkedMediaList item count: "+linkedMediaList.split(',').length);
					});
					//sendResponse({'message':'UFC: updtmrn completed in background.','senderTabId':sender.tab.id});
				break;

				case "auto-list-upload":
					chrome.storage.local.get('automationList', function (result) {
						var automationList = result.automationList;
						if(automationList===''){
							automationList = messageContent;
						} else {
							automationList = automationList + messageContent;
						};
						chrome.storage.local.set({'automationList': automationList }, function() {
						});
						console.log("updtmrn: chrome.storage.local.set: automationList item count: "+automationList.split(',').length);
					});
					sendResponse({'message':'UFC: automationList completed in background.'});
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


