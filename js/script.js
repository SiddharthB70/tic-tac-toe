const x = 0, y = 1; //Used to access the x and y values of a cell in the board

const player = ()=>{
    let playerName,playerSymbol,playerWins = 0, isComputer = false;

    function setPlayerDetails(name,symbol){
        playerName = name;
        playerSymbol = symbol;
    }

    function getPlayerName(){
        return playerName;
    }

    function getPlayerSymbol(){
        return playerSymbol;
    }

    function updatePlayerName(newName){
        playerName = newName;
    }

    function updatePlayerSymbol(newSymbol){
        playerSymbol = newSymbol;
    }
    function initializeWin(){
        playerWins = 0;
    }

    function increaseWin(){
        playerWins++;
        winCounter.displayWin(this);
    }

    function returnWins(){
        return playerWins;
    }

    function toggleComputer(){
        isComputer = !isComputer;
    }

    function checkComputer(){
        return isComputer;
    }

    return {setPlayerDetails,
            getPlayerName,
            getPlayerSymbol,
            updatePlayerName,
            updatePlayerSymbol,
            increaseWin,
            returnWins,
            initializeWin,
            toggleComputer,
            checkComputer
            };
};

let player1 = player();
let player2 = player();

/*
gameBoard is a module object that represents tic-tac-toe in logical manner using a 2D array.
It consists other details related to the board, such as the current player and the player's symbol.
It contains methods capable of update the 2D array tic-tac-toe board and return values for the 
present player and symbol.
*/
const gameBoard = (function(){
    let presentPlayer,presentSymbol,cellsFilled,board;

    function updateGameBoard(cell){//Here cell refers to cell coordinate
        board[cell[x]][cell[y]] = presentSymbol;
        cellsFilled++;
    }

    function getPresentSymbol(){
        return presentSymbol;
    }

    function getPresentPlayer(){
        return presentPlayer;
    }

    function updatePresentPlayer(player,symbol){
        presentPlayer = player;
        presentSymbol = symbol;
    }

    function getCellValue(cellCoordinate){
        return board[cellCoordinate[x]][cellCoordinate[y]];
    }
    
    function boardFilled(){
        if(cellsFilled!=9)
            return false;
        else
            return true;
    }

    function positionFilled(coordinate){
        if(board[coordinate[x]][coordinate[y]]=="")
            return false;
        return true;
    }

    function reset(){
        board =[["","",""],
                ["","",""],
                ["","",""]];
        if(player1.getPlayerSymbol() == "X")
            updatePresentPlayer(player1,player1.getPlayerSymbol());
        else
            updatePresentPlayer(player2,player2.getPlayerSymbol());
        cellsFilled = 0;
    }

    return {updateGameBoard,
            getPresentSymbol,
            getPresentPlayer,
            updatePresentPlayer,
            getCellValue,
            boardFilled,
            reset,
            positionFilled};
})();

