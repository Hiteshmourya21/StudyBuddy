import React, { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { useQuery } from '@tanstack/react-query';

const CreateQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    subject: '',
    difficulty: '',
    questions: [],
  });

  const {data:userQuiz} = useQuery({
    queryKey: ['userQuiz'],
    queryFn: async () => {
      const response = await axiosInstance.get('/quiz/user');
      setQuizzes(response.data);
      return response.data;
    },

  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz({ ...newQuiz, [name]: value });
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const saveQuiz = async () => {
    try {
      const response = await axiosInstance.post('/quiz', newQuiz);
      setQuizzes([...quizzes, response.data]);
      setNewQuiz({ title: '', subject: '', difficulty: '', questions: [] });
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await axiosInstance.delete(`/quiz/delete/${id}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          className="w-full border p-2 rounded"
          value={newQuiz.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full border p-2 rounded"
          value={newQuiz.subject}
          onChange={handleInputChange}
        />
        <select
          name="difficulty"
          className="w-full border p-2 rounded"
          value={newQuiz.difficulty}
          onChange={handleInputChange}
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {newQuiz.questions.map((q, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <input
              type="text"
              placeholder="Question"
              className="w-full border p-2 rounded"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
            />
            {q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="w-full border p-2 rounded"
                value={opt}
                onChange={(e) => handleOptionChange(index, i, e.target.value)}
              />
            ))}
            <input
              type="text"
              placeholder="Correct Answer"
              className="w-full border p-2 rounded"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteQuestion(index)}
            >
              Delete Question
            </button>
          </div>
        ))}

        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={addQuestion}
        >
          + Add Question
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={saveQuiz}
        >
          Save Quiz
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Created Quizzes</h2>
        {quizzes.map((quiz, i) => (
          <div key={i} className="border p-4 mb-2 rounded">
            <div className="flex justify-between">
              <h3 className="font-semibold">{quiz.title} ({quiz.subject} - {quiz.difficulty})</h3>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteQuiz(quiz._id)}
              >
                Delete Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQuiz;