jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

$( document ).ready(function() {
    console.log( "UFC 1.21.18 at the ready: HREF::" + $(this).attr('href')); //redult: undefined
    console.log( "UFC document.URL:  " + document.URL);//your current page
	//console.log( "UFC document.referrer:  " + document.referrer );//page you're coming from
	for (var valuePair in $.url().param()){
		try {	var UFCFieldType = valuePair.substring(0,7);
			var UFCFieldID = valuePair.substring(8,valuePair.length);
			var UFCFieldData=$.url().param(valuePair);
			console.log('========UFC FieldType:' + UFCFieldType + '   :UFC FieldID:' + UFCFieldID + '   :Value:' + UFCFieldData);
			switch(UFCFieldType) {
				// timestamp takes text, just get the format right
				case 'ufc-txt':
					//console.log('>>>>>ufc-txt:'+UFCFieldID+' >>> '+UFCFieldData);
					$('#'+ UFCFieldID).val(UFCFieldData);
				break;

				
				case 'ufc-chk':
					if(UFCFieldData==='TRUE'){
						$('#'+ UFCFieldID).prop('checked',true);}
					else {	$('#'+ UFCFieldID).prop('checked',false);}
				break;

				case 'ufc-sel':
					$('#'+ UFCFieldID + ' option[value="' + UFCFieldData + '"]').prop('selected',true);
				break;
				
				// multiselect: important to ADD only-!
				case 'ufc-msl':
					for (var toAddToSelections in UFCFieldData.split(',')){
						//console.log('   toAddToSelections ufc-msl #' + UFCFieldID + ': ' + UFCFieldData.split(',')[toAddToSelections]);
						$('#'+ UFCFieldID + ' option[value="' +  UFCFieldData.split(',')[toAddToSelections] + '"]').prop('selected','selected');
					}
				break;
								
				//Body Text: hidden iFrame 
				case 'ufc-bod':
					console.log('case ufc-bod');
					//console.log('#cke_edit-body-und-0-value:::::'+$('#cke_edit-body-und-0-value').attr("title"));
					//console.log('#cke_edit-body-und-0-value.find.iframe:::::'+$('#cke_edit-body-und-0-value').find('iframe').contents().find("").html());
					//$('#edit-body-und-0-format--2').html(UFCFieldData);
					$('#cke_edit-body-und-0-value').contents().find('iframe').load(function(){
						console.log(' body iframe loaded');
						console.log($('#cke_edit-body-und-0-value').find('iframe').contents().html());
						$('iframe').contents().find('body').html(UFCFieldData);
					});
					$('#cke_contents_edit-body-und-0-value').html(UFCFieldData);//v1: now this seems to be missing..?


				break;
								
				//files
				case 'ufc-fml':// FILE FROM FILE LIBRARY-- 
					$('html, body').animate({ scrollTop: $(document).height()-$(window).height()}, 000);
					//***this doesn't need the filename to access so easily :)
					//var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;">' + $.url().param('ufc-fll') + '</div>';
					//$('body').append(htmlstr);
					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
					$('#mediaBrowser').load(function(){
						//console.log('#mediaBrowser Loaded plus media-browser-tabset tabs selecting 1');
						//console.log('parent tab: '+$('iframe').contents().find('a[href=#media-tab-library]').parent().parent().html());

						$('iframe').contents().find('a[href=#media-tab-library]').trigger('select');
						$('iframe').contents().find('a[href=#media-tab-library]').parent().trigger('select');
						$('iframe').contents().find('a[href=#media-tab-library]').parent().parent().trigger('select');
						//$('iframe').contents().find('#media-tab-upload,#media-tab-library').toggleClass('ui-tabs-hide');
						//end try
						$('iframe').contents().find('#edit-filename').val(UFCFieldData);
						$('iframe').contents().find('#scrollbox').load(function(){
							//console.log('#scrollbox loaded-2');
							$('iframe').contents().find('a.exposed-button.button').trigger('click');
							$('iframe').contents().find('a.exposed-button.button').html("still need to click");
						});
					});
				break;

				case 'ufc-fup'://file upload
					//console.log('--ufc-fup-- ');
					$('html, body').animate({ 
						scrollTop: $(document).height()-$(window).height()}, 
						000
					);
					
					var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;"><p>' + UFCFieldData + '</p></div>';
					$('body').append(htmlstr);

					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
					$('#mediaBrowser').load(function(){
						//console.log('#mediaBrowser loaded-1');
						//$('iframe').contents().find('#media-browser-page').load(function(){
							//console.log('#media-browser-iframe loaded-2');
							//$('iframe').contents().find('#media-tab-upload,#media-tab-library').toggleClass('ui-tabs-hide');
							//$('iframe').contents().find('#edit-filename').val(UFCFieldData);
							//$('iframe').contents().find('#edit-upload').trigger('click');
							//$('iframe').contents().find('a.exposed-button.button').html('wasuuup');
						//});
					});
				break;	
				
				case 'ufc-mdc'://UFC-Media Check- check the number of items expected against number of media found
					var myMatches = $('#media-browser-library-list tr').length;
					//alert(myMatches + ' - ' + UFCFieldData);
					if(myMatches==UFCFieldData){
						chrome.runtime.sendMessage('killTab',function(response){
							//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					}
				break;
				
				case 'ufc-mrf'://LIST MEDIA REFERENCES IN ufc
					//console.log('window.location.pathname:'+window.location.pathname);
					var myMatches = 0;
					var myLinkedNode = '';
					var myLinkedMediaId = '';
					var myLinkedURL='';
					var myLinkedNodeId = '';
					myLinkedMediaId = window.location.pathname.split( '/' )[4];
					//console.log('myLinkedMediaId:'+myLinkedMediaId);
					var myLinkAddition='';
					$('#content').find('h3 :contains(node)').each(function(){
						//console.log('ref by : '+$(this).parent().next().html() );
						myMatches+=1;
						myLinkedNode=encodeURI($(this).parent().next().html());
						myLinkedNodeId=encodeURI($(this).parent().next().html().split('(')[$(this).parent().next().html().split('(').length-1]);
						myLinkedNodeId=myLinkedNodeId.substring(7,(myLinkedNodeId.length-1));
						myLinkedURL=encodeURI($(this).parent().next().find('a').attr('href'));
						myLinkAddition='{"MediaID":"'+myLinkedMediaId+'","NodeRef":"'+myLinkedNode+'","NodeId":"'+myLinkedNodeId+'","NodeURL":"'+myLinkedURL+'"}'
        				console.log('updtMRF-'+myLinkAddition);
        				chrome.runtime.sendMessage('updtMRF-'+myLinkAddition)
					})
					/*
					if (UFCFieldData.split(',').length()>0){
						window.open('https://cms.doe.gov/admin/media/ref/'+UFCFieldData.split(',')[0]+'?ufc-mdu='+UFCFieldData.substring(indexOf(',')));
					}
		
					if(myMatches < 1){
						chrome.runtime.sendMessage('killTab',function(response){
							//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					} else {
						//console.log('media is used, keeping tab open');
					}
					*/
				break;

				case 'ufc-dlf':// find all associated files related to download revisions (use from )
					console.log('window.location.pathname.split(/)[3]='+window.location.pathname.split( '/' )[3])
					var revisionCount =-1;
					revisionCount = $('li :contains(Revisions)').length;
						console.log('revisionCount: '+revisionCount);		
					if (UFCFieldData==='fillAndKill'){
						listFiles();
						chrome.runtime.sendMessage('killTab',function(response){});
					} else if (revisionCount > 0 && window.location.pathname.split( '/' )[3] !== 'revisions') {
						console.log('relocating');
						window.location.replace('https://'+document.domain+$('li :contains(Revisions)').attr('href')+'?ufc-dlf=redirected');
					} else if (revisionCount > 0 && window.location.pathname.split( '/' )[3] === 'revisions') {
						//console.log('for each revision....');
						//for each tr: first a link
						$('.sticky-table').find('tr:gt(0)').find('a:first').each(function(){
								var myRevision = 'https://'+document.domain+$(this).attr('href')+'?ufc-dlf=fillAndKill'
								console.log('myRevision:'+myRevision);
								window.open(myRevision)
								//listFiles(myRevision);
						});
					} else if(revisionCount === 0 && window.location.pathname.split( '/' )[3] === 'workflow') {
						console.log('go fillAndKill from https://'+document.domain+'/node/'+ window.location.pathname.split( '/' )[2] +'?ufc-dlf=fillAndKill');
						window.location.replace('https://'+document.domain+'/node/'+ window.location.pathname.split( '/' )[2] +'?ufc-dlf=fillAndKill');
					} else {
						console.log ('else');
						listFiles();
					}
					
				break;

				case 'ufc-trg':// trigger ID
					console.log("$('#"+ UFCFieldID +"').trigger('"+UFCFieldData+"');");
					$('#'+ UFCFieldID).trigger('click');
				break;

				default:
					//console.log('   ' + UFCFieldType + ' is not a UFC- controlled field.');
				break;
			}
			
		} catch(err) {
			console.log(err);
		}
	}

	if ($.url().param("killTab") ==='TRUE'){
		chrome.runtime.sendMessage('killTab',function(response){
			//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
	}

	if ($.url().param("ufc-submit-cls") ==='TRUE'){
		console.log('1.) click Submit');
		$('#edit-submit').trigger('click');
	}

	if (document.referrer.indexOf('ufc-submit-cls=TRUE')>-1){
		//console.log('4.) time to go away');
		chrome.runtime.sendMessage('killTab',function(response){
			//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
	}

	if ($.url().param("ufc-sav-pub-cls") ==='true'){
		console.log('1.) click save');
		$('#edit-submit').trigger('click');
		//$('#edit-submit').click();
	}

	if (document.referrer.indexOf('ufc-sav-pub-cls=true')>-1){
		//console.log('2.) view>>immediate publish::  '+ document.URL.replace('/view','/workflow/immediate%20publish'));
		window.location.replace(document.URL.replace('/view','/workflow/immediate%20publish?ufc-sav-pub-cls=pub'))
	}

	if ($.url().param("ufc-sav-pub-cls") ==='pub'){
		//console.log('3) click update state');
		$('#edit-submit').trigger('click');
	}

	if (document.referrer.indexOf('ufc-sav-pub-cls=pub')>-1){
		//console.log('4.) time to go away');
		chrome.runtime.sendMessage('killTab',function(response){
			//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
	}

	/*
	if($.url(document.referrer).param("ufc-autopub") ==='true' && document.referrer != ''){
		$(':regex(href,workflow)').first().each(function(){
			//console.log('link:' + $(this).attr('href'));
			window.location.replace('https://stage.cms.doe.gov' + $(this).attr('href') + '?ufc-autopub=workflow1')
		});
	} 
	if($.url(document.referrer).param("ufc-autopub") ==='workflow2' && document.referrer != ''){

		chrome.runtime.sendMessage('killTab',function(response){
			//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
		
	} 
	*/

});

function listFiles() {
	console.log('function listFiles()');
	var myMatches = 0;
	var myLinkedNode = '';
	myLinkedNode = window.location.pathname;
	var myMediaLink = '';
	var myMediaTitle = '';
	var linkedMediaList='';
	var myLinkAddition='';
	$('.field-type-file').find('a').each(function(){
		myMediaLink=encodeURI($(this).attr("href"));
		myMediaTitle=encodeURI($(this).find('.filename').html());
		myLinkAddition='{"NodeRef":"'+myLinkedNode+'","MediaTitle":"'+myMediaTitle+'","MediaLink":"'+myMediaLink+'","MediaID:Pending"}'
		chrome.runtime.sendMessage('updtDLF-'+myLinkAddition)
		console.log('chrome.runtime.sendMessage(updtDLF-'+myLinkAddition);
	})
}

// a hook from the popup
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('I heard something.');
		console.log('I heard something, and it was: ' + request.greeting);
		if(request.greeting === "getDemFields"){
			var myFields = 'I found these fields: '
			$('#page').find('input, select').each(
				function(){
					myFields = myFields + '\n' + $(this).attr('id') + '\t' + $(this).attr('type')
				}
			)
			console.log(myFields);
		} else {
			console.log('unknown request :' );
		}

	}
)