/*
displayController is a module object that controls the tic-tac-toe board displayed to the user
and any events related with it. It also contains methods to update the displayed board based on 
cell clicked and present player.
*/
const displayController = (function(){
    const boardCells = document.querySelectorAll(".gameboard td"); 

    function lock(){
        boardCells.forEach((cell)=>{
            blockCell(cell);
        })
    }

    function blockCell(cell){
        cell.removeEventListener("click",clickCell);
        cell.classList.remove("hover");
    }

    function reset(){
        boardCells.forEach((cell)=>{
            unblockCell(cell);
        })
    }

    function unblockCell(cell){
        cell.addEventListener("click",clickCell);
            cell.classList.add("hover");
            cell.classList.remove("win");
            cell.textContent = "";
    }

    function clickCell(e){
        selectCell(e.target)
    }

    function selectCell(cell){
        const cellCoordinate = returnCoordinate(cell);

        //To update Displayed cell
        blockCell(cell);
        updateDisplay(cell);

        //To update Array cell
        gameBoard.updateGameBoard(cellCoordinate);
        flowControl.moveControl(cellCoordinate);
    }

    function updateDisplay(cell){
        cell.textContent = gameBoard.getPresentSymbol();
    }

    function displayWin(){
        lock();
        showWinSet();
    }

    function showWinSet(){
        const winSet = gameWin.returnWinSet();
        let cell,k=0;
        winSet.forEach((cellCoordinate)=>{
            cell = returnCell(cellCoordinate);
            setTimeout(showWinCell,100*k,cell);
            k++;
        })
    }

    function showWinCell(cell){
        const lineThrough = document.createElement("div");
        lineThrough.classList.add("line-through");

        const winDirection = gameWin.returnWinDirection();
        if(winDirection == "column")
            lineThrough.classList.add("column");
        else if(winDirection == "ldiagonal")
            lineThrough.classList.add("ldiagonal");
        else if(winDirection == "rdiagonal")
            lineThrough.classList.add("rdiagonal");
        cell.classList.add("win");
        cell.appendChild(lineThrough);
    }

    function returnCell(coordinate){
        return document.querySelector(`tr[data-row="${coordinate[x]}"]> td[data-column="${coordinate[y]}"]`);
    }

    function returnCoordinate(cell){
        let y = cell.getAttribute("data-column");
        const row = cell.closest("tr");
        let x = row.getAttribute("data-row");
        return [x,y];
    }

    return {displayWin,
            lock,
            reset,
            selectCell,
            returnCell};
})();

/*
gameWin is an object to check if the clicked cell creates a win or not
*/
const gameWin = (function(){
    let symbol,winSet = [],winDirection = "";

    function checkWin(cellCoordinate){
        symbol = gameBoard.getPresentSymbol();
        let cWin = checkColumn(cellCoordinate[y]);
        winDirection = "column";
        if(!cWin){
            winDirection = "row";
            let rWin = checkRow(cellCoordinate[x]);
            if(!rWin){
                let dWin;
                if(cellCoordinate[x] == cellCoordinate[y]){
                    dWin = checkLeftDiagonal();
                    winDirection = "ldiagonal";
                }
                else if(Math.abs(cellCoordinate[x]-cellCoordinate[y]) == 2){
                    dWin = checkRightDiagonal();
                    winDirection = "rdiagonal";
                }
                if(!dWin){
                    winDirection = "";
                    return false; 
                }
            } 
        }
        return true;
    }

    function checkColumn(column){
        for(let x=0;x<=2;x++){
            if(gameBoard.getCellValue([x,Number(column)])!=symbol){
                winSet = [];
                return false;
            }
            winSet.push([x,Number(column)]);
        }
        return true;
    }

    function checkRow(row){
        for(let y=0;y<=2;y++){
            if(gameBoard.getCellValue([Number(row),y])!=symbol){
                winSet = [];
                return false;
            }
            winSet.push([Number(row),y]);
        }
        return true;
    }

    function checkLeftDiagonal(){
        let x = 0,y = 0;
        while(x<=2 && y<=2){
            if(gameBoard.getCellValue([x,y])!=symbol){
                winSet = [];
                return false;
            }
            winSet.push([x,y]);
            x++,y++;
        }
        return true;
    }

    function checkRightDiagonal(){
        let x = 0, y = 2
        while(x<=2 && y>=0){
            if(gameBoard.getCellValue([x,y])!=symbol){
                winSet = [];
                return false;
            }
            winSet.push([x,y]);
            x++,y--;
        }
        return true;
    }
    
    function returnWinSet(){
        return winSet;
    }

    function returnWinDirection(){
        return winDirection;
    }

    function reset(){
        winDirection = "";
        winSet = [];
    }

    return {checkWin,
            returnWinSet,
            returnWinDirection,
            reset};
})();

