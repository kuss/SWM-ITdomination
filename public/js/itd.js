var SocketHandlers = [
	{
		event : "welcome"
		,handler : function(){
			addLog("welcome");
		}
	}
	,{
		event : "gameStart"
		,handler : function(){
			addLog("gameStart");
		}
	}
];

function addLog(text){
	$("#log").append("<li>"+text+"</li>");
}

$(function(){
	var socket = io.connect(document.domain);

	for(var sh in SocketHandlers){
		(function(sh){
			socket.on(sh.event,sh.handler);
		})(SocketHandlers[sh]);
	}
});
