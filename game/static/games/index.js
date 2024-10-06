console.log('JS file loaded')
const storedMove = parseInt(localStorage.getItem('move'));
if (storedMove>10) {
    localStorage.setItem('move', 0)
}

function App() {
    const [board, setBoard] = React.useState(Array(9).fill(null))
    function playermark(move) {
        if ((move+1)%2==0) {
            return 'O';
        } else {
            return 'X';
        }
    }
    function updateBoard(index) {
        const move = parseInt(localStorage.getItem('move'));
        console.log(`board before move no ${move}: ${board}`)
        const newboard = [...board];
        newboard[index] = playermark(move);
        setBoard(newboard);
        console.log(`board after move no ${move}: ${newboard}`)
        localStorage.setItem('move', move+1);
    }
    return (
        <div class="d-flex flex-column"> 
            <div class="d-flex flex-row">
                <div onClick={() => updateBoard(0)} class="game-box">{board[0]}</div>
                <div onClick={() => updateBoard(1)} class="game-box">{board[1]}</div>
                <div onClick={() => updateBoard(2)} class="game-box">{board[2]}</div>
            </div>
            <div class="d-flex flex-row">
                <div onClick={() => updateBoard(3)} class="game-box">{board[3]}</div>
                <div onClick={() => updateBoard(4)} class="game-box">{board[4]}</div>
                <div onClick={() => updateBoard(5)} class="game-box">{board[5]}</div>
            </div>
            <div class="d-flex flex-row">
                <div onClick={() => updateBoard(6)} class="game-box">{board[6]}</div>
                <div onClick={() => updateBoard(7)} class="game-box">{board[7]}</div>
                <div onClick={() => updateBoard(8)} class="game-box">{board[8]}</div>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#game-container'))