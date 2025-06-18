import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, Trophy, Target, Clock, TrendingUp, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Remove useSafeState - usar useState normal
const moodsData = [
  { emoji: "😔", level: 1, description: "Muito triste", color: "bg-red-100 text-red-800" },
  { emoji: "😐", level: 2, description: "Neutro", color: "bg-gray-100 text-gray-800" },
  { emoji: "😊", level: 3, description: "Bem", color: "bg-yellow-100 text-yellow-800" },
  { emoji: "😄", level: 4, description: "Muito bem", color: "bg-green-100 text-green-800" },
  { emoji: "🤗", level: 5, description: "Excelente", color: "bg-blue-100 text-blue-800" }
];

interface DailyHealthMessageProps {
  onSubmit?: (data: { mood: number; message: string; selectedTopics: string[] }) => void;
}

export function DailyHealthMessage({ onSubmit }: DailyHealthMessageProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showTopics, setShowTopics] = useState(false);

  
  const healthTopics = [
    { id: "sono", label: "Qualidade do sono", icon: Clock },
    { id: "estresse", label: "Níveis de estresse", icon: TrendingUp },
    { id: "trabalho", label: "Satisfação no trabalho", icon: Target },
    { id: "relacionamento", label: "Relacionamentos", icon: Users },
    { id: "energia", label: "Níveis de energia", icon: Trophy },
    { id: "motivacao", label: "Motivação", icon: Star }
  ];

  const handleMoodSelect = (moodLevel: number) => {
    setSelectedMood(moodLevel);
    if (moodLevel <= 2) {
      setShowTopics(true);
    } else {
      setSelectedTopics([]);
      setShowTopics(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = () => {
    if (selectedMood && onSubmit) {
      onSubmit({
        mood: selectedMood,
        message,
        selectedTopics
      });
    }
  };

  const selectedMoodData = selectedMood ? moodsData.find(m => m.level === selectedMood) : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Como você está hoje?</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartilhe como você se sente para que possamos te apoiar melhor
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {moodsData.map((mood) => (
            <button
              key={mood.level}
              onClick={() => handleMoodSelect(mood.level)}
              className={cn(
                "p-3 rounded-lg border-2 transition-all hover:scale-105",
                selectedMood === mood.level
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium">{mood.level}</div>
            </button>
          ))}
        </div>

        {selectedMoodData && (
          <div className="text-center">
            <Badge className={selectedMoodData.color}>
              {selectedMoodData.description}
            </Badge>
          </div>
        )}

        {showTopics && (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              O que está afetando seu bem-estar? (opcional)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {healthTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={cn(
                    "p-2 rounded-lg border text-xs transition-all",
                    selectedTopics.includes(topic.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <topic.icon className="h-3 w-3 mx-auto mb-1" />
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Quer compartilhar algo mais? (opcional)
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Como foi seu dia? O que você gostaria de compartilhar?"
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood}
          className="w-full"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </CardContent>
    </Card>
  );
}
