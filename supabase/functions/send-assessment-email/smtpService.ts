
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
    const connection = await Promise.race([
      Deno.connect({
        hostname: config.server,
        port: config.port,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10s')), 10000)
      )
    ]) as Deno.TcpConn;
    
    console.log('SMTP connectivity test successful');
    connection.close();
    return true;
  } catch (error) {
    console.error('SMTP connectivity test failed:', error);
    return false;
  }
}

// Wait with exponential backoff
async function waitWithBackoff(attempt: number): Promise<void> {
  const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
  console.log(`Waiting ${delay}ms before retry attempt ${attempt + 1}`);
  await new Promise(resolve => setTimeout(resolve, delay));
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

// Enhanced SMTP sending with proper authentication and error handling
async function sendEmailViaSMTPDirect(config: SMTPConfig, email: EmailContent, retryAttempt = 0): Promise<boolean> {
  console.log(`=== DIRECT SMTP SENDING (Attempt ${retryAttempt + 1}) ===`);
  console.log('SMTP Configuration:', {
    server: config.server,
    port: config.port,
    username: config.username,
    senderEmail: config.senderEmail,
    senderName: config.senderName,
    useTLS: config.useTLS ?? true,
    hasPassword: !!config.password
  });

  let connection: Deno.TcpConn | null = null;

  try {
    console.log('Preparing enhanced email headers and body...');
    
    // Generate unique message ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const messageId = `<${timestamp}.${random}@${config.server}>`;
    
    // Prepare enhanced headers to avoid spam detection
    const emailHeaders = [
      `From: ${config.senderName} <${config.senderEmail}>`,
      `To: ${email.to}`,
      `Subject: ${email.subject}`,
      `Message-ID: ${messageId}`,
      `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      `X-Mailer: Sistema-Avaliacoes-v1.0`,
      `X-Priority: 3`,
      `Reply-To: ${config.senderEmail}`,
      '', // Linha em branco para separar headers do body
    ].join('\r\n');

    const fullMessage = emailHeaders + email.html + '\r\n';
    console.log('Email message prepared, size:', fullMessage.length, 'characters');

    console.log('Attempting to connect to SMTP server with timeout...');
    // Connect with timeout
    connection = await Promise.race([
      Deno.connect({
        hostname: config.server,
        port: config.port,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 15s')), 15000)
      )
    ]) as Deno.TcpConn;

    console.log('Connected to SMTP server successfully');

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Enhanced function to send command and read response with better timeout handling
    async function sendCommand(command: string, expectCode?: string): Promise<string> {
      const logCommand = command.replace(/PASS.*/, 'PASS [HIDDEN]').replace(/AUTH LOGIN.*/, 'AUTH LOGIN [HIDDEN]');
      console.log('SMTP Command:', logCommand);
      
      await connection!.write(encoder.encode(command + '\r\n'));
      
      const buffer = new Uint8Array(2048);
      let response = '';
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const bytesRead = await Promise.race([
            connection!.read(buffer),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Read timeout')), 8000)
            )
          ]) as number | null;
          
          if (bytesRead && bytesRead > 0) {
            response += decoder.decode(buffer.subarray(0, bytesRead));
            
            // Check if we have a complete response (ends with \r\n)
            if (response.includes('\r\n')) {
              break;
            }
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error;
          }
          console.log(`Read attempt ${attempts} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('SMTP Response:', response.trim());
      
      if (expectCode && !response.startsWith(expectCode)) {
        throw new Error(`Expected ${expectCode} but got: ${response.trim()}`);
      }
      
      return response.trim();
    }

    try {
      console.log('Starting enhanced SMTP communication...');
      
      // Read initial server greeting
      const greeting = await sendCommand('', '220');
      console.log('Server greeting received');
      
      // Enhanced EHLO with proper domain
      const domain = config.senderEmail.split('@')[1] || 'localhost';
      let response = await sendCommand(`EHLO ${domain}`, '250');
      
      // Parse EHLO response for capabilities
      const capabilities = response.split('\r\n').map(line => line.trim());
      const supportsStartTLS = capabilities.some(cap => cap.includes('STARTTLS'));
      const supportsAuth = capabilities.some(cap => cap.includes('AUTH'));
      
      console.log('Server capabilities:', { supportsStartTLS, supportsAuth });

      // STARTTLS if available and required
      if (supportsStartTLS && config.useTLS !== false && config.port !== 25) {
        console.log('Attempting STARTTLS...');
        try {
          response = await sendCommand('STARTTLS', '220');
          console.log('STARTTLS command accepted');
          // Note: Full TLS upgrade implementation would require additional setup
        } catch (error) {
          console.warn('STARTTLS failed, continuing without TLS:', error.message);
        }
      }

      if (supportsAuth) {
        console.log('Starting enhanced authentication...');
        
        // Try AUTH PLAIN first
        try {
          const authString = btoa(`\0${config.username}\0${config.password}`);
          response = await sendCommand(`AUTH PLAIN ${authString}`, '235');
          console.log('AUTH PLAIN successful');
        } catch (error) {
          console.log('AUTH PLAIN failed, trying AUTH LOGIN...');
          
          // Fallback to AUTH LOGIN
          response = await sendCommand('AUTH LOGIN', '334');
          
          const usernameB64 = btoa(config.username);
          response = await sendCommand(usernameB64, '334');
          
          const passwordB64 = btoa(config.password);
          response = await sendCommand(passwordB64, '235');
          
          console.log('AUTH LOGIN successful');
        }
      } else {
        console.warn('Server does not support authentication');
      }

      console.log('Sending email transaction...');
      
      // Send email transaction
      response = await sendCommand(`MAIL FROM:<${config.senderEmail}>`, '250');
      response = await sendCommand(`RCPT TO:<${email.to}>`, '250');
      response = await sendCommand('DATA', '354');

      // Send the email content
      console.log('Sending email content...');
      await connection.write(encoder.encode(fullMessage + '\r\n.\r\n'));
      
      // Read final response
      const buffer = new Uint8Array(1024);
      const bytesRead = await Promise.race([
        connection.read(buffer),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Final response timeout')), 10000)
        )
      ]) as number | null;
      
      const finalResponse = decoder.decode(buffer.subarray(0, bytesRead || 0));
      console.log('Final Response:', finalResponse.trim());
      
      if (!finalResponse.startsWith('250')) {
        throw new Error(`Email sending failed: ${finalResponse}`);
      }

      // Graceful disconnect
      try {
        await sendCommand('QUIT');
      } catch (error) {
        console.log('QUIT command failed, but email was sent successfully');
      }
      
      console.log('Email sent successfully via SMTP');
      return true;

    } finally {
      if (connection) {
        try {
          connection.close();
          console.log('SMTP connection closed');
        } catch (closeError) {
          console.warn('Error closing SMTP connection:', closeError);
        }
      }
    }

  } catch (error) {
    console.error('=== DIRECT SMTP SENDING ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (connection) {
      try {
        connection.close();
      } catch (closeError) {
        console.warn('Error closing connection after error:', closeError);
      }
    }
    
    // Retry logic with exponential backoff
    if (retryAttempt < 2) {
      console.log(`Retrying SMTP send (attempt ${retryAttempt + 2}/3)...`);
      await waitWithBackoff(retryAttempt);
      return await sendEmailViaSMTPDirect(config, email, retryAttempt + 1);
    }
    
    return false;
  }
}

