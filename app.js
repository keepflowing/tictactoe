const boardDisplay = document.querySelector("#gameBoard");
let gameOver = false;

const board = (() => {
    const squares = ["", "", "", "", "", "", "", "", ""];
    const init = () => {
        if (gameOver) {
            document.querySelector("#resetBtn").classList.toggle("invisible");
            gameOver = false;
        }
        document.querySelector("#info").innerText = "";
        boardDisplay.innerHTML = "";
        for (let i in squares) {
            squares[i] = "";
            let square = document.createElement("div");
            square.addEventListener("click", () => {
                placeMarker(i);
            });
            square.classList.add("square");
            square.id = "sq"+i;
            boardDisplay.append(square);
        }
    }

    const placeMarker = (i) => {
        if(!gameOver) {
            if (squares[i] === "") {
                squares[i] = playerTurn;
                board.update(i);   
    
                playerTurn === players[0] ? playerTurn = players[1]
                : playerTurn = players[0];
    
                board.checkGO();
            }
            else {
                alert("This square is taken!")
            }
        }
    }

    const checkDraw = () => {
        let num = 0;
        for (let i in squares) {
            if (squares[i] === "") {
                num += 1;
            }
        }
        if (num === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    const checkRows = () => {
        for (i = 0; i < 7; i += 3) {
            if (squares[i] === squares[i+1] && squares[i+1] === squares[i+2] && squares[i] !== "") {
                return squares[i];
            }
        }
        return false;
    }

    const checkColumns = () => {
        for (i = 0; i < 3; i++) {
            if (squares[i] === squares[i+3] && squares[i+3] === squares[i+6] && squares[i] !== "") {
                return squares[i];
            }
        }
        return false;
    }

    const checkDiagonals = () => {
        if (squares[0] === squares[4] && squares[4] === squares[8] && squares[0] !== "") {
            return squares[0];
        }
        else if (squares[2] === squares[4] && squares[4] === squares[6] && squares[2] !== "") {
            return squares[2];
        }
        return false;
    }

    const checkGO = () => {
        let winner;
        let draw = false;
        if (checkRows()) {
            winner = checkRows();
        }
        else if (checkColumns()) {
            winner = checkColumns();
        }
        else if (checkDiagonals()) {
            winner = checkDiagonals();
        }
        else if (checkDraw()) {
            draw = true;
        }
        if(winner) {
            gameOver = true;
            winner.score += 1;
            document.querySelector("#info").innerText = `The winner is ${winner.name}`;
            document.querySelector("#score").innerText = `${players[0].name}: ${players[0].score} - ${players[1].name}: ${players[1].score}`;
            document.querySelector("#resetBtn").classList.toggle("invisible");
        }
        else if(draw) {
            gameOver = true;
            document.querySelector("#info").innerText = `It's a draw.`;
            document.querySelector("#resetBtn").classList.toggle("invisible");
        }
    }

    const update = (i) => {
        document.querySelector(`#sq${i}`).innerText = squares[i].marker;
    }

    return {init, update, checkGO, squares}
})();

const createPlayer = (name, marker) => {
    let score = 0;
    return {name, marker, score};
}

const players = [createPlayer("P1", "X"), createPlayer("P2", "O")]

let playerTurn = players[0];
board.init();