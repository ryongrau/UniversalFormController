// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..

chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		if (message === 'close me'){
			chrome.tabs.remove(sender.tab.id);
		}else{
			sendResponse({'message':'the circle is now complete','senderTabId':sender.tab.id});
		}
});
