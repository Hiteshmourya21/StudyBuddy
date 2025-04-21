import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const QuizGen = () => {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [quizResults, setQuizResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/quiz/result/ai/previous")
      .then((response) => setQuizResults(response.data))
      .catch((error) => console.error("Error fetching quiz results:", error));
  }, []);

  const handleStartQuiz = () => {
    if (!subject || !difficulty) {
      alert("Please select both Subject and Difficulty!");
      return;
    }
    navigate("/quiz/startquiz",{state:{subject, difficulty}});
  };

  return (
    <div style={quizStyles.container}>
      <h1 style={quizStyles.heading}>📝 Take a Quiz</h1>
      <div style={quizStyles.selectionBox}>
        <label>
          <strong>Choose Subject:</strong>
          <input style={quizStyles.select} type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>

        <label>
          <strong>Choose Difficulty:</strong>
          <select style={quizStyles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <button onClick={handleStartQuiz} style={quizStyles.startQuizBtn}>Start Quiz</button>
      </div>

      <h2>📊 Last 5 Quiz Results</h2>
      <ul>
        {quizResults?.quizAttempts?.map((result, index) => (
          <li key={index}>
            <strong>Subject:</strong> {result.subject} | <strong>Difficulty:</strong> {result.difficulty} | <strong>Score:</strong> {result.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

const quizStyles = {
  container: { textAlign: "center", padding: "20px" },
  selectionBox: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" },
  select: { padding: "8px", borderRadius: "5px" },
  startQuizBtn: { backgroundColor: "#2ecc71", color: "white", padding: "10px 15px", border: "none", cursor: "pointer" },
};

export default QuizGen;