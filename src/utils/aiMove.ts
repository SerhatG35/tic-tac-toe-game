import { WINNING_CONDITIONS } from "./constants";

const checkWinner = (board: string[]) => {
    let result = null;
    for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
      const [x, y, z] = WINNING_CONDITIONS[i];
      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        if (board[x] === "X") {
          return (result = 10);
        } else {
          return (result = -10);
        }
      } else if (!board.includes("")) result = 0;
      else {
        return (result = null);
      }
    }
    return result;
  };

  const minimax = (tempSquares: string[], isMinimizing: boolean) => {
    let result = checkWinner(tempSquares);
    if (result !== null) {
      return result;
    }
    if (isMinimizing) {
      let bestScore = Infinity;
      for (let i = 0; i < tempSquares.length; i++) {
        if (tempSquares[i] === "") {
          tempSquares[i] = "O";
          let score = minimax(tempSquares, false);
          tempSquares[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = -Infinity;
      for (let i = 0; i < tempSquares.length; i++) {
        if (tempSquares[i] === "") {
          tempSquares[i] = "X";
          let score = minimax(tempSquares, true);
          tempSquares[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
  };

 export const aiMove = (squareAi: string[],setGrid :React.Dispatch<React.SetStateAction<boolean[]>>,grid:boolean[]) => {
    let bestScore = Infinity;
    let indexToPlay = null;
    for (let i = 0; i < squareAi.length; i++) {
      if (squareAi[i] === "") {
        squareAi[i] = "O";
        let score = minimax(squareAi, false);
        squareAi[i] = "";
        if (score < bestScore) {
          bestScore = score;
          indexToPlay = i;
        }
      }
    }
    if (indexToPlay !== null) {
      squareAi[indexToPlay] = "O";
      setGrid({ ...grid, [indexToPlay]: true });
    }
  };