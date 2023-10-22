const gameArea = document.getElementById("gameArea");
const Play = document.getElementById("Play");
const body = document.getElementsByName("body");
Play.addEventListener("click",handleStart);

const getBoard= function(row){
    const board = [];
    for(let i=0;i<row;i++){
        board[i] = [];
        for(let j=0;j<row;j++){
            board[i].push(getCell());
        }
    }
    return board;
};

const getCell = function(){
    const sign = "";
    const checked = false;
    const color = "white";
    return {sign,checked,color};
};

const gameBoard = (function(){
    const row = 3;
    const board = getBoard(row);
    let boardBlocks = [];

    function dropSign(row,col,player){
        board[row][col].sign = player.sign;
        board[row][col].checked = true;
        board[row][col].color = player.color;
        gameControler.setCurrentPlayer();
    }

    function resetBoard(){
        board = getBoard(row);
    }
    let winner = '';
    function getWinner(){
        return winner;
    }
    function setWinner(player){
        winner = player;
    }
    return {row,board,dropSign,resetBoard,getWinner,setWinner,boardBlocks};
})();



const getPlayer = function(name, sign, color){
    return {name,sign,color};
};


const gameControler = (function(){

    let player1;
    let player2;
    let currentPlayer = player1;
    function setPlayer1(name,sign,color){
        player1 = getPlayer(name,sign,color);
        currentPlayer = player1;
    }
    function setPlayer2(name,sign,color){
        player2 = getPlayer(name,sign,color);
    }

    function getPlayer1(){
        return player1;
    }
    function getPlayer2(){
        return player2;
    }

    function getCurrentPlayer(){
        return currentPlayer;
    }

    function setCurrentPlayer(){
        if(currentPlayer == player1){
            currentPlayer = player2;
        }
        else{
            currentPlayer = player1;
        }
    }

    function setGameArea(gameArea,child){
        while(gameArea.firstChild){
            gameArea.removeChild(gameArea.firstChild);
        }
        gameArea.appendChild(child);
    }

    function playRound(row,col){
        if(gameBoard.board[row][col].checked){
            return;
        }
        gameBoard.dropSign(row,col,getCurrentPlayer());
        InterFace.updateInterface(row,col);
    }

    return {getPlayer1,getPlayer2,setPlayer1,setPlayer2,playRound,getCurrentPlayer,setCurrentPlayer,setGameArea};
})();





function handleStart(){
    gameControler.setGameArea(gameArea,InterFace.InfoInterface());
}

function verifyInfo(player1Name,player2Name){
    gameControler.setPlayer1(player1Name.value,'X','red');
    gameControler.setPlayer2(player2Name.value,'O','blue');
    gameControler.setGameArea(gameArea,InterFace.BoardInterface());
}




const InterFace = (function(){
    const InfoInterface = function(){
        const player1Name = document.createElement("input");
        player1Name.placeholder = "Player1 name";
        player1Name.classList.add("name-input");
    
        const player2Name = document.createElement("input");
        player2Name.placeholder = "Player2 name";
        player2Name.classList.add("name-input");
    
        const next = document.createElement("button");
        next.textContent = "NEXT";
        next.id = "info-submit";
        next.classList.add("info-submit");
    
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("game");
        infoDiv.appendChild(player1Name);
        infoDiv.appendChild(player2Name);
        infoDiv.appendChild(next);
    
        next.addEventListener("click",()=>{
            verifyInfo(player1Name,player2Name);
        });
        return infoDiv;
    };

    const BoardInterface = function(){
        const gameLayout = document.createElement("div");
        const curBoard = document.createElement("div");
        curBoard.classList.add("game-board");

        const PlayerInfo = document.createElement("div");
        PlayerInfo.textContent = gameControler.getPlayer1().name +" VS "+gameControler.getPlayer2().name;
        
        for(let i=0;i<gameBoard.row;i++){
            gameBoard.boardBlocks[i] = [];
            for(let j=0;j<gameBoard.row;j++){
                gameBoard.boardBlocks[i][j] = document.createElement("div");
                gameBoard.boardBlocks[i][j].classList.add("board-cell");
                gameBoard.boardBlocks[i][j].addEventListener("click",()=>{
                    gameControler.playRound(i,j);
                });
                curBoard.appendChild(gameBoard.boardBlocks[i][j]);
            }
        }
        gameLayout.appendChild(PlayerInfo);
        gameLayout.appendChild(curBoard);
        return gameLayout;
    };

    const resultInterface = function(){
        const result = document.createElement("div");
        result.textContent = `The winner is ${gameBoard.getWinner}`;
        const home = document.createElement("button");
        home.addEventListener("click",handleStart);
        const restart = document.createElement("button");
        restart.addEventListener("click",()=>{
            gameControler.setGameArea(gameArea,BoardInterface);
        });
    }

    function updateInterface(row,col){
        gameBoard.boardBlocks[row][col].style.background = `url(images/${gameBoard.board[row][col].sign}.svg)`;
    }
    return {InfoInterface,BoardInterface,resultInterface,updateInterface};

})();