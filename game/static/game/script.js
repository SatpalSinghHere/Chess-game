
const white_pawn = "\u2659";
const white_knight = "\u2658";
const white_bishop = "\u2657";
const white_rook = "\u2656";
const white_queen = "\u2655";
const white_king = "\u2654";
const whiteset = [white_pawn, white_bishop,white_rook,white_knight,white_queen,white_king];
const black_king = "\u265A";
const black_pawn = "\u265F";
const black_queen = "\u265B";
const black_bishop = "\u265D";
const black_knight = "\u265E";
const black_rook = "\u265C";
const blackset = [black_king, black_queen, black_bishop, black_knight, black_rook, black_pawn];

let self_move = null;
let capture = null;
let move_check = null;
let notify = null;
let board_start = null;

let my_name = null;
let game_over = false;
let player = "whitepiece";
let opponent = "blackpiece";
let selected = [];
let optionsList = [];
let opponent_options_list = [];
let white_king_block = null;
let black_king_block = null;
let opponent_drawings = [];
let player_drawings = [];

let white_king_static = true;
let black_king_static = true;
let castleOptionsList = [];

function player_new_drawings(){
    player_drawings.sort();
    player_drawings.reverse();
    let player_drawer = document.querySelector(".drawer#player");
    player_drawer.textContent = '';
    for(let i=0; i<player_drawings.length;i++){
        player_drawer.textContent += player_drawings[i];
    }
}
function opponent_new_drawings(){
    opponent_drawings.sort();
    opponent_drawings.reverse();
    let opponent_drawer = document.querySelector(".drawer#opponent");
    opponent_drawer.textContent = '';
    for(let i=0; i<opponent_drawings.length;i++){
        opponent_drawer.textContent += opponent_drawings[i];
    }
}
function select(element){
    self_move.play();
    if(selected.length !=0){
        deselect();
    }
    selected.push(element);
    element.classList.add("selected");

    switch(element.textContent){
        case white_pawn: white_pawn_options(element);
            display_options();
            break;
        case black_pawn: black_pawn_options(element);
            display_options();
            break;
        case white_rook: white_rook_options(element);
            display_options();
            break;
        case white_bishop: white_bishop_options(element);
            display_options();
            break;
        case white_knight: white_knight_options(element);
            display_options();
            break;
        case white_queen: white_queen_options(element);
            display_options();
            break;
        case black_pawn: white_pawn_options(element);
            display_options();
            break;
        case black_rook: white_rook_options(element);
            display_options();
            break;
        case black_bishop: white_bishop_options(element);
            display_options();
            break;
        case black_knight: white_knight_options(element);
            display_options();
            break;
        case black_queen: white_queen_options(element);
            display_options();
            break;
        case white_king: white_king_options(element);
            display_options();
            break;
        case black_king: white_king_options(element);
            display_options();
            break;
    }
    
}
function swap_turn(){
    console.log("swapping turn");
    let temp = player;
    player = opponent;
    opponent = temp;
}
function white_king_status(){
    opponent_options('white'); 
    for(let i = 0; i<optionsList.length; i++){
        if(optionsList[i] == white_king_block){
            white_king_block.classList.add("threat");
            move_check.play();
            break;
        }
        else{
            white_king_block.classList.remove("threat");
        }
    }
    optionsList.length = 0;
}
function black_king_status(){
    opponent_options('black');
    for(let i = 0; i<optionsList.length; i++){
        if(optionsList[i].textContent == black_king){
            black_king_block.classList.add("threat");
            // move_check.play();
            break;
        }
        else{
            black_king_block.classList.remove("threat");
        }
    }
    
    optionsList.length = 0;
}

function opponent_options(color){
    let alive_opponent_pieces = null;
    if(color == 'black'){
        alive_opponent_pieces = document.querySelectorAll(`.block[data-under = "whitepiece"]`);
    }else{
        alive_opponent_pieces = document.querySelectorAll(`.block[data-under = "blackpiece"]`);
    }
    
    let flag = 0;
    if((color == 'white' && opponent == "blackpiece") || (color == 'black' && opponent == "whitepiece")){
        console.log('opponent_options_swap_turn');
        swap_turn();
        flag = 1;
    }
    alive_opponent_pieces.forEach((element) => {
        switch(element.textContent){
            case white_pawn: white_pawn_options(element);
                break;
            case black_pawn: black_pawn_options(element);
                break;
            case white_rook: white_rook_options(element);
                break;
            case white_bishop: white_bishop_options(element);
                break;
            case white_knight: white_knight_options(element);
                break;
            case white_queen: white_queen_options(element);
                break;
            case black_pawn: white_pawn_options(element);
                break;
            case black_rook: white_rook_options(element);
                break;
            case black_bishop: white_bishop_options(element);
                break;
            case black_knight: white_knight_options(element);
                break;
            case black_queen: white_queen_options(element);
                break;
        }
    });
    if(flag == 1){
        console.log('opponent_options_swap_turn');
        swap_turn();
    }
}

