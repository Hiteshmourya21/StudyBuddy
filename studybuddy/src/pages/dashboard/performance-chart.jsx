import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const PerformanceChart = ({ data }) => {
  // Format data for chart if needed
  const chartData = data.map((item) => ({
    subject: item.subject || "Unknown",
    score: item.score,
    difficulty: item.difficulty,
  }))

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
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#FF5722" name="Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart
