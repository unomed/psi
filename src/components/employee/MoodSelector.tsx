
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOOD_OPTIONS } from '@/types/employee-auth';
import { useEmployeeMood } from '@/hooks/useEmployeeMood';
import { formatDate } from '@/utils/dateFormat';

interface MoodSelectorProps {
  employeeId: string;
}

export function MoodSelector({ employeeId }: MoodSelectorProps) {
  const { todayMood, saveMood } = useEmployeeMood(employeeId);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = async (mood: typeof MOOD_OPTIONS[0]) => {
    setSaving(true);
    setSelectedMood(mood.score);
    
    await saveMood(mood.score, mood.emoji, mood.description);
    
    setSaving(false);
    setSelectedMood(null);
  };

  if (todayMood) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ Humor Registrado
          </CardTitle>
          <CardDescription>
            Como você está se sentindo hoje - {formatDate(new Date())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-6xl mb-2">{todayMood.mood_emoji}</div>
            <p className="text-lg font-medium">{todayMood.mood_description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Registrado às {new Date(todayMood.created_at).toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          😊 Como você está hoje?
        </CardTitle>
        <CardDescription>
          Registre seu humor diário - {formatDate(new Date())}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.score}
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center gap-1 transition-all ${
                selectedMood === mood.score ? 'scale-110' : ''
              }`}
              onClick={() => handleMoodSelect(mood)}
              disabled={saving}
              style={{
                borderColor: selectedMood === mood.score ? mood.color : undefined,
                backgroundColor: selectedMood === mood.score ? `${mood.color}20` : undefined
              }}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs">{mood.description}</span>
            </Button>
          ))}
        </div>
        
        {saving && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Salvando seu humor...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
