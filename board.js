
var Grid = function(arr){
    var self = {};
    self.arr = arr || [
        [null,null,null],
        [null,null,null],
        [null,null,null],
    ];

    self.pair = function(x,y){
        var p = {};
        p.x = x;
        p.y = y;
        p.query = '#' + p.x + '-' + p.y;
        p.matches = function(other){
            return p.x == other.x && p.y == other.y;
        }
        return p;
    }
    
    self.winning_coords = [
        [pair(0,0), pair(0,1), pair(0,2)],
        [pair(1,0), pair(1,1), pair(1,2)],
        [pair(2,0), pair(2,1), pair(2,2)],
        [pair(0,0), pair(1,0), pair(2,0)],
        [pair(0,1), pair(1,1), pair(2,1)],
        [pair(0,2), pair(1,2), pair(2,2)],
        [pair(0,0), pair(1,1), pair(2,2)],
        [pair(0,2), pair(1,1), pair(2,0)],
    ];

    self.getGrid = function(coord){
        return self.arr[coord.x][coord.y];
    }

    self.setGrid = function(coord, value){
        self.arr[coord.x][coord.y] = value;
    }

    self.stones_remaining = function(){
        var total_stones = 0;
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                if(self.getGrid(coord)){
                    total_stones += 1;
                }
            }
        }
        return 8 - total_stones;
    }

    self.is_victory = function(player){
        var current_stones = [];
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                var coord = pair(x,y);
                if(self.getGrid(coord) == player){
                    current_stones.push(coord);
                }
            }
        }

        var victory = false;
        winning_coords.forEach(function (stone_combination){
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

    return self;
}


var Board = function(grid, rotations, flipped){

    var self = {};
    self.grid = grid || make_grid();
    self.rotations = rotations || 0;
    self.flipped = flipped || false;

    self.rotate = function(){
        var rotated_grid = rotate_grid(self.grid);
        return Board(
            rotated_grid,
            self.rotations + 1,
            self.flipped
        )
    }

    self.flip = function(){
        var flipped_grid = flip_grid(self.grid);
        return Board(
            flipped_grid,
            self.rotations,
            !self.flipped
        )
    }

    self.generate_mutations = function(){
        return [
            self,
            self.rotate(),
            self.rotate().rotate(),
            self.rotate().rotate().rotate(),
            self.flip(),
            self.flip().rotate(),
            self.flip().rotate().rotate(),
            self.flip().rotate().rotate().rotate()
        ]
    }

    self.undo_mutation = function(){
        var new_grid = self.grid;
        for (var i = 0; i < self.rotations; i++){
            new_grid = un_rotate_grid(new_grid);
        }
        if (self.flipped){
            new_grid = un_flip_grid(new_grid);
        }
        return Board(new_grid);
    }

    return self;
}