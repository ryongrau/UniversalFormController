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
UFCData.PGinProgress=0;
UFCData.paragraphType=[['text','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_rich_text','paragraphs-item-type-paragraphs-sp-rich-text'],
	['heading','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_heading','paragraphs-item-type-paragraphs-sp-heading'],
	['image','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_image','paragraphs-item-type-paragraphs-sp-image'],
	['list','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_list','paragraphs-item-type-paragraphs-sp-list'],
	['blockquote','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_blockquote','paragraphs-item-type-paragraphs-sp-blockquote'],
	['youtube','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_youtube','paragraphs-item-type-energy-paragraphs-youtube'],
	['feature','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_ref','paragraphs-item-type-energy-paragraphs-ref'],
	['listing','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_listing_ref','paragraphs-item-type-energy-paragraphs-listing-ref'],
	['static-listing','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_listing_n_refs','paragraphs-item-type-energy-paragraphs-listing-n-refs'],
	['multicolumn','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_multi_column','paragraphs-item-type-energy-paragraphs-multi-column'],
	['photogallery','field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_photo_gallery','paragraphs-item-type-energy-paragraphs-photo-gallery'],
	['table','field_body_paragraphs_add_more_add_more_bundle_paragraphs_sp_table','paragraphs-item-type-paragraphs-sp-table']]
