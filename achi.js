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
var players = ['red','blue'];
var ai_on = false;
var current_id = 1;
var current = players[current_id];

//stuff that gets setup
var setup;
var gameOver;
var stonesInHand;
var grid;

//functions
function switchTurn(){
	current_id = (current_id + 1) % players.length;
	current = players[current_id];
	$(message_query).html(current + "'s turn");
	$(message_query).removeClass();
	$(message_query).addClass('msg-' + current);
}

function getEmptyCoord(){
	if(setup){
		throw "still setup phase";
	}
	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = Pair(x,y);
			if(!grid.getGrid(coord)){
				return coord;
			}
		}
	}
	throw "no empty places";
}

function areNeighbors(c1, c2){
	return (
		(c1.x == c2.x && Math.abs(c1.y - c2.y) == 1) ||
		(c1.y == c2.y && Math.abs(c1.x - c2.x) == 1) ||
		(
			((c1.x == 1 && c1.y == 1) || (c2.x == 1 && c2.y == 1)) &&
			Math.abs(c1.x - c2.x) == 1 &&
			Math.abs(c1.y - c2.y) == 1
		)
	)
}

function checkVictory(){
	return grid.is_victory(current);
}

function draw(){
	var stones = $('.block');
	players.forEach(function (tag){
	    stones.removeClass(tag);
	});
	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = Pair(x,y);
			var tag = grid.getGrid(coord);
			if(tag){
				$(coord.query).addClass(tag);
			}
		}
	}
}

function action(coord){
	var moveHappened = false;

	if(setup){
		if(!grid.getGrid(coord)){
			grid.setGrid(coord, current);
			if(grid.stones_remaining() == 0){
				setup = false;
			}

			moveHappened = true;
		}
	} else {
		if(grid.getGrid(coord) == current){
			empty = getEmptyCoord();
			if(areNeighbors(coord, empty)){
				grid.setGrid(empty, current);
				grid.setGrid(coord, null);

				moveHappened = true;
			}
		}
	}

	if(moveHappened){
		draw();
		gameOver = checkVictory();
		if(!gameOver){
			switchTurn();
		} else {
			$(message_query).html(current + " WINS!!");
		}
	}
}

function startGame(){
	ai_on = Boolean(read_url_param('ai'))
	setup = true;
	gameOver = false;
	grid = Grid();
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
	if(!gameOver){
		var coordStr = $(this)[0].id;
		var coord = Pair(coordStr[0], coordStr[2]);
		action(coord);
	}
});

$('#reset').on('click', startGame);

startGame();

}