const displayBoard = (function(){
    const cells = document.querySelectorAll(".gameboard td");
    function returnCells(){
        return cells
    }

    function cellClick(){
        cells.forEach((cell)=>{
            cell.addEventListener("click",addX);
        })
    }
    
    function addX(e){
        e.target.textContent = "X";
    }

    return {cellClick};
})();

displayBoard.cellClick();

