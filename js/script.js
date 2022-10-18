const gameBoard = (function(){
    const board =  [["","",""],
                    ["","",""],
                    ["","",""]];
    const playerSymbol = {
        "player1": "X",
        "player2": "O"
    };
    let presentPlayer = "player1";
    let presentSymbol = "X"
    const xCoordinate = 0, yCoordinate = 1;

    function updateGameBoard(cell){
        board[cell[xCoordinate]][cell[yCoordinate]] = presentSymbol;
    }

    function getPresentSymbol(){
        return presentSymbol;
    }

    return {updateGameBoard,getPresentSymbol};
})();

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

displayController.cellClick();

