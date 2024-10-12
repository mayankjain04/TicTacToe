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

function Cell({ board, count, updateBoard }) {
    return (
        <div onClick={() => board[count] === null && updateBoard(count)} class={board[count] === null ? 'game-box' : 'game-box disabled'}>{board[count]}</div>
    )
}

function Board({ lobby_id, gameInfo, setgameInfo, showPage }) {

    // to alternate bw X and O
    function playermark(move) {
        if ((move + 1) % 2 == 0) {
            return 'O';
        } else {
            return 'X';
        }
    }

    // to update the board for client and send it to server
    const updateBoard = (index) => {
        // const move = parseInt(localStorage.getItem('move'));
        const lastMove = gameInfo.lastTurn;
        console.log(`board before move no ${lastMove + 1}: ${gameInfo.moves}`);
        const newgameInfo = {
            ...gameInfo,
            lastTurn: lastMove + 1,
            moves: gameInfo.moves.map((move, idx) => idx === index ? playermark(lastMove) : move)
        }
        setgameInfo(newgameInfo);
        // console.log(`board after move no ${lastMove + 1}: ${gameInfo.moves}`);
        uploadBoard(newgameInfo.lastTurn, index); // this function sends the data to the server
    }

    function uploadBoard(lastmove, index) {
        console.log(`uploading the move Board[${index}]=${playermark(lastmove - 1)} to the server..`)
        fetch(`api/gamedata/${lobby_id}`, {
            method: 'POST',
            body: JSON.stringify({
                lastTurn: lastmove,
                index: index,
                playermark: playermark(lastmove - 1)
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


    return (
        <div class="d-flex flex-column align-items-center justify-content-center">
            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-primary mb-3" onClick={() => showPage('home')}>Home</button>
                <button class="btn btn-primary mb-3">Forfeit</button>
            </div>
            <div class="mb-3">Lobby name: <span class="text-primary">{lobby_id}</span></div>
            <div class="d-flex flex-column align-items-center justify-content-center">
                <div class="d-flex flex-row">
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={0} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={1} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={2} />
                </div>
                <div class="d-flex flex-row">
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={3} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={4} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={5} />
                </div>
                <div class="d-flex flex-row">
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={6} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={7} />
                    <Cell board={gameInfo.moves} updateBoard={updateBoard} count={8} />
                </div>
            </div>
        </div>
    )

}

function Lobby({ player_1, showPage }) {
    if (!player_1 || player_1.length === 0) {
        player_1 = 'playerone'
    }
    let lobbyName = localStorage.getItem('lobbyName');
    const [isfetched, setisfetched] = React.useState(false) //this makes sure the board only loads after the data is fetched
    const [gameInfo, setgameInfo] = React.useState(null) // this will hold the gameInfo for the entire game

    // i am commenting this check out cause the request is update or create, and i will need the lobbyInfo anyway
    if (!lobbyName || lobbyName === null) {
        // create a new lobby
        lobbyName = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    }

    React.useEffect(() => { // not using useEffect results in infinite api call loops lol
        fetch(`/api/create/${lobbyName}`, {
            method: 'POST',
            body: JSON.stringify({ // this is where the lobby data is generated, it will be saved in db in models.Game.object...gameInfo as JSONField
                player_1: player_1,
                player_2: '',
                lastTurn: 0,
                moves: [null, null, null, null, null, null, null, null, null]
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result.success);
                setgameInfo(result.gameInfo);
                setisfetched(true)
                // console.log(`the current lobby name is ${lobbyName} and played moves are ${result.gameInfo.lastTurn}`)
            })
            .catch(error => {
                console.log(`error: ${error}`)
            })
        localStorage.setItem('lobbyName', lobbyName); // this is for loading previous game
    }, []);

    // localStorage.setItem('move', 0);
    // }
    // const storedMove = parseInt(localStorage.getItem('move'));
    if (isfetched) {
        console.log(`player 1: ${player_1}`);
        console.log(`gameInfo: ${gameInfo}, board: ${gameInfo.moves}`);
        console.log(`the current lobby is ${lobbyName} and played moves are ${gameInfo.lastTurn}`)
        return (
            <div>
                <Board lobby_id={lobbyName} gameInfo={gameInfo} setgameInfo={setgameInfo} showPage={showPage} />
            </div>
        )
    } else {
        return (
            <div>
                <h1>loading...</h1>
            </div>
        )
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
    const [dataFetched, setdataFetched] = React.useState(null)
    const [isfetched, setisfetched] = React.useState(false)

    let player_2 = localStorage.getItem('playername')
    if (!player_2 || player_2.length === 0) {
        player_2 = 'playertwo'
    }
    function fetchGame() {
        console.log(lobbyName);
        // React.useEffect(() => {
            fetch(`/api/gamedata/${lobbyName}`, {
                method: 'POST',
                body: JSON.stringify({
                    player_2: player_2,
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
                    console.log(`The api data is: ${result}`);
                    console.log(`the move array is: ${result.gameInfo.moves}`)
                    setdataFetched(result.gameInfo);
                    setisfetched(true);
                })
                .catch(error => {
                    console.log(`error: ${error}`)
                })
        // })
    }

    function handlechange(event) {
        setlobbyName(event.target.value)
    }

    if (isfetched) {
        return (
            <Board lobby_id={lobbyName} gameInfo={dataFetched} setgameInfo={setdataFetched} showPage={showPage} />
        )
    }

    return (
        <div class='d-flex justify-content-around align-items-center'>
            <button class="btn btn-primary" onClick={() => showPage('home')}>Home</button>
            <input type="text" onChange={handlechange} class="form-control d-inline-block w-50" />
            <button class="btn btn-primary" onClick={() => fetchGame()}>Join</button>
            <hr />
        </div>
    )
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