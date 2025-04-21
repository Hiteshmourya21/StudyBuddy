import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import TodoSection from './TodoSection';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { Award, BookOpen, MessageSquare, ThumbsUp, Calendar, TrendingUp, FileText, CheckCircle } from 'lucide-react';

const dummyData = [
  { name: 'Easy', value: 0 },
  { name: 'Medium', value: 0 },
  { name: 'Hard', value: 0 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
const ENGAGEMENT_COLORS = {
  posts: '#FF5722',
  questions: '#2196F3',
  answers: '#4CAF50',
  quizAttempts: '#9C27B0'
};

const Dashboard = ({ data }) => {
  // Fetch performance data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['performanceData'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/dashboard/performance');
      return res.data;
    },
  });

  // Fetch engagement data
  const { data: engagementData, isLoading: engagementLoading } = useQuery({
    queryKey: ['engagementData'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/dashboard/engagement');
      return res.data;
    },
  });

  // Fetch resource metrics
  const { data: resourceMetrics, isLoading: resourceLoading } = useQuery({
    queryKey: ['resourceMetrics'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/dashboard/resource-metrics');
      return res.data;
    },
  });

  // Format engagement data for chart
  const formatEngagementData = () => {
    if (!engagementData) return [];
    
    return [
      { name: 'Posts', value: engagementData.posts, color: ENGAGEMENT_COLORS.posts },
      { name: 'Questions', value: engagementData.questions, color: ENGAGEMENT_COLORS.questions },
      { name: 'Answers', value: engagementData.answers, color: ENGAGEMENT_COLORS.answers },
      { name: 'Quiz Attempts', value: engagementData.quizAttempts, color: ENGAGEMENT_COLORS.quizAttempts }
    ];
  };

  // Format performance data for chart
  const formatPerformanceData = () => {
    if (!performanceData || performanceData.length === 0) {
      return [{ subject: 'No Data', score: 0 }];
    }
    
    return performanceData.map(item => ({
      subject: item.subject || 'Unknown',
      score: item.score,
      difficulty: item.difficulty
    }));
  };

  // Calculate streaks (mock data since we don't have actual streak data)
  const calculateStreaks = () => {
    return {
      currentStreak: 3,
      longestStreak: 7,
      totalDays: 15
    };
  };

  const streakData = calculateStreaks();
  const engagementChartData = formatEngagementData();
  const performanceChartData = formatPerformanceData();

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Activity Graph - Keep as is */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Activity Graph</h2>
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Todo List - Keep as is */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1">
        <h2 className="text-lg font-semibold">📝 Todo List</h2>
        <TodoSection />
      </div>

      {/* Weekly Engagement */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Weekly Engagement</h2>
        </div>
        
        {engagementLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {engagementChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm">Posts: {engagementData?.posts || 0}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm">Questions: {engagementData?.questions || 0}</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Answers: {engagementData?.answers || 0}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm">Quiz Attempts: {engagementData?.quizAttempts || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Data */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1">
        <div className="flex items-center mb-4">
          <Award className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Quiz Performance</h2>
        </div>
        
        {performanceLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : performanceData && performanceData.length > 0 ? (
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="score" fill="#FF5722" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Quiz Results</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {performanceData.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <p className="font-medium">{quiz.subject || 'Unnamed Quiz'}</p>
                      <p className="text-xs text-gray-500">
                        {quiz.difficulty || 'Unknown'} • {quiz.date || 'No date'}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-white text-sm ${
                      quiz.score >= 8 ? 'bg-green-500' : 
                      quiz.score >= 5 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {quiz.score}/10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <BookOpen className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">No quiz data available yet</p>
            <p className="text-sm text-gray-400">Complete quizzes to see your performance</p>
          </div>
        )}
      </div>

      {/* Streaks */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Learning Streaks</h2>
        </div>
        
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 rounded-full p-3 mb-2">
              <CheckCircle className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{streakData.currentStreak}</p>
            <p className="text-sm text-gray-500">Current Streak</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 rounded-full p-3 mb-2">
              <Award className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{streakData.longestStreak}</p>
            <p className="text-sm text-gray-500">Longest Streak</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 rounded-full p-3 mb-2">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{streakData.totalDays}</p>
            <p className="text-sm text-gray-500">Total Days</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Daily Goal</p>
            <p className="text-sm text-orange-500">1/1 completed</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Resource Metrics */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Resource Metrics</h2>
        </div>
        
        {resourceLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : resourceMetrics && resourceMetrics.length > 0 ? (
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={resourceMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="likes" fill="#FF5722" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Your Resources</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {resourceMetrics.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <p className="font-medium truncate max-w-[70%]">{resource.title}</p>
                    <div className="flex items-center text-orange-500">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{resource.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">No resources available yet</p>
            <p className="text-sm text-gray-400">Create resources to see metrics</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Recommended for You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Quiz: Advanced Mathematics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Challenge yourself with this advanced quiz</p>
            <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors">
              Start Quiz
            </button>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Resource: Study Techniques</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Learn effective study methods</p>
            <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors">
              View Resource
            </button>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Forum: Exam Preparation</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Join the discussion on exam prep</p>
            <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors">
              Join Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Todo = () => <div className="p-6 text-xl">📝 Todo List Page</div>;
const QuizzesData = () => <div className="p-6 text-xl">📊 Quizzes Data Page</div>;
const Streaks = () => <div className="p-6 text-xl">🔥 Streaks Page</div>;
const History = () => <div className="p-6 text-xl">📅 History Page</div>;
const Recommendations = () => <div className="p-6 text-xl">💡 Recommendations Page</div>;

const DashboardApp = () => {
  const { data: difficultyData = dummyData } = useQuery({
    queryKey: ['difficultyData'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/dashboard/acitivity');
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Dashboard data={difficultyData} />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/quizzes-data" element={<QuizzesData />} />
        <Route path="/streaks" element={<Streaks />} />
        <Route path="/history" element={<History />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  );
};

export default DashboardApp;
