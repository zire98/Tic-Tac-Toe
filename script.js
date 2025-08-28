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

const Game = (() => {
    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let players = [];
    let current = 0;
    let over = false;
    let winner = null;
    let winningLine = null;

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

        current = 1 - current;
        return { ok: true, status: 'continue', ...getState() };
    };

    const getState = () => ({
        board: GameBoard.getBoard(),
        currentPlayer: getCurrentPlayer(),
        over,
        winner,
        winningLine
    });

    const printBoard = () => {
        const b = GameBoard.getBoard().map(c => c ?? ' ');
        console.log(
            `${b[0]} | ${b[1]} | ${b[2]}\n` +
            `---------\n` +
            `${b[3]} | ${b[4]} | ${b[5]}\n` +
            `---------\n` +
            `${b[6]} | ${b[7]} | ${b[8]}`
        );
    };

    return { start, playTurn, getState, printBoard };
})();

const DisplayController = (() => {
    const input1 = document.querySelector('#player-name1');
    const input2 = document.querySelector('#player-name2');
    const newGameBtn = document.querySelector('#new-game');
    const cellsNodeList = document.querySelectorAll('.cell');

    const cells = Array.from(cellsNodeList);

    const statusEl = document.createElement('p');
    statusEl.className = 'status';
    const form = document.querySelector('.newGame-form');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(statusEl, form.nextSibling);
    } else {
        const board = document.querySelector('.board');
        board?.parentNode?.insertBefore(statusEl, board);
    }

    const clearWinStyles = () => {
        cells.forEach(btn => btn.classList.remove('win'));
    };

    const setStatus = (text) => {
        statusEl.textContent = text;
    };

    const setCellsEnabled = (enabled) => {
        cells.forEach(btn => {
            btn.disabled = !enabled;
        });
    };

    const render = (state) => {
        clearWinStyles();

        state.board.forEach((val, idx) => {
            cells[idx].textContent = val ?? '';
            cells[idx].disabled = val !== null || state.over === true;
        });

        if (!state.over) {
            const name = state.currentPlayer.getName
                ? state.currentPlayer.getName()
                : 'Player';
            setStatus(`Turno: ${name} (${state.currentPlayer.mark})`);
        } else {
            if (state.winner) {
                const wName = state.winner.getName ? state.winner.getName() : 'Player';
                setStatus(`¡Ganó ${wName} (${state.winner.mark})!`);
                if (Array.isArray(state.winningLine)) {
                    state.winningLine.forEach(i => cells[i].classList.add('win'));
                }
            } else {
                setStatus('¡Empate!');
            }
            setCellsEnabled(false);
        }
    };

})();

