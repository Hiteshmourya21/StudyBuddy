import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const ForumList = () => {
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await axiosInstance.get('/forum/questions');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full p-8">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discussion Forum</h1>
        <Link 
          to="/forum/ask" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Ask Question
        </Link>
      </div>
      
      <div className="flex flex-col gap-4">
        {questions && questions.map((question) => (
          <Link 
            key={question._id} 
            to={`/forum/question/${question._id}`}
            className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {question.user.profilePicture ? (
                  <img 
                    src={question.user.profilePicture || "/placeholder.svg"} 
                    alt={question.user.name}
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{question.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{question.user.name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  
                  <div className="flex items-center ml-auto gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{question.answersCount || 0}</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            
            {question.image && (
              <div className="mt-4">
                <img 
                  src={question.image || "/placeholder.svg"} 
                  alt="Question attachment" 
                  className="rounded-md max-h-48 object-contain" 
                />
              </div>
            )}
            
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {question.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
        
        {questions && questions.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Be the first to ask a question in this community!</p>
            <Link 
              to="/forum/ask" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-block transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumList;
