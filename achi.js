
// requires: board.js
// requires: ai.js

function game(){

read_url_param = function(param_name, as_list){
    as_list = as_list || false;
    var vars = {};
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            var param = q[i].split('=');
            var name = param[0];
            var value = param[1];
            vars[name] = vars[name] || [];
            vars[name].push(value);
        }
    }
    if (vars.hasOwnProperty(param_name)){
        if (vars[param_name].length == 1 && !as_list){
            return vars[param_name][0];
        }
        return vars[param_name];
    }
    return null;
};

//constants
var message_query = '#message';
var ai_brain = null;

//stuff that gets setup
var board = Board();
if (Boolean(read_url_param('ai'))){
	ai_brain = Brain(board.current_index);
}

//functions
function switchTurn(){
	$(message_query).html(board.current + "'s turn");
	$(message_query).removeClass();
	$(message_query).addClass('msg-' + board.current);

	check_ai_move();
}

function is_ai_turn(){
	return ai_brain && ai_brain.player_id == board.current;
}

function check_ai_move(){
	if (is_ai_turn()){
		setTimeout(function (){
			var coord = ai_brain.calculate_ai_move(board);
			action(coord);
		}, 400);
	}
}

function checkGameOver(){
	return board.is_game_over();
}

function draw(){
	var stones = $('.block');
	PLAYER_IDS.forEach(function (tag){
	    stones.removeClass(tag);
	});
	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = Pair(x,y);
			var tag = board.getGrid(coord);
			if(tag){
				$(coord.query).addClass(tag);
			}
		}
	}
}

function action(coord){
	var moveHappened = board.action(coord);

	if(moveHappened){
		draw();
		if(!checkGameOver()){
			switchTurn();
		} else {
			$(message_query).html(board.current + " WINS!!");
		}
	}
}

var test_timer = 0;
var test_delta = 400;

function test_move(x,y){
	test_timer += test_delta;
	setTimeout(function (){
		action(Pair(x,y));
	}, test_timer);
}

function startGame(){
	board.reset();
	switchTurn();
	draw();

	if (Boolean(read_url_param('test'))){
		test_move(1,1);
		test_move(0,0);
		test_move(2,2);
		test_move(2,0);
		test_move(1,0);
		test_move(1,2);
		test_move(0,2);
		test_move(0,1);
		test_move(2,2);
		test_move(1,2);
		test_move(0,2);
	}
}

$('.block').on('click', function (){
	if(!checkGameOver() && !is_ai_turn()){
		var coordStr = $(this)[0].id;
		var coord = Pair(coordStr[0], coordStr[2]);
		action(coord);
	}
});

$('#reset').on('click', startGame);

startGame();
}
