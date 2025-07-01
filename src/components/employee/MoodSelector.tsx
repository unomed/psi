
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeMood } from "@/hooks/useEmployeeMood";

interface MoodSelectorProps {
  employeeId: string;
}

const moodOptions = [
  { score: 1, emoji: "😢", description: "Muito mal", color: "bg-red-500" },
  { score: 2, emoji: "😞", description: "Mal", color: "bg-orange-500" },
  { score: 3, emoji: "😐", description: "Regular", color: "bg-yellow-500" },
  { score: 4, emoji: "😊", description: "Bem", color: "bg-blue-500" },
  { score: 5, emoji: "😄", description: "Muito bem", color: "bg-green-500" },
];

export function MoodSelector({ employeeId }: MoodSelectorProps) {
  const { todayMood, saveMood, loading } = useEmployeeMood(employeeId);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = async (moodScore: number, moodEmoji: string, moodDescription: string) => {
    if (todayMood) return;
    
    setSelectedMood(moodScore);
    setIsSubmitting(true);
    
    try {
      await saveMood(moodScore, moodEmoji, moodDescription);
    } finally {
      setIsSubmitting(false);
      setSelectedMood(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (todayMood) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">{todayMood.moodEmoji}</div>
        <p className="text-lg font-medium text-gray-900">{todayMood.moodDescription}</p>
        <p className="text-sm text-gray-600">Humor registrado hoje</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">Como você está se sentindo hoje?</p>
      
      <div className="grid grid-cols-5 gap-2">
        {moodOptions.map((mood) => (
          <Button
            key={mood.score}
            variant="outline"
            className={`flex flex-col items-center p-3 h-auto ${
              selectedMood === mood.score ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleMoodSelect(mood.score, mood.emoji, mood.description)}
            disabled={isSubmitting}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs text-center">{mood.description}</span>
          </Button>
        ))}
      </div>
      
      {isSubmitting && (
        <div className="text-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
          <p className="text-xs text-gray-600">Salvando...</p>
        </div>
      )}
    </div>
  );
}
