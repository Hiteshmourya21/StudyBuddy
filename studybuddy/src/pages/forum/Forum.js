import { Routes, Route } from "react-router-dom"
import ForumList from "../../components/forum/ForumList"
import QuestionDetail from "../../components/forum/QuestionDetail"
import AskQuestion from "../../components/forum/AskQuestion"

const Forum = () => {
  return (
    <div className="min-h-screen ">
      <Routes>
        <Route path="/" element={<ForumList />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
        <Route path="/ask" element={<AskQuestion />} />
      </Routes>
    </div>
  )
}

export default Forum

