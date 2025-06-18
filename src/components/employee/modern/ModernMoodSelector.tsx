
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Remove useSafeState - usar useState normal
interface MoodEntry {
  id: string;
  mood: number;
  emoji: string;
  description: string;
  message?: string;
  timestamp: Date;
}

interface ModernMoodSelectorProps {
  onSubmit?: (data: { mood: number; message: string }) => void;
  recentEntries?: MoodEntry[];
}

const moodOptions = [
  { level: 1, emoji: "😰", description: "Muito ansioso", color: "bg-red-50 border-red-200 text-red-700" },
  { level: 2, emoji: "😔", description: "Triste", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { level: 3, emoji: "😐", description: "Neutro", color: "bg-gray-50 border-gray-200 text-gray-700" },
  { level: 4, emoji: "😊", description: "Bem", color: "bg-green-50 border-green-200 text-green-700" },
  { level: 5, emoji: "😄", description: "Excelente", color: "bg-blue-50 border-blue-200 text-blue-700" }
];

export function ModernMoodSelector({ onSubmit, recentEntries = [] }: ModernMoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = () => {
    if (selectedMood && onSubmit) {
      onSubmit({ mood: selectedMood, message });
      setSelectedMood(null);
      setMessage("");
    }
  };

  const selectedMoodOption = selectedMood ? moodOptions.find(m => m.level === selectedMood) : null;

  // Simular entrada recente para mostrar histórico
  const mockRecentEntry = recentEntries.length > 0 ? recentEntries[0] : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Como você está se sentindo hoje?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.level}
                onClick={() => setSelectedMood(option.level)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all hover:scale-105 text-center",
                  selectedMood === option.level
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30",
                  option.color
                )}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-xs font-medium">{option.description}</div>
                <div className="text-xs text-muted-foreground mt-1">{option.level}</div>
              </button>
            ))}
          </div>

          {selectedMoodOption && (
            <div className="space-y-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <span className="text-2xl mr-2">{selectedMoodOption.emoji}</span>
                <span className="font-medium">{selectedMoodOption.description}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quer compartilhar mais detalhes? (opcional)
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="O que está acontecendo? Como podemos te ajudar?"
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Registrar Estado de Humor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {mockRecentEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Último Registro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="text-2xl">{mockRecentEntry.emoji || "😊"}</div>
              <div className="flex-1">
                <div className="font-medium">{mockRecentEntry.description || "Bem"}</div>
                {mockRecentEntry.message && (
                  <p className="text-sm text-muted-foreground mt-1">{mockRecentEntry.message}</p>
                )}
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(mockRecentEntry.timestamp || Date.now()).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
