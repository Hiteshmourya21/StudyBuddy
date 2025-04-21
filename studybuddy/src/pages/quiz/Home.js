import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const navigate = useNavigate();

  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const {data:quizzes=[]} = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => axiosInstance.get("/quiz/user").then((res) => res.data)
  });

  const {data: attempt={}} = useQuery({
    queryKey: ["attempt"],
    queryFn: () => axiosInstance.get("/quiz/user/attempts").then((res) => res.data)
  })


  const filteredQuizzes = quizzes.filter(q => {
    return (
      (!subjectFilter || q.subject === subjectFilter) &&
      (!difficultyFilter || q.difficulty === difficultyFilter)
    );
  });

  const allSubjects = quizzes.map((quiz) => quiz.subject).filter((subject, index, subjects) => subjects.indexOf(subject) === index);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button
            onClick={() => navigate('/quiz/createquiz')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Create a Quiz
          </button>

          <button
            onClick={() => navigate('/quiz/genquiz')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Generate by AI
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz._id} className="border-t">
                  <td className="px-4 py-2">
                    {attempt?.quizAttempts?.some((attempt) => attempt.quiz.toString() === quiz._id) ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-gray-400">◻</span>
                    )}
                  </td>
                    {attempt?.quizAttempts?.some((attempt) => attempt.quiz.toString() === quiz._id) ?(
                      <td className='px-4 py-2 text-green-600 bg-green-100'>
                      {quiz.title}
                      </td>
                    ):(
                      <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                    <Link to={`/quiz/${quiz._id}`}>{quiz.title}</Link>
                  </td>
                    )}
                    
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        quiz.difficulty === 'Easy'
                          ? 'bg-green-400'
                          : quiz.difficulty === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredQuizzes.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-6 text-gray-500">
                    No quizzes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;