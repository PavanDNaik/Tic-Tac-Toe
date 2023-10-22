const gameArea = document.getElementById("gameArea");
const Play = document.getElementById("Play");
const body = document.getElementsByName("body");
Play.addEventListener("click",()=>{
    gameControler.initGame();
    handleStart();
});

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
    let board = getBoard(row);
    let boardBlocks = [];

    function dropSign(row,col,player){
        board[row][col].sign = player.sign;
        board[row][col].checked = true;
        board[row][col].color = player.color;
    }

    function resetBoard(){
        for(let i=0;i<row;i++){
            for(let j=0;j<row;j++){
                board[i][j].sign = "";
                board[i][j].checked = false;
                board[i][j].color = "white";
            }
        }
    }
    
    return {row,board,dropSign,resetBoard,boardBlocks};

})();



const getPlayer = function(name, sign, color){
    return {name,sign,color};
};


const gameControler = (function(){

    let gameOne;
    let player1;
    let player2;
    let currentPlayer;

    function initGame(){
        currentPlayer = player1;
        gameOne = true;
    }

    function stopGameOn(){
        gameOne = false;
    }

    function setPlayer1(name,sign,color){
        player1 = getPlayer(name,sign,color);
        currentPlayer = player1;
    }

    function setPlayer2(name,sign,color){
        player2 = getPlayer(name,sign,color);
    }

    function resetPlayer(){
        setPlayer1("","","white");
        setPlayer2("","","white");
        currentPlayer = player1;
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
        if(!gameOne || gameBoard.board[row][col].checked ){
            return;
        }
        
        gameBoard.dropSign(row,col,getCurrentPlayer());
        InterFace.updateInterface(row,col);

        if(resultController.checkForWin(row,col)){
            gameControler.stopGameOn();
            resultController.setWinner(gameControler.getCurrentPlayer());
            
            InterFace.resultInterface();
        }
        else if(resultController.checkForDraw()){
            gameControler.stopGameOn();
            resultController.setWinner(undefined);
            InterFace.resultInterface();
        }

        setCurrentPlayer();
    }

    return {
        getPlayer1,getPlayer2,
        setPlayer1,setPlayer2,
        playRound,
        getCurrentPlayer,setCurrentPlayer,
        setGameArea,resetPlayer,
        initGame,stopGameOn
    };

})();


function handleStart(){
    gameControler.initGame();
    gameControler.setGameArea(gameArea,InterFace.InfoInterface());
}

function verifyInfo(player1Name,player2Name){
    if(player1Name.value == "" || player2Name.value == ""){
        alert("Please Enter Your names!!");
        return;
    }
    gameControler.setPlayer1(player1Name.value,'X','#fca5a5');
    gameControler.setPlayer2(player2Name.value,'O','#86efac');
    gameControler.setGameArea(gameArea,InterFace.BoardInterface());
}


