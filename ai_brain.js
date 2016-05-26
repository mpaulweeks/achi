
// requires: board.js
// requires: positions.js

var Brain = function(ai_player_index){

    var self = {};
    self.player_index = ai_player_index;
    self.player_id = PLAYER_IDS[self.player_index];
    self.positions = generate_positions(self.player_index);

    self.check_killing_blow = function(current_board){
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                var coord = Pair(x,y);
                var new_board = current_board.clone();
                var move_happened = new_board.action(coord);
                if (move_happened && new_board.is_game_over()){
                    return coord;
                }
            }
        }
        return null;
    }

    self.check_block = function(current_board){
        var opp_board = current_board.clone();
        opp_board.switch_current();
        var coord = self.check_killing_blow(opp_board);
        if (coord){
            var move_happened = current_board.clone().action(coord);
            if (move_happened){
                return coord;
            }
        }
        return null;
    }

    self.check_perfect_play = function(current_board){
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                var coord = Pair(x,y);
                var new_board = current_board.clone();
                var move_happened = new_board.action(coord);
                if (move_happened){
                    var match = new_board.check_positions(self.positions);
                    if (match){
                        return coord;
                    }
                }
            }
        }
        return null;
    }

    self.get_random_move = function(current_board){
        for(var x = 0; x < 3; x++){
            for(var y = 0; y < 3; y++){
                var coord = Pair(x,y);
                var new_board = current_board.clone();
                var move_happened = new_board.action(coord);
                if (move_happened){
                    return coord;
                }
            }
        }
        throw "no legal moves";
    }

    self.calculate_ai_move = function(current_board){
        var coord = self.check_killing_blow(current_board);
        if (coord) {
            console.log('found killing blow');
            return coord;
        }
        coord = self.check_block(current_board);
        if (coord) {
            console.log('found block');
            return coord;
        }
        coord = self.check_perfect_play(current_board);
        if (coord) {
            console.log('found matching position');
            return coord;
        }
        console.log('resorting to random');
        return self.get_random_move(current_board);
    }

    return self;
}
