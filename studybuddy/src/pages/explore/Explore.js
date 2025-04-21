"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios"
import TextBasedRelief from "./components/TextBasedRelief"
import GameBasedRelief from "./components/GameBasedRelief"
import SenseBasedRelief from "./components/SenseBasedRelief"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { BookOpen, GamepadIcon as GameController, Music } from "lucide-react"

const Explore = () => {
  const [activeTab, setActiveTab] = useState("text")

  // Fetch user data to personalize content
  const userData = useQuery({queryKey: ['authUser']});

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-2">Explore & Unwind</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Take a break from your studies and recharge your mind. These activities are designed to help you relieve
          stress and return to your studies refreshed.
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="text" className="flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Text-Based</span>
          </TabsTrigger>
          <TabsTrigger value="game" className="flex items-center justify-center gap-2">
            <GameController className="h-4 w-4" />
            <span>Game-Based</span>
          </TabsTrigger>
          <TabsTrigger value="sense" className="flex items-center justify-center gap-2">
            <Music className="h-4 w-4" />
            <span>Sense-Based</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TextBasedRelief userData={userData} />
        </TabsContent>

        <TabsContent value="game">
          <GameBasedRelief />
        </TabsContent>

        <TabsContent value="sense">
          <SenseBasedRelief />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Explore;