const InterFace = (function(){

    function updateInterface(row,col){
        gameBoard.boardBlocks[row][col].style.background = `url(images/${gameBoard.board[row][col].sign}.svg)`;
        gameBoard.boardBlocks[row][col].style.backgroundColor = gameBoard.board[row][col].color;
    }

    const InfoInterface = function(){
        const form = document.createElement("div");
        form.classList.add("info-form");
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
        form.classList.add("game");
        form.appendChild(player1Name);
        form.appendChild(player2Name);
        form.appendChild(next);
        infoDiv.appendChild(form);
    
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
        PlayerInfo.classList.add("vs-info");
        PlayerInfo.innerHTML = `<div class="red">${gameControler.getPlayer1().name.toUpperCase()}</div> <h1 class="VS-title">VS</h1> <div class="green">${gameControler.getPlayer2().name.toUpperCase()}</div>`;
        
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
        result.classList.add("winner-title");
        
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("result-button-container");
        const home = document.createElement("button");
        home.textContent = "Home";
        home.classList.add("home");
        home.addEventListener("click",()=>{
            gameControler.initGame();
            gameBoard.resetBoard();
            gameControler.resetPlayer();
            handleStart();
        });

        const restart = document.createElement("button");
        restart.textContent = "rematch";
        restart.classList.add("rematch");
        restart.addEventListener("click",()=>{
            gameBoard.resetBoard();
            gameControler.initGame();
            gameControler.setGameArea(gameArea,BoardInterface());
        });
        result.innerHTML = `<div class="result">${resultController.getResult()}<div>`;
        
        buttonContainer.append(home);
        buttonContainer.append(restart);
        gameArea.append(result);
        result.append(buttonContainer);

    }

    const fillRow = function(row){
        for(let i=0;i<gameBoard.row;i++){
            gameBoard.board[row][i].color = "#fde047";
            gameBoard.boardBlocks[row][i].style.backgroundColor = gameBoard.board[row][i].color;
        }
    }

    const fillColumn = function(col){
        for(let i=0;i<gameBoard.row;i++){
            gameBoard.board[i][col].color = "#fde047";
            gameBoard.boardBlocks[i][col].style.backgroundColor = gameBoard.board[i][col].color;
        }
    }

    const fillDiagonal = function(){
        for(let i=0;i<gameBoard.row;i++){
            gameBoard.board[i][i].color = "#fde047";
            gameBoard.boardBlocks[i][i].style.backgroundColor = gameBoard.board[i][i].color;
        }
    }

    const fillAntiDiagonal = function(){
        let size = gameBoard.row;
        for(let i=0;i<gameBoard.row;i++){
            gameBoard.board[i][size-i-1].color = "#fde047";
            gameBoard.boardBlocks[i][size-i-1].style.backgroundColor = gameBoard.board[i][size-i-1].color;
        }
    }
    return {InfoInterface, BoardInterface, resultInterface, updateInterface, fillRow, fillColumn, fillDiagonal, fillAntiDiagonal};

})();

const resultController = (function(){
    let winner = undefined;

    function setWinner(player){
        winner = player;
    }

    function checkForWin(row,col){
        let color = gameBoard.board[row][col].color;
        let isWin = 1;
        let size = gameBoard.row;

        //check row
        for(let i=0;i<size;i++){
            if( !gameBoard.board[row][i].checked || color!=gameBoard.board[row][i].color){
                isWin = 0;
                break;
            }
        }
        if(isWin == 1){
            InterFace.fillRow(row);
            return true;
        }

        //check column
        isWin = 1;
        for(let i=0;i<size;i++){
            if( !gameBoard.board[i][col].checked || color!=gameBoard.board[i][col].color){
                isWin = 0;
                break;
            }
        }

        if(isWin == 1){
            InterFace.fillColumn(col);
            return true;
        }

        //check diagonal
        if(row == col){
            isWin = 1;
            for(let i=0;i<size;i++){
                if(!gameBoard.board[i][i].checked || color!=gameBoard.board[i][i].color){
                    isWin = 0;
                    break;
                }
            }
            if(isWin == 1){
                InterFace.fillDiagonal();
                return true;
            }
        }

        //check anti-diagonal
        if( row + col == size-1){
            isWin = 1;
            for(let i=0;i<size;i++){
                if(!gameBoard.board[i][size-i-1].checked || color!=gameBoard.board[i][size-i-1].color){
                    isWin = 0;
                    break;
                }
            }
            if(isWin == 1){
                InterFace.fillAntiDiagonal();
                return true;
            }
        }
        return false;
    }



    function checkForDraw(){

        for(let i=0;i<gameBoard.row;i++){
            for(let j=0;j<gameBoard.row;j++){
                if(!gameBoard.board[i][j].checked){
                    return false;
                }
            }
        }

        return true;
    }

    function getResult(){
        if(winner == undefined){
            return "Its a Draw";
        }
        else{
            return `Winner is ${winner.name}`;
        }
    }

    return {setWinner,checkForDraw,checkForWin,getResult};
})();