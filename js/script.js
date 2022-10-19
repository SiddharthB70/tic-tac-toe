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
    const xCoordinate = 0, yCoordinate = 1;

    function updateGameBoard(cell){//Here cell refers to cell coordinate
        board[cell[xCoordinate]][cell[yCoordinate]] = presentSymbol;
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

    return {updateGameBoard,getPresentSymbol,getPresentPlayer,updatePresentPlayer};
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
        cell.removeEventListener("click",selectCell);
        cell.classList.remove("hover");
        gameBoard.updateGameBoard(returnCoordinate(cell));
        updateDisplay(cell);
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

    return {cellClick};
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

})();

const player1 = player("Player 1","X");
const player2 = player("Player 2","O");

window.onload = () =>{
    displayController.cellClick();
    gameBoard.updatePresentPlayer(player1.getPlayerName(),player1.getPlayerSymbol());
};