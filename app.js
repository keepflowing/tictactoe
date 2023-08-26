const boardDisplay = document.querySelector("#gameBoard");
const resetBtn = document.querySelector("#resetBtn");
const info = document.querySelector("#info");
const score = document.querySelector("#score");

let winner;
let ai = 2;
let playerTurn;
let gameOver = false;

const board = (() => {
    const squares = ["", "", "", "", "", "", "", "", ""];
    const init = () => {
        if (gameOver) {
            resetBtn.classList.toggle("invisible");
            gameOver = false;
            let totScore = players[0].score + players[1].score;
            totScore % 2 === 0 ? playerTurn = players[0] : playerTurn = players[1];
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
        else if (playerTurn === players[1] && ai === 2) {
            hardAi.play();
            playerTurn = players[0];
        }
    }

    const placeMarker = (i) => {
        if(!gameOver) {
            if (squares[i] === "") {
                squares[i] = playerTurn;
                update(i);   
                let go = checkGO(squares);

                if (go === 1) {
                    gameOver = true;
                    winner.score += 1;
                    info.innerText = `The winner is ${winner.name}`;
                    score.innerText = `${players[0].name}: ${players[0].score} - ${players[1].name}: ${players[1].score}`;
                    resetBtn.classList.toggle("invisible");
                }

                else if (go === 0) {
                    gameOver = true;
                    info.innerText = `It's a draw.`;
                    resetBtn.classList.toggle("invisible");
                }

                playerTurn === players[0] ? playerTurn = players[1]
                : playerTurn = players[0];
    
                if (ai === 1 && playerTurn === players[1] && !gameOver) {
                    easyAi.play();
                }
                else if (ai === 2 && playerTurn === players[1] && !gameOver) {
                    hardAi.play();
                }
            }
            else {
                alert("This square is taken!")
            }
        }
    }

    const checkDraw = (squares) => {
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

    const checkRows = (squares) => {
        for (i = 0; i < 7; i += 3) {
            if (squares[i] === squares[i+1] && squares[i+1] === squares[i+2] && squares[i] !== "") {
                return squares[i];
            }
        }
        return false;
    }

    const checkColumns = (squares) => {
        for (i = 0; i < 3; i++) {
            if (squares[i] === squares[i+3] && squares[i+3] === squares[i+6] && squares[i] !== "") {
                return squares[i];
            }
        }
        return false;
    }

    const checkDiagonals = (squares) => {
        if (squares[0] === squares[4] && squares[4] === squares[8] && squares[0] !== "") {
            return squares[0];
        }
        else if (squares[2] === squares[4] && squares[4] === squares[6] && squares[2] !== "") {
            return squares[2];
        }
        return false;
    }

    const checkGO = (squares) => {
        winner = false;
        let draw = false;
        if (checkRows(squares)) {
            winner = checkRows(squares);
        }
        else if (checkColumns(squares)) {
            winner = checkColumns(squares);
        }
        else if (checkDiagonals(squares)) {
            winner = checkDiagonals(squares);
        }
        else if (checkDraw(squares)) {
            draw = true;
        }
        if(winner) {
            return 1;
        }
        else if(draw) {
            return 0;
        }
        return -1;
    }

    const update = (i) => {
        document.querySelector(`#sq${i}`).innerText = squares[i].marker;
    }

    return {init, placeMarker, squares, checkGO}
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

const hardAi = (() => {
    const play = () => {
        let firstRound = 0;
        for (let i in board.squares) {
            if (board.squares[i] === "") {
                firstRound += 1;
            }
        }
        if (firstRound === 9) {
            easyAi.play();
        }
        else {
            if (evaluateState(board.squares)[1] !== -1) {
                board.placeMarker(evaluateState(board.squares)[1]);
            }
        }
    }
    return {play}
})();

const createPlayer = (name, marker) => {
    let score = 0;
    return {name, marker, score};
}

const evaluateState = (squares) => {
    let evaluation = 0;
    let bestSquare = -1;
    let hypSquares;
    for (let i in squares) {
        hypSquares = Object.create(squares);
        if (squares[i] === "") {
            hypSquares[i] = playerTurn;
            /*console.log(`
                ${hypSquares[0].marker} ${hypSquares[1].marker} ${hypSquares[2].marker}
                ${hypSquares[3].marker} ${hypSquares[4].marker} ${hypSquares[5].marker} 
                ${hypSquares[6].marker} ${hypSquares[7].marker} ${hypSquares[8].marker}
                `); 
            console.log(bestSquare)*/
            if (board.checkGO(hypSquares) === 1) {
                bestSquare = i;
                evaluation = 1;
                return [evaluation, bestSquare]
            }
            else if (board.checkGO(hypSquares) === 0 || board.checkGO(hypSquares) === -1) {
                changePlayerTurn();
                evaluation = 0;
                let nextTurn = evaluateState(hypSquares);
                if (nextTurn[0] === 1) {
                    bestSquare = nextTurn[1];
                    changePlayerTurn();
                    return [evaluation, bestSquare]
                }
                else {
                    bestSquare = Math.floor(Math.random() * 9);
                    if(board.squares[bestSquare] === "") {
                        changePlayerTurn();
                    }
                    else {
                        bestSquare = evaluateState(hypSquares)[1];
                        changePlayerTurn();
                    }
                }
            }
            else {hypSquares = Object.create(squares)}
        }
    }
    return [evaluation, bestSquare];
}

const changePlayerTurn = () => {
    playerTurn === players[1] ? playerTurn = players[0] 
    : playerTurn = players[1];
}

const players = [createPlayer("P1", "X"), createPlayer("P2", "O")];

const startGame = () => {
    document.querySelector("#start").classList.toggle("invisible");
    playerTurn = players[0];
    board.init();
}