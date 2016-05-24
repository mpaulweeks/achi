
var Pair = function(x,y){
    var p = {};
    p.x = x;
    p.y = y;
    p.query = '#' + p.x + '-' + p.y;
    p.matches = function(other){
        return p.x == other.x && p.y == other.y;
    }
    return p;
}

var Grid = function(arr){
    var self = {};

    self.generate_grid = function(){
        return [
            [null,null,null],
            [null,null,null],
            [null,null,null],
        ];
    }

    self.arr = arr || self.generate_grid();
    
    self.winning_coords = [
        [Pair(0,0), Pair(0,1), Pair(0,2)],
        [Pair(1,0), Pair(1,1), Pair(1,2)],
        [Pair(2,0), Pair(2,1), Pair(2,2)],
        [Pair(0,0), Pair(1,0), Pair(2,0)],
        [Pair(0,1), Pair(1,1), Pair(2,1)],
        [Pair(0,2), Pair(1,2), Pair(2,2)],
        [Pair(0,0), Pair(1,1), Pair(2,2)],
        [Pair(0,2), Pair(1,1), Pair(2,0)],
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
                var coord = Pair(x,y);
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
                var coord = Pair(x,y);
                if(self.getGrid(coord) == player){
                    current_stones.push(coord);
                }
            }
        }

        var victory = false;
        self.winning_coords.forEach(function (stone_combination){
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

    self.rotate = function(){
        var new_grid = self.generate_grid();
        new_grid[1][1] = self.arr[1][1];
        new_grid[0][0] = self.arr[0][2];
        new_grid[2][0] = self.arr[0][0];
        new_grid[2][2] = self.arr[2][0];
        new_grid[0][2] = self.arr[2][2];
        new_grid[1][0] = self.arr[0][1];
        new_grid[2][1] = self.arr[1][0];
        new_grid[1][2] = self.arr[2][1];
        new_grid[0][1] = self.arr[1][2];
        return new_grid;
    }

    self.flip = function(){
        var new_grid = self.generate_grid();
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                new_grid[x][y] = self.arr[x][2-y];
            }
        }
        return new_grid;
    }

    return self;
}


var Board = function(grid, rotations, flipped){

    var self = {};
    self.grid = grid || make_grid();
    self.rotations = rotations || 0;
    self.flipped = flipped || false;

    self.rotate = function(){
        var rotated_grid = self.grid.rotate();
        return Board(
            rotated_grid,
            self.rotations + 1,
            self.flipped
        )
    }

    self.flip = function(){
        var flipped_grid = self.grid.flip();
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
        for (var i = 0; i < 4 - self.rotations; i++){
            new_grid = new_grid.rotate();
        }
        if (self.flipped){
            new_grid = new_grid.flip();
        }
        return Board(new_grid);
    }

    return self;
}