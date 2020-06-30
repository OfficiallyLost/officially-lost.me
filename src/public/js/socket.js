const socket = io('http://localhost:2000/chat');

socket.on('message', (message) => {
	console.log(message);
});
