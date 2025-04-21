import { Award, Star, BookOpen, ThumbsUp, MessageSquare } from "lucide-react"

const AchievementCard = ({ title, description, type, unlocked }) => {
  // Get icon based on achievement type
  const getAchievementIcon = (type) => {
    switch (type) {
      case "quiz":
        return <BookOpen className="h-8 w-8" />
      case "post":
        return <ThumbsUp className="h-8 w-8" />
      case "forum":
        return <MessageSquare className="h-8 w-8" />
      case "resource":
        return <Star className="h-8 w-8" />
      default:
        return <Award className="h-8 w-8" />
    }
  }

  return (
    <div className={`rounded-lg p-4 border ${unlocked ? "bg-white" : "bg-gray-100"}`}>
      <div
        className={`rounded-full p-3 inline-block mb-3 ${unlocked ? "bg-orange-100 text-orange-500" : "bg-gray-200 text-gray-400"}`}
      >
        {getAchievementIcon(type)}
      </div>
      <h3 className={`font-bold text-lg mb-1 ${unlocked ? "text-gray-800" : "text-gray-500"}`}>{title}</h3>
      <p className={`text-sm ${unlocked ? "text-gray-600" : "text-gray-400"}`}>{description}</p>
      {unlocked && (
        <div className="mt-3 bg-orange-500 text-white text-xs font-bold py-1 px-2 rounded-full inline-block">
          UNLOCKED
        </div>
      )}
      {!unlocked && (
        <div className="mt-3 bg-gray-300 text-gray-600 text-xs font-bold py-1 px-2 rounded-full inline-block">
          LOCKED
        </div>
      )}
    </div>
  )
}

export default AchievementCard
