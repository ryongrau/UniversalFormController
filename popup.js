$( document ).ready(function() {
	console.log('popup.js pew pew');
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

	    //tab 3
	    var linkedMediaList
		chrome.storage.local.get('linkedMediaList', function (result) {
			$('#linkedMediaList').find('tr:gt(0)').remove();
			linkedMediaList = result.linkedMediaList;
			var linkedMediaListJSON=JSON.parse('{ "linkedMediaList" : [' +linkedMediaList +']}');
			var myRow = ''
			for(i = 0; i < linkedMediaListJSON.linkedMediaList.length; i++) {
				myRow += "<tr><td>" +
		        linkedMediaListJSON.linkedMediaList[i].NodeRef +
		        "</td><td>" +
		        decodeURI(linkedMediaListJSON.linkedMediaList[i].MediaTitle) +
		        "</td><td>" +
		        decodeURI(linkedMediaListJSON.linkedMediaList[i].MediaLink) +
		        "</td></tr>";
			}
			$('#linkedMediaList').append(myRow);
	    });

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

		$('#clearNodeRefList').click(function(){
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'nodeRefList':''},function(){
				$('#nodeRefList').find('tr:gt(0)').remove();
				console.log('#clearNodeRefList did its thang:');
			});
		});

		$('#clearLinkedMediaList').click(function(){
			//console.log($(this).attr("ID"));
			chrome.storage.local.set({'linkedMediaList':''},function(){
				$('#linkedMediaList').find('tr:gt(0)').remove();
				console.log('#clearLinkedMediaList did its thang:');
			});
		});

	    chrome.storage.onChanged.addListener(function(changes, nameSpace) {
	    	console.log('popup.js listener: storage changed');
	    });

	} catch(err) {
		console.log(err);
	}
})