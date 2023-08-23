const boardDisplay = document.querySelector("#gameBoard");
const resetBtn = document.querySelector("#resetBtn");
const info = document.querySelector("#info");
const score = document.querySelector("#score");

let ai = 1;
let playerTurn;
let gameOver = false;

const board = (() => {
    const squares = ["", "", "", "", "", "", "", "", ""];
    const init = () => {
        if (gameOver) {
            resetBtn.classList.toggle("invisible");
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
        if (playerTurn === players[1] && ai === 1) {
            easyAi.play();
            playerTurn = players[0];
        }
    }

    const placeMarker = (i) => {
        if(!gameOver) {
            if (squares[i] === "") {
                squares[i] = playerTurn;
                update(i);   
                checkGO();

                playerTurn === players[0] ? playerTurn = players[1]
                : playerTurn = players[0];
    
                if (ai === 1 && playerTurn === players[1] && !gameOver) {
                    easyAi.play();
                }
                else if (ai === 2) {

                }
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
            info.innerText = `The winner is ${winner.name}`;
            score.innerText = `${players[0].name}: ${players[0].score} - ${players[1].name}: ${players[1].score}`;
            resetBtn.classList.toggle("invisible");
        }
        else if(draw) {
            gameOver = true;
            info.innerText = `It's a draw.`;
            resetBtn.classList.toggle("invisible");
        }
    }

    const update = (i) => {
        document.querySelector(`#sq${i}`).innerText = squares[i].marker;
    }

    return {init, placeMarker, squares}
})();

const easyAi = (() => {
    const play = () => {
        let i = Math.floor(Math.random() * 9);
        if (board.squares[i] === "") {
            board.placeMarker(i);
        }
        else {play();}
    }
    return {play}
})();

const createPlayer = (name, marker) => {
    let score = 0;
    return {name, marker, score};
}

const players = [createPlayer("P1", "X"), createPlayer("P2", "O")];

const startGame = () => {
    document.querySelector("#start").classList.toggle("invisible");
    playerTurn = players[0];
    board.init();
}