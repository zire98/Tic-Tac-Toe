// factory function
const Player = (name, score) => {
    const getName = () => name;
    const getScore = () => score;

    return { getName, getScore };
}

// IIFE 
const GameBoard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => [...board];
    const reset = () => { board = Array(9).fill(null); };
    const placeMark = (index, mark) => {
        if (board[index] || index < 0 || index > 8) return false;
        board[index] = mark;
        return true;

    };

    return { getBoard, reset, placeMark };
})();

// IIFE
const Game = (() => {
    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6]          // diagonales
    ];

    let players = [];
    let current = 0;           // índice del jugador actual
    let over = false;
    let winner = null;
    let winningLine = null;
})();
