// closing tabs- can't be done ON the tabs, but rather on the background script. This runs all the time and listens to all calls from the extension across all tabs..
//alert('Universal Form Controller loaded');
chrome.runtime.onMessage.addListener(
	function(message,sender,sendResponse){
		//alert(message.message);
		try {	
			//var messageType = message.message.substring(0,7);
			//var message.messageData = message.message.substring(8,message.length);
			//alert('background.js-chrome.runtime.onMessage:  ' + messageType + '     : UFC message.messageData:' + message.messageData);
			switch(message.messageType) {
				case "killTab":
					sendResponse({message:"background script killing it yo"});
					//sendResponse({message:'background script killing it, yo',senderTabId:sender.tab.id});
					chrome.tabs.remove(sender.tab.id);
				break;

				case "scrnSht":
					console.log("bk scrnSht");
					chrome.tabs.captureVisibleTab(function(myImageData){

						console.log("bk scrnSht myImageData:"+myImageData);
						var myImage = document.createElement("img");
						myImage.id = "imageId";
						myImage.src = myImageData
						//myImage.src = myImageData.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
						chrome.downloads.download(myImage,function(downloadId){});
						

						//chrome.runtime.sendMessage({messageType:'downloadImage', imageData:myImageData },function(response){
						//captureVisibleTabStatus='working on captureVisibleTab';
						//  ADDING IMAGE TO BACKGROUND PAGE
						/*
						alert('captureVisibleTab URL: '+myImageData);
						var myImage = document.createElement("img");
						var imageParent = document.getElementsByTagName("body");
						myImage.id = "imageId";
						myImage.className = "imageClass";
						myImage.src = myImageData;            // image.src = "IMAGE URL/PATH"
						imageParent.appendChild(myImage);
						
						/*
						var image = new Image();
						var newCanvas = document.createElement("canvas");
						var link = document.createElement('a');
						image.onload = function() {
							var myCanvas = screenshot.content;
							myCanvas.width = image.width;
							myCanvas.height = image.height;
							var context = myCanvas.getContext("2d");
							context.drawImage(image, 0, 0);

							// save the image
							
							link.download = "download.png";
							link.href = screenshot.content.toDataURL();
							
						};
						*/
						//sendResponse({'message':'response from captureVisibleTab', 'myImageData':myImageData});
						//sendResponse({'message':'response from captureVisibleTab'});
					});
					//sendResponse({'message':'Background.js captureVisibleTab Status: '+captureVisibleTabStatus,'senderTabId':sender.tab.id});
					sendResponse({'message':'background scrnSht done'});
				break;

				case "refNode":
					//alert('refNode:  ' + messageType + '     : UFC message.messageData:' + message.messageData);
					//var myPage = chrome.extension.getBackgroundPage();
					//alert(chrome.extension.getBackgroundPage().document.getElementById("linkedNodeList").innerHTML);
					//myPage.find("#linkedNodeList").append('<tr><td>new</td><td>new</td></tr>');
				break;

				case "updtMRF":
					chrome.storage.local.get('nodeRefList', function (result) {
						var nodeRefList = result.nodeRefList;
						
						if(nodeRefList===''){
								nodeRefList = message.messageData;
							} else {
								nodeRefList = nodeRefList + ','+ message.messageData;
							};
						chrome.storage.local.set({'nodeRefList': nodeRefList }, function() {
        				});
    				});
				break;

				case "updtDLF":
					chrome.storage.local.get('linkedMediaList', function (result) {
						var linkedMediaList = result.linkedMediaList;

						if(linkedMediaList===''){
							linkedMediaList = message.messageData;
						} else {
							linkedMediaList = linkedMediaList + ',' + message.messageData;
						};
						chrome.storage.local.set({'linkedMediaList': linkedMediaList }, function() {
						});
						//alert("updtDLF: chrome.storage.local.set: linkedMediaList: "+linkedMediaList);
					});
					//sendResponse({'message':'UFC: updtDLF completed in background.','senderTabId':sender.tab.id});
				break;

				default:
					sendResponse({message:"UFC: unhandled Chrome runtime message","senderTabId":sender.tab.id});
				break;

			}
		} catch(err) {
			//alert(err);
			sendResponse({message:"bkg script err:"+err,senderTabId: sender.tab.id});
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


