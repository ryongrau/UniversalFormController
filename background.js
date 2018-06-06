// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..
chrome.runtime.sendMessage('hello from the background');
var storageQueue=[];
var storageQueueActive=false;
chrome.storage.local.currentlyActiveTabs='';
chrome.storage.local.currentlyActiveTabCount=0;

//################ TEST DATA
var testResultList='{"Link":"test1","Status":"test2","myObject":"test3"}';
//'{"NodeRef":"'+myLinkedNode+'","MediaTitle":"'+myMediaTitle+'","MediaLink":"'+myMediaLink+'","MediaID":"'+myMediaID+'"}'
chrome.storage.local.set({'nodeRefList':testResultList }, function() {
	console.log('set test linkedMediaList:');

});
chrome.storage.local.set({'linkedMediaList':testResultList }, function() {
	console.log('set test linkedMediaList');
});
chrome.storage.local.set({'automationList':testResultList }, function() {
	console.log('set test automationList');
	chrome.storage.local.get('automationList', function (result) {
		console.log(result.automationList);
	});
});
//################ END TEST DATA

chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		try {	
			var messageType = message.greeting;
			var messageContent = message.content;
			console.log('messageType:  ' + messageType );
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
					// needs to be queued
					addToStorageQueue('nodeRefList',messageContent);
					/*
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
					*/
					sendResponse({'message':'UFC updtMRF completed in background.'});

				break;

				case "updtmrn":
					// needs to be queued
					addToStorageQueue('linkedMediaList',messageContent);

					/*
					chrome.storage.local.get('linkedMediaList', function (result) {
						var linkedMediaList = result.linkedMediaList;
						// TO DO: look for the file ID, if its not there, add new line, else find in array & add in link field
						if(linkedMediaList===''){
							linkedMediaList = messageContent;
						} else {
							linkedMediaList = linkedMediaList + ',' + messageContent;
						};
						chrome.storage.local.set({'linkedMediaList': linkedMediaList }, function() {});
						console.log("updtmrn: chrome.storage.local.set: linkedMediaList item count: "+linkedMediaList.split(',').length);
						
					});
					*/
					sendResponse({'message':'UFC updtmrn completed in background.'});
				break;

				case "auto-list-upload":
					// needs to be queued
					addToStorageQueue('automationList',messageContent);
					/*
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
					*/
					sendResponse({'message':'auto-list-upload: automationList completed in background.'});

				break;

				case "createTab":
					var myUrl=message.url;
					var myActive=message.active;
					chrome.tabs.create(
						{url:myUrl,active:myActive}, 
						function(tab){
							console.log('open Tab for myUrl:'+myUrl);
							
						}
					);
					sendResponse({'message':'Created Tab for: '+myUrl});
				break;

				case "auto-start":
					chrome.storage.local.currentlyActiveTabs='';
					chrome.storage.local.currentlyActiveTabCount=0;
					chrome.storage.local.concurrentAutomationsAllowed= message.setConcurrentAutomationsAllowed;
					console.log('chrome.storage.local.concurrentAutomationsAllowed:'+chrome.storage.local.concurrentAutomationsAllowed);
					for (i=0;i<chrome.storage.local.concurrentAutomationsAllowed;i++){
						runNextTabInQueue ('auto-start');
					}
					sendResponse({'message':'automation starting in background for '+chrome.storage.local.concurrentAutomationsAllowed+' tabs'});

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
			console.log(err);
		}
	
});

function addToStorageQueue(setStorage,newContent){
	console.log('addToStorageQueue ('+setStorage+', '+newContent+')');
	try {
		storageQueue.push([setStorage,newContent]);
		console.log('number of queue sotrage items:'+ storageQueue.length);
		if(storageQueueActive===false){
			storageQueueActive=true;
			console.log('storageQueueActive=false; start addNextInQueueToStorage()');
			addNextInQueueToStorage();
		} else {
			console.log('storageQueueActive=true; no need to start addNextInQueueToStorage()');
		};
	} catch(err){
		console.log(err)
	}
};

function addNextInQueueToStorage(){
	try{
		//console.log('function addNextInQueueToStorage()');
		if (storageQueue.length>0){
			var myStorage =storageQueue[0][0].toString();
			var myNewData=storageQueue[0][1];
			console.log('addNextInQueueToStorage() Adding Item to Storage Set '+myStorage+';  with new content: '+myNewData);
			chrome.storage.local.get(myStorage, function (result) {
				var resultList;
				switch(myStorage) {
					case "nodeRefList":
						resultList=result.nodeRefList;
					break;
					case "linkedMediaList":
						resultList=result.linkedMediaList;
					break;
					case "automationList":
						resultList=result.automationList;
					break;
				}
				if(resultList===''){
					resultList = myNewData;
				} else {
					resultList = resultList + ',' + myNewData;
				};
				console.log('full resultList:'+resultList);
				//console.log("addNextInQueueToStorage update:"+ + resultList);
				switch(myStorage) {
					case "nodeRefList":
						chrome.storage.local.set({nodeRefList:resultList }, function() {

						});
					break;
					case "linkedMediaList":
						chrome.storage.local.set({linkedMediaList:resultList }, function() {

						});
					break;
					case "automationList":
						chrome.storage.local.set({automationList:resultList }, function() {

						});
					break;
				}
				
				storageQueue.shift();
				if (storageQueue.length>0){
					console.log(storageQueue.length+' more items to add to storage: shift & addNextInQueueToStorage()');
					addNextInQueueToStorage();
				}else{
					console.log(storageQueue.length+' more items to add, deactivating storage queue');
					storageQueueActive=false;
				};
			});
		}

	} catch(err) {
		alert(err);
	}

};

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
		if (chrome.storage.local.currentlyActiveTabs.includes(tabId)===true){
			console.log('tab removed:'+tabId+' currentlyActiveTabs:'+chrome.storage.local.currentlyActiveTabs);
			chrome.storage.local.currentlyActiveTabs.replace(tabId,'').replace(',,',',')
			chrome.storage.local.currentlyActiveTabCount=chrome.storage.local.currentlyActiveTabCount-1;
			runNextTabInQueue ('auto-start');
		}
	} catch(err) {
		console.log('chrome.tabs.onRemoved.addListener error:'+err);
	}
})
