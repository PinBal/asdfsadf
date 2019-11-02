	/*function encodeImagetoBase64(element) {
	  var file = element.files[0];
	  var reader = new FileReader();
	  reader.onloadend = function() {
	    	socket.on('newImg', data => {
				$('#empty-chat-text').fadeOut(500);
				// check if the user sending the message is this sessions' user or someone else...
				$chat.append('<div class="well message '+ (window.sessionUser == data.user ? "mine" : "not-mine" ) +'"><strong>' + data.user + ': </strong><img src="' + reader.result + '" /></div>');
				// add a line break after every message for aesthetic purposes
				$chat.append('<br class="chat-line-break">');
			});
		//console.log(reader.result);

	  }
		reader.readAsDataURL(file);
	}*/