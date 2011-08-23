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
			console.log("screen : ")
			console.log(screen);
			//set screen using screen object

			$("#player .deck-field").html(screen.player.deckCount);

			//set hand
	
			ITDomination.clear(ITDomination.hand);
			for(var i in screen.hand){
				ITDomination.hand.append(
					$("<div>").addClass("field-wrapper").html(
						$("<img>").attr("src",screen.hand[i].proto.image).attr("index",screen.hand[i].id).attr("playerIndex",screen.hand[i].playerId)
					)
				);
			}

			//set player front field
			ITDomination.clear(ITDomination.front_field);
			for(var i in screen.player.front_field){
				ITDomination.front_field.append(
					$("<div>").addClass("field-wrapper front-field").html(
						$("<img>").attr("src",screen.player.front_field[i].proto.image).attr("index",screen.player.front_field[i].id).attr("playerIndex",screen.player.front_field[i].playerId)
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
		this.front_field = $("#player .front-fields");
		this.back_field = $("#player .back-fields");

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
	,clear : function(obj){
		obj.find("*").each(function(){
			$(this).remove();
		});
	}
};

function addLog(text){
	$("#log").append("<li>"+text+"</li>");
}


$(function(){
//	ITDomination.intro();

	ITDomination.init(document.domain);

});
