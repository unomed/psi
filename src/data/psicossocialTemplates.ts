
import { PsicossocialQuestion } from "@/types";

export const psicossocialQuestions: PsicossocialQuestion[] = [
  {
    id: "psico-1",
    text: "Você se sente sobrecarregado com o volume de trabalho?",
    question_text: "Você se sente sobrecarregado com o volume de trabalho?",
    category: "Demandas",
    weight: 1,
    order_number: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "psico-2", 
    text: "Tem controle sobre como realizar suas tarefas?",
    question_text: "Tem controle sobre como realizar suas tarefas?",
    category: "Controle",
    weight: 1,
    order_number: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "psico-3",
    text: "Recebe apoio adequado dos colegas?",
    question_text: "Recebe apoio adequado dos colegas?", 
    category: "Apoio Social",
    weight: 1,
    order_number: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "psico-4",
    text: "As mudanças no trabalho são bem comunicadas?",
    question_text: "As mudanças no trabalho são bem comunicadas?",
    category: "Mudanças",
    weight: 1,
    order_number: 4,  
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "psico-5",
    text: "Seu papel no trabalho está claramente definido?",
    question_text: "Seu papel no trabalho está claramente definido?",
    category: "Papel",
    weight: 1,
    order_number: 5,
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString()
  }
];
