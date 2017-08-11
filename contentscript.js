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
    console.log( "UFC 1.24.02 at the ready:"); 
    //console.log( "UFC document.URL:  " + document.URL);//your current page
	//console.log( "UFC document.referrer:  " + document.referrer );//page you're coming from
	// Set this to *false* to avoid addon auto-installation if missed.
    FireShotAPI.AutoInstall = false;
	for (var valuePair in $.url().param()){
		try {	var UFCFieldType = valuePair.substring(0,7);
			var UFCFieldID = valuePair.substring(8,valuePair.length);
			var UFCFieldData=$.url().param(valuePair);
			console.log('========UFC FieldType:' + UFCFieldType + '   :UFC FieldID:' + UFCFieldID + '   :Value:' + UFCFieldData);
			switch(UFCFieldType) {

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
				
				case 'ufc-chk':
					if(UFCFieldData==='TRUE'){
						$('#'+ UFCFieldID).prop('checked',true);}
					else {	$('#'+ UFCFieldID).prop('checked',false);}
				break;

				case 'ufc-dlf':// find all associated files related to download revisions (use from )
					console.log('window.location.pathname.split(/)[3]='+window.location.pathname.split( '/' )[3])
					var revisionCount =-1;
					revisionCount = $('li :contains(Revisions)').length;
						console.log('revisionCount: '+revisionCount);		
					if (UFCFieldData==='fillAndKill'){
						listFiles();
						chrome.runtime.sendMessage({messageType:'killTab'},function(response){});
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
						});
					} else if(revisionCount === 0 && window.location.pathname.split( '/' )[3] === 'workflow') {
						console.log('go fillAndKill from https://'+document.domain+'/node/'+ window.location.pathname.split( '/' )[2] +'?ufc-dlf=fillAndKill');
						window.location.replace('https://'+document.domain+'/node/'+ window.location.pathname.split( '/' )[2] +'?ufc-dlf=fillAndKill');
					} else {
						console.log ('else');
						listFiles();
					}
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
						chrome.runtime.sendMessage({messageType:'killTab'},function(response){
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
        				chrome.runtime.sendMessage({messageType:'updtMRF',messageData:myLinkAddition})
					})

				break;

				// multiselect: important to ADD only-!
				case 'ufc-msl':
					for (var toAddToSelections in UFCFieldData.split(',')){
						//console.log('   toAddToSelections ufc-msl #' + UFCFieldID + ': ' + UFCFieldData.split(',')[toAddToSelections]);
						$('#'+ UFCFieldID + ' option[value="' +  UFCFieldData.split(',')[toAddToSelections] + '"]').prop('selected','selected');
					}
				break;
								

				case 'new-par':
					console.log('UFCData.tasksToComplete before addNewParagraph('+UFCFieldID+', '+UFCFieldData+')='+UFCData.tasksToComplete);
					UFCData.tasksToComplete = UFCData.tasksToComplete+1;
					addNewParagraph(UFCFieldID, UFCFieldData);
				break;

				// timestamp takes text, just get the format right
				case 'ufc-scr': // Screenshot

					console.log("About to captureVisibleTabStatus sendMessage");
					chrome.runtime.sendMessage({messageType:'scrnSht'},function(response){
						console.log('captureVisibleTab in function: '+response.message);
					});
					console.log('after captureVisibleTab ');
				break;

				case 'ufc-sel':
					$('#'+ UFCFieldID + ' option[value="' +  UFCFieldData + '"]').prop('selected','selected');
				break;

				case 'ufc-txt':
					$('#'+ UFCFieldID).val(UFCFieldData);
				break;


				default:
					console.log("UFC: popup.js unhandled Chrome runtime message");
				break;
					
			}
		} catch(err) {
			console.log('error: '+err);
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
				/*myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(0).val('Visual QA Testing Article (2207013)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(1).val('Visual QA Testing Download (2207025)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(2).val('Visual QA Testing Event (2207033)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(3).val('Visual QA Testing External Resource (2207029)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(4).val('Visual QA Testing Download (2207025)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(5).val('Visual QA Testing Page (2207053)');
				myParagraph.find('input:text[name*="field_para_energy_ref_items"]').eq(6).val('Visual QA Testing Pivot Table (2207065)');*/
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
		chrome.runtime.sendMessage({messageType:'updtDLF',messageData:myLinkAddition})
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

function pageClosing(){
	//console.log('Remaining tasks To Complete:'+UFCData.tasksToComplete);
	//console.log("document.referrer.indexOf('ufc-submit-cls=TRUE')="+document.referrer.indexOf('ufc-submit-cls=TRUE'));
	if(UFCData.tasksToComplete===0){
		if ($.url().param("killTab") ==='TRUE'){

			chrome.runtime.sendMessage({messageType:'killTab'},function(response){
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});

		}

		if ($.url().param("ufc-submit-cls") ==='TRUE'){
			console.log('1.) click Submit');
			$('#edit-submit').trigger('click');
		}

		if (document.referrer.indexOf('ufc-submit-cls=TRUE')>-1){
			console.log('4.) time to go away');
			chrome.runtime.sendMessage({messageType:"killTab"},function(response){
				console.log("Response from bkg script: "+ response.responseMessage);
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});
		}

		// ################# SAVE PUBLISH CLOSE  #############################

		if ($.url().param("ufc-sav-pub-cls") ==='TRUE'){
			console.log('1.) click save');
			$('#edit-submit').trigger('click');
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=TRUE')>-1){
			
			// it all spits you out to "/node/NID/revisions/RID"
			if (document.URL.indexOf('/revisions/')>-1){
				window.location.replace(document.URL+'/workflow/immediate%20publish?ufc-sav-pub-cls=pub')
			} else {
				window.location.replace(document.referrer.substr(0,document.referrer.indexOf('?')-4)+'workflow?ufc-sav-pub-cls=new')
			} 
		}


		// edit click >> bypassing direct re publish revision now, I believe..
		if ($.url().param("ufc-sav-pub-cls") ==='new'){
			console.log('2 1/2) pub new node');

			$('fieldset:contains("Drafts")').find('a[href*="immediate%20publish"]').eq(0).each(function() {
				console.log('immediate publish'+$(this).attr('href')+'?ufc-sav-pub-cls=pub');
				window.location.replace($(this).attr('href')+'?ufc-sav-pub-cls=pub')
			});
		}


		if ($.url().param("ufc-sav-pub-cls") ==='pub'){
			console.log('3 click update state');
			$('#edit-submit').trigger('click');
		}

		if (document.referrer.indexOf('ufc-sav-pub-cls=pub')>-1){
			//console.log('4.) time to go away');
			chrome.runtime.sendMessage({messageType:"killTab"},function(response){
				console.log('4.) time to go away');
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
				console.log('killTab response:'+response.message);
			});
		}


		console.log('UFC tasks completed.');
	}else{
		//console.log('setTimeout(pageClosing(),(2000));');
		setTimeout(function(){pageClosing();},(3000));
	}
}