var SocketHandlers = [
	{
		event : "welcome"
		,handler : function(){
			ITDomination.addLog("서버에 접속되었습니다.");
		}
	}
	,{
		event : "gameStart"
		,handler : function(){
			ITDomination.addLog("게임이 시작되었습니다.");
		}
	}
	,{
		event : "turnStart"
		,handler : function(){
			ITDomination.hand_wrapper.slideDown(100);
			ITDomination.addLog("당신의 차례입니다.", true);
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
			ITDomination.addLog("상대방의 차례입니다.", true);
			ITDomination.hand_wrapper.slideUp(100);
		}
	}
	,{
		event : "gameDraw"
		,handler : function() {
			ITDomination.addLog("게임 종료 - 무승부!");
		}
	}
	,{
		event : "gameWin"
		,handler : function() {
			ITDomination.addLog("게임 종료 - 당신의 승리!");
		}
	}
	,{
		event : "gameLose"
		,handler : function() {
			ITDomination.addLog("게임 종료 - 당신의 패배!");
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

			//set player back field
			ITDomination.clear(ITDomination.back_field);
			ITDomination.addCards(screen.player.back_field, ITDomination.back_field, "field-wrapper back-field", 3);
			//set enemy front field
			ITDomination.clear(ITDomination.enemy_front_field);
			ITDomination.addCards(screen.enemy.front_field, ITDomination.enemy_front_field, "field-wrapper front-field", 3);
			
			//set enemy back field
			ITDomination.clear(ITDomination.enemy_back_field);
			ITDomination.addCards(screen.enemy.back_field, ITDomination.enemy_back_field, "field-wrapper back-field", 3);
	
			//set market
			if(screen.game.market.card)
			{	
				ITDomination.clear(ITDomination.market);
				console.log(screen.game.market);
				ITDomination.addCards([screen.game.market], ITDomination.market, "field-wrapper");

				//색 변환 
				var color;
				color = screen.game.market.card.vit / screen.game.market.card.proto.vit;
				if(color>1)color=1;
				color = Math.ceil(255 * (1- color));
				ITDomination.market.children().append($("<div>").addClass("field-text-wrapper").css("color","rgb("+color+","+color+","+color+")").text(screen.game.market.card.vit));
			}

			//set tomb
			if(screen.player.tombCount > 0){
				ITDomination.tomb.addClass("back-card").html(screen.player.tombCount);
			}
			else
				ITDomination.tomb.removeClass("back-card");

			//set player occ
			var enemy_occ = ITDomination.maxOcc - screen.player.occ;
			ITDomination.occ_enemy.text(enemy_occ);
			ITDomination.occ_player.text(screen.player.occ);
			ITDomination.occ_bar.css("width", Math.ceil(enemy_occ/ITDomination.maxOcc*100)+"%");
			
			//set player money
			ITDomination.money.html("\\ "+screen.player.money + "<br /><span class=\"money-per-turn\">\\ "+screen.player.moneyPerTurn + " per turn</span>");
			//set game info

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

		//set constant
		this.maxOcc = 100;

		//set view element
		this.hand = $("#hand");
		this.hand_wrapper = $("#hand-wrapper");
		this.player = $("#player");
		this.enemy = $("#enemy");
		this.front_field = $("#player .front-fields");
		this.back_field = $("#player .back-fields-live");
		this.enemy_front_field = $("#enemy .front-fields");
		this.enemy_back_field = $("#enemy .back-fields-live");
		this.market = $("#market");
		this.deck = $("#player .deck-field");
		this.log = $("#log");
		this.tomb = $("#player .tomb-field");
		this.card_info = $("#card-info");
		this.card_info_image = $("#card-info-image");
		this.card_info_text = $("#card-info-text");
		this.card_info_action = $("#card-info-action");
		this.game_log = $("#game-log");
		this.focused = null;
		this.data = {0 : {}, 1 : {}};
		this.chat_content = $("#game-chat-content");
		this.occ_enemy = $("#game-occ-enemy-value");
		this.occ_player = $("#game-occ-player-value");
		this.occ_bar =$("#game-occ-bar");
		this.money = $("#game-money");
		//add view handlers

		var socket = this.socket;

		$(".field-wrapper img").live("click", function(e){
			var card = ITDomination.data[$(this).attr("playerIndex")][$(this).attr("index")];
			// set card info using card object
			ITDomination.card_info_image.html($("<img>").attr("src", card.card.proto.image));

			ITDomination.card_info_text.html(ITDomination.cardtoInfo(card.card));

			// set action
			ITDomination.clear(ITDomination.card_info_action);
			for(var i in card.action){
				var action = $("<button>");
				action.html(card.action[i].name);
				action.click(function(){
					if(ITDomination.focused != null){
						var focused = ITDomination.focused;
						if(focused.attr("index") != null 
							&& focused.attr("index") != undefined
							&& focused.attr("playerIndex") != null
							&& focused.attr("playerIndex") != undefined
						){
							ITDomination.socket.emit(card.action[i].event, focused.attr("playerIndex"), focused.attr("index"));
						}
					}
				});
				ITDomination.card_info_action.append(action);
			}
			//add close button
			ITDomination.card_info_action.append($("<button>").addClass("card-info-close").html("Close"));
			ITDomination.card_info.show();
			ITDomination.focused = $(this);
			e.stopPropagation();
		});
	
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

		$(".card-info-use").live("click",function(){
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

		$(".card-info-close").live("click",function(e){
			e.stopPropagation();
			ITDomination.card_info.hide();
			ITDomination.focused = null;
		});
		
		//hide card info when user push ESC key
		$(window).keydown(function(e){
			if(e.keyCode == 27){
				ITDomination.card_info.hide();
				ITDomination.focused = null;
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
	,addCards : function(cards, to, className, max){
		if( max == undefined){
			for(var i in cards){
				if(cards[i] != null){
					(function(card_i){
					var ne = $("<div>").addClass(className).html(
								$("<img>").attr("src",card_i.card.proto.image).attr("index",card_i.card.id).attr("playerIndex",card_i.card.playerId)
						);

					ITDomination.data[card_i.card.playerId][card_i.card.id] = card_i;
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
								$("<img>").attr("src",card_i.card.proto.image).attr("index",card_i.card.id).attr("playerIndex",card_i.card.playerId)
						);

					ITDomination.data[card_i.card.playerId][card_i.card.id] = card_i;
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
		if(card.proto.type == "product"){
			return '<h1 class"card-info-name">'+card.proto.name+'</h1>\
			<h2 class="card-info-type">Product</h2>\
			<table>\
			<tr><td class="card-info-key">공격력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.atk+'</span> ('+card.proto.atk+')</td></tr>\
			<tr><td class="card-info-key">체력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.vit+'</span> / '+card.proto.vit+'</td></tr>\
			<tr><td class="card-info-key">점유력</td><td>:</td><td class="card-info-value"><span class="hl">'+card.occ+'</span> ('+card.proto.occ+')</td></tr>\
			<tr><td class="card-info-key">비용</td><td>:</td><td class="card-info-value"><span class="hl">'+card.proto.cost+'</span></td></tr>\
			</table>\
			<div class="card-info-effect-header">효과</div>\
			<div class="card-info-effect">'+card.proto.text+'</div>';
		}
		else if(card.proto.type == "skill"){
			return '<h1 class"card-info-name">'+card.proto.name+'</h1>\
			<h2 class="card-info-type">Tech</h2>\
			<table>\
			<tr><td class="card-info-key">비용</td><td>:</td><td class="card-info-value"><span class="hl">'+card.proto.cost+'</span></td></tr>\
			</table>\
			<div class="card-info-effect-header">효과</div>\
			<div class="card-info-effect">'+card.proto.text+'</div>';
		}
		else if(card.proto.type == "tactic"){
			return '<h1 class"card-info-name">'+card.proto.name+'</h1>\
				<h2 class="card-info-type">Tactic</h2>\
				<table>\
				<tr><td class="card-info-key">비용</td><td>:</td><td class="card-info-value"><span class="hl">'+card.proto.cost+'</span></td></tr>\
				</table>\
				<div class="card-info-effect-header">효과</div>\
				<div class="card-info-effect">'+card.proto.text+'</div>';
		}
	}
	,addLog : function(text, flag){
		if(flag){
			ITDomination.log.append("<li class=\"sep\">"+text+"</li>");
		}
		else{
			ITDomination.log.append("<li>"+text+"</li>");
		}
		ITDomination.game_log.prop('scrollTop', ITDomination.game_log.prop("scrollHeight"));
	}
};




$(function(){
//	ITDomination.intro();

	ITDomination.init(document.domain);

});
