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
    console.log( "UFC at the ready:");
	console.log( "UFC referring URL:" + document.referrer );
	for (var valuePair in $.url().param()){
		try {
			console.log('M-A-MI:'+valuePair + ' : ' + $.url().param(valuePair));
			switch(valuePair.substring(0,6)) {
				// timestamp takes text, just get the format right
				case 'ufc-fld':
					$('#'+ valuePair.substring(7,99)).val($.url().param(valuePair));
				break;

				
				case 'ufc-chk':
					if($.url().param(valuePair)==='TRUE'){
						$('#'+ valuePair.substring(7,99)).prop('checked',true);}
					else {	$('#'+ valuePair.substring(7,99)).prop('checked',false);}
				break;

				case 'ufc-sel':
					$('#'+ valuePair.substring(7,99) option[value="' + $.url().param(valuePair) + '"]').prop('selected',true);
				break;
				
				//Need some thought down here
				case 'ufc-bod'://wow.. this will need some study later
					$('#cke_contents_edit-body-und-0-value body').html(mySummary);
					$('iframe').contents().find('body').html(mySummary);
				break;
								
				
				case 'ufc-fil':
					$('html, body').animate({ scrollTop: $(document).height()-$(window).height()}, 000);
					var htmlstr = '<div id="copyPasta" style="position:fixed;width:700px;height:50px;z-index:9999999;background-color:#e0ffff;top:200px;left:300px;padding:20px;font-size:20px;">' + $.url().param('dnkffURL') + '</div>';
					$('body').append(htmlstr);
					$('#edit-field-download-files-und-0 > .launcher').trigger('click'); 
				break;
				
			}
		} catch(err) {
			console.log(err);
		}
	}
	if($.url(document.referrer).param("ufc-autopub") ==='true' && document.referrer != ''){
		$(':regex(href,workflow)').first().each(function(){
			console.log('link:' + $(this).attr('href'));
			window.location.replace('https://cms.doe.gov' + $(this).attr('href') + '?dnkffautopublish=workflow1')
		});
	} 
	if($.url(document.referrer).param("ufc-autopub") ==='workflow2' && document.referrer != ''){

		chrome.runtime.sendMessage('close me',function(response){
			console.log('dnkffautopublish sendMessage response:'+response.message+' sender tab id: ' + response.senderTabId);
		});
		
	} 

});

//this is onkly needed if you're needing a hook from the popup.. leaving in for reference :)
/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                request.greeting);
	populateFields(request.greeting)
	
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
}
*/






