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
			ITDomination.hand_wrapper.slideDown(100);
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
			ITDomination.addCards(screen.player.front_field, ITDomination.front_field, "field-wrapper front-field", 3);


			//set enemy front field
			ITDomination.clear(ITDomination.enemy_front_field);
			ITDomination.addCards(screen.enemy.front_field, ITDomination.enemy_front_field, "field-wrapper front-field", 3);

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

		//set view element

		this.hand = $("#hand");
		this.hand_wrapper = $("#hand-wrapper");
		this.player = $("#player");
		this.enemy = $("#enemy");
		this.front_field = $("#player .front-fields");
		this.back_field = $("#player .back-fields");
		this.enemy_front_field = $("#enemy .front-fields");
		this.market = $("#market");
		this.deck = $("#player .deck-field");
		this.tomb = $("#player .tomb-field");
		this.card_info = $("#card-info");
		this.card_info_image = $("#card-info-image");
		this.card_info_text = $("#card-info-text");
		this.focused = null;
		this.data = {0 : {}, 1 : {}};

		//add view handlers

		var socket = this.socket;

		$(".field-wrapper img").live("click", function(e){
			console.log(ITDomination.data[$(this).attr("playerIndex")][$(this).attr("index")]);
///			ITDomination.card_info_text.html($.data($
			ITDomination.card_info.show();
			ITDomination.focused = $(this);
		})

		ITDomination.card_info.live("click", function(e){
			ITDomination.card_info.hide();
			ITDomination.focused = null;
		});

		$("#hand-toggle").click(function(){
			ITDomination.hand_wrapper.slideToggle(100);
		});

		$("#card-info-use").click(function(){
			if(ITDomination.focused != null){
				var focused = ITDomination.focused;
				if(focused.attr("index") != null 
					&& focused.attr("index") != undefined
					&& focused.attr("playerIndex") != null
					&& focused.attr("playerIndex") != undefined
					){
					ITDomination.socket.emit("click", focused.attr("playerIndex"), focused.attr("index"));
				}
			}
		});

		$("#card-info-close").click(function(e){
			e.stopPropagation();
			ITDomination.card_info.hide();
			ITDomination.focused = null;
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
	,addCards : function(cards, to, className, max){
		if( max == undefined){
			for(var i in cards){
				if(cards[i] != null){
					(function(card_i){
					var ne = $("<div>").addClass(className).html(
								$("<img>").attr("src",card_i.proto.image).attr("index",card_i.id).attr("playerIndex",card_i.playerId)
						);

					ITDomination.data[card_i.playerId][card_i.id] = card_i;
					to.append(ne);
					})(cards[i]);
				}
			}
		}
		else
		{
			for(var i=0;i<max;i++){
				if(cards[i] != null && cards[i] != undefined){
					(function(card_i){
					var ne = $("<div>").addClass(className).html(
								$("<img>").attr("src",card_i.proto.image).attr("index",card_i.id).attr("playerIndex",card_i.playerId)
						);

					ITDomination.data[card_i.playerId][card_i.id] = card_i;
					to.append(ne);
					})(cards[i]);
				}
				else
				{
					to.append($("<div>").addClass(className));
				}
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
