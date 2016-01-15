$.getJSON("js/schema.json", function(){}).success(function(JSONData){

	/* Compile Templates */
	var nav = Handlebars.compile( $( "#nav-container" ).html() ),
		general = Handlebars.compile( $("#nav-general").html() );
		main = Handlebars.compile( $("#main-container").html() );

	/* Helper Functions */
	var reverseWords = function(word) {
		return word.split('_').reverse().join(' ');
	}
	var removePrefix = function(word){
		return word.substring(word.indexOf("_") + 1);
	}
	var replacePrefix = function(word){
		return word.replace(/_/g, ' ');
	}

	/* Establish Helpers */
	Handlebars.registerHelper('formatName', function(options) {
		var retVal = options.fn(this);
		switch(retVal){
			case 'dt_deceased':
				retVal = 'Is deleted?';
				break;
			case 'deceased':
			 	retVal = 'Is deceased?';
				break;
			case 'name_first':
				retVal = reverseWords(retVal);
				break;
			case 'name_middle':
			case 'name_last':
			case 'name_maiden':
				retVal = reverseWords(retVal);
				break;
			case 'name_nick':
				retVal = reverseWords(retVal).replace(/ /g,'');
				break;
			case 'name_prefix':
			case 'name_suffix':
				retVal = removePrefix(retVal);
				break;
			default:
				retVal = replacePrefix(retVal);
				break;
		}
		retVal = new Handlebars.SafeString(retVal);
	  	return retVal;
	});
	Handlebars.registerHelper('formatUsage', function(options) {
		var retVal = "";
		if(options.fn(this)){
			var retArray = options.fn(this).split(",");
			for(var i = 0; i < retArray.length; i++) {
				retVal += '<div class="icon-usage ' +
				retArray[i] +
				'">' +
				replacePrefix(retArray[i]) +
				'</div>';
			}
		}
		return retVal;
	});

	/* Create Wrappers */
	var navWrapper = general ({objects: JSONData}) + nav ({objects: JSONData});
	var mainWrapper = main ({objects: JSONData});

	/* Generate HTML using template */
	$('#nav').append(navWrapper);
	$('#main').append(mainWrapper);

	/* Sidebar Accordions */
	$('.accordion-header').click(function(){
		$('.accordion-content:visible').slideToggle();
		$(this).next('.accordion-content:hidden').slideToggle();
	});
	$('a[data-key]').click(function(e){
		e.preventDefault();
		$target = $('div[data-key=' + $(this).attr('data-key') + ']');
		$('html, body').animate({
	        scrollTop: $target.offset().top
	    }, 1000);
		$('[data-key].focus').removeClass('focus');
		$('[data-key=' + $(this).attr('data-key') + ']').addClass('focus');
	});

});
