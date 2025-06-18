
import React from 'react';
import { useSafeState } from '@/hooks/useSafeReact';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOOD_OPTIONS } from '@/types/employee-auth';
import { useEmployeeMoodSafe } from '@/hooks/useEmployeeMoodSafe';
import { formatDate } from '@/utils/dateFormat';
import { Sparkles, CheckCircle, Info } from 'lucide-react';

interface ModernMoodSelectorProps {
  employeeId: string;
}

export function ModernMoodSelector({ employeeId }: ModernMoodSelectorProps) {
  // Check React availability first
  if (typeof React === 'undefined' || !React) {
    console.warn('[ModernMoodSelector] React not available');
    return null;
  }

  const { todayMood, saveMood } = useEmployeeMoodSafe(employeeId);
  const [selectedMood, setSelectedMood] = useSafeState<number | null>(null);
  const [saving, setSaving] = useSafeState(false);

  const handleMoodSelect = async (mood: typeof MOOD_OPTIONS[number]) => {
    // Se já tem humor registrado, mostrar informação
    if (todayMood) {
      return;
    }

    setSaving(true);
    setSelectedMood(mood.score);
    
    const result = await saveMood(mood.score, mood.emoji, mood.description);
    
    setSaving(false);
    setSelectedMood(null);
  };

  if (todayMood) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <CardTitle className="text-green-800">Humor Registrado!</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            {formatDate(new Date())}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-7xl mb-3">{todayMood.moodEmoji}</div>
            <p className="text-xl font-semibold text-gray-800 mb-2">{todayMood.moodDescription}</p>
            <p className="text-sm text-gray-600 mb-3">
              Registrado às {new Date(todayMood.createdAt).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-center text-blue-700">
                <Info className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  Você pode registrar seu humor uma vez por dia
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <CardTitle className="text-blue-800">Como você está hoje?</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Registre seu humor • {formatDate(new Date())}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.score}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 border-2 bg-white/60 backdrop-blur-sm ${
                selectedMood === mood.score 
                  ? 'scale-110 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleMoodSelect(mood)}
              disabled={saving}
              style={{
                borderColor: selectedMood === mood.score ? mood.color : 'rgb(226 232 240)',
                backgroundColor: selectedMood === mood.score ? `${mood.color}20` : undefined
              }}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">{mood.description}</span>
            </Button>
          ))}
        </div>
        
        {saving && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Salvando seu humor...
            </div>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-center text-gray-600">
            <Info className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Você pode registrar seu humor apenas uma vez por dia
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
