"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Brain, Grid3X3 } from "lucide-react"

const GameBasedRelief = () => {
  const [activeGame, setActiveGame] = useState("memory")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="memory" className="w-full" onValueChange={setActiveGame}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="memory" className="flex items-center justify-center gap-1">
            <Grid3X3 className="h-4 w-4" />
            <span>Memory Cards</span>
          </TabsTrigger>
          <TabsTrigger value="puzzle" className="flex items-center justify-center gap-1">
            <Brain className="h-4 w-4" />
            <span>Puzzle Challenge</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memory">
          <MemoryGame />
        </TabsContent>

        <TabsContent value="puzzle">
          <PuzzleGame />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Memory Card Game Component
const MemoryGame = () => {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [disabled, setDisabled] = useState(false)

  // Motivational words for the memory game
  const motivationalPairs = [
    { id: 1, word: "Success" },
    { id: 2, word: "Believe" },
    { id: 3, word: "Focus" },
    { id: 4, word: "Achieve" },
    { id: 5, word: "Persist" },
    { id: 6, word: "Dream" },
    { id: 7, word: "Courage" },
    { id: 8, word: "Growth" },
  ]

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create pairs of cards
    const duplicatedCards = [...motivationalPairs, ...motivationalPairs]
      .map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`,
        isFlipped: false,
        isSolved: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(duplicatedCards)
    setFlipped([])
    setSolved([])
    setMoves(0)
    setGameOver(false)
    setDisabled(false)
  }

  // Handle card click
  const handleCardClick = (uniqueId) => {
    // Don't allow flipping if disabled or card is already flipped/solved
    if (disabled || flipped.includes(uniqueId) || solved.includes(uniqueId)) {
      return
    }

    // Add card to flipped array
    const newFlipped = [...flipped, uniqueId]
    setFlipped(newFlipped)

    // If this is the first card flipped, just update state
    if (newFlipped.length === 1) {
      return
    }

    // If this is the second card, check for a match
    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      setDisabled(true)

      const [firstCardId, secondCardId] = newFlipped
      const firstCard = cards.find((card) => card.uniqueId === firstCardId)
      const secondCard = cards.find((card) => card.uniqueId === secondCardId)

      // Check if the cards match (same word)
      if (firstCard.id === secondCard.id) {
        // Cards match - add to solved array
        setSolved([...solved, firstCardId, secondCardId])
        setFlipped([])
        setDisabled(false)

        // Check if all cards are solved
        if (solved.length + 2 === cards.length) {
          setGameOver(true)
        }
      } else {
        // Cards don't match - flip them back after a delay
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }

  return (
    <Card className="w-ful">
      <CardHeader>
        <CardTitle>Memory Card Game</CardTitle>
        <CardDescription>Match pairs of motivational words to win. Flip cards by clicking on them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Moves: {moves}</div>
          <Button onClick={initializeGame} variant="outline" size="sm">
            Restart Game
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.uniqueId}
              onClick={() => handleCardClick(card.uniqueId)}
              className={`
                 aspect-square flex items-center justify-center rounded-md cursor-pointer text-center transition-all duration-300 transform
                ${
                  flipped.includes(card.uniqueId) || solved.includes(card.uniqueId)
                    ? "bg-orange-500 text-white rotate-y-180"
                    : "bg-gray-200 text-gray-200 hover:bg-gray-300"
                }
                ${solved.includes(card.uniqueId) ? "bg-green-500" : ""}
              `}
            >
              <span
                className={`font-medium ${flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) ? "text-white" : "text-gray-200"}`}
              >
                {flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) ? card.word : "?"}
              </span>
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800 font-medium">Congratulations! You completed the game in {moves} moves.</p>
            <Button onClick={initializeGame} className="mt-2" variant="outline">
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Puzzle Game Component
const PuzzleGame = () => {
  const [puzzle, setPuzzle] = useState([])
  const [emptyCell, setEmptyCell] = useState({ row: 3, col: 3 })
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle()
  }, [])

  const initializePuzzle = () => {
    // Create a solved 4x4 puzzle (1-15 and empty)
    const newPuzzle = Array(4)
      .fill()
      .map(() => Array(4).fill(0))
    let num = 1

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          newPuzzle[i][j] = 0 // Empty cell
        } else {
          newPuzzle[i][j] = num++
        }
      }
    }

    setPuzzle(newPuzzle)
    setEmptyCell({ row: 3, col: 3 })
    setMoves(0)
    setSolved(false)
    setGameStarted(false)
  }

  const shufflePuzzle = () => {
    // Make random moves to shuffle the puzzle
    const newPuzzle = [...puzzle.map((row) => [...row])]
    const newEmptyCell = { ...emptyCell }

    // Make 100 random moves
    for (let i = 0; i < 100; i++) {
      const possibleMoves = []

      // Check all four directions
      if (newEmptyCell.row > 0) possibleMoves.push({ row: newEmptyCell.row - 1, col: newEmptyCell.col })
      if (newEmptyCell.row < 3) possibleMoves.push({ row: newEmptyCell.row + 1, col: newEmptyCell.col })
      if (newEmptyCell.col > 0) possibleMoves.push({ row: newEmptyCell.row, col: newEmptyCell.col - 1 })
      if (newEmptyCell.col < 3) possibleMoves.push({ row: newEmptyCell.row, col: newEmptyCell.col + 1 })

      // Pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

      // Swap cells
      newPuzzle[newEmptyCell.row][newEmptyCell.col] = newPuzzle[randomMove.row][randomMove.col]
      newPuzzle[randomMove.row][randomMove.col] = 0

      // Update empty cell position
      newEmptyCell.row = randomMove.row
      newEmptyCell.col = randomMove.col
    }

    setPuzzle(newPuzzle)
    setEmptyCell(newEmptyCell)
    setMoves(0)
    setSolved(false)
    setGameStarted(true)
  }

  const handleCellClick = (row, col) => {
    if (!gameStarted || solved) return

    // Check if the clicked cell is adjacent to the empty cell
    const isAdjacent =
      (row === emptyCell.row && Math.abs(col - emptyCell.col) === 1) ||
      (col === emptyCell.col && Math.abs(row - emptyCell.row) === 1)

    if (isAdjacent) {
      // Create a copy of the puzzle
      const newPuzzle = [...puzzle.map((row) => [...row])]

      // Swap the clicked cell with the empty cell
      newPuzzle[emptyCell.row][emptyCell.col] = newPuzzle[row][col]
      newPuzzle[row][col] = 0

      // Update state
      setPuzzle(newPuzzle)
      setEmptyCell({ row, col })
      setMoves(moves + 1)

      // Check if puzzle is solved
      checkIfSolved(newPuzzle)
    }
  }

  const checkIfSolved = (currentPuzzle) => {
    let num = 1
    let isSolved = true

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // Skip the last cell (should be empty)
        if (i === 3 && j === 3) {
          if (currentPuzzle[i][j] !== 0) {
            isSolved = false
          }
        } else if (currentPuzzle[i][j] !== num++) {
          isSolved = false
        }
      }
    }

    setSolved(isSolved)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>15 Puzzle Challenge</CardTitle>
        <CardDescription>
          Arrange the numbers in order from 1 to 15 by sliding tiles into the empty space.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Moves: {moves}</div>
          <div className="space-x-2">
            <Button onClick={initializePuzzle} variant="outline" size="sm">
              Reset
            </Button>
            <Button onClick={shufflePuzzle} variant="default" size="sm">
              Shuffle & Start
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {puzzle.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  aspect-square flex items-center justify-center rounded-md cursor-pointer text-center
                  ${
                    cell === 0
                      ? "bg-gray-100 border-2 border-dashed border-gray-300"
                      : "bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  }
                `}
              >
                <span className="text-lg font-bold">{cell !== 0 ? cell : ""}</span>
              </div>
            )),
          )}
        </div>

        {solved && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800 font-medium">Congratulations! You solved the puzzle in {moves} moves.</p>
            <Button onClick={shufflePuzzle} className="mt-2" variant="outline">
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GameBasedRelief

