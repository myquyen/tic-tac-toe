import React from "react";
import "./App.css";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.handleClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      XNext: true,
      winner: null,
      history: [{ name: "Game Start", board: Array(9).fill(null) }],
      turn: 0
    };
  }

  handleClick(i) {
    if (!this.state.winner) {
      let squares = this.state.squares;
      let history = this.state.history;
      let turn = this.state.turn + 1;
      squares[i] = this.state.XNext ? "X" : "O";
      history.push({ name: `Go to move ${turn}`, board: squares });
      this.setState({
        squares: squares,
        XNext: !this.state.XNext,
        winner: calculateWinner(this.state.squares),
        history: history,
        turn: turn
      });
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        handleClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    console.log(this.state, this.history);
    let status;
    if (this.state.winner) {
      status = `Winner is ${this.state.winner}`;
    } else {
      status = `Next player: ${this.state.XNext ? "X" : "O"}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <ol>
          {this.state.history.map(move => {
            return (
              <li>
                <button onClick={() => console.log(move.board)}>
                  {move.name}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      XNext: true,
      history: [Array(9).fill(null)],
      stepNumber: 0
    };
  }

  handleClick(i) {
    let squares = this.state.squares.slice();
    let history = this.state.history.slice(0, this.state.stepNumber + 1);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.XNext ? "X" : "O";
    this.setState({
      squares: squares,
      XNext: !this.state.XNext,
      history: history.concat([squares]),
      stepNumber: history.length
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        handleClick={() => this.handleClick(i)}
      />
    );
  }

  jumpTo = (move, i) => {
    this.setState({ squares: move, stepNumber: i, XNext: i % 2 === 0 });
  };

  render() {
    // console.log("NOTHING", this.state);
    let status;
    let winner = calculateWinner(this.state.squares);
    if (winner) {
      status = `Winner is ${winner}`;
    } else {
      status = `Next player: ${this.state.XNext ? "X" : "O"}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <ol>
          {this.state.history.map((move, i) => {
            return (
              <li key={i}>
                <button onClick={() => this.jumpTo(move, i)}>
                  {i === 0 ? `Game Start` : `Go to Move ${i}`}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}

export default Game;
