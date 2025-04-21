import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import StartQuiz from './StartQuiz'
import QuizGen from './QuizGen'
import CreateQuiz from './CreateQuiz'
import StartQuizById from './StartQuizById'

const Quiz = () => {
  return (
    <div className="min-h-screen ">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createquiz" element={<CreateQuiz/>} />
        <Route path="/genquiz" element={<QuizGen />} />
        <Route path="/startquiz" element={<StartQuiz />} />
        <Route path="/:id" element={<StartQuizById />} />
      </Routes>
    </div>
  )
}

export default Quiz