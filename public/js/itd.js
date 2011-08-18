$(function(){
	var socket = io.connect(document.domain);
	socket.on("msg",function(msg){
		$("#log").append("<li>"+msg+"</li>");
	});
});