const flowControl = (function(){
    let win,boardFilled;
    
    function moveControl(cellCoordinate){
        win = gameWin.checkWin(cellCoordinate);
        boardFilled = gameBoard.boardFilled();
        if(!win && !boardFilled){
            switchPlayer();
            if((gameBoard.getPresentPlayer()).checkComputer())
                computerAI.generateCoordinate();
            msgPanelObject.playerMessage(gameBoard.getPresentPlayer());
            return;
        }
        else if(win){
            setGameWin();    
            msgPanelObject.newGameMessage(msgPanelObject.winMessage());
            gameBoard.getPresentPlayer().increaseWin();
        }
        else{
            msgPanelObject.newGameMessage(msgPanelObject.tieMessage());
        }
        startButtonObject.unlock();
        startButtonObject.newGame();
    }

    function switchPlayer(){
        presentPlayer = gameBoard.getPresentPlayer();
        if(presentPlayer === player1)
            gameBoard.updatePresentPlayer(player2,player2.getPlayerSymbol());
        
        else    
            gameBoard.updatePresentPlayer(player1,player1.getPlayerSymbol());
    }

    function setGameWin(){
        displayController.displayWin();
    }

    return {moveControl,
            switchPlayer};
})();

const initializePage = (function(){
    const nameForm = document.querySelector("form");
    
    function resetGamePlayers(){
        nameForm.reset();            
        gameBoard.reset();
        gameWin.reset();
        displayController.reset();
        msgPanelObject.removeMessage();
        if(player2.checkComputer()){
            choosePlayer.changePlayer();
        }
        startButtonObject.reset();

        resetButtonObject.lock();
        displayController.lock();
        startButtonObject.unlock();
        playerNameFields.unlock();
        swapButtonObject.unlock();
        choosePlayer.unlock();
        
        setGamePlayers();
        setDefaultValues();
    }

    function setDefaultValues(){
        playerSymbols.displaySymbols();
        winCounter.initialize();
        msgPanelObject.defaultMessage();
    }

    function setGamePlayers(){
        player1.setPlayerDetails("Player 1","X");
        player2.setPlayerDetails("Player 2","O");
    }

    return {resetGamePlayers};
})();

const playerNameFields = (function(){
    const player1Name = document.getElementById("name-field1");
    const player2Name = document.getElementById("name-field2");

    player1Name.addEventListener("keyup",checkEnter);
    player2Name.addEventListener("keyup",checkEnter);

    function checkEnter(e){
        if(e.key == "Enter")
            (e.target).blur();
    }

    function lock(){
        player1Name.disabled = true;
        player2Name.disabled = true;
    }

    function unlock(){
        player1Name.disabled = false;
        player2Name.disabled = false;
    }

    function computerLock(){
        player2Name.disabled = true;
        player2Name.value = "Computer";
    }

    function playerUnlock(){
        player2Name.disabled = false;
        player2Name.value = "Player 2"
    }

    function setPlayerDetails(){
        player1.updatePlayerName(player1Name.value);
        player2.updatePlayerName(player2Name.value);
    }

    return {lock,
            unlock,
            setPlayerDetails,
            computerLock,
            playerUnlock};

})();

const playerSymbols = (function(){
    const player1Symbol = document.getElementById("symbol1");
    const player2Symbol = document.getElementById("symbol2");

    function displaySymbols(){
        player1Symbol.textContent = player1.getPlayerSymbol();
        player2Symbol.textContent = player2.getPlayerSymbol();
    }

    return {displaySymbols};
})();

const swapButtonObject = (function(){
    const swapButton = document.getElementById("swap-button");
    
    swapButton.addEventListener("click",swapButtonFunction);

    function swapButtonFunction(){
        swapButton.classList.add("clicked");
        setTimeout(function(){
            swapButton.classList.remove("clicked");
        },200)
        swapButtonObject();
        playerSymbols.displaySymbols();
        flowControl.switchPlayer();
    }

    function swapButtonObject(){
        let temp = player1.getPlayerSymbol();
        player1.updatePlayerSymbol(player2.getPlayerSymbol());
        player2.updatePlayerSymbol(temp);
    } 
    
    function lock(){
        swapButton.disabled = true;
    }

    function unlock(){
        swapButton.disabled = false;
    }

    return {lock,
            unlock};
})();

const winCounter = (function(){
    const p1Win = document.getElementById("player1-wins");
    const p2Win = document.getElementById("player2-wins");

    function initialize(){
        player1.initializeWin();
        player2.initializeWin();    
        displayWin(player1);
        displayWin(player2);
    }

    function displayWin(player){
        if(player == player1)
            p1Win.textContent = "Wins: "+player1.returnWins();
        else 
            p2Win.textContent = "Wins: "+player2.returnWins();
    }

    return {initialize,
            displayWin};
})();

