$( document ).ready(function() {
	console.log('popup.js active');
	try{
		$('#popup-header').append(' '+chrome.app.getDetails().version);
	} catch(err){
		console.log(err);
	}

	try{
		var tabCount =0;
		//var myQueryInfo = new Object();
		//myQueryInfo.currentWindow=true;
		chrome.tabs.query({currentWindow: true}, function(tabs){
			tabCount=tabs.length;
			$('#tabcount').append(tabCount);
		});
		
	} catch(err) {
		console.log(err);
	}

	try{
		$( "#tabs" ).tabs();
		//tab 2
		var nodeRefList
		chrome.storage.local.get('nodeRefList', function (result) {
			$('#nodeRefList').find('tr:gt(0)').remove();
			nodeRefList = result.nodeRefList;
			var linkedNodesJSON=JSON.parse('{ "nodeRefList" : [' +nodeRefList +']}');
			var myRow = ''
			for(i = 0; i < linkedNodesJSON.nodeRefList.length; i++) {
				myRow += "<tr><td>" +
		        linkedNodesJSON.nodeRefList[i].MediaID +
		        "</td><td>" +
		        decodeURI(linkedNodesJSON.nodeRefList[i].NodeRef) +
		        "</td><td>" +
		        decodeURI(linkedNodesJSON.nodeRefList[i].NodeURL) +
		        "</td><td>" +
		        decodeURI(linkedNodesJSON.nodeRefList[i].NodeId) +
		        "</td></tr>"
		        ;
			}
			$('#nodeRefList').append(myRow);
	    });

	    $('#clearNodeRefList').click(function(){
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'nodeRefList':''},function(){
				$('#nodeRefList').find('tr:gt(0)').remove();
				$('#nodeRefList').append('<tr><td>test mediaId</td><td>test Node Link</td><td>test Node URL</td><td>test NodeID</td></tr>');
				console.log('#clearNodeRefList did its thang:');
			});
		});

	    //tab 3
	    
	    var linkedMediaList
		chrome.storage.local.get('linkedMediaList', function (result) {
			$('#linkedMediaList').find('tr:gt(0)').remove();
			linkedMediaList = result.linkedMediaList;
			console.log('linkedMediaList results : '+linkedMediaList);
			
			var linkedMediaListJSON=JSON.parse('{ "linkedMediaList" : [' +linkedMediaList +']}');
			var myRow = ''
			for(i = 0; i < linkedMediaListJSON.linkedMediaList.length; i++) {
				myRow += "<tr><td>" +
		        linkedMediaListJSON.linkedMediaList[i].NodeRef +
		        "</td><td>" +
		        decodeURI(linkedMediaListJSON.linkedMediaList[i].MediaTitle) +
		        "</td><td>" +
		        decodeURI(linkedMediaListJSON.linkedMediaList[i].MediaLink) +
		        "</td><td>" +
		        decodeURI(linkedMediaListJSON.linkedMediaList[i].MediaID) +
		        "</td></tr>";
			}
			

			$('#linkedMediaList').append(myRow);
	    });

	    $('#clearLinkedMediaList').click(function(){
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'linkedMediaList':''},function(){
				$('#linkedMediaList').find('tr:gt(0)').remove();
				$('#linkedMediaList').append('<tr><td>test node/revision</td><td>test related Media title</td><td>test related Media link</td><td>test related Media ID</td></tr>');
				console.log('#clearLinkedMediaList did its thang:');
			});
		});

		// tab 4

		$('#getDemFields').click(function(){
			//var myText = "getDemFields clicked";
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{greeting: "getDemFields"},
					function(response) {
						console.log('page contentscript returned ' + response.farewell);
						$('#FieldList').html(response.myFields);

					}
				);
			});
		});

		//tab 5

		var automationListResult
		chrome.storage.local.get('automationList', function (result) {
			$('#autoListTable').find('tr:gt(0)').remove();
			automationListResult = result.automationList;
			console.log('automationListResult : '+automationListResult);
			var automationListResultJSON=JSON.parse('{ "automationListResult" : [' +automationListResult+']}');
			console.log( 'Number of Queued Items:' + automationListResultJSON.automationListResult.length );
			var myTableContent = ''
			for(i = 0; i < automationListResultJSON.automationListResult.length; i++) {
				myTableContent += "<tr><td>" +
		        decodeURI(automationListResultJSON.automationListResult[i].Link) +
		        "</td><td>" +
		        automationListResultJSON.automationListResult[i].Status +
		        "</td></tr>";
			}
			$('#autoListTable').html(myTableContent);
			
	    });		

		$('#auto-list-upload').click(function(){
			var urlItems = $('#auto-list-text').val().split('\n');
			//var autoListUpload='{"Link":"URL","Status":"Testing"}';
			var autoListUpload='';

			//var numToQueue=urlItems.length;
			console.log( 'Number of Items to upload:' + urlItems.length );
			for(i=0; i<urlItems.length; i++){
				autoListUpload=autoListUpload + ',{"Link" : "' + urlItems[i] + '","Status" : "New"}'
			}
			console.log('this is what we sending:'+autoListUpload);
			chrome.runtime.sendMessage(
				{greeting : "auto-list-upload", content : autoListUpload},
				function(response) {
					console.log('#auto-list-upload Background? returned:  ' + response.message);
				}
			);
		});

		$('#auto-reset').click(function(){
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'automationList':'{"Link":"none","Status":"n/a"}'},function(){
				$('#autoListTable').find('tr:gt(0)').remove();
				$('#autoListTable').html('<tr><th>Link</th><th>Status</th></tr><tr><td>reset clicked</td><td><span class="fa fa-times">reset clicked</span></td></tr>');
				console.log('#auto-reset did its thang:');
			});
		});

	    chrome.storage.onChanged.addListener(function(changes, nameSpace) {
	    	console.log('popup.js listener: storage changed');
	    });

	} catch(err) {
		console.log(err);
	}
})