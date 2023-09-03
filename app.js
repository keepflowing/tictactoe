gameDisplay = document.querySelector("#gameBoard");

class Player {
    constructor (name, marker) {
        this.name = name;
        this.marker = marker;
    }
}

const minimax = (squares, player, score) => {
    let hypSquares = Object.create(squares);
    const spots = board.emptySquares(hypSquares);

    const moves = [];
    
    for (let i = 0; i < spots.length; i++) {
        hypSquares[spots[i]] = player.marker;
        console.log(hypSquares[0] + " " + hypSquares[1] + " " + hypSquares[2]);
        console.log(hypSquares[3] + " " + hypSquares[4] + " " + hypSquares[5]);
        console.log(hypSquares[6] + " " + hypSquares[7] + " " + hypSquares[8]);
        console.log("-----------------------");
        if (board.isGameOver(hypSquares) === 1) {
            if (player === human) {
                score = 1;
            }
            else {score = -1}
            console.log(score);
            console.log("-----------------------");
        }
        else if (board.isGameOver(hypSquares) === 0) {
            score = 0;
            console.log(score);
            console.log("-----------------------");
        }
        else {
            if (player === human) {
                minimax(hypSquares, ai)
            }
            else {
                minimax(hypSquares, human)
            }
        }
        hypSquares = Object.create(squares);
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

    const draw = () => {
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
            return 1;
        }
        else if (hasColumn(squares)) {
            return 1;
        }
        else if (hasDiagonal(squares)) {
            return 1;
        }
        else if (emptySquares(squares).length === 0) {
            return 0;
        }
        else {return -1}
    }

    const placeMarker = (player, i) => {
        if (squares[i] === " ") {
            squares[i] = player.marker;
            return 1;
        }
        return -1;
    } 

    return {init, draw, placeMarker,isGameOver, squares, emptySquares}
})();

let human = new Player("P1", "X");
let ai = new Player("P2", "O");

board.init();

for(let i = 0; i < 4; i++) {
    let empty = [];
    for(let j = 0; j < 9; j++) {
        if (board.squares[j] === " ") {
            empty.push(j)
        }
    }
    let num = Math.floor(Math.random() * empty.length);
    if (i % 2 === 0) {
        board.placeMarker(human, empty[num]);
    }
    else {
        board.placeMarker(ai, empty[num]);
    }
}

board.draw();