const startButtonObject = (function(){
    const startButton = document.getElementById("start-button");
    
    startButton.addEventListener("click",startButtonFunctionality);

    function startButtonFunctionality(){
        startButtonObject.lock();
        playerNameFields.lock();
        swapButtonObject.lock();
        choosePlayer.lock();
        resetButtonObject.unlock();

        displayController.reset();
        gameBoard.reset();
        gameWin.reset();

        playerNameFields.setPlayerDetails();
        msgPanelObject.removeMessage();
        msgPanelObject.playerMessage(gameBoard.getPresentPlayer());

        if((gameBoard.getPresentPlayer()).checkComputer())
                computerAI.generateCoordinate();
    }

    function lock(){
        startButton.disabled = true;
        startButton.removeEventListener("click",startButtonFunctionality);
    }

    function unlock(){
        startButton.disabled = false;
        startButton.addEventListener("click",startButtonFunctionality);
    }

    function newGame(){
        startButton.textContent = "Restart";
    }

    function reset(){
        startButton.textContent = "Start";
    }
    
    return {lock,
            unlock,
            newGame,
            reset};
})();

const resetButtonObject = (function(){
    const resetButton = document.getElementById("reset-button");

    resetButton.addEventListener("click",resetGame);

    function unlock(){
        resetButton.disabled = false;
    }

    function lock(){
        resetButton.disabled = true;
    }

    function resetGame(){
        initializePage.resetGamePlayers();
    }

    return {lock,
            unlock}
})();

const msgPanelObject = (function(){
    const messagePanel = document.querySelector(".message-layer");
    let message;

    function defaultMessage(){
        alternateMessage("Enter Player Names",
                         "Click Start to Begin!")
    }

    function alternateMessage(message1,message2){
        let k = 1;
        messagePanel.textContent = message1;
        message = setInterval(function(){
            if(k%2 == 0)
                messagePanel.textContent = message1;
            else
                messagePanel.textContent = message2;
            k++;
        },2000)
    }

    function newGameMessage(result){
        alternateMessage(result,
                         "Click Restart to Begin Next Game");
    }

    function removeMessage(){
        clearInterval(message);
        messagePanel.textContent = "";
    }

    function playerMessage(player){
        messagePanel.textContent = "Present Player: " + player.getPlayerName();
    }

    function winMessage(){
        return gameBoard.getPresentPlayer().getPlayerName() + " Wins!";
    }

    function tieMessage(){
        return "It's a tie!";
    }
    
    return {defaultMessage,
            removeMessage,
            playerMessage,
            winMessage,
            tieMessage,
            newGameMessage};

})();

const choosePlayer = (function(){
    const selectField = document.getElementById("select");

    selectField.addEventListener("click",changePlayer);

    function changePlayer(){
        if(selectField.getAttribute("data-player") == "Player"){
            selectField.setAttribute("data-player","Computer");
            selectField.textContent = "Computer";
            playerNameFields.computerLock();
            player2.toggleComputer();
        }
        else{
            playerNameFields.playerUnlock();
            selectField.setAttribute("data-player","Player");
            selectField.textContent = "Player";
            player2.toggleComputer();
        }
    }

    function lock(){
        selectField.removeEventListener("click",changePlayer);
        selectField.classList.add("disabled");
    }

    function unlock(){
        selectField.addEventListener("click",changePlayer);
        selectField.classList.remove("disabled");
    }

    return {changePlayer,
            lock,
            unlock};
})();

const computerAI = (function(){
    let x,y,cell;
    function generateCoordinate(){
        do{
            x = Math.floor(Math.random()*3);
            y = Math.floor(Math.random()*3);
        }while(gameBoard.positionFilled([x,y]));
        cell  = displayController.returnCell([x,y]);
        displayController.selectCell(cell);
    }
    
    return {generateCoordinate};
})();

window.onload = () =>{
    initializePage.resetGamePlayers();
};
