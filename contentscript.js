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
var UFCData = {};
UFCData.tasksToComplete = 0;
UFCData.taskRetry=3000;
UFCData.PGinProgress=0
//$(document).load( function () {
$( document ).ready(function() {
    console.log( "UFC 1.23.00 at the ready: HREF::" + $(this).attr('href')); //redult: undefined
    console.log( "UFC document.URL:  " + document.URL);//your current page
	console.log( "UFC document.referrer:  " + document.referrer );//page you're coming from
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

				case 'new-par':
					console.log(' case new-par-'+UFCFieldID+"  :  "+UFCFieldData);
					UFCData.tasksToComplete = UFCData.tasksToComplete+1;
					console.log('now I have this so many:'+UFCData.tasksToComplete);
					addNewParagraph(UFCFieldID, UFCFieldData);
				break;
								
				//files
				case 'ufc-fml':// ADD FILE FROM FILE LIBRARY-- 
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
					var myOffset = $('#'+UFCFieldID ).offset();
					console.log('Top left of my thing:'+myOffset.left + " : " + myOffset.top );
					console.log('so imma click here x:'+(myOffset.left+($('#'+UFCFieldID ).width()/2))+ ", y: " + (myOffset.top+($('#'+UFCFieldID ).height()/2)));
					var event = new MouseEvent(UFCFieldData, {
						'view': window,
						'bubbles': true,
						'cancelable': true
					});
					var  myThing = document.getElementById(UFCFieldID);
					var cancelled = !myThing.dispatchEvent(event);
					if (cancelled) {
					    // A handler called preventDefault.
						//console.log("cancelled");
					} else {
					    // None of the handlers called preventDefault.
						//console.log("not cancelled");
					}



					$('#'+UFCFieldID).parent().children().each(function(){
						console.log($(this).attr('name'));
					});
					
				break;

				default:
					console.log('   ' + UFCFieldType + ' is not a UFC- controlled field.');
				break;
			}
			
		} catch(err) {
			console.log(err);
		}
	}
//######### saving and closing 
	pageClosing();
});

