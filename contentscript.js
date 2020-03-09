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
var UFCData = [];
UFCData.taskRetry=3000;
UFCData.PGinProgress=0;
var taskQueue=[];
var manifest = chrome.runtime.getManifest();
console.log(manifest.name +' ::: '+manifest.version); 
var paragraphTypesObj={	
	"accordion":{"title":"Accordion","btnClass":".paragraphs-add-more-energy-paragraphs-accordion","default":"accordion-title",
		"fields":{"accordion-title":"input:text[name*='field_para_accordion_title'][name*='value']"}},
	"block-quo":{"title":"Blockquote","btnClass":".paragraphs-add-more-paragraphs-sp-blockquote","default":"quote-text",
		"fields":{"quote-text":"textarea[name*='field_para_sp_rich_text'][name*='value']","name-of-person-cited":"input:text[name*='field_para_energy_bq_cite_name'][name*='value']","title-of-person-cited":"input:text[name*='field_para_energy_bq_cite_title'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-quote":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
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
		"fields":{"featured-item":"input:text[name*='field_para_energy_ref_item'][name*='target_id']","title-override":"input:text[name*='field_para_energy_ref_title'][name*='value']","summary-override":"textarea[name*='field_para_energy_ref_summary'][name*='value']","upload":"input:text","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","color-scheme":"select[name*='field_para_sp_selectors'][name*='color']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-title":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
	"list-full":{"title":"Formatted-List-(Full)","btnClass":".paragraphs-add-more-paragraphs-sp-list","default":"",
		"fields":{"list-style":"select[name*='field_para_sp_selectors'][name*='lists']"}},
	"list":{"title":"Formatted-List-(Simple)","btnClass":".paragraphs-add-more-paragraphs-sp-simple-list","default":"list",
		"fields":{"list":"textarea[name*='field_para_sp_sl_rich_text'][name*='value']"}},
	"heading":{"title":"Heading","btnClass":".paragraphs-add-more-paragraphs-sp-heading","default":"heading-text",
		"fields":{"heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","heading-link":"input:text[name*='field_para_energy_heading_link'][name*='target_id']","anchor-title":"input:text[name*='field_para_energy_heading_anchor'][name*='value']"}},
	"image":{"title":"Image","btnClass":".paragraphs-add-more-paragraphs-sp-image","default":"caption-text-override",
		"fields":{"upload":"input:text","caption-text-override":"textarea[name*='field_para_sp_img_caption'][name*='value']","attribution-text-override":"input:text[name*='field_para_sp_img_attrib'][name*='value']","alt-text-override":"input:text[name*='field_para_energy_img_alt'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","upload":"input:text[name*='field_para_sp_img_url'][name*='url']","open-url-in-a-new-window":"input:checkbox[name*='field_para_sp_img_url'][name*='attributes']"}},
	"listing-dynamic":{"title":"Listing-(Dynamic)","btnClass":".paragraphs-add-more-energy-paragraphs-listing-ref","default":"listing",
		"fields":{"heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","list-orientation":"select[name*='field_para_sp_selectors'][name*='listorientation']","list-style":"select[name*='field_para_sp_selectors'][name*='lists']","heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","listing":"input:text[name*='field_para_energy_listing_ref'][name*='target_id']"}},
	"listing-static":{"title":"Listing-(Static)","btnClass":".paragraphs-add-more-energy-paragraphs-listing-n-refs","default":"item",
		"fields":{"heading-text":"input:text[name*='field_para_sp_heading'][name*='value']","heading-style":"select[name*='field_para_sp_selectors'][name*='headings']","list-orientation":"select[name*='field_para_sp_selectors'][name*='listorientation']","list-style":"select[name*='field_para_sp_selectors'][name*='lists']","item":"input:text[name*='field_para_energy_ref_items'][name*='target_id']","how-many-to-add":"select[name*='field_para_energy_ref_items']"}},
	"multi-column":{"title":"Multi-Column","btnClass":".paragraphs-add-more-energy-paragraphs-multi-column","default":"layout-style",
		"fields":{"layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}},
	"photo-gallery":{"title":"Photo-Gallery","btnClass":".paragraphs-add-more-energy-paragraphs-photo-gallery","default":"photo-gallery",
		"fields":{"photo-gallery":"input:text[name*='field_para_energy_ref_pg'][name*='target_id']"}},
	"podcast":{"title":"Podcast","btnClass":".paragraphs-add-more-energy-paragraphs-podcast","default":"podcast-item",
		"fields":{"title-override":"input:text[name*='field_para_energy_ref_title'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","podcast-item":"input:text[name*='field_para_energy_podcast'][name*='target_id']"}},
	"text":{"title":"Rich-Text","btnClass":".paragraphs-add-more-paragraphs-sp-rich-text","default":"rich-text",
		"fields":{"rich-text":"textarea[name*='field_para_sp_rich_text'][name*='value']"}},
	"text-full":{"title":"Rich-Text-(Full)","btnClass":".paragraphs-add-more-energy-paragraphs-full-rich-text","default":"full-rich-text",
		"fields":{"full-rich-text":"textarea[name*='field_full_rich_text'][name*='value']"}},
	"social":{"title":"Social-Media-Post","btnClass":".paragraphs-add-more-energy-paragraphs-social","default":"url",
		"fields":{"url":"input:text[name*='field_embedded_post_url'][name*='url']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}},
	"statistic":{"title":"Statistic","btnClass":".paragraphs-add-more-energy-paragraphs-statistic","default":"statistic",
		"fields":{"statistic":"input:text[name*='field_para_stat_number'][name*='value']","summary":"input:text[name*='field_para_stat_summary'][name*='value']","related-item":"input:text[name*='field_para_energy_ref_item'][name*='target_id']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']","color-scheme":"select[name*='field_para_sp_selectors'][name*='color']","make-this-shareable":"input:checkbox[name*='field_para_make_shareable']","shared-title":"input:text[name*='field_para_shared_title'][name*='value']","shared-summary":"textarea[name*='field_para_shared_summary'][name*='value']"}},
	"tabs":{"title":"Tabs","btnClass":".paragraphs-add-more-energy-paragraphs-tabs","default":"",
		"fields":{}},
	"video":{"title":"Video","btnClass":".paragraphs-add-more-energy-paragraphs-youtube","default":"caption",
		"fields":{"video":"input:text","caption":"textarea[name*='field_energy_youtube_caption'][name*='value']","attribution":"input:text[name*='field_energy_youtube_attribution'][name*='value']","layout-style":"select[name*='field_para_sp_selectors'][name*='layout']"}}};
	

var paragraphContainersObj={"body":{"addContainer":"div[id*=edit-field-body-paragraphs-und-add-more]","pgTable":"table[id*=field-body-paragraphs-values]"}};
$( document ).ready(function() {
	try {
	    for (var valuePair in $.url().param()){
    		taskQueue.push([valuePair.substring(0,7),valuePair.substring(8,valuePair.length),$.url().param(valuePair)]);
    	}
    	runTaskQueue();
	} catch(err) {
		console.log('$( document ).ready error: '+err);
	}
});

function runTaskQueue(){
	try{
		console.log('Run Task Queue Item 1 of '+taskQueue.length);
		if (taskQueue.length>0){
			console.log('Task Queue Item: '+taskQueue[0][0]+'   Target Field: '+taskQueue[0][1]+'   Target Data: '+taskQueue[0][2])
			var UFCFieldType = taskQueue[0][0];
			var UFCFieldID = taskQueue[0][1];
			var UFCFieldData=taskQueue[0][2];
			switch(UFCFieldType) {
				// timestamp takes text, just get the format right
				case 'ufc-txt':
					$('#'+ UFCFieldID).val(UFCFieldData);
					runNextInQueue();
				break;
				
				case 'ufc-chk':
					if(UFCFieldData==='TRUE'){
						$('#'+ UFCFieldID).prop('checked',true);}
					else {	$('#'+ UFCFieldID).prop('checked',false);}
					runNextInQueue();
				break;

				case 'ufc-sel':
					$('#'+ UFCFieldID + ' option[value="' + UFCFieldData + '"]').prop('selected',true);
					runNextInQueue();
				break;
				
				// multiselect: important to ADD only-!
				case 'ufc-msl':
					for (var toAddToSelections in UFCFieldData.split(',')){
						//console.log('   toAddToSelections ufc-msl #' + UFCFieldID + ': ' + UFCFieldData.split(',')[toAddToSelections]);
						$('#'+ UFCFieldID + ' option[value="' +  UFCFieldData.split(',')[toAddToSelections] + '"]').prop('selected','selected');
					}
					runNextInQueue();
				break;
								
				//Body Text: hidden iFrame 
				case 'ufc-bod':
					console.log('case ufc-bod');
					//$('#cke_edit-body-und-0-value').contents().find('iframe').on('load',function(){
						//console.log('body iframe loaded');
						//console.log(' body iframe loaded: '+$('#cke_edit-body-und-0-value').find('iframe').contents().html());
						//var myBodyText=$('#cke_edit-body-und-0-value').find('iframe').contents().html();
						var myBodyText=$('#edit-body-und-0-value').val();
						console.log('myBodyText:    '+myBodyText);
						$('#edit-body-und-0-value').val('');
						//$('#edit-body-und-0-value').html('');
						$('#edit-body-und-0-summary').val('');
						addNewParagraphs('text-full:'+myBodyText);
					//});
					//$('#cke_contents_edit-body-und-0-value').html(UFCFieldData);//v1: now this seems to be missing..?
					//runNextInQueue();
				break;
				
				case 'new-par':
					addNewParagraphs(UFCFieldData);
				break;

				case 'edit-pg':
					editParagraph(UFCFieldData);
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
					// SWITCH TO A MEDIA
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
					console.log("$('#content tr:contains(paragraphs_item)').length: "+$('#content tr:contains("paragraphs_item")').length);
					$('#content tr:contains("node")').each(function(){
						myMatches+=1;
						myLinkedURL=encodeURI($(this).find('a:first').attr('href'));
						myLinkedTitle=encodeURI($(this).find('a:first').html());
						console.log('myLinkedURL:'+myLinkedURL+'   myLinkedTitle:'+myLinkedTitle);
						myLinkAddition='{"FileID":"'+myFileID+'","FileName":"'+myFileName+'","LinkedURL":"'+myLinkedURL+'","LinkedTitle":"'+myLinkedTitle+'"}'
						console.log('updtMRF-'+myLinkAddition);
						chrome.runtime.sendMessage({greeting:'updtMRF', content : myLinkAddition});
					})
					$('#content tr:contains("paragraphs_item"):first').each(function(){
						myMatches+=1;
						myLinkedURL='';
						myLinkedTitle=encodeURI('paragraphs: '+$($this).children().last().html());
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
					console.log('document.URL.split(/)[5].substr(0,8)='+document.URL.split('/')[5].substr(0,8));
					if (UFCFieldData==='fillAndKill'){
						listFiles(UFCFieldData);
						chrome.runtime.sendMessage({greeting:'killTab'},function(response){});
					} else if (document.URL.split('/')[5].substr(0,8) !== 'workflow') {
						console.log('relocating');
						window.location.replace(document.URL.split('/').slice(0,5).join('/')+'/workflow?ufc-mrn='+UFCFieldData);
					} else if (document.URL.split('/')[5].substr(0,8) === 'workflow') {
						var myRevision = document.URL.split('/').slice(0,5).join('/')+'?ufc-mrn=fillAndKill';
						var isPublished = $('div.region.region-content fieldset:first-child div.form-item.form-type-item:first-child').html().includes('Published (published)');
						console.log('myRevision:'+myRevision);
						//if (isPublished){
							//window.open(myRevision)
							chrome.runtime.sendMessage({greeting:'createTab',url:myRevision,active:false},function(response){
								console.log('Created Tab:'+response.message);
							});
						/*	
						} else {
							console.log('unpublished has all revisions in drafts AND Archived Revisions');
						}*/
						$('div.region.region-content tr td:first-child a').each(function(){
							myRevision=document.URL.split('/').slice(0,5).join('/')+'/revisions/'+$(this).html()+'?ufc-mrn=fillAndKill';
							console.log('Draft Revision:'+myRevision);
							chrome.runtime.sendMessage({greeting:'createTab',url:myRevision,active:false},function(response){
								console.log('Create Tab:'+response.message);
							});
							/*
							if ($(this).attr('href').split( '/' )[1] === 'node'){
								//filter to /node/ links, and add node/1234?ufc-mrn=fillAndKill'
								myRevision = 'https://'+document.domain+$(this).attr('href')+'?ufc-mrn=fillAndKill'
								//window.open(myRevision)
							chrome.runtime.sendMessage({greeting:'createTab',url:myRevision,active:true},function(response){
									console.log('Create Tab:'+response.message);
								});
							}
							*/
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
					runNextInQueue()
				break;

				case 'ufc-w84':// ufc-w84-fieldID=[OPEN/CLOSE] click, and then w8 4 = wait for, get it?
					var nextFieldReady=false;
					var targetNode = document.getElementsByTagName("body")[0];
					// Options for the observer (which mutations to observe)
					var config = { attributes: true, childList: true, subtree: true };
					// Callback function to execute when mutations are observed
					var callback = function(mutations) {
					    mutations.forEach(function(mutation) {
					    	try{
					    		// OK lets not gett too clever about it.
					    		var $myFind = $('#'+UFCFieldID);
					    		if(($myFind.length>0 && UFCFieldData==="OPEN")||(!($myFind.length>0) && UFCFieldData==="CLOSE")){
					    			//console.log('!!!!!!!!! FOUND #'+UFCFieldData);
					    			if(nextFieldReady===false){
					    				console.log('>>>>>>>>>> UFC-W84: nextFieldReady=false >>> true >>> go!');
					    				nextFieldReady=true;
					    				observer.disconnect();
					    				runNextInQueue();
					    			}
					    		} else {
					    			//console.log('still waiting for #'+UFCFieldData);
					    		}
						    }catch(err){
						    	//console.log('mutation observer error: '+err);
					   		}
					    });
					};
					// Create an observer instance linked to the callback function
					var observer = new MutationObserver(callback);
					// Start observing the target node for configured mutations
					observer.observe(targetNode, config);

				break;

				case 'ufc-mdo':// open media for edit 1: listen 2: click 3: react 4: next
					var nextFieldReady=false;
					var targetNode = document.getElementsByTagName("body")[0];
					// Options for the observer (which mutations to observe)
					var config = { attributes: true, childList: true, subtree: true };
					// Callback function to execute when mutations are observed
					var callback = function(mutations) {
					    mutations.forEach(function(mutation) {
					    	try{
					    		// OK lets not gett too clever about it.
					    		var $myFind = $('#'+UFCFieldData);
					    		if($myFind.length>0){
					    			//console.log('!!!!!!!!! FOUND #'+UFCFieldData);
					    			if(nextFieldReady===false){
					    				console.log('>>>>>>>>>> nextFieldReady=false >>> true >>> go!');
					    				nextFieldReady=true;
					    				observer.disconnect();
					    				runNextInQueue();
					    			}
					    		} else {
					    			//console.log('still waiting for #'+UFCFieldData);
					    		}
						    }catch(err){
						    	console.log('mutation observer error: '+err);
					   		}
					    });
					};
					// Create an observer instance linked to the callback function
					var observer = new MutationObserver(callback);
					// Start observing the target node for configured mutations
					observer.observe(targetNode, config);

					// MAKE THAT CLICK EVENT
					var event = new MouseEvent('click', {
						'view': window,
						'bubbles': true,
						'cancelable': true
					});
					var  myMediaEditButton = document.getElementById(UFCFieldID);
					myMediaEditButton.dispatchEvent(event);
				break;
				default:
					console.log('   ' + UFCFieldType + ' is not a UFC- controlled field.');
					runNextInQueue();
				break;
			}//switch

		} else {
			pageClosing();
		}
	} catch(err) {
		console.log('function runTaskQueue Error on: '+taskQueue[0][0]+'   Target Field: '+taskQueue[0][1]+'   Target Data: '+taskQueue[0][2]);
		console.log('function runTaskQueue Error Message: '+err);
		runNextInQueue();
	}
}

function runNextInQueue(){
		taskQueue.shift();
		console.log('runNextInQueue-- still '+taskQueue.length+' more tasks left, run task queue again');
		runTaskQueue();
}

function addNewParagraphs(paragraphContent){// parse and queue up add new PGs
	console.log('function addNewParagraphs:'+paragraphContent);
	//will start just hrd codinf bodt PF add button container divs- they add --2 on pg incrementation
	var myContainer = 'body';
	try{
		if(paragraphContent.substring(0,1)==='['){
			console.log('multiple PG item/ fields');
			var myParagraphAdditions = JSON.parse(paragraphContent);
			for(myParagraphAddition in myParagraphAdditions){
				console.log('myParagraphAddition'+myParagraphAddition+' ::: '+myParagraphAddition[myParagraphAddition]);
			};
			// MULTPLE PG? SPLIT AND *UN*SHIFT MULTIPLE PARAGRAPHS BACK UP INTO THE TASK QUEUE INDIVIDUALLY
			//single pg and multiple fields: addNewParagraph
		} else {
			console.log('singular pg item/value');
			addNewParagraph(myContainer,paragraphContent.split(':')[0], paragraphContent.substring(paragraphContent.indexOf(':')+1,10000));
		}
	} catch(err) {
		console.log('function addNewParagraphs Error: '+err);
		runNextInQueue();
	}
}

function addNewParagraph(container, paragraphType, paragraphContent){
	//we'll work on that container for later
	try{
		console.log('function addNewParagraph ('+container+','+paragraphType+','+paragraphContent+')');
		if(UFCData.PGinProgress===0){
			UFCData.PGinProgress=UFCData.PGinProgress+1;
			UFCData.currentParagraphType=paragraphType;
			UFCData.currentParagraphContent=paragraphContent;
			console.log('addNewParagraph: No paragraph in progress; creating new:'+paragraphType);
			for(pgType in paragraphTypesObj){
				//console.log('pgType:'+pgType);
				if(pgType===paragraphType) {
					console.log('addNewParagraph: '+pgType+' PG add button='+paragraphTypesObj[pgType].btnClass);
					var event = new MouseEvent('mousedown', {
						'view': window,
						'bubbles': true,
						'cancelable': true
					});
					//body PG always has same name :)
					var myAddButtonContainer=paragraphContainersObj[container].addContainer;
					console.log('PG add button in '+container+'  '+myAddButtonContainer);

					var myAddButton = $(myAddButtonContainer).find(paragraphTypesObj[pgType].btnClass).get(0);
					console.log('addNewParagraph: '+'myAddButton::'+myAddButtonContainer+'.find>'+paragraphTypesObj[pgType].btnClass);
					console.log('addNewParagraph: '+'my title::'+$(myAddButtonContainer).find(paragraphTypesObj[pgType].btnClass).attr('title'));
					myAddButton.dispatchEvent(event);
					UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length;
					console.log('addNewParagraph: '+paragraphType+' starting mutation observer with '+UFCData.myParagraphsCount+" paragraphs");

					var targetNode = $("#edit-field-body-paragraphs")[0];
					console.log('addNewParagraph: '+targetNode.attributes.toString());

					var config = { childList: true };
					// Callback function to execute when mutations are observed
					var callback = function(mutations) {
					    mutations.forEach(function(mutation) {
					    	try{
								if (mutation.type == 'childList') {
									//console.log('A child node has been added or removed.');
									if(UFCData.myParagraphsCount < $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length){
										//console.log('PARAGRAPH HAS BEEN ADDED');
										observer.disconnect();
										UFCData.myParagraphsCount = $("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').length;
										// cleverer selection process reuired laters
										var myParagraph=$(paragraphContainersObj[container].pgTable).last();
										editParagraph(myParagraph, paragraphType, paragraphContent);
									}
								}
						    }catch(err){
								console.log('addNewParagraph: '+'mutation observer error: '+err);
								observer.disconnect();
					   		}
					    });
					};
					// Create an observer instance linked to the callback function
					var observer = new MutationObserver(callback);
					// Start observing the target node for configured mutations
					observer.observe(targetNode, config);
					break;
					
				}
			}	
		}
	} catch(err) {
		console.log('function addNewParagraph Error: '+err);
	}
}

function editParagraph(myParagraph, paragraphType, paragraphContent){
	try {
		console.log('FUNCTION editParagraph(myParagraph: '+myParagraph+', paragraphType: '+paragraphType+', paragraphContent:'+paragraphContent+')');
		if(paragraphContent.substring(0,1)==='['){
			console.log('editParagraph: '+'multiple/specific fields');
		} else {
			var myParagraphDefault=paragraphTypesObj[paragraphType].default;
			console.log('editParagraph: '+'fill single default field in Paragraph:'+myParagraphDefault);
			var myFieldSelector=paragraphTypesObj[paragraphType].fields[myParagraphDefault];
			console.log('editParagraph: '+'myFieldSelector: '+myFieldSelector);
			var myfieldToEdit=myParagraph.find(myFieldSelector).last();
			console.log('editParagraph: '+'fill default field:'+myParagraph.attr('id')+'   :::  '+myfieldToEdit.attr('id'));
			var myFieldType=myFieldSelector.toString().split('[')[0];
			console.log('editParagraph: '+'fill feild type'+myFieldType);
			fillField(myfieldToEdit,myFieldType,paragraphContent);//<< multifield will require fields specific content here, not just the whole of the task
			console.log('editParagraph: '+'default field ID::'+myParagraph.find(paragraphTypesObj[paragraphType].fields[myParagraphDefault]).attr('id'));
			finishedWithParagraph();
		}
	} catch(err) {
		console.log('!!! editParagraph Error: '+err);
		finishedWithParagraph();
	}
}

function fillField(fieldToEdit,fieldType,paragraphContent){
	try{
		console.log('function fillField: '+fieldToEdit+' >>> '+fieldType+' >>> '+paragraphContent)
		switch(fieldType){
			case 'input:text':
				fieldToEdit.val(paragraphContent);
			break;
			case 'textarea:rich':
				console.log('fillField: '+'Filling TEXTAREA:rich field');
				var myIFrame =fieldToEdit.find('iframe');	
				console.log('fillField: '+'myIFrame ID:'+myIFrame.attr('id'));
				myIFrame.load(function(){
						// THIS PROBABLY STILL NEEDS A MUTATION OBSERVER TO WAIT FOR THE IFRAM, AYE?
						console.log('fillField: '+'fillRichTextListener: myIFrame.load for '+UFCData.currentParagraphType +' within '+myParagraph.attr('class'));
						if(myIFrame.contents().find('body').html()!=UFCData.currentParagraphContent){
							console.log('>>>CONTENTS:'+myIFrame.contents().find('body').html());
							myIFrame.contents().find('body').html(UFCData.currentParagraphContent);
						}
					})
				
			break;
			case 'select':
				fieldToEdit.find('option[value="' + paragraphContent + '"]').prop('selected',true);
				
			break;
			case 'input:checkbox':
				if(paragraphContent==='TRUE'){
					fieldToEdit.prop('checked',true);}
				else {	fieldToEdit.prop('checked',false);}
			break;
			case 'textarea':
				fieldToEdit.val(paragraphContent);
			break;
			default:
				console.log('function fillField ERROR: unhandled field type ='+ fieldType);
			break;
		}
		return('complete');
	} catch(err) {
		console.log('function fillField Error: '+err);
	}
};

function finishedWithParagraph() {
	UFCData.PGinProgress=UFCData.PGinProgress - 1;
	runNextInQueue();
}



// **************** OK, these will get replaced with a universal field filler, methinks
/*
function fillTextField(fieldIdentifier){
	var myField=$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last().find(fieldIdentifier);
	console.log('fillTextField identifier:'+UFCData.currentParagraphInputField);
	console.log('fillTextField:'+myField.attr('id'));
	myField.val(UFCData.currentParagraphContent);
	//I should put identifier back up in the main array at the top, but hey
	finishedWithParagraph();
}

function fillRichTextField(){
	var myParagraph=$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last();
	var myIFrame =$("#edit-field-body-paragraphs").find('tr[class*="paragraphs-item-type-"]').last().contents().find('iframe');	
	console.log('fillRichTextField:'+myIFrame.attr('id'));
	
	myIFrame.load(function(){
			// THIS PROBABLY STILL NEEDS A MUTATION OBSERVER TO WAIT FOR THE IFRAM, AYE?
			console.log('fillRichTextListener: myIFrame.load for '+UFCData.currentParagraphType +' within '+myParagraph.attr('class'));
			if(myIFrame.contents().find('body').html()!=UFCData.currentParagraphContent){
				console.log('>>>CONTENTS:'+myIFrame.contents().find('body').html());
				myIFrame.contents().find('body').html(UFCData.currentParagraphContent);
				finishedWithParagraph();
			}
		})
	
	finishedWithParagraph();
}*/

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
			chrome.runtime.sendMessage({greeting : 'updtmrn', content : myLinkAddition},function(response){
				console.log("'chrome.runtime.sendMessage({greeting : 'updtmrn', content : "+myLinkAddition+"}#### RESPONSE:"+response.message);
			});
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

			var myFields = '<tr><th>Field Type</th><th>Field Label</th><th>Paragraph Class</th><th>Field Id</th><th>Field Name</th><th>Field Class</th><th>Field Value</th></tr>'
			var myFieldType = '';
			var myFieldLabel = '';
			var myParagraphType = '';//closest('tr[class*="paragraphs-item-type-"]')
			$('#page').find('input, select, option[selected="selected"], textarea, iframe').each(
				function(){
					try{
						myParagraphType='';
						myFieldLabel = $('label[for="'+$(this).attr('id')+'"]').text();
						if($(this).closest('tr[class*="paragraphs-item-type-"]').attr('class')!=undefined){
							myParagraphType =$(this).closest('tr[class*="paragraphs-item-type-"]').attr('class').replace('draggable','').replace('even','').replace('odd','');
						}
						
						switch($(this).get(0).tagName){
							case 'INPUT':
								myFieldType=$(this).get(0).tagName+':'+$(this).attr('type')
							break;
							case 'OPTION':
								if ($(this).attr('selected') != undefined){
									myFieldType=$(this).get(0).tagName+':'+$(this).attr('selected')
								} else {
									myFieldType=$(this).get(0).tagName;
								}
							break;
							default:
								myFieldType=$(this).get(0).tagName;
						}
						//console.log($(this).get(0).tagName);
						myFields = myFields + '<tr><td>'+ myFieldType + '</td><td>'+ myFieldLabel + '</td><td>'+ myParagraphType + '</td><td>' + $(this).attr('id') + '</td><td>' +
						$(this).attr('name') + '</td><td>' + $(this).attr('class') + '</td><td>' + $(this).attr('value') + '</td></tr>';
					} catch(err) {
						console.log(err);
					}
				}
			)
			sendResponse({'myFields': myFields});
		} else {
			console.log('unknown request :' );
		}

	}
)

function pageClosing(){
	console.log('Remaining tasks To Complete:'+taskQueue.length);
	if(taskQueue.length===0){
		if ($.url().param("killTab") ==='TRUE'){
			chrome.runtime.sendMessage({greeting:'killTab'},function(response){
				//console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
			});
		}

		if ($.url().param("ufc-pound-it") ==='TRUE'){
			chrome.runtime.sendMessage({greeting:'pound-it'},function(response){
				console.log('ufc-pount-it sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
				//window.location.replace($.url());
			});
		}


		if ($.url().param("ufc-submit") ==='TRUE'){
			console.log('trigger Submit click');
			$('#edit-submit').trigger('click');
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