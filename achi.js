
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
var ai_on = false;

//stuff that gets setup
var board = Board();

//functions
function switchTurn(){
	$(message_query).html(board.current + "'s turn");
	$(message_query).removeClass();
	$(message_query).addClass('msg-' + board.current);
}

function checkGameOver(){
	return board.is_game_over();
}

function draw(){
	var stones = $('.block');
	board.players.forEach(function (tag){
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

function startGame(){
	ai_on = Boolean(read_url_param('ai'))
	board.reset();
	switchTurn();
	draw();

	// practice forcing win
	if (ai_on){
		action(Pair(1,1));
		action(Pair(0,0));
		action(Pair(2,2));
		action(Pair(2,0));
		action(Pair(1,0));
		action(Pair(1,2));
		action(Pair(0,2));
		action(Pair(0,1));
		action(Pair(2,2));
		action(Pair(1,2));
		action(Pair(0,2));
	}
}

$('.block').on('click', function (){
	if(!checkGameOver()){
		var coordStr = $(this)[0].id;
		var coord = Pair(coordStr[0], coordStr[2]);
		action(coord);
	}
});

$('#reset').on('click', startGame);
$('#btn1').on('click', function(){
	console.log(board.rotate());
	draw();
});
$('#btn2').on('click', function(){
	board = board.rotate();
	draw();
});
$('#btn3').on('click', function(){
	board = board.flip();
	draw();
});

startGame();

}