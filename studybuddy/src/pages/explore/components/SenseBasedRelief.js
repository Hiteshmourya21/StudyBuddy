"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Music, Wind, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react"

const SenseBasedRelief = () => {
  const [activeTab, setActiveTab] = useState("meditation")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="meditation" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="meditation" className="flex items-center justify-center gap-1">
            <Music className="h-4 w-4" />
            <span>Meditation Music</span>
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center justify-center gap-1">
            <Wind className="h-4 w-4" />
            <span>Breathing Exercise</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meditation">
          <MeditationMusic />
        </TabsContent>

        <TabsContent value="breathing">
          <BreathingExercise />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Meditation Music Component
const MeditationMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef(null)

  const tracks = [
    {
      title: "Calm Waters",
      description: "Gentle ocean waves with soft piano",
      src: "https://example.com/meditation1.mp3", // Replace with actual audio URL
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Forest Serenity",
      description: "Birds chirping with ambient forest sounds",
      src: "https://example.com/meditation2.mp3", // Replace with actual audio URL
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Peaceful Rain",
      description: "Gentle rainfall with soft background music",
      src: "https://example.com/meditation3.mp3", // Replace with actual audio URL
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Deep Meditation",
      description: "Tibetan singing bowls and ambient tones",
      src: "https://example.com/meditation4.mp3", // Replace with actual audio URL
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle track change
  const changeTrack = (direction) => {
    let newTrack
    if (direction === "next") {
      newTrack = (currentTrack + 1) % tracks.length
    } else {
      newTrack = (currentTrack - 1 + tracks.length) % tracks.length
    }
    setCurrentTrack(newTrack)
    setIsPlaying(false)
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].src
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Meditation Music</CardTitle>
        <CardDescription>Relax your mind with calming sounds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/3">
            <img
              src={tracks[currentTrack].image || "/placeholder.svg"}
              alt={tracks[currentTrack].title}
              className="w-full aspect-square object-cover rounded-md shadow-md"
            />
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{tracks[currentTrack].title}</h3>
              <p className="text-gray-600">{tracks[currentTrack].description}</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button onClick={() => changeTrack("prev")} variant="outline" size="icon" className="rounded-full">
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                onClick={togglePlay}
                variant="default"
                size="icon"
                className="rounded-full h-12 w-12 bg-orange-500 hover:bg-orange-600"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>

              <Button onClick={() => changeTrack("next")} variant="outline" size="icon" className="rounded-full">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <audio ref={audioRef} className="hidden">
          <source src={tracks[currentTrack].src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        <p>Music can help reduce stress and improve focus during study sessions.</p>
      </CardFooter>
    </Card>
  )
}

// Breathing Exercise Component
const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState("inhale") // inhale, hold, exhale, rest
  const [timer, setTimer] = useState(0)
  const [cycles, setCycles] = useState(0)
  const animationRef = useRef(null)

  const breathingPattern = {
    inhale: 4, // seconds
    hold: 7, // seconds
    exhale: 8, // seconds
    rest: 1, // seconds
    totalCycles: 3,
  }

  const startBreathing = () => {
    setIsActive(true)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
  }

  const stopBreathing = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  useEffect(() => {
    let lastTime = 0
    let elapsed = 0

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp
      elapsed += timestamp - lastTime
      lastTime = timestamp

      // Update timer every second
      if (elapsed >= 1000) {
        elapsed = 0
        setTimer((prevTimer) => prevTimer + 1)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  // Handle phase transitions
  useEffect(() => {
    if (!isActive) return

    let nextPhase
    let resetTimer = false

    if (phase === "inhale" && timer >= breathingPattern.inhale) {
      nextPhase = "hold"
      resetTimer = true
    } else if (phase === "hold" && timer >= breathingPattern.hold) {
      nextPhase = "exhale"
      resetTimer = true
    } else if (phase === "exhale" && timer >= breathingPattern.exhale) {
      nextPhase = "rest"
      resetTimer = true
    } else if (phase === "rest" && timer >= breathingPattern.rest) {
      nextPhase = "inhale"
      resetTimer = true
      setCycles((prev) => {
        const newCycles = prev + 1
        if (newCycles >= breathingPattern.totalCycles) {
          // Exercise complete
          setIsActive(false)
        }
        return newCycles
      })
    }

    if (resetTimer) {
      setTimer(0)
      setPhase(nextPhase)
    }
  }, [timer, phase, isActive])

  // Calculate circle size based on breathing phase
  const getCircleSize = () => {
    if (phase === "inhale") {
      // Gradually increase from 50% to 100%
      const progress = timer / breathingPattern.inhale
      return 50 + progress * 50
    } else if (phase === "hold") {
      return 100 // Fully expanded
    } else if (phase === "exhale") {
      // Gradually decrease from 100% to 50%
      const progress = timer / breathingPattern.exhale
      return 100 - progress * 50
    } else {
      return 50 // Rest at smallest size
    }
  }

  // Get instruction text based on current phase
  const getInstructionText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
      case "rest":
        return "Rest"
      default:
        return ""
    }
  }

  // Get color based on current phase
  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "bg-blue-500"
      case "hold":
        return "bg-green-500"
      case "exhale":
        return "bg-orange-500"
      case "rest":
        return "bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>4-7-8 Breathing Exercise</CardTitle>
        <CardDescription>A simple breathing technique to help reduce anxiety and promote relaxation</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds, and rest for 1 second. Complete 3 cycles
            for maximum benefit.
          </p>
        </div>

        <div className="relative flex items-center justify-center my-8">
          <div
            className={`rounded-full transition-all duration-1000 ease-in-out ${isActive ? getPhaseColor() : "bg-gray-300"}`}
            style={{
              width: `${isActive ? getCircleSize() : 50}%`,
              height: `${isActive ? getCircleSize() : 50}%`,
              maxWidth: "250px",
              maxHeight: "250px",
              aspectRatio: "1/1",
            }}
          />

          <div className="absolute text-center">
            {isActive ? (
              <>
                <p className="text-2xl font-bold text-white">{getInstructionText()}</p>
                <p className="text-white">
                  {timer} /{" "}
                  {phase === "inhale"
                    ? breathingPattern.inhale
                    : phase === "hold"
                      ? breathingPattern.hold
                      : phase === "exhale"
                        ? breathingPattern.exhale
                        : breathingPattern.rest}
                </p>
                <p className="text-white mt-2">
                  Cycle {cycles + 1} of {breathingPattern.totalCycles}
                </p>
              </>
            ) : (
              <p className="text-xl font-medium text-orange-700">Press Start to Begin</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          {!isActive ? (
            <Button onClick={startBreathing} className="bg-orange-500 hover:bg-orange-600">
              Start Breathing Exercise
            </Button>
          ) : (
            <Button onClick={stopBreathing} variant="outline">
              Stop Exercise
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        <p>Deep breathing exercises can help reduce stress and anxiety before exams.</p>
      </CardFooter>
    </Card>
  )
}

export default SenseBasedRelief

