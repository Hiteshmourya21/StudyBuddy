"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Quote, Laugh, BookText, Lightbulb, RefreshCw } from "lucide-react"
import axios from "axios"

const TextBasedRelief = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("quotes")
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false)

  const mockData = {
      quotes: [
        {
          quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
          author: "Winston Churchill",
        },
        { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        {
          quote: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt",
        },
        { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
      ],
      jokes: [
        { setup: "Why don't scientists trust atoms?",punchline:"Because they make up everything!" },
        { setup: "What did the ocean say to the beach?",punchline:"Nothing, it just waved." },
        { setup: "Why did the scarecrow win an award?",punchline:"Because he was outstanding in his field!" },
        { setup: "I told my wife she was drawing her eyebrows too high.",punchline:"She looked surprised." },
        { setup: "What do you call a fake noodle?",punchline:"An impasta!" },
      ],
      poems: [
        {
          title: "Don't Quit",
          text: "When things go wrong, as they sometimes will,\nWhen the road you're trudging seems all uphill,\nWhen the funds are low and the debts are high,\nAnd you want to smile, but you have to sigh,\nWhen care is pressing you down a bit,\nRest, if you must—but don't you quit.",
          author: "John Greenleaf Whittier",
        },
        {
          title: "The Road Not Taken",
          text: "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth...",
          author: "Robert Frost",
        },
        {
          title: "Invictus",
          text: "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.",
          author: "William Ernest Henley",
        },
      ],
      riddles: [
        {
          riddle:
            "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
          answer: "An echo",
        },
        {
          riddle: "The more you take, the more you leave behind. What am I?",
          answer: "Footsteps",
        },
        {
          riddle: "What has keys but no locks, space but no room, and you can enter but not go in?",
          answer: "A keyboard",
        },
        {
          riddle: "What gets wetter as it dries?",
          answer: "A towel",
        },
      ],
    }



const {
  data: textContent=[],
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["textContent", activeTab],
  queryFn: async () => {
    try {
      switch (activeTab) {
          
        case "quotes":
            const res = await axios.get("https://qapi.vercel.app/api/random");
            return res.data;

        case "jokes":
            const res2 = await axios.get("https://official-joke-api.appspot.com/jokes/random");
            return res2.data;

        case "riddles":
            const res3 = await axios.get("https://riddles-api.vercel.app/random");
            return res3.data;
        
      }
    } catch (err) {
      console.error("Error fetching text content:", err)
      return []
    }
  },
});

const getRandomItem = (array) => {
    if (!array || array.length === 0) return null
    return array[Math.floor(Math.random() * array.length)]
  }



const randomItem = (!isLoading &&  textContent.length === 0)  ? getRandomItem(mockData[activeTab]) : textContent


const handleRefresh = () => {
  refetch()
  setShowRiddleAnswer(false)
}

  const renderContent = () => {
    if (isLoading) {
    
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (!randomItem || isError) {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p>No content available. Please try again.</p>
          </CardContent>
        </Card>
      )
    }

    switch (activeTab) {
      case "quotes":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-orange-500" />
                Daily Inspiration
              </CardTitle>
              <CardDescription>A quote to motivate your studies</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="italic text-xl text-orange-500 border-l-4 border-orange-500 pl-4 py-2">
                "{randomItem.quote}"
              </blockquote>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-gray-600">— {randomItem.author}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                New Quote
              </Button>
            </CardFooter>
          </Card>
        )

      case "jokes":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laugh className="h-5 w-5 text-orange-500" />
                Take a Laugh Break
              </CardTitle>
              <CardDescription>A joke to brighten your day</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-orange-500 py-4">{randomItem.setup} {randomItem.punchline}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
                <RefreshCw className="h-4 w-4" />
                Another Joke
              </Button>
            </CardFooter>
          </Card>
        )

      case "poems":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="h-5 w-5 text-orange-500" />
                {randomItem.title}
              </CardTitle>
              <CardDescription>By {randomItem.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-orange-500">{randomItem.text}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
                <RefreshCw className="h-4 w-4" />
                Another Poem
              </Button>
            </CardFooter>
          </Card>
        )

      case "riddles":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange-500" />
                Brain Teaser
              </CardTitle>
              <CardDescription>Test your problem-solving skills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-orange-500 mb-6">{randomItem.riddle}</p>

              {showRiddleAnswer ? (
                <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                  <p className="font-medium text-orange-800">Answer: {randomItem.answer}</p>
                </div>
              ) : (
                <Button onClick={() => setShowRiddleAnswer(true)} variant="secondary" className="w-full">
                  Reveal Answer
                </Button>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
                <RefreshCw className="h-4 w-4" />
                Another Riddle
              </Button>
            </CardFooter>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="quotes" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="quotes" className="flex items-center justify-center gap-1">
            <Quote className="h-4 w-4" />
            <span>Quotes</span>
          </TabsTrigger>
          <TabsTrigger value="jokes" className="flex items-center justify-center gap-1">
            <Laugh className="h-4 w-4" />
            <span>Jokes</span>
          </TabsTrigger>
          <TabsTrigger value="poems" className="flex items-center justify-center gap-1">
            <BookText className="h-4 w-4" />
            <span>Poetry</span>
          </TabsTrigger>
          <TabsTrigger value="riddles" className="flex items-center justify-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span>Riddles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">{renderContent()}</TabsContent>
        <TabsContent value="jokes">{renderContent()}</TabsContent>
        <TabsContent value="poems">{renderContent()}</TabsContent>
        <TabsContent value="riddles">{renderContent()}</TabsContent>
      </Tabs>
    </div>
  )
}

export default TextBasedRelief

