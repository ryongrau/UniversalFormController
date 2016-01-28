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
	console.log( "UFC document.referrer:  " + document.referrer );//page you're coming from
	for (var valuePair in $.url().param()){
		try {	var UFCFieldType = valuePair.substring(0,7);
			var UFCFieldID = valuePair.substring(8,valuePair.length);
			console.log('========UFC FieldType:' + UFCFieldType + '   :UFC FieldID:' + UFCFieldID + '   :Value:' + $.url().param(valuePair));
			switch(UFCFieldType) {
				// timestamp takes text, just get the format right
				case 'ufc-txt':
					console.log('>>>>>ufc-txt:'+UFCFieldID+' >>> '+$.url().param(valuePair));
					$('#'+ UFCFieldID).val($.url().param(valuePair));
				break;

				
				case 'ufc-chk':
					if($.url().param(valuePair)==='TRUE'){
						$('#'+ UFCFieldID).prop('checked',true);}
					else {	$('#'+ UFCFieldID).prop('checked',false);}
				break;

				case 'ufc-sel':
					$('#'+ UFCFieldID + ' option[value="' + $.url().param(valuePair) + '"]').prop('selected',true);
				break;
				
				// multiselect: important to ADD only-!
				case 'ufc-msl':
					for (var toAddToSelections in $.url().param(valuePair).split(',')){
						console.log('   toAddToSelections ufc-msl #' + UFCFieldID + ': ' + $.url().param(valuePair).split(',')[toAddToSelections]);
						$('#'+ UFCFieldID + ' option[value="' +  $.url().param(valuePair).split(',')[toAddToSelections] + '"]').prop('selected','selected');
					}
				break;
								
				//Body Text: hidden iFrame Need some thought down here
				case 'ufc-bod'://wow.. this will need some study later
					$('#cke_contents_edit-body-und-0-value').html($.url().param(valuePair));
					//$('iframe').ready(function(){
							console.log('>>>>>ufc-bod:'+$.url().param(valuePair));
							$('iframe').contents().find('body').html($.url().param(valuePair));
					//	});
					//$('iframe').contents().find('body').html($.url().param(valuePair));
				break;
								
				//files
				case 'ufc-fml':// FILE FROM FILE LIBRARY-- 
					$('html, body').animate({ scrollTop: $(document).height()-$(window).height()}, 000);
					//***this doesn't need the filename to access so easily :)
					//var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;">' + $.url().param('ufc-fll') + '</div>';
					//$('body').append(htmlstr);
					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
					$('#mediaBrowser').load(function(){
						console.log('#mediaBrowser Loaded plus media-browser-tabset tabs selecting 1');
						//var tabs = $('#media-browser-tabset').tabs();
						//tabs.tabs('select','#media-tab-library');
						//tabs.tabs(active:'#media-tab-library');
						//try
						//console.log('parent tab: '+$('iframe').contents().find('a[href=#media-tab-library]').parent().parent().html());

						$('iframe').contents().find('a[href=#media-tab-library]').trigger('select');
						$('iframe').contents().find('a[href=#media-tab-library]').parent().trigger('select');
						$('iframe').contents().find('a[href=#media-tab-library]').parent().parent().trigger('select');
						//$('iframe').contents().find('#media-tab-upload,#media-tab-library').toggleClass('ui-tabs-hide');

						//end try

						
						
						$('iframe').contents().find('#edit-filename').val($.url().param(valuePair));
						$('iframe').contents().find('#scrollbox').load(function(){
							console.log('#scrollbox loaded-2');
							
							$('iframe').contents().find('a.exposed-button.button').trigger('click');
							$('iframe').contents().find('a.exposed-button.button').html("still need to click");
						});
					});
					
				break;

				case 'ufc-fup'://srsly, wtf-ok file upload
					console.log('--ufc-fup-- ');
					$('html, body').animate({ 
						scrollTop: $(document).height()-$(window).height()}, 
						000
					);
					
					var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;"><p>' + $.url().param(valuePair) + '</p></div>';
					$('body').append(htmlstr);

					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
					$('#mediaBrowser').load(function(){
						//console.log('#mediaBrowser loaded-1');
						//$('iframe').contents().find('#media-browser-page').load(function(){
							//console.log('#media-browser-iframe loaded-2');
							//$('iframe').contents().find('#media-tab-upload,#media-tab-library').toggleClass('ui-tabs-hide');
							//$('iframe').contents().find('#edit-filename').val($.url().param(valuePair));
							//$('iframe').contents().find('#edit-upload').trigger('click');
							//$('iframe').contents().find('a.exposed-button.button').html('wasuuup');
						//});
					});
				break;	
				
				case 'ufc-mdc'://UFC-Media Check- check the number of items expected against number of media found, right?
					var myMatches = $('#media-browser-library-list tr').length;
					//alert(myMatches + ' - ' + $.url().param(valuePair));
					if(myMatches==$.url().param(valuePair)){
						chrome.runtime.sendMessage('killTab',function(response){
							console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					}
					
				break;
				
				case 'ufc-mdu'://UFC-Media check Usage on /media/#####
					var myMatches = 0;
					$('#content').find('h3 :contains(node)').each(function(){
						console.log('ref by : '+$(this).parent().next().html() );
						myMatches+=1;
						chrome.runtime.sendMessage('refNode'+$(this).parent().next().html() );
						//chrome.runtime.getBackgroundPage().find("#linkedNodeList").append('<tr><td>new</td><td>new</td></tr>');
					})
		/*
					}
					if ($.url().param(valuePair).split(',').length()>0){

						window.open('https://cms.doe.gov/admin/media/ref/'+$.url().param(valuePair).split(',')[0]+'?ufc-mdu='+$.url().param(valuePair).substring(indexOf(',')));
					}
		
					if(myMatches < 1){
						chrome.runtime.sendMessage('killTab',function(response){
							console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					} else {
						console.log('media is used, keeping tab open');
					}
*/
				break;

				case 'ufc-mrf'://check content referenced mt media (comma seperated IDs)
				break;

				default:
					console.log('   ' + UFCFieldType + ' is not a UFC- controlled field.');
				break;
			}
			
		} catch(err) {
			console.log(err);
		}
	}

	
	if ($.url().param("ufc-submit-cls") ==='true'){
		console.log('1.) click Submit');
		$('#edit-submit').trigger('click');
	}

	if (document.referrer.indexOf('ufc-submit-cls=true')>-1){
		console.log('4.) time to go away');
		chrome.runtime.sendMessage('killTab',function(response){
			console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
	}

	if ($.url().param("ufc-sav-pub-cls") ==='true'){
		console.log('1.) click save');
		$('#edit-submit').trigger('click');
		//$('#edit-submit').click();
	}

	if (document.referrer.indexOf('ufc-sav-pub-cls=true')>-1){
		console.log('2.) view>>immediate publish::  '+ document.URL.replace('/view','/workflow/immediate%20publish'));
		window.location.replace(document.URL.replace('/view','/workflow/immediate%20publish?ufc-sav-pub-cls=pub'))
	}

	if ($.url().param("ufc-sav-pub-cls") ==='pub'){
		console.log('3) click update state');
		$('#edit-submit').trigger('click');
	}

	if (document.referrer.indexOf('ufc-sav-pub-cls=pub')>-1){
		console.log('4.) time to go away');
		chrome.runtime.sendMessage('killTab',function(response){
			console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
	}

	/*
	if($.url(document.referrer).param("ufc-autopub") ==='true' && document.referrer != ''){
		$(':regex(href,workflow)').first().each(function(){
			console.log('link:' + $(this).attr('href'));
			window.location.replace('https://stage.cms.doe.gov' + $(this).attr('href') + '?ufc-autopub=workflow1')
		});
	} 
	if($.url(document.referrer).param("ufc-autopub") ==='workflow2' && document.referrer != ''){

		chrome.runtime.sendMessage('killTab',function(response){
			console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
		
	} 
	*/

});

//this is only needed if you're needing a hook from the popup.. leaving in for reference :)

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('I heard something: ' + request.greeting);
		if(request.greeting === "getDemFields"){
			var myFields = 'ufc-bod'
			$('#page').find('input[type=text], select, input[type=checkbox]').each(
				function(){
					myFields = myFields + '\t' + $(this).attr('id')
				}
			)
			console.log('I found these fields: ' + myFields);
		}

	}
)








