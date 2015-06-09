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
    //console.log( "UFC at the ready: HREF::" + $(this).attr('href'));
    console.log( "UFC at the ready: URL::" + document.URL);
	console.log( "UFC referring URL:" + document.referrer );
	for (var valuePair in $.url().param()){
		try {	var UFCFieldType = valuePair.substring(0,7);
			var UFCFieldID = valuePair.substring(8,99);
			console.log('UFC FieldType:' + UFCFieldType + '   :UFC FieldID:' + UFCFieldID + '   :Value:' + $.url().param(valuePair));
			switch(UFCFieldType) {
				// timestamp takes text, just get the format right
				case 'ufc-txt':
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
					$('#cke_contents_edit-body-und-0-value body').html($.url().param(valuePair));
					$('iframe').contents().find('body').html($.url().param(valuePair));
				break;
								
				//files
				case 'ufc-fll':// FILE FROM FILE LIBRARY-- 
					$('html, body').animate({ scrollTop: $(document).height()-$(window).height()}, 000);
					//***this doesn't need the filename to access so easily :)
					//var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;">' + $.url().param('ufc-fll') + '</div>';
					//$('body').append(htmlstr);
					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
					$('#mediaBrowser').load(function(){
						console.log('#mediaBrowser Loaded');
						//$('iframe').contents().find('#media-browser-page').load(function(){
							//console.log('#media-browser-page loaded');
							$('iframe').contents().find('#media-tab-upload,#media-tab-library').toggleClass('ui-tabs-hide');
							$('iframe').contents().find('#edit-filename').val($.url().param(valuePair));
							$('iframe').contents().find('a.exposed-button.button').parent().trigger('click');
							//$('iframe').contents().find('a.exposed-button.button').html('wasuuup');
						//});
					});
					
				break;
				
				case 'ufc-mdc'://UFC-Media Check- check the number of items expected against number of media found, right?
					var myMatches = $('#media-browser-library-list tr').length;
					//alert(myMatches + ' - ' + $.url().param(valuePair));
					if(myMatches==$.url().param(valuePair)){
						chrome.runtime.sendMessage('close me',function(response){
							console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
						});
					}
					
				break;
				
				default:
					console.log('   ' + UFCFieldType + ' is not a UFC- controlled field.');
			}
			
		} catch(err) {
			console.log(err);
		}
	}

	
	
	if($.url(document.referrer).param("ufc-autopub") ==='true' && document.referrer != ''){
		$(':regex(href,workflow)').first().each(function(){
			console.log('link:' + $(this).attr('href'));
			window.location.replace('https://cms.doe.gov' + $(this).attr('href') + '?ufc-autopub=workflow1')
		});
	} 
	if($.url(document.referrer).param("ufc-autopub") ==='workflow2' && document.referrer != ''){

		chrome.runtime.sendMessage('close me',function(response){
			console.log('ufc-autopub sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
		
	} 

});

//this is only needed if you're needing a hook from the popup.. leaving in for reference :)

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ? "from a content script:" + sender.tab.url : request.greeting);
		console.log('I heard something: ' + request.greeting);
		

	}
)