function deselect(){
    if(selected.length != 0){
        selected[0].classList.remove("selected");
        selected.pop();
    }
    if(optionsList.length != 0){
        for( let i = 0; i < optionsList.length ; i++){
            optionsList[i].classList.remove("option");
            optionsList[i].classList.remove("kill");
        }
    }
    if(castleOptionsList.length != 0){
        for( let i = 0; i < castleOptionsList.length ; i++){
            castleOptionsList[i].classList.remove("castle");
        }
    }
    optionsList.length = 0;
    castleOptionsList.length = 0;
}
function move(launch, land){
    if(land.textContent == white_king || land.textContent == black_king){
        won_game();
        return;
    }
    if(launch.textContent == white_king || launch.textContent == white_rook){
        white_king_static = false;
    }
    if(launch.textContent == black_king || launch.textContent == black_rook){
        black_king_static = false;
    }
    if(land.textContent == ''){
        self_move.play();
    }
    else{
        capture.play();
        if(launch.dataset.under == 'whitepiece'){
            player_drawings.push(land.textContent);
            player_new_drawings();
        }
        else{
            opponent_drawings.push(land.textContent);
            opponent_new_drawings();
        }
    }
    land.textContent = launch.textContent;
    
    launch.textContent = '';
    
    deselect();
    white_king_block.classList.remove("threat");
    black_king_block.classList.remove("threat");
    assign();   
    land.classList.add("land");
    launch.classList.add("launch");
    
    white_king_status();
    black_king_status();
    
    console.log('move_function_swap_turn')
    swap_turn();
}


