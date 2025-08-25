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

    // Evalúa el tablero y devuelve info de estado
    const evaluate = (board) => {
        for (const line of WIN_LINES) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { status: 'win', mark: board[a], line };
            }
        }
        if (board.every(cell => cell !== null)) {
            return { status: 'tie' };
        }
        return { status: 'continue' };
    };

    const start = (name1 = 'Player 1', name2 = 'Player 2') => {
        GameBoard.reset();
        // Reutilizamos tu Player. Añadimos 'mark' como propiedad ad-hoc.
        players = [
            { ...Player(name1, 0), mark: 'X' },
            { ...Player(name2, 0), mark: 'O' }
        ];
        current = 0;
        over = false;
        winner = null;
        winningLine = null;
        return getState();
    };

    const getCurrentPlayer = () => players[current];

    const playTurn = (index) => {
        if (over) return { ok: false, reason: 'game-over', ...getState() };

        const mark = getCurrentPlayer().mark;
        const placed = GameBoard.placeMark(index, mark);
        if (!placed) return { ok: false, reason: 'invalid-move', ...getState() };

        const board = GameBoard.getBoard();
        const evalResult = evaluate(board);

        if (evalResult.status === 'win') {
            over = true;
            winner = getCurrentPlayer();
            winningLine = evalResult.line;
            return { ok: true, status: 'win', ...getState() };
        }

        if (evalResult.status === 'tie') {
            over = true;
            return { ok: true, status: 'tie', ...getState() };
        }

        // Continua la partida
        current = 1 - current;
        return { ok: true, status: 'continue', ...getState() };
    };
})();
