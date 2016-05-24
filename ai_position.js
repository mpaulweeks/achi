
// requires: board.js

var offensive_positions = function(p_id, o_id){
    var move1 = [
        [null,null,null],
        [null,p_id,null],
        [null,null,null],
    ];
    var move1_trap = [
        [p_id,o_id,null],
        [null,p_id,null],
        [null,null,null],
    ];
    var move2 = [
        [o_id,null,null],
        [null,p_id,null],
        [null,null,p_id],
    ];
    var move2_trap1 = [
        [o_id,null,null],
        [o_id,p_id,null],
        [p_id,null,p_id],
    ];
    var move2_trap2 = [
        [o_id,null,null],
        [null,p_id,o_id],
        [null,p_id,p_id],
    ];
    var move4 = [
        [o_id,p_id,o_id],
        [null,p_id,null],
        [p_id,o_id,p_id],
    ];
    return [
        move1,
        move1_trap,
        move2,
        move2_trap1,
        move2_trap2,
        move4,
    ];
}

var parity_positions = function(p_id, o_id){
    var offensive_move5 = [
        [o_id,p_id,o_id],
        [o_id,p_id,p_id],
        [p_id,o_id,null],
    ];
    var defensive_reversal = [
        [p_id,o_id,p_id],
        [null,p_id,o_id],
        [o_id,p_id,o_id],
    ];
    return [
        offensive_move5,
        defensive_reversal,
    ];
}

var defensive_positions = function(p_id, o_id){
    var move1_center = [
        [p_id,null,null],
        [null,o_id,null],
        [null,null,null],
    ];
    var move2_center = [
        [p_id,null,p_id],
        [null,o_id,null],
        [null,null,o_id],
    ];
    var move1_corner = [
        [o_id,null,null],
        [null,p_id,null],
        [null,null,null],
    ];
    var move2_corner_corner = [
        [o_id,p_id,null],
        [null,p_id,null],
        [null,null,o_id],
    ];
    var move2_corner_side = [
        [o_id,null,p_id],
        [null,p_id,o_id],
        [null,null,null],
    ];
    var move1_side = [
        [null,o_id,null],
        [null,p_id,null],
        [null,null,null],
    ];
    var move2_side_sandwich = [
        [p_id,o_id,null],
        [null,p_id,null],
        [null,o_id,null],
    ];
    var move2_side_close = [
        [null,o_id,p_id],
        [o_id,p_id,null],
        [null,null,null],
    ];
    return [
        move1_center,
        move2_center,
        move1_corner,
        move2_corner_corner,
        move2_corner_side,
        move1_side,
        move2_side_sandwich,
        move2_side_close,
    ];
}

var generate_positions = function(player_index){
    var p_id = PLAYER_IDS[player_index];
    var o_id = PLAYER_IDS[1 - player_index];
    return (
        offensive_positions(p_id, o_id).concat(
        parity_positions(p_id, o_id)).concat(
        defensive_positions(p_id, o_id))
    )
}
