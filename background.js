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


// ############### Set Paragraph Variables
var paragraphTypesObj={
	"accordion":{"title":"Accordion","btnClass":".paragraphs-add-more-energy-paragraphs-accordion","default":"accordion-title",
		"fields":{"accordion-title":"input:text[name*='field_para_accordion_title'][name*='value']"}},
	"block-quo":{"title":"Blockquote","btnClass":".paragraphs-add-more-paragraphs-sp-blockquote","default":"quote-text",
		"fields":{"quote-text":"textarea:rich[name*='field_para_sp_rich_text'][name*='value']","name-of-person-cited":"input:text[name*='field_para_energy_bq_cite_name'][name*='value']","title-of-person-cited":"input:text[name*='field_para_energy_bq_cite_title'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-quote":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
	"block-ref":{"title":"Block-Reference","btnClass":".paragraphs-add-more-energy-paragraphs-block-ref","default":"block",
		"fields":{"layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","block":"input:text[name*='field_para_block_ref'][name*='bid']"}},
	"contact":{"title":"Contact-Reference","btnClass":".paragraphs-add-more-energy-paragraphs-contact","default":"contact",
		"fields":{"heading-text":"input:text[name*='field_paragraph_heading_text'][name*='value']","contact":"input:text[name*='field_para_contact_contacts'][name*='nid']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}},
	"container":{"title":"Container","btnClass":".paragraphs-add-more-paragraphs-sp-container","default":"",
		"fields":{}},
	"table":{"title":"Data-Table","btnClass":".paragraphs-add-more-paragraphs-sp-table","default":"display",
		"fields":{"display":"select[name*='field_para_sp_table_display']"}},
	"email":{"title":"Email-Subscription-Form","btnClass":".paragraphs-add-more-energy-paragraphs-subscription","default":"heading-text",
		"fields":{"heading-text":"input:text[name*='field_paragraph_heading_text'][name*='value']","description":"textarea[name*='field_summary'][name*='value']","subscription-type":"select[name*='field_para_sub_type']","mailchimp-form":"textarea[name*='field_mailchimp_form'][name*='value']","account-id":"input:text[name*='field_govdelivery_user'][name*='value']","topic-id":"input:text[name*='field_govdelivery_topic'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","color-scheme":"select[name*='field_para_sp_selectors'][name*='color']"}},
	"featured":{"title":"Featured-Item","btnClass":".paragraphs-add-more-energy-paragraphs-ref","default":"featured-item",
		"fields":{"featured-item":"input:text[name*='field_para_energy_ref_item'][name*='target_id']","title-override":"input:text[name*='field_para_energy_ref_title'][name*='value']","summary-override":"textarea:rich[name*='field_para_energy_ref_summary'][name*='value']","upload":"input:text","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","color-scheme":"select[name*='field_para_sp_selectors'][name*='color']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-title":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
	"list-full":{"title":"Formatted-List-(Full)","btnClass":".paragraphs-add-more-paragraphs-sp-list","default":"",
		"fields":{"list-style":"select[name*='field_para_sp_selectors'][name*='lists']"}},
	"list":{"title":"Formatted-List-(Simple)","btnClass":".paragraphs-add-more-paragraphs-sp-simple-list","default":"list",
		"fields":{"list":"textarea:rich[name*='field_para_sp_sl_rich_text'][name*='value']"}},
	"heading":{"title":"Heading","btnClass":".paragraphs-add-more-paragraphs-sp-heading","default":"heading-text",
		"fields":{"heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","heading-link":"input:text[name*='field_para_energy_heading_link'][name*='target_id']","anchor-title":"input:text[name*='field_para_energy_heading_anchor'][name*='value']"}},
	"image":{"title":"Image","btnClass":".paragraphs-add-more-paragraphs-sp-image","default":"caption-text-override",
		"fields":{"upload":"input:text","caption-text-override":"textarea:rich[name*='field_para_sp_img_caption'][name*='value']","attribution-text-override":"input:text[name*='field_para_sp_img_attrib'][name*='value']","alt-text-override":"input:text[name*='field_para_energy_img_alt'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","upload":"input:text[name*='field_para_sp_img_url'][name*='url']","open-url-in-a-new-window":"input:checkbox[name*='field_para_sp_img_url'][name*='attributes']"}},
	"listing-dynamic":{"title":"Listing-(Dynamic)","btnClass":".paragraphs-add-more-energy-paragraphs-listing-ref","default":"listing",
		"fields":{"heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","list-orientation":"select[name*='field_para_sp_selectors'][name*='listorientation']","list-style":"select[name*='field_para_sp_selectors'][name*='lists']","heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","listing":"input:text[name*='field_para_energy_listing_ref'][name*='target_id']"}},
	"listing-static":{"title":"Listing-(Static)","btnClass":".paragraphs-add-more-energy-paragraphs-listing-n-refs","default":"item","fields":{"heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","list-orientation":"select[name*='field_para_sp_selectors'][name*='listorientation']","list-style":"select[name*='field_para_sp_selectors'][name*='lists']","item":"input:text[name*='field_para_energy_ref_items'][name*='target_id']","how-many-to-add":"select[name*='field_para_energy_ref_items']"}},
	"multi-column":{"title":"Multi-Column","btnClass":".paragraphs-add-more-energy-paragraphs-multi-column","default":"layout-style","fields":{"layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}},
	"photo-gallery":{"title":"Photo-Gallery","btnClass":".paragraphs-add-more-energy-paragraphs-photo-gallery","default":"photo-gallery","fields":{"photo-gallery":"input:text[name*='field_para_energy_ref_pg'][name*='target_id']"}},
	"podcast":{"title":"Podcast","btnClass":".paragraphs-add-more-energy-paragraphs-podcast","default":"podcast-item","fields":{"title-override":"input:text[name*='field_para_energy_ref_title'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","podcast-item":"input:text[name*='field_para_energy_podcast'][name*='target_id']"}},
	"text":{"title":"Rich-Text","btnClass":".paragraphs-add-more-paragraphs-sp-rich-text","default":"rich-text","fields":{"rich-text":"textarea:rich[name*='field_para_sp_rich_text'][name*='value']"}},
	"text-full":{"title":"Rich-Text-(Full)","btnClass":".paragraphs-add-more-energy-paragraphs-full-rich-text","default":"full-rich-text","fields":{"full-rich-text":"textarea:rich[name*='field_full_rich_text'][name*='value']"}},
	"social":{"title":"Social-Media-Post","btnClass":".paragraphs-add-more-energy-paragraphs-social","default":"url","fields":{"url":"input:text[name*='field_embedded_post_url'][name*='url']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}},
	"statistic":{"title":"Statistic","btnClass":".paragraphs-add-more-energy-paragraphs-statistic","default":"statistic","fields":{"statistic":"input:text[name*='field_para_stat_number'][name*='value']","summary":"input:text[name*='field_para_stat_summary'][name*='value']","related-item":"input:text[name*='field_para_energy_ref_item'][name*='target_id']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","color-scheme":"select[name*='field_para_sp_selectors'][name*='color']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-title":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
	"tabs":{"title":"Tabs","btnClass":".paragraphs-add-more-energy-paragraphs-tabs","default":"","fields":{}},"video":{"title":"Video","btnClass":".paragraphs-add-more-energy-paragraphs-youtube","default":"caption","fields":{"video":"input:text","caption":"textarea:rich[name*='field_energy_youtube_caption'][name*='value']","attribution":"input:text[name*='field_energy_youtube_attribution'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}}
};
chrome.storage.local.set({'paragraphTypesObj':paragraphTypesObj }, function() {
	console.log('set test paragraphTypesObj');
});
var paragraphContainersObj={
	"body":{"addContainer":"div[id*=edit-field-body-paragraphs-und-add-more]","pgTable":"table[id*=field-body-paragraphs-values]"}
};
chrome.storage.local.set({'paragraphContainersObj':paragraphContainersObj }, function() {
	console.log('set test paragraphContainersObj');
});


chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		try {	
			var messageType = message.greeting;
			var messageContent = message.content;
			// console.log('messageType:  ' + messageType );
			switch(messageType) {
				case "killTab":
					chrome.tabs.remove(sender.tab.id);
				break;

				case "pound-it":
					var myNow = Date.now();
					var myTimestamp = myNow.toString();
					console.log(messageType + ' '+ sender.tab.id+' '+ myTimestamp +' '+ sender.tab.url);
					chrome.tabs.reload(sender.tab.id);
					sendResponse({'message':'acknowledged'});
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
