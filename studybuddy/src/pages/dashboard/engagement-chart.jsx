import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const EngagementChart = ({ data }) => {
  const COLORS = {
    posts: "#FF5722",
    questions: "#2196F3",
    answers: "#4CAF50",
    quizAttempts: "#9C27B0",
  }

  // Format data for chart
  const chartData = [
    { name: "Posts", value: data.posts, color: COLORS.posts },
    { name: "Questions", value: data.questions, color: COLORS.questions },
    { name: "Answers", value: data.answers, color: COLORS.answers },
    { name: "Quiz Attempts", value: data.quizAttempts, color: COLORS.quizAttempts },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EngagementChart
