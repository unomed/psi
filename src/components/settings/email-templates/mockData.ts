
import { EmailTemplate } from "./types";

export const initialTemplates: EmailTemplate[] = [
  {
    id: "conclusao",
    name: "Conclusão de Avaliação",
    subject: "Sua avaliação psicossocial foi concluída",
    body: `Olá {nome},

Gostaríamos de informar que você concluiu com sucesso a avaliação psicossocial.

Agradecemos sua participação e comprometimento.

Atenciosamente,
Equipe de Recursos Humanos`,
    description: "Enviado quando uma avaliação é concluída pelo funcionário"
  },
  {
    id: "lembrete",
    name: "Lembrete de Avaliação",
    subject: "Lembrete: Avaliação psicossocial pendente",
    body: `Olá {nome},

Este é um lembrete de que você tem uma avaliação psicossocial pendente que precisa ser concluída até {data_limite}.

Link da avaliação: {link}

A sua participação é muito importante.

Atenciosamente,
Equipe de Recursos Humanos`,
    description: "Enviado como lembrete para funcionários com avaliações pendentes"
  },
  {
    id: "convite",
    name: "Convite para Avaliação",
    subject: "Convite para participar de uma avaliação psicossocial",
    body: `Olá {nome},

Você foi convidado(a) a participar de uma avaliação psicossocial. 
Por favor, acesse o link abaixo para completar a avaliação até {data_limite}.

Link da avaliação: {link}

Se tiver qualquer dúvida, entre em contato com o RH.

Atenciosamente,
Equipe de Recursos Humanos`,
    description: "Enviado quando uma nova avaliação é agendada para um funcionário"
  }
];
