(function(window, undefined) {

	// Prepare our Variables
	var History = window.History
	  , $ = window.jQuery
	  , document = window.document;

	// Check to see if History.js is enabled for our Browser
	if(!History.enabled) {
		return false;
	}

	// Wait for Document
	$(function() {
	  	// Prepare Variables
	  	  /* Application Specific Variables */
	  	var contentSelector = "#main"
	  	  , $content = $(contentSelector).filter(':first')
	  	  , contentNode = $content.get(0)
	  	  , activeClass = "selected"
	  	  , activeSelector = ".selected"
	  	  /* Application Generic Variables */
	  	  , $body = $(document.body)
	  	  , rootUrl = History.getRootUrl();

	  	// Ensure Content
	  	if($content.length === 0) {
	  		$content = $body;
	  	}

	  	// Internal Helper
		$.expr[':'].internal = function(obj, index, meta, stack) {
			// Prepare
			var $this = $(obj)
			  , url = $this.attr('href')||''
			  , isInternalLink;
			
			// Check link
			isInternalLink = url.substring(0,rootUrl.length) === rootUrl || url.indexOf(':') === -1;
			
			// Ignore or Keep
			return isInternalLink;
		};

	  	// HTML Helper
	  	var documentHtml = function(html) {
	  		// Prepare
	  		var result = String(html)
	  			.replace(/<\!DOCTYPE[^>]*>/i, '')
	  			.replace(/<(html|head|body|title|meta|script)([\s\>])/gi, '<div class="document-$1"$2')
	  			.replace(/<\/(html|head|body|title|meta|script)\>/gi, '</div>');

	  		// Return
	  		return result;
	  	};

	  	// Ajaxify Helper
	  	$.fn.ajaxify = function() {
	  		// Prepare
	  		var $this = $(this);

	  		// Ajaxify
	  		$this.find('a:internal:not(.no-ajaxy)').click(function(event) {
	  			// Prepare
	  			var $this = $(this)
	  			  , url = $this.attr('href')
	  			  , title = $this.attr('title') || null;

	  			// Continue as normal for cmd clicks etc
	  			if(event.which == 2 || event.metaKey) {
	  				return true;
	  			}
	  			if($this.attr('target') == '_blank' || event.metaKey) {
	  				return true;
	  			}

	  			// Ajaxify this link
	  			History.pushState(null, title, url);
	  			event.preventDefault();

	  			return false;
	  		});

	  		// Chain
	  		return $this;
	  	};

	  	// Ajaxify our Internal Links
	  	$body.ajaxify();

	  	// Hook into State Changes
	  	$(window).bind('statechange', function() {
	  		// Prepare Variables
	  		var State = History.getState()
	  		  , url = State.url
	  		  , relativeUrl = url.replace(rootUrl, '');

	  		$body.addClass('loading-in');
	  		window.setTimeout(function() {
	  			$('html, body').scrollTop(0);
	  			$body.addClass('loading');
	  			$body.addClass('blockscroll');
	  		}, 200);

	  		window.setTimeout(function() {
				// Ajax Request the Traditional Page
		  		$.ajax({
		  			url: url,
		  			success: function(data, textStatus, jqXHR) {
		  				// Prepare
		  				var $data = $(documentHtml(data))
		  				  , $dataBody = $data.find('.document-body:first')
		  				  , $dataContent = $dataBody.find(contentSelector).filter(':first')
		  				  , contentHtml
		  				  , $scripts;

		  				// Fetch the scripts
		  				$scripts = $dataBody.find('.document-script');

		  				if($scripts.context != undefined) {
		  					$scripts.each(function() {
			  					var filename = $(this).attr('src');
			  					console.log(filename);
			  					if(typeof filename != "undefined") {
			  						loadjs($(this).attr('src'));
			  					}
			  				});
		  				} else {
		  					$('body').removeClass('loading');

							window.setTimeout(function() {
								$('body').removeClass('blockscroll');
							}, 200);
		  				}

		  				// Fetch the content
		  				contentHtml = $dataContent.html() || $data.html();
		  				if(!contentHtml) {
		  					document.location.href = url;
		  					return false;
		  				}

		  				// Update the content
		  				$content.append(contentHtml).ajaxify();
		  				$content.html(contentHtml).ajaxify();

		  				// Update the title
		  				document.title = $data.find('.document-title:first').text();
		  				try {
		  					document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
		  				} catch(Exception) {}

		  				$body.removeClass('loading-in');
		  				$body.addClass('loading-out');

		  				window.setTimeout(function() {
		  					$body.removeClass('loading-out');
		  				}, 200);
		  			},
		  			error: function(jqXHR, textStatus, errorThrown) {
		  				console.log(errorThrown);
		  			}
		  		});
	  		}, 500);
	  	});
	});
})(window);

function loadjs(filename) {
	var fileref = document.createElement('script');
	fileref.setAttribute('type', 'text/javascript');
	fileref.setAttribute('src', filename);
	fileref.onload = function() {
		$('body').removeClass('loading');

		window.setTimeout(function() {
			$('body').removeClass('blockscroll');
		}, 1000);
	};

	if(typeof fileref != "undefined") {
		document.getElementsByTagName('head')[0].appendChild(fileref);
	}
}
