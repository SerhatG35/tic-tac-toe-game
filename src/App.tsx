import { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import { WINNING_CONDITIONS } from "./utils/constants";

function App() {
  const [turn, setTurn] = useState<boolean>(true); // turn : true(X) false(O)
  const [winner, setWinner] = useState<string>("");
  const [squares, setSquares] = useState<string[]>(Array(9).fill(""));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [grid, setGrid] = useState<{ [key: number]: boolean }>(
    Array(9).fill(false)
  );

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1,
  ];
  const trans: any = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });
  const resetButtonAppear = useSpring({
    marginLeft: gameOver ? 0 : -1500,
    config: { duration: 250 },
  });
  const resetButtonDisappear = useSpring({
    marginLeft: gameOver ? -1500 : 0,
    config: { duration: 250 },
  });

  const isGameOver = (results: string[]) => {
    WINNING_CONDITIONS.map((condition) => {
      const [x, y, z] = condition;
      if (
        results[x] &&
        results[x] === results[y] &&
        results[y] === results[z]
      ) {
        setWinner(results[x]);
        setGameOver(!gameOver);
      }
    });
    if (!squares.includes("") && !gameOver) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(""));
    setGameOver(false);
    setTurn(true);
    setGrid(Array(9).fill(false));
    setWinner("");
  };

  const handleClick = ({ target }: any) => {
    const boxIndex: number = target.getAttribute("data-grid");
    const newSquares = squares;
    if (gameOver) return null;
    if (!grid[boxIndex]) {
      newSquares[boxIndex - 1] = turn ? "X" : "O";
      setGrid({ ...grid, [boxIndex]: true });
      turn ? setTurn(false) : setTurn(true);
    }
    isGameOver(squares);
  };

  return (
    <div className="App">
      <a.div className="head" style={animation}>
        <h2 className="title">TIC-TAC-TOE</h2>
        <span className="desc">
          {!gameOver ? (turn ? "X's turn" : "O's turn") : "Game Over!"}
        </span>
      </a.div>
      <a.div style={animation}>
        <div className="grid-container">
          {squares.map((square, index) => {
            return (
              <a.div
                className="grid-item"
                key={index}
                data-grid={index + 1}
                onClick={handleClick}
                onMouseMove={({ clientX: x, clientY: y }) =>
                  set({ xys: calc(x, y) })
                }
                onMouseLeave={() => set({ xys: [0, 0, 1] })}
                style={{
                  transform: props.xys.interpolate(trans),
                }}
              >
                {square}
              </a.div>
            );
          })}
        </div>
      </a.div>
      {gameOver && (
        <a.div
          className="bottom"
          style={gameOver ? resetButtonAppear : resetButtonDisappear}
        >
          <p className="winner-text">
            {!squares.includes("") && winner === ""
              ? "Draw!"
              : `${winner} has won!`}
          </p>
          <button className="resetButton" onClick={resetGame}>
            RESET
          </button>
        </a.div>
      )}
    </div>
  );
}
export default App;
