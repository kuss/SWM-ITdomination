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
	,{
		event : "turnStart"
		,hander : function(){
		}
	}
	,{
		event : "setScreen"
		,handler : function(){
		}
	}
];

var ITDomination = {
	init : function(socket_url){ //initialize module
		this.socket = io.connect(socket_url); //initialize socket
		var self=this;
		for(var sh in SocketHandlers){ //add socket event handler
			(function(sh){
				self.socket.on(sh.event,sh.handler);
			})(SocketHandlers[sh]);
		}
	}
	,intro : function(){ //show intro 
		$("#intro").show();
	}
	
};

function addLog(text){
	$("#log").append("<li>"+text+"</li>");
}


$(function(){
//	ITDomination.intro();

	ITDomination.init(document.domain);

});
