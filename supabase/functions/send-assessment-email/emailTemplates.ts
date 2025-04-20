
import { EmailRequest } from './types';

// Default email templates
export const emailTemplates = {
  "Conclusão": {
    subject: "Sua avaliação psicossocial foi concluída",
    body: `Olá {employeeName},

Gostaríamos de informar que você concluiu com sucesso a avaliação psicossocial.

Agradecemos sua participação e comprometimento.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "Lembrete": {
    subject: "Lembrete: Avaliação psicossocial pendente",
    body: `Olá {employeeName},

Este é um lembrete de que você tem uma avaliação psicossocial pendente que precisa ser concluída.

Link da avaliação: {linkUrl}

A sua participação é muito importante.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "Convite": {
    subject: "Convite para participar de uma avaliação psicossocial",
    body: `Olá {employeeName},

Você foi convidado(a) a participar de uma avaliação psicossocial. 
Por favor, acesse o link abaixo para completar a avaliação.

Link da avaliação: {linkUrl}

Se tiver qualquer dúvida, entre em contato com o RH.

Atenciosamente,
Equipe de Recursos Humanos`
  }
};

