const gameDisplay = document.querySelector("#gameBoard");

class Player {
    constructor (name, marker) {
        this.name = name;
        this.marker = marker;
        this.bestSquare = -1;
    }
}

const copyArray = (arr) => {
    const newArr = [];
    for (let i in arr) {
        newArr.push(arr[i]);
    }
    return newArr;
}

const minimax = (boardSquares, humanPlayer) => {
    const squares = copyArray(boardSquares);
    //board.draw(squares);
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
                if (eval > maxEval) {
                    human.bestSquare = Number(i);
                }
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
                if (eval < minEval) {
                    aiMod.bestSquare = Number(i);
                }
                minEval = Math.min(eval, minEval)
            }
        }
        return minEval;
    }
}

const board = (() => {
    const squares = [];
    
    const init = () => {
        for (let i = 0; i < 9; i++) {
            squares[i] = " ";
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

    const draw = (squares) => {
        console.log(squares[0] + " " + squares[1] + " " + squares[2]);
        console.log(squares[3] + " " + squares[4] + " " + squares[5]);
        console.log(squares[6] + " " + squares[7] + " " + squares[8]);
        console.log("------------------------------")
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
            return 1;
        }
        return -1;
    } 

    return {init, draw, placeMarker, isGameOver, squares}
})();

const aiMod = (() => {
    let level = 0;
    let bestSquare = -1;
    const setLevel = (x) => {
        level = x;
    }
    const play = () => {
        if (level === 2) {
            minimax(board.squares, false);
            board.placeMarker(ai, aiMod.bestSquare);
        }
        else {
            const arr = [];
            for (let i in board.squares) {
                if (board.squares[i] === " ") {
                    arr.push(i);
                }
            }
            let r = Math.floor(Math.random() * arr.length);
            board.placeMarker(ai, arr[r]);
        }
    }
    return {play, setLevel, bestSquare}
})();

let human = new Player("P1", "X");
let ai = new Player("P2", "O");

board.init();

board.draw(board.squares);