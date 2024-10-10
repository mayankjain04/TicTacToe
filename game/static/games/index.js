console.log('JS file loaded')

function Home({ showPage }) {
    const [playername, setplayername] = React.useState(localStorage.getItem('playername'))
    return (
        <div class="d-flex w-100 h-100 flex-column align-items-center">
            {(!playername || playername.length === 0) ? (
                <div class="d-flex w-100 h-100 flex-column align-items-center">
                    <h4 class="mb-4">Welcome!</h4>
                    <div class="col col-9 col-lg-6">
                        <form onSubmit={handleForm} class="d-flex mb-3 w-100 align-items-center justify-content-around justify-content-lg-evenly">
                            <label for="playername">Username:</label>
                            <input type="text" id="playername" class="form-control w-50" />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div class="d-flex align-items-center">
                    <h4 class="mb-4">Welcome {playername}!</h4>
                </div>
            )}
            <div class="d-flex flex-row w-75 justify-content-around justify-content-lg-evenly">
                <div class="d-flex flex-column align-items-center">
                    <div class="mb-3">Play offline!</div>
                    <button class="mb-3 w-100">Play with computer</button>
                    <button class="w-100">Play with a friend</button>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <div class="mb-3">Play Online!</div>
                    <button id="create-game" class="mb-3 w-100" onClick={() => showPage('lobby')}>Create Game</button>
                    <button id="join-game" class="mb-3 w-100" onClick={() => showPage('join')}>Join Game</button>
                    <button id="last-game" class="mb-3 w-100" onClick={() => showPage('lastgame')}>Load previous Game</button>
                </div>
            </div>
            <hr />
        </div>
    )

    function handleForm(event) {
        event.preventDefault();
        setplayername(event.target.playername.value);
        localStorage.setItem('playername', event.target.playername.value);
    }
}

function Lobby({ player_1, showPage }) {
    if (!player_1 || player_1.length === 0) {
        player_1 = 'playerone'
    }
    console.log(player_1);
    const [board, setBoard] = React.useState(Array(9).fill(null));
    let lobbyName = localStorage.getItem('lobbyName');
    if (!lobbyName || lobbyName === null) {
        // create a new lobby
        lobbyName = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
        fetch(`/api/create/${lobbyName}`, {
            method: 'POST',
            body: JSON.stringify({
                player_1: player_1,
                player_2: '',
                currentTurn: 0,
                moves: [null, null, null, null, null, null, null, null, null]
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
        localStorage.setItem('lobbyName', lobbyName);
        localStorage.setItem('move', 0);
    }
    const lobby_id = lobbyName;
    const storedMove = parseInt(localStorage.getItem('move'));
    console.log(`the current lobby is ${lobby_id} and played moves are ${storedMove}`)

    return (
        <div class="d-flex flex-column align-items-center justify-content-center">
            <div class="mb-3">Lobby name: <span class="text-primary">{lobby_id}</span></div>
            <button class="btn btn-primary mb-3" onClick={() => showPage('home')}>Home</button>
            <div class="d-flex flex-column align-items-center justify-content-center">
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
        </div>
    )
    // to POST the data to the sever and update
    function updateBoard(index) {
        const move = parseInt(localStorage.getItem('move'));
        console.log(`board before move no ${move + 1}: ${board}`);
        const newboard = [...board];
        newboard[index] = playermark(move);
        setBoard(newboard);
        console.log(`board after move no ${move + 1}: ${newboard}`);
        localStorage.setItem('move', move + 1);
        uploadBoard(newboard, move);
        // setTimeout(() => {
        //     fetchBoard(lobby_id);
        // }, 1000);
    }
    // to alternate bw X and O
    function playermark(move) {
        if ((move + 1) % 2 == 0) {
            return 'O';
        } else {
            return 'X';
        }
    }

    function uploadBoard(board, move) {
        fetch(`api/gamedata/${lobby_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lobby_id: lobby_id,
                player_1: 'mayank',
                player_2: 'mello',
                current_turn: move,
                moves: board
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error(`error: ${error}`);
            });
    }
}

function Create({ showPage }) {
    localStorage.removeItem('lobbyName');
    localStorage.removeItem('move');
    const player_1 = localStorage.getItem('playername');
    return (
        <Lobby player_1={player_1} showPage={showPage} />
    )
}

function Join({ showPage }) {
    const [lobbyName, setlobbyName] = React.useState('')
    let player_2 = localStorage.getItem('playername')
    if (!player_2 || player_2.length === 0) {
        player_2 = 'playertwo'
    }
    return (
        <div class='d-flex justify-content-around align-items-center'>
            <button class="btn btn-primary" onClick={() => showPage('home')}>Home</button>
            <input type="text" onChange={handlechange} class="form-control d-inline-block w-50" />
            <button class="btn btn-primary" onClick={() => fetchGame()}>Join</button>
        </div>
    )
    function fetchGame() {
        console.log(lobbyName);
        fetch(`/api/gamedata/${lobbyName}`, {
            method: 'POST',
            body: JSON.stringify({
                player_2:player_2,
            })
        })
            .then(response => {
                if (response.status === 404) {
                    console.log(`lobby with name "${lobbyName}" does not exist!`);
                    return;
                } else {
                    return response.json();
                }
            })
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(`error: ${error}`)
            })
    }
    function handlechange(event) {
        setlobbyName(event.target.value)
    }
}

function Lastgame({ showPage }) {
    return (
        <div>
            <Lobby showPage={showPage} />
        </div>
    )
}


function App() {
    const [currentpage, setcurrentpage] = React.useState('home');

    const showPage = (page) => {
        setcurrentpage(page)
    }
    return (
        <div>
            {currentpage === 'home' && <Home showPage={showPage} />}
            {currentpage === 'lobby' && <Create showPage={showPage} />}
            {currentpage === 'join' && <Join showPage={showPage} />}
            {currentpage === 'lastgame' && <Lastgame showPage={showPage} />}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))