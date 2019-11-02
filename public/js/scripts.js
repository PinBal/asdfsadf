/* global $, io, Crypt, i*/
$(document).ready(() => {
	

	const socket = io.connect();
	//message screen
	const $messageArea = $('#messageArea'),
		  $messageForm = $('#messageForm'),
		  $message = $('#message'),
		  $users = $('#users');
	//chat screen
	const $chat = $('#chat');
	//login area
	const $loginForm = $('#loginForm'),
		  $loginArea = $('#loginArea'),
		  $username = $('#username');

	let passphrase = 'fcf8afd67e96fa3366dd8eafec8bcace',
		crypter = Crypt(passphrase),
		id = 0;
		
	socket.on('connect', () => {
		socket.emit('counter', crypter.encrypt({
			id: id
		}));
	});
	
	socket.on('counter', data => {
		var decriptedData = crypter.decrypt(data);
		socket.emit('counter', crypter.encrypt({
			id: decriptedData.id
		}));
	});

	$messageForm.on("submit", event => {
		event.preventDefault();
		if ($message.val().trim() != "" && $message.val().length <= 27) {
			socket.emit('sendMsg', $message.val());
			$message.val('');
		} else {
			alert("Please enter a valid message. The character limit for each message is 27.");
		}
	});

	$loginForm.on("submit", event => {
		event.preventDefault();
		if ($username.val() != "" && $username.val().length <= 8) {
			window.sessionUser = $username.val();
			socket.emit('newUser', $username.val(), data => {
				if (data) {
					$loginForm.fadeOut("slow");
					$('#intro-container').fadeOut("slow");
					$loginArea.fadeOut("slow");
					$("#footer").fadeOut("slow");
					setTimeout(() => {
						$messageArea.fadeIn("slow");
					}, 600);
				}
			});
		} else {
			alert("Please enter an actual username. Remember, everyone will see this name. Your username must be less than 9 characters.");
		}
		$username.val('');
	});
	
	// when a new message is transmitted from the server
	socket.on('newMsg', data => {
		$('#empty-chat-text').fadeOut(500);
		// check if the user sending the message is this sessions' user or someone else...
		$chat.append('<div class="well message '+ (window.sessionUser == data.user ? "mine" : "not-mine" ) +'"><strong>' + data.user + ': </strong>' + data.msg + ' </div>');
		// add a line break after every message for aesthetic purposes
		$chat.append('<br class="chat-line-break">');
	});

	socket.on('getUsers', data => {
		var html = '';

		for (i = 0; i < data.length; i++) {
			html += '<li id="' + id + '" class="list-group-item"><i class="fa fa-circle" style="color: #40f23a;"></i> ' + data[i] + ' </li>';
		}
		$users.html(html);
	});

	$("#file-to-upload").on('change', function() {
		var reader = new FileReader();
		reader.onload = function(){
			socket.emit('sendImg', reader.result);
		};
		reader.readAsDataURL($("#file-to-upload").get(0).files[0]);   
	});

	function debugBase64(base64URL){
		var win = window.open();
		win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
	}

	socket.on('newImg', data => {
		$('#empty-chat-text').fadeOut(500);
		// check if the user sending the message is this sessions' user or someone else...
		$chat.append('<div class="well message '+ (window.sessionUser == data.user ? "mine" : "not-mine" ) +'"><strong>' + data.user + ': </strong><div class="item"><img src="' + data.msg + '" /></div></div>');
		// add a line break after every message for aesthetic purposes
		$chat.append('<br class="chat-line-break">');
	});
	
});	