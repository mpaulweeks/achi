function game(){

var message_query = '#message';
var setup = true;
var stonesInHand = 8;
var grid = [
	[null,null,null],
	[null,null,null],
	[null,null,null],
];
var players = ['red','blue'];
var current_id = 1;
var current = players[current_id];

function switchTurn(){
	current_id = (current_id + 1) % players.length;
	current = players[current_id];
	$(message_query).html(current + "'s turn");
}

function pair(x,y){
	var self = {};
	self.x = x;
	self.y = y;
	self.query = '#' + self.x + '-' + self.y;

	self.matches = function(other){
		return self.x == other.x && self.y == other.y;
	}

	return self;
}

function getGrid(coord){
	return grid[coord.x][coord.y];
}

function setGrid(coord, value){
	grid[coord.x][coord.y] = value;
}

function getEmptyCoord(){
	if(setup){
		throw "still setup phase";
	}

	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = pair(x,y);
			if(!getGrid(coord)){
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

var winningCoords = [
	[pair(0,0), pair(0,1), pair(0,2)],
	[pair(1,0), pair(1,1), pair(1,2)],
	[pair(2,0), pair(2,1), pair(2,2)],
	[pair(0,0), pair(1,0), pair(2,0)],
	[pair(0,1), pair(1,1), pair(2,1)],
	[pair(0,2), pair(1,2), pair(2,2)],
	[pair(0,0), pair(1,1), pair(2,2)],
	[pair(0,2), pair(1,1), pair(2,0)],
];

function checkVictory(){
	var current_stones = [];
	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = pair(x,y);
			if(getGrid(coord) == current){
				current_stones.push(coord);
			}
		}
	}

	var victory = false;
	winningCoords.forEach(function (stone_combination){
		var allStones = true;
		stone_combination.forEach(function (winning_stone){
			var match = false;
			current_stones.forEach(function (player_stone){
				match |= winning_stone.matches(player_stone);
			});
			allStones &= match;
		});
		victory |= allStones;
	});

	return victory;
}

function draw(){
	var stones = $('.block');
	players.forEach(function (tag){
	    stones.removeClass(tag);
	});
	for(var x = 0; x < 3; x++){
		for(var y = 0; y < 3; y++){
			var coord = pair(x,y);
			var tag = getGrid(coord);
			if(tag){
				$(coord.query).addClass(tag);
			}
		}
	}
}

var gameOver = false;

function action(coord){

	var moveHappened = false;

	if(setup){
		if(!getGrid(coord)){
			setGrid(coord, current);
			stonesInHand--;
			if(stonesInHand == 0){
				setup = false;
			}

			moveHappened = true;
			console.log('placed');
		}
	} else {
		if(getGrid(coord) == current){
			empty = getEmptyCoord();
			if(areNeighbors(coord, empty)){
				setGrid(empty, current);
				setGrid(coord, null);

				moveHappened = true;
				console.log('moved');
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

$('.block').on('click', function () {
	if(!gameOver){
		var coordStr = $(this)[0].id;
		var coord = pair(coordStr[0], coordStr[2]);
		action(coord);
	}
});

switchTurn();

}