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
						chrome.storage.local.set({'linkedMediaList': linkedMediaList }, function() {});
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
							automationList = automationList + ',' + messageContent;
						};
						console.log("auto-list-upload automationList update:" + automationList);
						chrome.storage.local.set({'automationList': automationList }, function() {
						});
						console.log("auto-list-upload: chrome.storage.local.set: automationList item count: "+automationList.split(',').length);
					});
					sendResponse({'message':'auto-list-upload: automationList completed in background.'});
				break;

				case "createTab":
					var myUrl=message.url;
					var myActive=message.active;
					chrome.tabs.create(
						{url:myUrl,active:myActive}, 
						function(tab){
							console.log('open Tab for myUrl:'+myUrl);
							sendResponse({'message':'"Created Tab for '+myUrl+'"'});
						}
					);

				break;

				case "auto-start":
					chrome.storage.local.currentlyActiveTabs='';
					chrome.storage.local.currentlyActiveTabCount=0;
					chrome.storage.local.concurrentAutomationsAllowed=1;
					runNextTabInQueue ('auto-start');
					sendResponse({'message':'automation starting in background.'});

				break;

				case "auto-stop":
					chrome.storage.local.concurrentAutomationsAllowed=0;
					sendResponse({'message':'automation stopping in background.'});
				break;

				default:
					sendResponse({'message':'UFC: unhandled Chrome runtime message','senderTabId':sender.tab.id});
				break;

			}


		} catch(err) {
			alert(err);
		}
	
});


function runNextTabInQueue (nextAutomationLink){
	try{
		console.log('runNextTabInQueue('+nextAutomationLink);
		if(chrome.storage.local.currentlyActiveTabCount < chrome.storage.local.concurrentAutomationsAllowed){
			if(nextAutomationLink==='auto-start'){
				chrome.storage.local.get('automationList', function (result) {
					console.log("auto-start runNextTabInQueue automationList result: "+result.automationList);
					var parsedAutomationList = JSON.parse('{ "automationList" : [' +result.automationList +']}');
					for(i=0;i<parsedAutomationList.automationList.length;i++){
						if(parsedAutomationList.automationList[i].Status==="New"){
							chrome.storage.local.currentlyActiveTabCount=chrome.storage.local.currentlyActiveTabCount+1;
							var d = new Date();
							parsedAutomationList.automationList[i].Status="Started:"+d.toUTCString();
							chrome.tabs.create(
								{url:parsedAutomationList.automationList[i].Link,active:false}, 
								function(tab){
									chrome.storage.local.currentlyActiveTabs=chrome.storage.local.currentlyActiveTabs+","+tab.id;
									console.log(tab);
								}
							);
							break;
						}
					}
					var stringifiedAutomationList = JSON.stringify(parsedAutomationList.automationList).substring(1,JSON.stringify(parsedAutomationList.automationList).length-1)
					console.log("runNextTabInQueue automationList update: stringified JSON:" + stringifiedAutomationList);
					chrome.storage.local.set({'automationList':stringifiedAutomationList},function(){});
				});
			} else {
				chrome.storage.local.currentlyActiveTabCount=chrome.storage.local.currentlyActiveTabCount+1;
				chrome.tabs.create(
					{url:nextAutomationLink}, 
					function(tab){
						chrome.storage.local.currentlyActiveTabs=chrome.storage.local.currentlyActiveTabs+","+tab.id;
						console.log(data);
					}
				);
			}
		} else {
			if(chrome.storage.local.concurrentAutomationsAllowed!=0){
				console.log('runNextTabInQueue: else currentlyActiveTabCount > concurrentAutomationsAllowed, try again');
				setTimeout(function(){runNextTabInQueue(nextAutomationLink);},	2500);
			}
		}
	} catch(err) {
		console.log('runNextTabInQueue error:'+err);
	}
}

chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
	try{
		console.log('tab removed:'+tabId+' currentlyActiveTabs:'+chrome.storage.local.currentlyActiveTabs);
		if (chrome.storage.local.currentlyActiveTabs.includes(tabId)===true){
			chrome.storage.local.currentlyActiveTabs.replace(tabId,'').replace(',,',',')
			chrome.storage.local.currentlyActiveTabCount=chrome.storage.local.currentlyActiveTabCount-1;
			runNextTabInQueue ('auto-start');
		}
	} catch(err) {
		console.log('chrome.tabs.onRemoved.addListener error:'+err);
	}
})
