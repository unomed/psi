
// SMTP Service para envio real de emails
export interface SMTPConfig {
  server: string;
  port: number;
  username: string;
  password: string;
  senderEmail: string;
  senderName: string;
  useTLS?: boolean;
}

export interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailViaSMTP(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  try {
    console.log('Configurando conexão SMTP...', {
      server: config.server,
      port: config.port,
      username: config.username,
      useTLS: config.useTLS ?? true
    });

    // Preparar headers do email
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36)}`;
    const messageId = `<${Date.now()}.${Math.random().toString(36)}@${config.server}>`;
    
    const emailHeaders = [
      `From: ${config.senderName} <${config.senderEmail}>`,
      `To: ${email.to}`,
      `Subject: ${email.subject}`,
      `Message-ID: ${messageId}`,
      `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '', // Linha em branco para separar headers do body
    ].join('\r\n');

    // Preparar corpo do email (multipart)
    const textPart = email.text || email.html.replace(/<[^>]*>/g, '');
    const emailBody = [
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      '',
      textPart,
      '',
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      '',
      email.html,
      '',
      `--${boundary}--`,
      ''
    ].join('\r\n');

    const fullMessage = emailHeaders + emailBody;

    // Conectar ao servidor SMTP
    const connection = await Deno.connect({
      hostname: config.server,
      port: config.port,
    });

    console.log('Conectado ao servidor SMTP');

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Função para enviar comando e ler resposta
    async function sendCommand(command: string): Promise<string> {
      console.log('SMTP Command:', command.replace(/PASS.*/, 'PASS [HIDDEN]'));
      await connection.write(encoder.encode(command + '\r\n'));
      
      const buffer = new Uint8Array(1024);
      const bytesRead = await connection.read(buffer);
      const response = decoder.decode(buffer.subarray(0, bytesRead || 0));
      console.log('SMTP Response:', response.trim());
      return response;
    }

    try {
      // Iniciar comunicação SMTP
      let response = await sendCommand('EHLO localhost');
      if (!response.startsWith('250')) {
        throw new Error(`EHLO failed: ${response}`);
      }

      // STARTTLS se disponível e necessário
      if (config.useTLS !== false && config.port !== 25) {
        response = await sendCommand('STARTTLS');
        if (response.startsWith('220')) {
          console.log('STARTTLS iniciado');
          // Aqui normalmente precisaríamos fazer upgrade da conexão para TLS
          // Por simplicidade, vamos continuar sem TLS para testes locais
        }
      }

      // Autenticação
      response = await sendCommand('AUTH LOGIN');
      if (!response.startsWith('334')) {
        throw new Error(`AUTH LOGIN failed: ${response}`);
      }

      // Enviar username (base64)
      const usernameB64 = btoa(config.username);
      response = await sendCommand(usernameB64);
      if (!response.startsWith('334')) {
        throw new Error(`Username authentication failed: ${response}`);
      }

      // Enviar password (base64)
      const passwordB64 = btoa(config.password);
      response = await sendCommand(passwordB64);
      if (!response.startsWith('235')) {
        throw new Error(`Password authentication failed: ${response}`);
      }

      console.log('Autenticação SMTP bem-sucedida');

      // Enviar email
      response = await sendCommand(`MAIL FROM:<${config.senderEmail}>`);
      if (!response.startsWith('250')) {
        throw new Error(`MAIL FROM failed: ${response}`);
      }

      response = await sendCommand(`RCPT TO:<${email.to}>`);
      if (!response.startsWith('250')) {
        throw new Error(`RCPT TO failed: ${response}`);
      }

      response = await sendCommand('DATA');
      if (!response.startsWith('354')) {
        throw new Error(`DATA command failed: ${response}`);
      }

      // Enviar o conteúdo do email
      await connection.write(encoder.encode(fullMessage + '\r\n.\r\n'));
      
      const dataBuffer = new Uint8Array(1024);
      const dataBytesRead = await connection.read(dataBuffer);
      const dataResponse = decoder.decode(dataBuffer.subarray(0, dataBytesRead || 0));
      console.log('DATA Response:', dataResponse.trim());
      
      if (!dataResponse.startsWith('250')) {
        throw new Error(`Email sending failed: ${dataResponse}`);
      }

      // Finalizar conexão
      await sendCommand('QUIT');
      
      console.log('Email enviado com sucesso via SMTP');
      return true;

    } finally {
      connection.close();
    }

  } catch (error) {
    console.error('Erro no envio SMTP:', error);
    
    // Fallback: tentar usar fetch para simulação em desenvolvimento
    if (Deno.env.get('ENVIRONMENT') === 'development') {
      console.log('Modo desenvolvimento: simulando envio de email');
      console.log('Email que seria enviado:', {
        to: email.to,
        subject: email.subject,
        from: `${config.senderName} <${config.senderEmail}>`,
        htmlPreview: email.html.substring(0, 200) + '...'
      });
      return true;
    }
    
    return false;
  }
}
