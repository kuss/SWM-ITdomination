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
		event : "message"
		,handler : function(message){
			addLog(message);
		}
	}
	,{
		event : "turnEnd"
		,handler : function(){
			addLog("Turn End!");
		}
	}
	,{
		event : "setScreen"
		,handler : function(screen){
			console.log("screen : ")
			console.log(screen);
			//set screen using screen object

			if(screen.player.deckCount > 0){
				ITDomination.deck.addClass("back-card").html(screen.player.deckCount);
			}
			else
				ITDomination.deck.removeClass("back-card");

			//set hand	
			ITDomination.clear(ITDomination.hand);
			ITDomination.addCards(screen.hand, ITDomination.hand, "field-wrapper");

			//set player front field
			ITDomination.clear(ITDomination.front_field);
			ITDomination.addCards(screen.player.front_field, ITDomination.front_field, "field-wrapper front-field");


			//set enemy front field
			ITDomination.clear(ITDomination.enemy_front_field);
			ITDomination.addCards(screen.enemy.front_field, ITDomination.enemy_front_field, "field-wrapper front-field");

			//set market
			if(screen.game.market)
			{	
				ITDomination.clear(ITDomination.market);
				console.log("market");
				console.log(screen.game.market);
				ITDomination.addCards([screen.game.market], ITDomination.market, "field-wrapper");
				ITDomination.market.prepend("체력 : "+screen.game.market.vit);
			}

			//set tomb
			if(screen.player.tombCount > 0){
				ITDomination.tomb.addClass("back-card").html(screen.player.tombCount);
			}
			else
				ITDomination.tomb.removeClass("back-card");
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
		this.enemy_front_field = $("#enemy .front-fields");
		this.market = $("#market");
		this.deck = $("#player .deck-field");
		this.tomb = $("#player .tomb-field");
		//add view handlers

		var socket = this.socket;
		
		$(".field-wrapper img").live("click", function(){
			if($(this).attr("index") != undefined && $(this).attr("index") != null && $(this).attr("playerIndex") != undefined && $(this).attr("playerIndex") != null){
				socket.emit("click", $(this).attr("playerIndex"), $(this).attr("index"));
			}
		});

		$("#turn-end").click(function(){
			socket.emit("turnEndRequest");
		});
	}
	,intro : function(){ //show intro 
		$("#intro").show();
	}
	,clear : function(obj){
		obj.find("*").each(function(){
			$(this).remove();
		});
		obj.html("");
	}
	,addCards : function(cards, to, className){
		for(var i in cards){
			if(cards[i] != null){
				to.append(
					$("<div>").addClass(className).html(
						$("<img>").attr("src",cards[i].proto.image).attr("index",cards[i].id).attr("playerIndex",cards[i].playerId)
					)
				);
			}
		}
	}
};

function addLog(text){
	$("#log").append("<li>"+text+"</li>");
}


$(function(){
//	ITDomination.intro();

	ITDomination.init(document.domain);

});
