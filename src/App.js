import React from "react";
import FacebookLogin from "react-facebook-login";

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      XNext: true,
      history: [Array(9).fill(null)],
      stepNumber: 0,
      highScores: [],
      timeIn: Date.now(),
      timeOut: null
    };
  }

  componentDidMount() {
    let currentUser = localStorage.getItem("FbLogin");
    if (currentUser !== null) {
      this.setState({ currentUser: JSON.parse(currentUser) });
    }
    this.getHighScore();
    // this.postScore();
  }

  getHighScore = async () => {
    try {
      let response = await fetch(
        "http://ftw-highscores.herokuapp.com/tictactoe-dev?reverse=true&limit=20"
      );
      let jsonData = await response.json();
      this.setState({ highScores: jsonData.items });
    } catch {
      this.setState({ hasError: true });
    }
  };

  postScore = async () => {
    try {
      let data = new URLSearchParams();
      let score = this.state.timeOut - this.state.timeIn;

      data.append("player", this.state.currentUser.name);
      data.append("score", score);
      console.log("SCORE", score);
      const url = "http://ftw-highscores.herokuapp.com/tictactoe-dev";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data.toString(),
        json: true
      });
      if (response.status == 200) this.getHighScore();
    } catch (TypeError) {
      alert("You need to login first!");
    }
  };

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

  responseFacebook = response => {
    if (response && response.status !== "unknown") {
      localStorage.setItem("FbLogin", JSON.stringify(response));
      this.setState({ currentUser: response });
    }
  };

  logout = () => {
    localStorage.removeItem("FbLogin");
    this.setState({ currentUser: null });
  };

  render() {
    // console.log("RED", this.state);
    let status;
    let winner = calculateWinner(this.state.squares);
    if (winner && !this.state.timeOut) {
      status = `Winner is ${winner}`;
      this.setState({ timeOut: Date.now() });
    } else {
      status = `Next player: ${this.state.XNext ? "X" : "O"}`;
    }

    if (this.state.hasError) {
      return <h1>Oops! Something went wrong.</h1>;
    } else {
      return (
        <div className="App">
          <div className="body">
            <ol id="highScore">
              <h3>High Scores</h3>
              {this.state.highScores.map(score => {
                return (
                  <li>
                    {score.player}: {score.score}
                  </li>
                );
              })}
            </ol>
            <div>
              {this.state.currentUser ? (
                <>
                  <h2>{this.state.currentUser.name}</h2>
                  <button id="logout" onClick={this.logout}>
                    Log Out
                  </button>
                </>
              ) : (
                <FacebookLogin
                  autoLoad={true}
                  appId="973802842965767"
                  fields="name,email,picture"
                  callback={resp => this.responseFacebook(resp)}
                />
              )}
              <hr />
              <div className="status">
                <h3>
                  {this.state.timeOut
                    ? `Score: ${this.state.timeOut - this.state.timeIn}`
                    : status}
                </h3>
              </div>
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
              <hr />
              <button onClick={this.postScore}>Post new score</button>
            </div>
            <ol>
              <h3>Moves</h3>
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
        </div>
      );
    }
  }
}

export default Game;
