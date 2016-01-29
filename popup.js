$( document ).ready(function() {
	console.log('popup.js pew pew');
	try{
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
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'linkedNodeList':''},function(){
				$('#linkedNodeList').find('tr:gt(0)').remove();
				console.log('#clearMediaList did its thang:');
			});
		});

		var linkedNodeList

		//$('#linkedNodeList').append('<tr><td>popup.js</td><td>popup.js</td></tr>');
		chrome.storage.local.get('linkedNodeList', function (result) {
			$('#linkedNodeList').find('tr:gt(0)').remove();
			linkedNodeList = result.linkedNodeList;
			var linkedNodesJSON=JSON.parse('{ "linkedNodeList" : [' +linkedNodeList +']}');
			var myRow = ''
			for(i = 0; i < linkedNodesJSON.linkedNodeList.length; i++) {
				myRow += "<tr><td>" +
		        linkedNodesJSON.linkedNodeList[i].MediaID +
		        "</td><td>" +
		        decodeURI(linkedNodesJSON.linkedNodeList[i].NodeRef) +
		        "</td></tr>";
			}
			$('#linkedNodeList').append(myRow);
	    });

	    chrome.storage.onChanged.addListener(function(changes, nameSpace) {
	    	console.log('popup.js listener: storage changed');
	    });
		
		/*
		var linkedNodeList = chrome.storage.local.get('linkedNodeList');
		console.log('linkedNodeList:   '+linkedNodeList);
		
		$('#linkedNodeList').append('<tr><td></td><td>'+linkedNodeList+'</td></tr>');
		*/

	//chrome.runtime.sendMessage('popupID');
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
	} catch(err) {
		console.log(err);
	}
})