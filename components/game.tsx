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
  squares: any[];
  currentMove: number;
  onPlay: (squares: any[]) => void;
  onPlayAgain: () => void
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

function Board({ xIsNext, squares, currentMove, onPlay, onPlayAgain }: BoardProps) {
  const [indexDeleteSquare, setIndexDeleteSquare] = useState<(number)[]>([]);
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

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <ThemedText>{status}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[0]} isDisable={(indexDeleteSquare[0] === 0) && currentMove >= 6} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} isDisable={(indexDeleteSquare[0] === 1) && currentMove >= 6} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} isDisable={(indexDeleteSquare[0] === 2) && currentMove >= 6} onSquareClick={() => handleClick(2)} />
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[3]} isDisable={(indexDeleteSquare[0] === 3) && currentMove >= 6} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} isDisable={(indexDeleteSquare[0] === 4) && currentMove >= 6} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} isDisable={(indexDeleteSquare[0] === 5) && currentMove >= 6} onSquareClick={() => handleClick(5)} />
      </ThemedView>
      <ThemedView style={styles.boardRow}>
        <Square value={squares[6]} isDisable={(indexDeleteSquare[0] === 6) && currentMove >= 6} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} isDisable={(indexDeleteSquare[0] === 7) && currentMove >= 6} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} isDisable={(indexDeleteSquare[0] === 8) && currentMove >= 6} onSquareClick={() => handleClick(8)} />
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

export default function GameScreen() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handlePlayAgain() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
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

  return (
    <ThemedView>
      <ThemedView>
        <Board xIsNext={xIsNext} squares={currentSquares} currentMove={currentMove} onPlay={handlePlay} onPlayAgain={handlePlayAgain} />
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