function assign(){
    const blocks = document.querySelectorAll(".block");
    
    blocks.forEach((element)=>{
        element.classList.remove("occupied");
        element.classList.remove("vacant");
        element.classList.remove("land");
        element.classList.remove("launch");
        
        if(element.textContent != ''){
            element.classList.add("occupied");
            for(let i = 0; i<blackset.length; i++){
                if(element.textContent == blackset[i]){
                    element.setAttribute('data-under', 'blackpiece');
                    if(element.textContent == black_king){
                        black_king_block = element;
                    }
                    break;
                }
                if(element.textContent == whiteset[i]){
                    element.setAttribute('data-under', 'whitepiece');
                    if(element.textContent == white_king){
                        white_king_block = element;
                    }
                    break;
                }
            }
        }
        else{
            element.classList.add("vacant");
            element.setAttribute('data-under', 'none');
        }
    })
    
}
function display_options(){
    for(let i=0; i<optionsList.length; i++){
        
        if(optionsList[i].classList.contains("vacant")){
            optionsList[i].classList.add("option");
        }
        else if(optionsList[i].dataset.under == opponent){
            optionsList[i].classList.add("kill");
        }
    }
    if(castleOptionsList.length != 0){
        for(let i=0; i<castleOptionsList.length; i++){
            castleOptionsList[i].classList.add("castle");
        }
    }
}
function white_king_options(element){
    const id = element.id;
    let row = parseInt(id[0],10);
    const column = id[1];
    let column_index = column.charCodeAt(0);
    if(element.dataset.under == 'whitepiece'){
        opponent_options('white');
        if(white_king_static == true){
            checking_castle('white');
        }
    }else{        
        opponent_options('black');
        if(black_king_static == true){
            checking_castle('black');
        }
    }
    
    function checking_castle(color){
        let f = document.querySelector(`[id="${row}${String.fromCharCode(column_index+1)}"]`);
        let g = document.querySelector(`[id="${row}${String.fromCharCode(column_index+2)}"]`);
        let b = document.querySelector(`[id="${row}${String.fromCharCode(column_index-3)}"]`);
        let c = document.querySelector(`[id="${row}${String.fromCharCode(column_index-2)}"]`);
        let d = document.querySelector(`[id="${row}${String.fromCharCode(column_index-1)}"]`);
        
        // king side castle
        if(f.classList.contains("vacant") && g.classList.contains("vacant")){
            if(!(optionsList.includes(f) || optionsList.includes(g) || optionsList.includes(white_king_block))){
                castleOptionsList.push(g);
            }
        }
        // queen side castle
        if(b.classList.contains("vacant") && c.classList.contains("vacant") && d.classList.contains("vacant")){
            if(!(optionsList.includes(b) || optionsList.includes(c) || optionsList.includes(d) || optionsList.includes(white_king_block))){
                castleOptionsList.push(c);
            }
        }
    }
    opponent_options_list = Array.from(optionsList); //making a copy of optionsList
    optionsList.length = 0;
    //north
    if(row<=7){
        const option = document.querySelector(`[id="${row+1}${column}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //east
    if(column_index<=71){
        const option = document.querySelector(`[id="${row}${String.fromCharCode(column_index+1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //west
    if(column_index>=66){
        const option = document.querySelector(`[id="${row}${String.fromCharCode(column_index-1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //option_east
    if(row<=7 && column_index<=71){
        const option = document.querySelector(`[id="${row+1}${String.fromCharCode(column_index+1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //option_west
    if(row<=7 && column_index>=66){
        const option = document.querySelector(`[id="${row+1}${String.fromCharCode(column_index-1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //south
    if(row>=2){
        const option = document.querySelector(`[id="${row-1}${String.fromCharCode(column_index)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //south_east
    if(row>=2 && column_index<=71){
        const option = document.querySelector(`[id="${row-1}${String.fromCharCode(column_index+1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    //south_west
    if(row>=2 && column_index>=66){
        const option = document.querySelector(`[id="${row-1}${String.fromCharCode(column_index-1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            if(!(opponent_options_list.includes(option))){
                optionsList.push(option);
            }
        }
    }
    
    

}
function white_bishop_options(element){
    const id = element.id;
    let row = parseInt(id[0],10);
    let column = id[1];
    let column_index = column.charCodeAt(0);

    //north-east side
    for(let i=row+1, j=column_index+1; i<=8 && j<=72; i++,j++){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //north-west side
    for(let i=row+1, j=column_index-1; i<=8 && j>=65; i++,j--){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //south-east side
    for(let i=row-1, j=column_index+1; i>=1 && j<=72; i--,j++){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //south-west side
    for(let i=row-1, j=column_index-1; i>=1 && j>=65; i--,j--){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
}

function white_pawn_options(element){
    
    
    const id = element.id;
    let row = parseInt(id[0],10);
    let column = id[1];

    const front = document.querySelector(`[id = "${row + 1}${column}"]`);
    const front2 = document.querySelector(`[id = "${row + 2}${column}"]`);
    if(front.classList.contains("vacant") ){
        if(!(front.classList.contains("option"))){
            optionsList.push(front);
        }
        
        if(row == 2 && front2.classList.contains("vacant")){
            if(!(front2.classList.contains("option"))){
                optionsList.push(front2);
            }
        }
    }
    
    if(column != 'A'){
        
        const dia1 = document.querySelector(`[id = "${row + 1}${String.fromCharCode(column.charCodeAt(0) - 1)}"]`);
        if(dia1.dataset.under == opponent){
            optionsList.push(dia1);
        }
    }
    if(column!='H'){
        const dia2 = document.querySelector(`[id = "${row + 1}${String.fromCharCode(column.charCodeAt(0) + 1)}"]`);
        if(dia2.dataset.under == opponent){
            optionsList.push(dia2);
        }
    }
}
function black_pawn_options(element){
    
    
    const id = element.id;
    let row = parseInt(id[0],10);
    let column = id[1];

    const front = document.querySelector(`[id = "${row - 1}${column}"]`);
    const front2 = document.querySelector(`[id = "${row - 2}${column}"]`);
    if(front.classList.contains("vacant") ){
        if(!(front.classList.contains("option"))){
            optionsList.push(front);
        }
        
        if(row == 7 && front2.classList.contains("vacant")){
            if(!(front2.classList.contains("option"))){
                optionsList.push(front2);
            }
        }
    }
    
    if(column != 'A'){
        
        const dia1 = document.querySelector(`[id = "${row - 1}${String.fromCharCode(column.charCodeAt(0) - 1)}"]`);
        if(dia1.dataset.under == opponent){
            optionsList.push(dia1);
        }
    }
    if(column!='H'){
        const dia2 = document.querySelector(`[id = "${row - 1}${String.fromCharCode(column.charCodeAt(0) + 1)}"]`);
        if(dia2.dataset.under == opponent){
            optionsList.push(dia2);
        }
    }  
            
}
function white_knight_options(element){
    const id = element.id;
    let row = parseInt(id[0],10);
    const column = id[1];
    let column_index = column.charCodeAt(0);
    //fwd_right
    if(row<=6 && column_index<=71){
        const option = document.querySelector(`[id="${row+2}${String.fromCharCode(column_index+1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //right_fwd
    if(row<=7 && column_index<=70){
        const option = document.querySelector(`[id="${row+1}${String.fromCharCode(column_index+2)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //fwd_left
    if(row<=6 && column_index>=66){
        const option = document.querySelector(`[id="${row+2}${String.fromCharCode(column_index-1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //left_fwd
    if(row<=7 && column_index>=67){
        const option = document.querySelector(`[id="${row+1}${String.fromCharCode(column_index-2)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //bwd_right
    if(row>=3 && column_index<=71){
        const option = document.querySelector(`[id="${row-2}${String.fromCharCode(column_index+1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //right_bwd
    if(row>=2 && column_index<=70){
        const option = document.querySelector(`[id="${row-1}${String.fromCharCode(column_index+2)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //bwd_left
    if(row>=3 && column_index>=66){
        const option = document.querySelector(`[id="${row-2}${String.fromCharCode(column_index-1)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    //left_bwd
    if(row>=2 && column_index>=67){
        const option = document.querySelector(`[id="${row-1}${String.fromCharCode(column_index-2)}"]`);
        if( option.classList.contains("vacant") || option.dataset.under == opponent){
            optionsList.push(option);
        }
    }
    
}
function white_rook_options(element){
    const id = element.id;
    let row = parseInt(id[0],10);
    let column = id[1];
    let column_index = column.charCodeAt(0);

    //north side
    for(let i = row+1; i<=8; i++){
        let option = document.querySelector(`[id="${i}${column}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }        
    }

    //south side
    for(let i = row-1; i>=1; i--){
        let option = document.querySelector(`[id="${i}${column}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
    //west side
    for(let i = column_index-1; i>=65; i--){
        let option = document.querySelector(`[id="${row}${String.fromCharCode(i)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
    //east side
    for(let i = column_index+1; i<=72; i++){
        let option = document.querySelector(`[id="${row}${String.fromCharCode(i)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
}
function white_queen_options(element){
    const id = element.id;
    let row = parseInt(id[0],10);
    let column = id[1];
    let column_index = column.charCodeAt(0);

    //north side
    for(let i = row+1; i<=8; i++){
        let option = document.querySelector(`[id="${i}${column}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }

    //south side
    for(let i = row-1; i>=1; i--){
        let option = document.querySelector(`[id="${i}${column}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
    //west side
    for(let i = column_index-1; i>=65; i--){
        let option = document.querySelector(`[id="${row}${String.fromCharCode(i)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
    //east side
    for(let i = column_index+1; i<=72; i++){
        let option = document.querySelector(`[id="${row}${String.fromCharCode(i)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
        
    }
    //north-east side
    for(let i=row+1, j=column_index+1; i<=8 && j<=72; i++,j++){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //north-west side
    for(let i=row+1, j=column_index-1; i<=8 && j>=65; i++,j--){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //south-east side
    for(let i=row-1, j=column_index+1; i>=1 && j<=72; i--,j++){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
    //south-west side
    for(let i=row-1, j=column_index-1; i>=1 && j>=65; i--,j--){
        let option = document.querySelector(`[id = "${i}${String.fromCharCode(j)}"]`);
        if(option.classList.contains("vacant")){
            optionsList.push(option);
        }
        else{
            if(option.dataset.under == opponent){
                optionsList.push(option);
            }
            break;
        }
    }
}

function won_game(){
    deselect();
    game_over = true;
    if(player == 'whitepiece'){
        const player_name = document.querySelector(".name#player").innerHTML;
        openpopup(`${player_name} won the game`);
    }else{
        const player_name = document.querySelector(".name#opponent").innerHTML;
        openpopup(`${player_name} won the game`);
    }
}
function openpopup(message){
    notify.play();
    let popup = document.querySelector("#popup");
    let overlay = document.querySelector("#overlay");
    let h1 = document.createElement("h1");
    h1.innerHTML = message;
    popup.append(h1);
    popup.classList.add("active");
    overlay.classList.add("active");
    
} 
function closepopup(){
    let popup = document.querySelector("#popup");
    let overlay = document.querySelector("#overlay");
    let h1 = document.querySelector("#popup h1");
    h1.remove();
    popup.classList.remove("active");
    overlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () =>{
    capture = new Audio(audio_url + "/capture.mp3");
    move_check = new Audio(audio_url + "/move-check.mp3");
    notify = new Audio(audio_url + "/notify.mp3");
    board_start = new Audio(audio_url + "/board-start.mp3");
    self_move = new Audio(audio_url + "/move-self.mp3");
    
    assign();
    my_name = document.querySelector("#username").textContent;
    const blocks = document.querySelectorAll(".block");
    
    blocks.forEach((element) => {
        assign();
        element.onclick = function(){
            if(game_over){
                won_game();
                return;
            }
            else{
                if(element.dataset.under == player && selected[0]!=element){
                    select(element);
                }
                else{
                    if(element.classList.contains("kill") || element.classList.contains("option")){
                        gameSocket.send(JSON.stringify({
                            'launch' : selected[0].id,
                            'land' : element.id,
                            'sender' : my_name,
                            'swap' : '',
                            'add_my_name' : ''
                        }));
                    }
                    else if(element.classList.contains("castle")){
                        const id = element.id;
                        const row = id[0];
                        const column = id[1];
                        
                        if(column == 'G'){
                            gameSocket.send(JSON.stringify({
                                'launch' : `${row}H`,
                                'land' : `${row}F`,
                                'sender' : my_name,
                                'swap' : '',
                                'add_my_name' : ''
                            }));
                            gameSocket.send(JSON.stringify({
                                'launch' : `${row}E`,
                                'land' : `${row}G`,
                                'sender' : my_name,
                                'swap' : "swap",
                                'add_my_name' : ''
                            }));
                            
                        }
                        else if(column == 'C'){
                            gameSocket.send(JSON.stringify({
                                'launch' : `${row}A`,
                                'land' : `${row}D`,
                                'sender' : my_name,
                                'swap' : '',
                                'add_my_name' : ''
                            }));
                            gameSocket.send(JSON.stringify({
                                'launch' : `${row}E`,
                                'land' : `${row}C`,
                                'sender' : my_name,
                                'swap' : "swap",
                                'add_my_name' : ''
                            }));
                            
                        }
                    }
                    else{
                        if(selected[0]!=element){
                            deselect();
                        }
                    }                
                } 
            }
            
        }
    })
    let close = document.querySelector("#close");    
    close.onclick = function(){ closepopup(); }

    //websocket
    const roomName = JSON.parse(document.getElementById('room-name').textContent);

    const gameSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/game/' + roomName + '/'
    );

    gameSocket.onopen = function(e) {
        console.log("Connection established");
        gameSocket.send(JSON.stringify({
            'add_my_name' : my_name,
            'sender' : '',
            'swap' : '',
            'launch' : '',
            'land' : ''
        }));
    }

    gameSocket.onerror = function(e) {
        console.log("Websocket Error occured");
    }
    const lock = document.querySelector("#lock");
    gameSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data.toss);
        if(data.toss == "room_full"){
            window.location.pathname = '/room_full/';
        }
        if(data.room_full == 'room_full'){
            window.location.pathname = '/room_full';
        }
        console.log("opponent = ", data.opponent);
        if(data.opponent != undefined && data.opponent != ''){
            document.querySelector(".name#opponent").innerHTML = data.opponent.replace(/['"]+/g, '');
            document.querySelector(".name#player").innerHTML = my_name.replace(/['"]+/g, '');
        }
        const launch = data['launch'];
        const land = data['land'];
        console.log("land = ", land);
        console.log("sender = ", data.sender);
        console.log("swap = ", data.swap);
        console.log("add_my_name = ", data.add_my_name);
        if(land){
          const launch_block = document.querySelector(`[id="${launch}"]`);
        const land_block = document.querySelector(`[id="${land}"]`);
        move(launch_block, land_block);  
        }
        if(data.sender != '' && data.sender != undefined){
            if(data.sender == my_name){
                console.log("locked");
                lock.style.pointerEvents = "all";
            }else{
                console.log("unlocked"); 
                lock.style.pointerEvents = "none";
            }
        }
        
        console.log(data.toss);
        if(data.toss == "room_full"){
            window.location.pathname = '/room_full/';
        }
        if(data.toss == 0){
            console.log("blacked");
            const board = document.querySelector(".board");
            board.style.flexDirection = "column-reverse";
            console.log("locked");
            lock.style.pointerEvents = "all";
        }
        if(data.swap == 'swap'){
            console.log('sent swap');
            swap_turn();
        }
    }
})