//$(document).load( function () {
$( document ).ready(function() {
    console.log( "UFC 1.24.01 at the ready:"); 
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
					console.log('UFCData.tasksToComplete before addNewParagraph('+UFCFieldID+', '+UFCFieldData+')='+UFCData.tasksToComplete);
					UFCData.tasksToComplete = UFCData.tasksToComplete+1;
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

				break;	
				
				case 'ufc-mdc'://UFC-Media Check- check the number of items expected against number of media found
					var myMatches = $('#media-browser-library-list tr').length;
					//alert(myMatches + ' - ' + UFCFieldData);
					if(myMatches==UFCFieldData){
						chrome.runtime.sendMessage({greeting:'killTab'},function(response){
							//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					}
				break;
				
				case 'ufc-mrf'://List nodes that reference the file
					console.log('ufc-mrf');
					var myMatches = 0;
					var myFileID = '';
					var myFileName = '';
					var myLinkedURL='';
					var myLinkedTitle='';
					myFileID = document.URL.split( '/' )[4];
					myFileName = encodeURI($('h1.page-title').html());
					console.log('myFileID:'+myFileID+'  myFileName:'+myFileName);
					var myLinkAddition='';
					console.log("$('#content tr:contains(paragraphs_item)').length: "+$('#content tr:contains(paragraphs_item)').length);
					$('#content tr:contains(node)').each(function(){
					//$('#content').find('tr :contains(node)').parent().children(':eq(0)').find('a').each(function(){
						myMatches+=1;
						myLinkedURL=encodeURI($(this).find('a:first').attr('href'));
						myLinkedTitle=encodeURI($(this).find('a:first').html());
						console.log('myLinkedURL:'+myLinkedURL+'   myLinkedTitle:'+myLinkedTitle);
						myLinkAddition='{"FileID":"'+myFileID+'","FileName":"'+myFileName+'","LinkedURL":"'+myLinkedURL+'","LinkedTitle":"'+myLinkedTitle+'"}'
        				console.log('updtMRF-'+myLinkAddition);
        				chrome.runtime.sendMessage({greeting:'updtMRF', content : myLinkAddition});
					})
					$('#content tr:contains(paragraphs_item):first').each(function(){
						myMatches+=1;
						myLinkedURL='';
						myLinkedTitle=encodeURI('paragraphs: '+$('#content tr:contains(paragraphs_item)').length);
						console.log('myLinkedURL:'+myLinkedURL+'   myLinkedTitle:'+myLinkedTitle);
						myLinkAddition='{"FileID":"'+myFileID+'","FileName":"'+myFileName+'","LinkedURL":"'+myLinkedURL+'","LinkedTitle":"'+myLinkedTitle+'"}'
        				console.log('updtMRF-'+myLinkAddition);
        				chrome.runtime.sendMessage({greeting:'updtMRF', content : myLinkAddition});
					})
					if (UFCFieldData==='CLOSE') {
							chrome.runtime.sendMessage({greeting:'killTab'},function(response){});
					}
				break;

				case 'ufc-mrn':// find all associated files related to download revisions (use from )
					console.log('window.location.pathname.split(/)[3]='+window.location.pathname.split( '/' )[3])
					if (UFCFieldData==='fillAndKill'){
						listFiles(UFCFieldData);
						chrome.runtime.sendMessage({greeting:'killTab'},function(response){});
					} else if (window.location.pathname.split( '/' )[3] !== 'workflow') {
						console.log('relocating');
						window.location.replace('https://'+document.domain+'/'+window.location.pathname.split( '/' )[1]+'/'+window.location.pathname.split( '/' )[2]+'/workflow?ufc-mrn='+UFCFieldData);
					} else if (window.location.pathname.split( '/' )[3] === 'workflow') {
						var myRevision = 'https://'+document.domain+'/node/'+window.location.pathname.split( '/' )[2]+'?ufc-mrn=fillAndKill';
						var isPublished = $('div.region.region-content fieldset:first-child div.form-item.form-type-item:first-child').html().includes('Published (published)');
						console.log('myRevision:'+myRevision);
						if (isPublished){
							//window.open(myRevision)
							chrome.runtime.sendMessage({greeting:'createTab',url:myRevision,active:true},function(response){
								console.log('Create Tab:'+response.message);
							});
							
						} else {
							console.log('unpublished has all revisions in drafts');
						}
						$('div.region.region-content tr td:last-child a:first-child').each(function(){
							if ($(this).attr('href').split( '/' )[1] === 'node'){
								//filter to /node/ links, and add node/1234?ufc-mrn=fillAndKill'
								myRevision = 'https://'+document.domain+$(this).attr('href')+'?ufc-mrn=fillAndKill'
								//window.open(myRevision)
							chrome.runtime.sendMessage({greeting:'createTab',url:myRevision,active:true},function(response){
									console.log('Create Tab:'+response.message);
								});
							}
						});
						if ($('.pager-next').length>0){
							window.location.replace('https://'+document.domain+$('.pager-next a').attr('href'));
						} else if (UFCFieldData==='CLOSE') {
							chrome.runtime.sendMessage({greeting:'killTab'},function(response){});
						}
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

function addNewParagraph (paragraphType, paragraphContent){
	if(UFCData.PGinProgress===0){
		UFCData.PGinProgress=UFCData.PGinProgress+1;
		UFCData.currentParagraphType=paragraphType;
		UFCData.currentParagraphContent=paragraphContent;
		console.log('addNewParagraph:'+paragraphType);
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
			case 'blockref':
				paragraphName='field_body_paragraphs_add_more_add_more_bundle_energy_paragraphs_block_ref'
			break;
		}
		var event = new MouseEvent('mousedown', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		var myAddButton = $('input[name='+paragraphName+']').get(0);
		myAddButton.dispatchEvent(event);
		var myParagraphs = $("#edit-field-body-paragraphs").get(0);
		UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length;
		console.log(paragraphType+' starting event listener with initial UFCData.myParagraphsCount='+UFCData.myParagraphsCount);
		myParagraphs.addEventListener('DOMSubtreeModified', myParagraphListener, false);
	} else {
		setTimeout(function(){
			addNewParagraph(paragraphType, paragraphContent);
		},(300));
	}
}

function myParagraphListener(){
	//so, every time something changes in PG table, only IF new TR added
	//console.log("myParagraphListener triggered, paragraph count="+$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length);
	if(UFCData.myParagraphsCount < $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length){
		UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length;
		//console.log('myParagraphListener myParagraphsCount increased: '+UFCData.myParagraphsCount);
		fillNewParagraph(UFCData.currentParagraphType, UFCData.currentParagraphContent);
		var myParagraphs = $("#edit-field-body-paragraphs").get(0);
		myParagraphs.removeEventListener('DOMSubtreeModified', myParagraphListener, false);
		//still going to add the filling as its own loop, waiting for feilds to appear after TR incase it's noy all at once..
	}
}

function fillNewParagraph(paragraphType, paragraphContent){
		var myParagraph=$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last();
		switch(paragraphType){
			case 'text':
				UFCData.PGinProgress=UFCData.PGinProgress + 1;
				UFCData.tasksToComplete =UFCData.tasksToComplete + 1;
				//console.log('fillRichTextListener for '+ myParagraph.find('.cke_contents').eq(0).attr("id"));
				myParagraph.get(0).addEventListener('DOMSubtreeModified', fillRichTextListener, false);
			break;
			case 'heading':
				//name: field_para_sp_heading,field_para_energy_heading_link,Heading Text field is required.
				myParagraph.find('input:text[name*="field_para_sp_heading"]').val(paragraphContent);
			break;
			case 'image':
				//field_para_sp_img_caption,field_para_sp_img_attrib,field_para_energy_img_alt,field_para_sp_img_url
				myParagraph.find('input:text[name*="field_para_sp_img_caption"]').val(paragraphContent);
			break;
			case 'list':
			break;
			case 'blockquote'://[iframe text],field_para_energy_bq_cite_name,field_para_energy_bq_cite_title
				UFCData.PGinProgress=UFCData.PGinProgress + 1;
				UFCData.tasksToComplete =UFCData.tasksToComplete + 1;
				//console.log('fillRichTextListener for '+ myParagraph.find('.cke_contents').eq(0).attr("id"));
				myParagraph.get(0).addEventListener('DOMSubtreeModified', fillRichTextListener, false);
			break;
			case 'youtube':
				//[media]field_energy_youtube_caption,field_energy_youtube_attribution
				myParagraph.find('input:text[name*="field_para_sp_heading"]').val(paragraphContent);
			break;
			case 'feature':
				//field_para_energy_ref_title,field_para_energy_ref_item[target_id],Featured Item field is required. {page: 'Visual QA Testing Page (2207053)'}
				myParagraph.find('input:text[name*="field_para_energy_ref_title"]').val(paragraphContent);
				myParagraph.find('input:text[name*="field_para_energy_ref_item"]').val('Visual QA Testing Page (2207053)');
			break;
			case 'listing':
				//field_para_sp_heading,field_para_energy_listing_ref[tarhet_id],Listing field is required{listing: 'Visual QA Testing Listing (2207045)'}
				myParagraph.find('input:text[name*="field_para_sp_heading"]').val(paragraphContent);
				myParagraph.find('input:text[name*="field_para_energy_listing_ref"]').val('Visual QA Testing Listing (2207045)');
			break;
			case 'static-listing':
				//field_para_sp_heading,field_para_energy_ref_items(10),field_para_energy_ref_title,(media), heading text required, 1st item required {page: 'Visual QA Testing Page (2207053)'}
				myParagraph.find('input:text[name*="field_para_sp_heading"]').val(paragraphContent);
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(0).val('Visual QA Testing Article (2207013)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(1).val('Visual QA Testing Download (2207025)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(2).val('Visual QA Testing Event (2207033)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(3).val('Visual QA Testing External Resource (2207029)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(4).val('Visual QA Testing Download (2207025)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(5).val('Visual QA Testing Page (2207053)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(6).val('Visual QA Testing Pivot Table (2207065)');
			break;
			case 'multicolumn':
			break;
			case 'photogallery':
				//field_para_energy_ref_pg,Photo Gallery field is required {photogallery: 'Visual QA Testing Photo Gallery [nid:2207057]'}
				myParagraph.find('input:text[name*="field_para_energy_ref_pg"]').val('Visual QA Testing Photo Gallery [nid:2207057]');
			break;
			case 'table'://Table Data File field is required.
			break;
			case 'blockref'://Table Data File field is required.
				myParagraph.find('input:text[name*="field_para_block_ref"]').val('IE: Upcoming Events [bid:10771]');
			break;
		}
		//UFCData.currentParagraphType='';
		//UFCData.currentParagraphContent='';
		UFCData.tasksToComplete =UFCData.tasksToComplete - 1;
		UFCData.PGinProgress=UFCData.PGinProgress - 1;
}

function fillRichTextListener(){
	var myParagraph=$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last();
	//if(!myParagraph.find('iframe').eq(0).attr("title")){}else{
		//console.log('>>>fill '+myParagraph.find('iframe').attr("title")+' with '+(UFCData.currentParagraphContent));
		//myParagraph.contents().find('iframe').load(function(){
						//console.log('>>>CONTENTS:'+myParagraph.find('iframe').contents().find('body').html());

	var myIFrame =$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last().contents().find('iframe')	
	myIFrame.load(function(){
			console.log('myIFrame.load for '+UFCData.currentParagraphType +' within '+myParagraph.attr('class'));
			if(myIFrame.contents().find('body').html()!=UFCData.currentParagraphContent){
				myParagraph.get(0).removeEventListener('DOMSubtreeModified', fillRichTextListener, true);
				console.log('>>>CONTENTS:'+myIFrame.contents().find('body').html());
				myIFrame.contents().find('body').html(UFCData.currentParagraphContent);
				UFCData.PGinProgress=UFCData.PGinProgress - 1;
				UFCData.tasksToComplete =UFCData.tasksToComplete - 1;
			}
		})
	//}
}

function listFiles() {
	try {
		console.log('function listFiles()');
		var myMatches = 0;
		var myLinkedNode = '';
		myLinkedNode = window.location.pathname;
		var myMediaID = '';
		var myMediaLink = '';
		var myMediaTitle = '';
		var linkedMediaList='';
		var myLinkAddition='';
		$('div.content > span.file > a').each(function(){
			myMediaID=encodeURI($(this).parent().parent().parent().attr('id'));
			myMediaLink=encodeURI($(this).attr("href"));
			myMediaTitle=encodeURI($(this).html());
			myLinkAddition='{"NodeRef":"'+myLinkedNode+'","MediaTitle":"'+myMediaTitle+'","MediaLink":"'+myMediaLink+'","MediaID":"'+myMediaID+'"}';
			chrome.runtime.sendMessage({greeting : 'updtmrn', content : myLinkAddition});
			console.log("'chrome.runtime.sendMessage({greeting : 'updtmrn', content : "+myLinkAddition+"}");
		})
	} catch(err) {
		console.log('function listFiles()'+err);
	}
}

// a hook from the popup
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.greeting === "getDemFields"){
			console.log('getDemFields activated by: ' + request.greeting);

			var myFields = '<tr><th>Field Id</th><th>Field Type</th></tr>'
			$('#page').find('input, select').each(
				function(){
					myFields = myFields + '<tr><td>' + $(this).attr('id') + '</td><td>' + $(this).attr('type') + '</td></tr>'
				}
			)
			sendResponse({'myFields': myFields});
		} else {
			console.log('unknown request :' );
		}

	}
)

function pageClosing(){
	console.log('Remaining tasks To Complete:'+UFCData.tasksToComplete);
	if(UFCData.tasksToComplete===0){
		if ($.url().param("killTab") ==='TRUE'){
			chrome.runtime.sendMessage({greeting:'killTab'},function(response){
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});
		}

		if ($.url().param("ufc-submit-cls") ==='TRUE'){
			console.log('1.) click Submit');
			$('#edit-submit').trigger('click');
		}

		if (document.referrer.indexOf('ufc-submit-cls=TRUE')>-1){
			//console.log('4.) time to go away');
			chrome.runtime.sendMessage({greeting:'killTab'},function(response){
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});
		}

		if ($.url().param("ufc-sav-pub-cls") ==='TRUE'){
			console.log('1.) click save');
			$('#edit-submit').trigger('click');
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=TRUE')>-1){
			window.location.replace(document.referrer.substr(0,document.referrer.indexOf('?')-4)+'workflow?ufc-sav-pub-cls=new')
		}

		if ($.url().param("ufc-sav-pub-cls") ==='pub'){
			console.log('3 click update state');
			$('#edit-submit').trigger('click');
		}

		if ($.url().param("ufc-sav-pub-cls") ==='new'){
			console.log('2 1/2) pub new node');

			$('fieldset:contains("Drafts")').find('a[href*="immediate%20publish"]').eq(0).each(function() {
				console.log('immediate publish'+$(this).attr('href')+'?ufc-sav-pub-cls=pub');
				window.location.replace($(this).attr('href')+'?ufc-sav-pub-cls=pub')
			});
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=pub')>-1){
			//console.log('4.) time to go away');
			chrome.runtime.sendMessage({greeting:'killTab'},function(response){
				console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});
		}
		console.log('pageClosing job done.');
	}else{
		//console.log('setTimeout(pageClosing(),(2000));');
		setTimeout(function(){pageClosing();},(3000));
	}
}