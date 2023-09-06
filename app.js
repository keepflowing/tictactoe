const gameDisplay = document.querySelector("#gameBoard");
const resetBtn = document.querySelector("#resetBtn");
const result = document.querySelector("#result");

class Player {
    constructor (name, marker) {
        this.name = name;
        this.marker = marker;
        this.score = 0;
    }
}

const copyArray = (arr) => {
    const newArr = [];
    for (let i in arr) {
        newArr.push(arr[i]);
    }
    return newArr;
}

let moves = [];

const minimax = (boardSquares, humanPlayer) => {
    const squares = copyArray(boardSquares);
    let gameOver = board.isGameOver(squares);

    if (gameOver !== false) {
        if (gameOver === 0) {
            return 0;
        }
        return gameOver === human.marker ?  1 : -1;
    }

    if (humanPlayer) {
        let maxEval = -10;
        for (let i in squares) {
            if (squares[i] === " "){
                const hypSquares = copyArray(squares);
                hypSquares[i] = human.marker;
                let eval = minimax(hypSquares, false);
                maxEval = Math.max(eval, maxEval)
            }
        }
        return maxEval;
    }

    else {
        let minEval = 10; 
        for (let i in squares) {
            if (squares[i] === " "){
                const hypSquares = copyArray(squares);
                hypSquares[i] = ai.marker;
                let eval = minimax(hypSquares, true);
                minEval = Math.min(eval, minEval)
            }
        }
        return minEval;
    }
}

const board = (() => {
    const squares = [];
    let active;
    
    const init = () => {
        resetBtn.classList.toggle("invisible");
        result.innerHTML = `${human.name}(${human.marker}): ${human.score} vs. ${ai.name}(${ai.marker}): ${ai.score}`;
        for (let i = 0; i < 9; i++) {
            squares[i] = " ";
            document.querySelector(`#s${i}`).innerHTML = " ";
        }
    }

    const emptySquares = (squares) => {
        const empty = [];
        for (let i in squares) {
            if (squares[i] === " ") {
                empty.push(i);
            }
        }
        return empty;
    }

    const hasRow = (squares) => {
        for (i = 0; i < 7; i += 3) {
            if (squares[i] === squares[i+1] && squares[i+1] === squares[i+2] && squares[i] !== " ") {
                return squares[i];
            }
        }
        return false;
    }

    const hasColumn = (squares) => {
        for (i = 0; i < 3; i++) {
            if (squares[i] === squares[i+3] && squares[i+3] === squares[i+6] && squares[i] !== " ") {
                return squares[i];
            }
        }
        return false;
    }

    const hasDiagonal = (squares) => {
        if (squares[0] === squares[4] && squares[4] === squares[8] && squares[0] !== " ") {
            return squares[0];
        }
        else if (squares[2] === squares[4] && squares[4] === squares[6] && squares[2] !== " ") {
            return squares[2];
        }
        return false;
    }

    const isGameOver = (squares) => {
        if(hasRow(squares)) {
            return hasRow(squares);
        }
        else if (hasColumn(squares)) {
            return hasColumn(squares);
        }
        else if (hasDiagonal(squares)) {
            return hasDiagonal(squares);
        }
        else if (emptySquares(squares).length === 0) {
            return 0;
        }
        else {return false}
    }

    const placeMarker = (player, i) => {
        if (squares[i] === " ") {
            squares[i] = player.marker;
            document.querySelector(`#s${i}`).innerHTML = player.marker;
            player === human ? board.active = ai : board.active = human;
            let go = isGameOver(squares);
            if (go !== false) {
                resetBtn.classList.toggle("invisible");
                if (go === 0) {
                    result.innerHTML = "It's a draw";
                }
                else {
                    result.innerHTML = `The winner is: ${go}!`;
                    if (go === human.marker) {
                        human.score += 1;
                    }
                    else {
                        ai.score += 1;
                    }
                } 
            }
            else if (aiMod.level > 0 && board.active === ai) {
                aiMod.play();
            }
        }
        return -1;
    } 

    return {init, placeMarker, isGameOver, squares, active}
})();

const aiMod = (() => {
    let level = 2;

    const play = () => {
        let bestEval = 10;
        let bestMove = -1;

        const empty = [];
        for (let i in board.squares) {
            if (board.squares[i] === " ") {
                empty.push(i);
            }
        }

        if (aiMod.level === 2) {
            const hypSquares = copyArray(board.squares);
            for (let i in empty) {
                hypSquares[empty[i]] = ai.marker;
                let eval = minimax(hypSquares, true);
                if (eval < bestEval) {
                    bestMove = empty[i];
                    bestEval = eval;
                }
                hypSquares[empty[i]] = " ";
            }
            board.placeMarker(ai, bestMove);
        }
        else {
            let r = Math.floor(Math.random() * empty.length);
            board.placeMarker(ai, empty[r]);
        }
    }
    return {play, level}
})();

let human = new Player("P1", "X");
let ai = new Player("P2", "O");

board.active = human;
board.init();