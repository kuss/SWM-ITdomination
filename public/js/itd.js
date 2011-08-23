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
		,handler : function(){
			addLog("Your Turn!");
		}
	}
	,{
		event : "setScreen"
		,handler : function(screen){
			console.log(screen);
			$("#player .deck-field").html(screen.player.deckCount);
			ITDomination.hand.find("*").each(function(){
				$(this).remove();
			});

			for(var i in screen.hand){
				console.log(screen.hand[i]);
				ITDomination.hand.append(
					$("<div>").addClass("field-wrapper").html(
						$("<img>").attr("src",screen.hand[i].proto.image).attr("index",screen.hand[i].id).attr("playerIndex",screen.hand[i].playerId)
					)
				);
			}
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

		this.hand = $("#hand");
		this.player = $("#player");
		this.enemy = $("#enemy");
		
		var socket = this.socket;
		$(".field-wrapper img").live("click", function(){
			if($(this).attr("index") != undefined && $(this).attr("index") != null && $(this).attr("playerIndex") != undefined && $(this).attr("playerIndex") != null){
				socket.emit("click", $(this).attr("playerIndex"), $(this).attr("index"));
			}
		});
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
