import { StyleSheet, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface SquareProps {
  value: string | null;
  isDisable: boolean;
  onSquareClick: () => void;
}
interface BoardProps {
  xIsNext: boolean;
  isBot: boolean;
  squares: any[];
  indexDeleteSquare: any[];
  currentMove: number;
  onPlay: (squares: any[]) => void;
  botMakeMove?: (squares: any[]) => void;
  onPlayAgain: () => void
  setIndexDeleteSquare: (squares: number[]) => void
}

function Square({ value, isDisable, onSquareClick }: SquareProps) {
  return (
    <TouchableOpacity style={styles.square} onPress={onSquareClick}>
      <ThemedText type="title" darkColor={isDisable ? "#737373" : undefined}>
        {value}
      </ThemedText>
    </TouchableOpacity>
  );
}

function Board({ xIsNext, squares, currentMove, indexDeleteSquare, isBot, setIndexDeleteSquare, onPlay, onPlayAgain, botMakeMove }: BoardProps) {
  // Using useRef to hold the sound object
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/click-sound.mp3')
      );
      soundRef.current = sound;
    };

    loadSound();

    // Make sure to unload the sound when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync(); // Use replayAsync to play from the beginning
    }
  };

  function handleClick(i: any) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    playSound();
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    if (currentMove < 6) {
      setIndexDeleteSquare([...indexDeleteSquare, i]);
    } else {
      nextSquares[indexDeleteSquare[0]] = null;
      setIndexDeleteSquare([...indexDeleteSquare.slice(1), i]);
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const isDisableArray =
    // isBot ?
    //   [indexDeleteSquare[0], indexDeleteSquare[1]] :
    [indexDeleteSquare[0]];

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <ThemedText>{status}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[0]} isDisable={(isDisableArray.includes(0)) && currentMove >= 6} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} isDisable={(isDisableArray.includes(1)) && currentMove >= 6} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} isDisable={(isDisableArray.includes(2)) && currentMove >= 6} onSquareClick={() => handleClick(2)} />
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[3]} isDisable={(isDisableArray.includes(3)) && currentMove >= 6} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} isDisable={(isDisableArray.includes(4)) && currentMove >= 6} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} isDisable={(isDisableArray.includes(5)) && currentMove >= 6} onSquareClick={() => handleClick(5)} />
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[6]} isDisable={(isDisableArray.includes(6)) && currentMove >= 6} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} isDisable={(isDisableArray.includes(7)) && currentMove >= 6} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} isDisable={(isDisableArray.includes(8)) && currentMove >= 6} onSquareClick={() => handleClick(8)} />
      </ThemedView>

      {winner && <Button
        title="Play Again"
        onPress={onPlayAgain}
      />}
    </ThemedView>
  );
}

function calculateWinner(squares: any[]) {
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
      return squares[a];
    }
  }
  return null;
}

function blockUser(squaresX: number[], squaresO: number[], random: number) {
  let block = 0;
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

  // Check to win
  for (let line of lines) {
    const [a, b, c] = line;
    if (squaresO.includes(a) && squaresO.includes(b) && !squaresX.includes(c)) {
      return c;
    }
    if (squaresO.includes(a) && !squaresX.includes(b) && squaresO.includes(c)) {
      return b;
    }
    if (!squaresX.includes(a) && squaresO.includes(b) && squaresO.includes(c)) {
      return a;
    }
  }

  // Check for a block
  for (let line of lines) {
    const [a, b, c] = line;
    if (squaresX.includes(a) && squaresX.includes(b) && !squaresO.includes(c)) {
      return c;
    }
    if (squaresX.includes(a) && !squaresO.includes(b) && squaresX.includes(c)) {
      return b;
    }
    if (!squaresO.includes(a) && squaresX.includes(b) && squaresX.includes(c)) {
      return a;
    }
  }

  // No win or block found
  return random;
}

export default function GameScreen({ isBot = false }: { isBot?: boolean }) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  console.log(history);
  const [currentMove, setCurrentMove] = useState(0);
  const [indexDeleteSquare, setIndexDeleteSquare] = useState<(number)[]>([]);
  const xIsNext = currentMove % 2 === 0;
  let currentSquares = history[currentMove];

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handlePlayAgain() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIndexDeleteSquare([]);
    currentSquares = Array(9).fill(null);
  }

  function botMakeMove(squares: any) {
    // Find all empty squares
    const emptyIndices = squares.map((square: any, index: number) => square === null ? index : null).filter((index: any) => index !== null);

    if (emptyIndices.length === 0 || calculateWinner(squares) === "X") {
      // No available moves, possibly the game is a draw
      return;
    }

    console.log(squares);
    const eachXInBoard = squares.map((square: any, index: number) => square === 'X' ? index : null).filter((index: any) => index !== null);
    const eachOInBoard = squares.map((square: any, index: number) => square === 'O' ? index : null).filter((index: any) => index !== null);

    console.log(eachOInBoard);
    console.log(eachXInBoard);

    // Select a random empty square for the bot's move
    const moveIndex = blockUser(eachXInBoard, eachOInBoard, emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);

    if (currentMove < 6) {
      setIndexDeleteSquare([...indexDeleteSquare, moveIndex]);
    } else {
      squares[indexDeleteSquare[0]] = null;
      setIndexDeleteSquare([...indexDeleteSquare.slice(1), moveIndex]);
    }
    // Create a new board state with the bot's move applied
    const nextSquares = [...squares];
    nextSquares[moveIndex] = 'O'; // Assuming the bot plays as 'O'

    // Call handlePlay with the new board state
    handlePlay(nextSquares);
  }

  // function jumpTo(nextMove) {
  //   setCurrentMove(nextMove);
  // }

  // const moves = history.map((squares, move) => {
  //   let description;
  //   if (move > 0) {
  //     description = 'Go to move #' + move;
  //   } else {
  //     description = 'Go to game start';
  //   }
  //   return (
  //     <li key={move}>
  //       <button onClick={() => jumpTo(move)}>{description}</button>
  //     </li>
  //   );
  // });

  useEffect(() => {
    if (!xIsNext && isBot) {
      botMakeMove(currentSquares);
    }
  }, [handlePlay]);

  return (
    <ThemedView>
      <ThemedView>
        <Board
          xIsNext={xIsNext}
          isBot={isBot}
          squares={currentSquares}
          currentMove={currentMove}
          onPlay={handlePlay}
          onPlayAgain={handlePlayAgain}
          setIndexDeleteSquare={setIndexDeleteSquare}
          indexDeleteSquare={indexDeleteSquare}
        />
      </ThemedView>
      {/* <div className="game-info">
        <ol>{moves}</ol>
      </div> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: 60, // Set the width of the square
    height: 60, // Set the height of the square
    backgroundColor: 'darkblue', // Set the background color of the square
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    margin: 10, // Add some margin around the square
  },
});