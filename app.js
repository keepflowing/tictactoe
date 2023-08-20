const boardDisplay = document.querySelector("#gameBoard");

const board = (() => {
    const squares = ["", "", "", "", "", "", "", "", ""];
    const init = () => {
        boardDisplay.innerHTML = "";
        for (let i in squares) {
            let square = document.createElement("div");
            square.addEventListener("click", () => {
                placeMarker(i);
            });
            square.classList.add("square");
            square.innerText = squares[i];
            square.id = "sq"+i;
            boardDisplay.append(square);
        }
    }

    const placeMarker = (i) => {
        if (squares[i] === "") {
            squares[i] = playerTurn;
            board.update(i);   

            playerTurn === players[0].marker ? playerTurn = players[1].marker 
            : playerTurn = players[0].marker;

            board.checkGO();
        }
        else {
            alert("This square is taken!")
        }
    }

    const checkGO = () => {
        
    }

    const update = (i) => {
        document.querySelector(`#sq${i}`).innerText = squares[i];
    }

    return {init, update}
})();

const Player = (name, marker) => {
    let score = 0;
    return {name, marker, score};
}

const players = [Player("P1", "X"), Player("P2", "O")]

let playerTurn = players[0].marker;
board.init();