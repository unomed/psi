
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

// Check if we're in development mode
function isDevelopmentMode(): boolean {
  const isDev = Deno.env.get('ENVIRONMENT') === 'development' || 
               Deno.env.get('DENO_DEPLOYMENT_ID') === undefined;
  console.log('Environment check:', {
    ENVIRONMENT: Deno.env.get('ENVIRONMENT'),
    DENO_DEPLOYMENT_ID: Deno.env.get('DENO_DEPLOYMENT_ID'),
    isDevelopment: isDev
  });
  return isDev;
}

// Test SMTP connectivity before attempting to send
async function testSMTPConnectivity(config: SMTPConfig): Promise<boolean> {
  console.log('Testing SMTP connectivity...');
  
  try {
    const connection = await Deno.connect({
      hostname: config.server,
      port: config.port,
    });
    
    console.log('SMTP connectivity test successful');
    connection.close();
    return true;
  } catch (error) {
    console.error('SMTP connectivity test failed:', error);
    return false;
  }
}

// Try alternative SMTP configurations
async function tryAlternativeConfigs(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  console.log('Trying alternative SMTP configurations...');
  
  // Try port 587 with STARTTLS
  if (config.port === 465) {
    console.log('Trying port 587 with STARTTLS...');
    const altConfig = { ...config, port: 587, useTLS: true };
    const connected = await testSMTPConnectivity(altConfig);
    if (connected) {
      return await sendEmailViaSMTPDirect(altConfig, email);
    }
  }
  
  // Try port 25 without TLS
  if (config.port !== 25) {
    console.log('Trying port 25 without TLS...');
    const altConfig = { ...config, port: 25, useTLS: false };
    const connected = await testSMTPConnectivity(altConfig);
    if (connected) {
      return await sendEmailViaSMTPDirect(altConfig, email);
    }
  }
  
  return false;
}

// Simulate email sending in development
function simulateEmailSend(config: SMTPConfig, email: EmailContent): boolean {
  console.log('=== DEVELOPMENT MODE: Simulating email send ===');
  console.log('Email that would be sent:', {
    from: `${config.senderName} <${config.senderEmail}>`,
    to: email.to,
    subject: email.subject,
    server: config.server,
    port: config.port,
    htmlPreview: email.html.substring(0, 200) + '...'
  });
  
  console.log('Email simulation completed successfully');
  return true;
}

// Direct SMTP sending implementation
async function sendEmailViaSMTPDirect(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  console.log('=== DIRECT SMTP SENDING ===');
  console.log('SMTP Configuration:', {
    server: config.server,
    port: config.port,
    username: config.username,
    senderEmail: config.senderEmail,
    senderName: config.senderName,
    useTLS: config.useTLS ?? true,
    hasPassword: !!config.password
  });

  try {
    console.log('Preparing email headers and body...');
    
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
    console.log('Email message prepared, size:', fullMessage.length, 'characters');

    console.log('Attempting to connect to SMTP server...');
    // Conectar ao servidor SMTP com timeout
    const connection = await Promise.race([
      Deno.connect({
        hostname: config.server,
        port: config.port,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]) as Deno.TcpConn;

    console.log('Connected to SMTP server successfully');

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Função para enviar comando e ler resposta com timeout
    async function sendCommand(command: string): Promise<string> {
      const logCommand = command.replace(/PASS.*/, 'PASS [HIDDEN]').replace(/AUTH LOGIN.*/, 'AUTH LOGIN [HIDDEN]');
      console.log('SMTP Command:', logCommand);
      
      await connection.write(encoder.encode(command + '\r\n'));
      
      const buffer = new Uint8Array(1024);
      const bytesRead = await Promise.race([
        connection.read(buffer),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Read timeout')), 5000)
        )
      ]) as number | null;
      
      const response = decoder.decode(buffer.subarray(0, bytesRead || 0));
      console.log('SMTP Response:', response.trim());
      return response;
    }

    try {
      console.log('Starting SMTP communication...');
      
      // Iniciar comunicação SMTP
      let response = await sendCommand('EHLO localhost');
      if (!response.startsWith('250')) {
        throw new Error(`EHLO failed: ${response}`);
      }

      // STARTTLS se disponível e necessário
      if (config.useTLS !== false && config.port !== 25) {
        console.log('Attempting STARTTLS...');
        response = await sendCommand('STARTTLS');
        if (response.startsWith('220')) {
          console.log('STARTTLS accepted (note: TLS upgrade not fully implemented in this version)');
        } else {
          console.log('STARTTLS not supported or failed, continuing without TLS');
        }
      }

      console.log('Starting authentication...');
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

      console.log('SMTP authentication successful');

      console.log('Sending email...');
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
      console.log('Sending email content...');
      await connection.write(encoder.encode(fullMessage + '\r\n.\r\n'));
      
      const dataBuffer = new Uint8Array(1024);
      const dataBytesRead = await Promise.race([
        connection.read(dataBuffer),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Data read timeout')), 10000)
        )
      ]) as number | null;
      
      const dataResponse = decoder.decode(dataBuffer.subarray(0, dataBytesRead || 0));
      console.log('DATA Response:', dataResponse.trim());
      
      if (!dataResponse.startsWith('250')) {
        throw new Error(`Email sending failed: ${dataResponse}`);
      }

      // Finalizar conexão
      await sendCommand('QUIT');
      
      console.log('Email sent successfully via SMTP');
      return true;

    } finally {
      try {
        connection.close();
        console.log('SMTP connection closed');
      } catch (closeError) {
        console.warn('Error closing SMTP connection:', closeError);
      }
    }

  } catch (error) {
    console.error('=== DIRECT SMTP SENDING ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    return false;
  }
}

export async function sendEmailViaSMTP(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  console.log('=== SMTP SERVICE STARTED ===');
  
  // Check if we're in development mode
  if (isDevelopmentMode()) {
    return simulateEmailSend(config, email);
  }
  
  console.log('Production mode - attempting real SMTP send');
  
  // Test connectivity first
  const canConnect = await testSMTPConnectivity(config);
  if (!canConnect) {
    console.warn('Initial connectivity test failed, trying alternatives...');
    return await tryAlternativeConfigs(config, email);
  }
  
  // Try direct SMTP sending
  const directSuccess = await sendEmailViaSMTPDirect(config, email);
  if (directSuccess) {
    return true;
  }
  
  // If direct sending fails, try alternatives
  console.warn('Direct SMTP sending failed, trying alternatives...');
  return await tryAlternativeConfigs(config, email);
}
