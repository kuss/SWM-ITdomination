var SocketHandlers = [
	{
		event : "welcome"
		,handler : function(){
			ITDomination.addLog("welcome");
		}
	}
	,{
		event : "gameStart"
		,handler : function(){
			ITDomination.addLog("gameStart");
		}
	}
	,{
		event : "turnStart"
		,handler : function(){
			ITDomination.hand_wrapper.slideDown(100);
			ITDomination.addLog("Your Turn!");
		}
	}
	,{
		event : "message"
		,handler : function(message){
			ITDomination.addLog(message);
		}
	}
	,{
		event : "turnEnd"
		,handler : function(){
			ITDomination.addLog("Turn End!");
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
		this.log = $("#log");
		this.tomb = $("#player .tomb-field");
		this.card_info = $("#card-info");
		this.card_info_image = $("#card-info-image");
		this.card_info_text = $("#card-info-text");
		this.game_log = $("#game-log");
		this.focused = null;
		this.data = {0 : {}, 1 : {}};
		this.chat_content = $("#game-chat-content");

		//add view handlers

		var socket = this.socket;

		$(".field-wrapper img").live("click", function(e){
			var card = ITDomination.data[$(this).attr("playerIndex")][$(this).attr("index")];
			// set card info using card object

			ITDomination.card_info_image.html($("<img>").attr("src", card.proto.image));
			ITDomination.card_info_text.html(ITDomination.cardtoInfo(card));
			ITDomination.card_info.show();
			ITDomination.focused = $(this);
		})


		// chat 
		$("#game-chat").submit(function(){
			if(ITDomination.chat_content.val().length > 0){
				ITDomination.socket.emit("chat",ITDomination.chat_content.val());
				ITDomination.chat_content.val('').focus();
			}
			return false;
		});
		// show card info when card clicked
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
	,cardtoInfo : function(card){
		return '<h1 class"card-info-name">'+card.proto.name+'</h1>\
		<table>\
		<tr><td class="card-info-key">공격력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.atk+'</span> ('+card.proto.atk+')</td></tr>\
		<tr><td class="card-info-key">체력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.vit+'</span> / '+card.proto.vit+'</td></tr>\
		<tr><td class="card-info-key">점유력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.occ+'</span> ('+card.proto.occ+')</td></tr>\
		<tr><td class="card-info-key">비용</td><td>:</td><td class="card-info-value"><span class="hl">'+card.proto.cost+'</span></td></tr>\
		</table>';
	}
	,addLog : function(text){
		ITDomination.log.append("<li>"+text+"</li>");
		ITDomination.game_log.prop('scrollTop', ITDomination.game_log.prop("scrollHeight"));
	}
};




$(function(){
//	ITDomination.intro();

	ITDomination.init(document.domain);

});