// Try alternative SMTP configurations
async function tryAlternativeConfigs(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  console.log('Trying alternative SMTP configurations...');
  
  const alternatives = [
    // Try port 587 with STARTTLS
    { ...config, port: 587, useTLS: true },
    // Try port 25 without TLS
    { ...config, port: 25, useTLS: false },
    // Try original port without TLS
    { ...config, useTLS: false }
  ];
  
  for (const altConfig of alternatives) {
    if (altConfig.port === config.port && altConfig.useTLS === config.useTLS) {
      continue; // Skip if same as original config
    }
    
    console.log(`Trying alternative: port ${altConfig.port}, TLS: ${altConfig.useTLS}`);
    
    const connected = await testSMTPConnectivity(altConfig);
    if (connected) {
      const success = await sendEmailViaSMTPDirect(altConfig, email);
      if (success) {
        console.log('Alternative configuration successful');
        return true;
      }
    }
    
    // Wait between alternative attempts
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('All alternative configurations failed');
  return false;
}

export async function sendEmailViaSMTP(config: SMTPConfig, email: EmailContent): Promise<boolean> {
  console.log('=== SMTP SERVICE STARTED ===');
  
  // Check if we're in development mode
  if (isDevelopmentMode()) {
    return simulateEmailSend(config, email);
  }
  
  console.log('Production mode - attempting real SMTP send');
  
  // Validate configuration
  if (!config.server || !config.port || !config.username || !config.password) {
    console.error('Invalid SMTP configuration');
    return false;
  }
  
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