function pageClosing(){
	console.log('Remaining tasks To Complete:'+UFCData.tasksToComplete);
	if(UFCData.tasksToComplete===0){
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

		if ($.url().param("ufc-sav-pub-cls") ==='TRUE'){
			console.log('1.) click save');
			$('#edit-submit').trigger('click');
			//$('#edit-submit').click();
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=TRUE')>-1){
			//console.log('2.) view>>immediate publish::  '+ document.URL.replace('/view','/workflow/immediate%20publish'));
			//if(document.URL.indexOf('/node/')>-1){console.log("editing a revision");
			//	window.location.replace(document.URL.replace('/view','/workflow/immediate%20publish?ufc-sav-pub-cls=pub'))
			//} else {console.log("be gentle its the first time: OR just the front page: "+ document.referrer.substr(0,document.referrer.indexOf('?')-4)+'workflow?ufc-sav-pub-cls=new'); 
				window.location.replace(document.referrer.substr(0,document.referrer.indexOf('?')-4)+'workflow?ufc-sav-pub-cls=new')
			//}
		}

		if ($.url().param("ufc-sav-pub-cls") ==='pub'){
			console.log('3 click update state');
			$('#edit-submit').trigger('click');
		}

		if ($.url().param("ufc-sav-pub-cls") ==='new'){
			console.log('2 1/2) pub new node');
			//$('a[href*="immediate%20publish"]').eq(1).each(function() {
			    //console.log('immediate publish'+$(this).attr('href')+'?ufc-sav-pub-cls=pub');
			    //window.location.replace($(this).attr('href')+'?ufc-sav-pub-cls=pub')
			$('fieldset:contains("Drafts")').find('a[href*="immediate%20publish"]').eq(0).each(function() {
				console.log('immediate publish'+$(this).attr('href')+'?ufc-sav-pub-cls=pub');
				window.location.replace($(this).attr('href')+'?ufc-sav-pub-cls=pub')
			});
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=pub')>-1){
			//console.log('4.) time to go away');
			chrome.runtime.sendMessage('killTab',function(response){
				console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
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
		console.log('no final pageClosing applied; job done.');
	}else{
		console.log('setTimeout(pageClosing(),(2000));');
		setTimeout(function(){pageClosing();},(2000));
	}
}

function addNewParagraph(paragraphType, paragraphContent){
	//if(UFCData.PGProcessing===0){
		console.log('addNewParagraph:'+paragraphType);
		UFCData.PGProcessing=UFCData.PGProcessing+1;
		var paragraphName = ""
		switch(paragraphType){
			case 'text':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_rich_text'
			break;
			case 'heading':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_heading'
			break;
			case 'image':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_image'
			break;
			case 'list':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_list'
			break;
			case 'blockquote':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_blockquote'
			break;
			case 'youtube':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_youtube'
			break;
			case 'feature':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_ref'
			break;
			case 'listing':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_listing_ref'
			break;
			case 'static-listing':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_listing_n_refs'
			break;
			case 'multicolumn':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_multi_column'
			break;
			case 'photogallery':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_photo_gallery'
			break;
			case 'table':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_table'
			break;
		}
		//var myOffset = $('input[name='+paragraphName+']').offset();
		//console.log('Top left of my thing:'+myOffset.left + " : " + myOffset.top );
		//console.log('so imma click here x:'+(myOffset.left+($('input[name='+paragraphName+']' ).width()/2))+ ", y: " + (myOffset.top+($('input[name='+paragraphName+']').height()/2)));
		clickAddNewPar(paragraphName);
		
	/*} else {
		console.log('addNewParagraph:'+paragraphType+ 'is busy; trying again later');
		setTimeout(function(){
			addNewParagraph(paragraphType, paragraphContent);
		},(2000));
	}*/
}	

function clickAddNewPar (paragraphName){
	if(UFCData.PGinProgress===0){
		UFCData.PGinProgress=UFCData.PGinProgress+1;
		console.log('clickAddNewPar:'+paragraphName);
		var event = new MouseEvent('mousedown', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		var myAddButton = $('input[name='+paragraphName+']').get(0);
		myAddButton.dispatchEvent(event);
		var myParagraphs = $("#edit-field-body-paragraphs").get(0);
		UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr').length;
		console.log(paragraphName+' myParagraphsCount: '+UFCData.myParagraphsCount);
		myParagraphs.addEventListener('DOMSubtreeModified', myParagraphListener, false);
	} else {
		setTimeout(function(){
			clickAddNewPar(paragraphName);
		},(300));
	}
}


function myParagraphListener(){
	if(UFCData.myParagraphsCount < $("#edit-field-body-paragraphs").find('tr').length){
		UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr').length;
		console.log('myParagraphsCount changed: '+UFCData.myParagraphsCount);
		UFCData.tasksToComplete =UFCData.tasksToComplete - 1;
		UFCData.PGinProgress=UFCData.PGinProgress - 1;
		console.log("added new pg");
		var myParagraphs = $("#edit-field-body-paragraphs").get(0);
		myParagraphs.removeEventListener('DOMSubtreeModified', myParagraphListener, false);
	}
}

function fillNewParagraphs(){
	//that's one for wednesday ;;;;;;;
}

	//filling in rich text pgs later:
	/*setTimeout(function(){
		console.log('awaitingRichText iframe loaded--'+$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').attr("title"));
		//$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').load(function(){
			//alert('PG rich text iframe loaded!');
			//console.log($('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').contents().html());
			//$('iframe').contents().find('body').html(UFCFieldData);
			$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').contents().find('body').html(UFCFieldData);
		//});

	},2000);

					console.log('current number of rich text paragraphs:'+$('.paragraphs-item-type-paragraphs-sp-rich-text').length);
					setTimeout(function(){
						console.log('PG rich text iframe loaded--'+$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').attr("title"));
						//$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').load(function(){
							//alert('PG rich text iframe loaded!');
							//console.log($('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').contents().html());
							//$('iframe').contents().find('body').html(UFCFieldData);
							$('.paragraphs-item-type-paragraphs-sp-rich-text').eq(UFCFieldID).find('iframe').contents().find('body').html(UFCFieldData);
						//});

					},2000);
	

	*/



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

// running google test event..








