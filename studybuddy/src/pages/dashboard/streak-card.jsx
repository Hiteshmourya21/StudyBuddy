import { Calendar, Award, CheckCircle } from "lucide-react"

const StreakCard = ({ currentStreak, longestStreak, totalDays, dailyGoalCompleted }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-orange-500 mr-2" />
        <h2 className="text-lg font-semibold">Learning Streaks</h2>
      </div>

      <div className="flex justify-around text-center">
        <div className="flex flex-col items-center">
          <div className="bg-orange-100 rounded-full p-3 mb-2">
            <CheckCircle className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">{currentStreak}</p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-orange-100 rounded-full p-3 mb-2">
            <Award className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">{longestStreak}</p>
          <p className="text-sm text-gray-500">Longest Streak</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-orange-100 rounded-full p-3 mb-2">
            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">{totalDays}</p>
          <p className="text-sm text-gray-500">Total Days</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Daily Goal</p>
          <p className="text-sm text-orange-500">{dailyGoalCompleted ? "1/1 completed" : "0/1 completed"}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: dailyGoalCompleted ? "100%" : "0%" }}></div>
        </div>
      </div>
    </div>
  )
}

export default StreakCard
