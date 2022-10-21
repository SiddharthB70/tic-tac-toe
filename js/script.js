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

    return {updateGameBoard,getPresentSymbol,getPresentPlayer,updatePresentPlayer,getCellValue};
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

    function returnCoordinate(cell){
        let y = cell.getAttribute("data-column");
        const row = cell.closest("tr");
        let x = row.getAttribute("data-row");
        return [x,y];
    }

    function updateDisplay(cell){
        cell.textContent = gameBoard.getPresentSymbol();
    }

    return {cellClick,blockAllCells};
})();



const player = (playerName,playerSymbol)=>{

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

    return {setPlayerDetails,getPlayerName,getPlayerSymbol,updatePlayerName,updatePlayerSymbol};
};

const flowControl = (function(){
    let win;
    
    function moveControl(cellCoordinate){
        win = gameWin.checkWin(cellCoordinate);
        if(!win)
            switchPlayer();
        else
            displayWin();
    }


    function switchPlayer(){
        presentPlayer = gameBoard.getPresentPlayer();
        if(presentPlayer === player1)
            gameBoard.updatePresentPlayer(player2,player2.getPlayerSymbol());
        
        else    
            gameBoard.updatePresentPlayer(player1,player1.getPlayerSymbol());
    }

    function displayWin(){
        displayController.blockAllCells();
    }

    return {moveControl};
})();

const player1 = player("Player 1","X");
const player2 = player("Player 2","O");

const gameWin = (function(){
    let symbol;
    function checkWin(cellCoordinate){
        symbol = gameBoard.getPresentSymbol();
        let cWin = checkColumn(cellCoordinate[y]);
        let rWin = checkRow(cellCoordinate[x]);
        let dWin;
        if(cellCoordinate[x] == cellCoordinate[y])
            dWin = checkLeftDiagonal();
        else if(Math.abs(cellCoordinate[x]-cellCoordinate[y]) == 2)
            dWin = checkRightDiagonal();
        else
            dWin = false;
        return cWin||rWin||dWin;
    }


    function checkColumn(column){
        for(let x=0;x<=2;x++){
            if(gameBoard.getCellValue([x,Number(column)])!=symbol)
                return false;
        }
        return true;
    }

    function checkRow(row){
        for(let y=0;y<=2;y++){
            if(gameBoard.getCellValue([Number(row),y])!=symbol)
                return false;
        }
        return true;
    }

    function checkLeftDiagonal(){
        let x = 0,y = 0;
        while(x<=2 && y<=2){
            if(gameBoard.getCellValue([x,y])!=symbol)
                return false;
            x++,y++;
        }
        return true;
    }

    function checkRightDiagonal(){
        let x = 0, y = 2
        while(x<=2 && y>=0){
            if(gameBoard.getCellValue([x,y])!=symbol)
                return false;
            x++,y--;
        }
        return true;
    }

    return {checkWin};
})();


window.onload = () =>{
    displayController.cellClick();
    gameBoard.updatePresentPlayer(player1,player1.getPlayerSymbol());
};

