
// requires: board.js

var Brain = function(player_id){
    
    var self = {};
    self.player_id = player_id;

    self.check_killing_blow = function(grid){
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                var coord = Pair(x,y);

                var new_grid = grid.clone();

                if(new_grid.is_victory(self.player_id)){
                    current_stones.push(coord);
                }
            }
        }

    }

    self.move = function(grid){

    }

    return self;
}