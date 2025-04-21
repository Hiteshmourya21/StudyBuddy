"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { axiosInstance } from "../../lib/axios"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

const StartQuizById = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [quizStarted, setQuizStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("")

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/quiz/${id}`)
        .then((response) => {
          const quiz = response.data
          setQuestions(quiz.questions)
          setSubject(quiz.subject)
          setDifficulty(quiz.difficulty)
          setQuizStarted(true)
        })
        .catch((error) => console.error("Error fetching quiz by ID:", error))
    }
  }, [id])

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizStarted) {
      nextQuestion()
    }
  }, [quizStarted, timeLeft])

  const handleAnswer = (option) => {
    setSelectedOption(option)
    setShowFeedback(true)

    setTimeout(() => {
      if (option === questions[currentQuestionIndex]?.correctAnswer) {
        setScore(score + 1)
      }
      setShowFeedback(false)
      setSelectedOption(null)
      nextQuestion()
    }, 1000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(60)
    } else {
      axiosInstance
        .post("/quiz/results", { quizId: id,subject, difficulty , score, type: "manual" })
        .then(() => navigate("/"))
        .catch((error) => toast.error(error.response.data.message || "Error saving result"))
    }
  }

  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-500"
    if (timeLeft > 10) return "text-yellow-500"
    return "text-red-500"
  }

  const getOptionClass = (option) => {
    if (!showFeedback) return "bg-white hover:bg-gray-100"
    if (option === questions[currentQuestionIndex]?.correctAnswer) return "bg-green-100 border-green-500"
    if (option === selectedOption && option !== questions[currentQuestionIndex]?.correctAnswer)
      return "bg-red-100 border-red-500"
    return "bg-white opacity-50"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {quizStarted && questions.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{subject} Quiz</h2>
                  <p className="text-primary-100">Difficulty: {difficulty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Score: {score}/{questions.length}
                  </p>
                  <p className="text-xs">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-primary h-2 transition-all duration-300"
                style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center p-4 border-b">
              <Clock className={`mr-2 ${getTimerColor()}`} size={20} />
              <span className={`font-mono text-xl font-bold ${getTimerColor()}`}>{timeLeft}s</span>
            </div>

            {/* Question */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">
                {questions[currentQuestionIndex]?.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${getOptionClass(
                      option
                    )}`}
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>

                      {showFeedback && option === questions[currentQuestionIndex]?.correctAnswer && (
                        <CheckCircle className="ml-auto text-green-500" size={20} />
                      )}

                      {showFeedback &&
                        option === selectedOption &&
                        option !== questions[currentQuestionIndex]?.correctAnswer && (
                          <AlertCircle className="ml-auto text-red-500" size={20} />
                        )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading quiz...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartQuizById
