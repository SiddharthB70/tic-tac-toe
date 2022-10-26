const x = 0, y = 1; //Used to access the x and y values of a cell in the board

/*
gameBoard is a module object that represents tic-tac-toe in logical manner using a 2D array.
It consists other details related to the board, such as the current player and the player's symbol.
It contains methods capable of update the 2D array tic-tac-toe board and return values for the 
present player and symbol.
*/
const gameBoard = (function(){
    const board =  [["","",""],
                    ["","",""],
                    ["","",""]];
    
    let presentPlayer,presentSymbol;

    function updateGameBoard(cell){//Here cell refers to cell coordinate
        board[cell[x]][cell[y]] = presentSymbol;
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

    function updateWinSet(set){
        winSet = set;
    }

    return {updateGameBoard,
            getPresentSymbol,
            getPresentPlayer,
            updatePresentPlayer,
            getCellValue,
            updateWinSet};
})();

/*
displayController is a module object that controls the tic-tac-toe board displayed to the user
and any events related with it. It also contains methods to update the displayed board based on 
cell clicked and present player.
*/
const displayController = (function(){
    const boardCells = document.querySelectorAll(".gameboard td"); 

    function cellClick(){
        boardCells.forEach((cell)=>{
            cell.addEventListener("click",selectCell);
        })
    }

    function selectCell(e){
        const cell = e.target;
        const cellCoordinate = returnCoordinate(cell);

        //To update Displayed cell
        blockCell(cell);
        updateDisplay(cell);

        //To update Array cell
        gameBoard.updateGameBoard(cellCoordinate);
        flowControl.moveControl(cellCoordinate);
    }
    
    function blockCell(cell){
        cell.removeEventListener("click",selectCell);
        cell.classList.remove("hover");
    }

    function blockAllCells(){
        boardCells.forEach((cell)=>{
            blockCell(cell);
        })
    }

    function displayWin(){
        blockAllCells();
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

    function updateDisplay(cell){
        cell.textContent = gameBoard.getPresentSymbol();
    }

    return {cellClick,
            displayWin};
})();

const flowControl = (function(){
    let win;
    
    function moveControl(cellCoordinate){
        win = gameWin.checkWin(cellCoordinate);
        if(!win)
            switchPlayer();
        else
            setGameWin();
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

    return {moveControl};
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

    return {checkWin,
            returnWinSet,
            returnWinDirection};
})();

const player = ()=>{
    let playerName,playerSymbol,playerWins = 0;

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
    
    function increaseWin(){
        playerWins++;
    }

    function returnWins(){
        return playerWins;
    }

    return {setPlayerDetails,
            getPlayerName,
            getPlayerSymbol,
            updatePlayerName,
            updatePlayerSymbol,
            increaseWin,
            returnWins    
            };
};

const gamePlayers = (function(){
    const nameForm = document.querySelector("form");
    const player1Name = document.getElementById("name-field1");
    const player2Name = document.getElementById("name-field2");
    const player1Symbol = document.getElementById("symbol1");
    const player2Symbol = document.getElementById("symbol2");

    player1Name.addEventListener("keyup",changeName);
    player2Name.addEventListener("keyup",changeName);

    function resetGamePlayers(){
        nameForm.reset();
    }

    function setGamePlayers(){
        player1.setPlayerDetails("Player 1",player1Symbol.textContent);
        player2.setPlayerDetails(player2Name.value,player2Symbol.textContent);
    }

    function changeName(e){
        if(e.key!="Enter")
            return;
        if(e.target==player1Name){
            player1.updatePlayerName(player1Name.value);
            player1Name.blur();
        }
            
        else
            player2.updatePlayerName(player2Name.value);
            player2Name.blur();
    }
    
    function swapSymbols(){
        let temp = player1Symbol.textContent;
        player1Symbol.textContent = player2Symbol.textContent;
        player2Symbol.textContent = temp;
    }
    
    return {resetGamePlayers,setGamePlayers,swapSymbols};
})();

const swapButton = (function(){
    const sButton = document.getElementById("swap-button");
    sButton.addEventListener("click",sButtonFunction);

    function sButtonFunction(){
        sButton.classList.add("clicked");
        setTimeout(function(){
            sButton.classList.remove("clicked");
        },200)
        gamePlayers.swapSymbols();
    }

})();

const player1 = player();
const player2 = player();


window.onload = () =>{
    gamePlayers.resetGamePlayers();
    gamePlayers.setGamePlayers();
    displayController.cellClick();
    gameBoard.updatePresentPlayer(player1,player1.getPlayerSymbol());
};

