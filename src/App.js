import { useState } from 'react';

function Square({ isWin, value, onSquareClick }) {
  return (
    <button className={`square ${isWin && 'win'}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const result = calculateWinner(squares);
    if (result || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  let status;
  let winnerLine = [];
  if (result) {
    status = 'Winner: ' + result.winner;
    winnerLine = result.line;
  } else {
    if(!squares.includes(null))
      status = 'Draw';
    else
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        [0, 1, 2].map((_, i) => (
          <div className="board-row" key={i}>
            {
              [0, 1, 2].map((_, j) => {
                const index = i * 3 + j;
                return (
                  <Square key={index} isWin={winnerLine.length !== 0 && winnerLine.includes(index)} value={squares[index]} onSquareClick={() => handleClick(index)} />
                );
              })
            }
          </div>
        ))
      }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      const prevSquares = history[move - 1];
      const diff = squares.findIndex((square, i) => square !== prevSquares[i]);
      const row = Math.floor(diff / 3) + 1;
      const col = diff % 3 + 1;
      description = 'Go to move #' + move + ': (' + row + ', ' + col + ')';

      if(move === currentMove) {
        description = 'You are at move #' + move + ': (' + row + ', ' + col + ')';
      }
    }
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? description : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return null;
}
