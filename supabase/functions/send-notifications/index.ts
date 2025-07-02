import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  type: 'risk_alert' | 'deadline_alert';
  recipient_email: string;
  subject: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  assessment_id?: string;
  action_plan_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Supabase  
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('=== VERIFICANDO NOTIFICAÇÕES PENDENTES ===');

    // Buscar configurações de notificação ativas
    const { data: notificationSettings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('email_notifications', true)
      .single();

    if (settingsError || !notificationSettings) {
      console.log('Notificações por email desabilitadas ou erro:', settingsError);
      return new Response('Notificações desabilitadas', { status: 200, headers: corsHeaders });
    }

    const notifications: NotificationData[] = [];

    // 1. VERIFICAR ALERTAS DE RISCO ALTO
    if (notificationSettings.risk_alerts) {
      console.log('Verificando alertas de risco alto...');
      
      const { data: highRiskAssessments, error: riskError } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          *,
          assessment_responses (
            id,
            employees (
              name,
              email,
              company_id,
              companies (name)
            )
          )
        `)
        .in('exposure_level', ['alto', 'critico'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Últimas 24h
        .is('notification_sent_at', null);

      if (riskError) {
        console.error('Erro ao buscar riscos altos:', riskError);
      } else if (highRiskAssessments && highRiskAssessments.length > 0) {
        for (const risk of highRiskAssessments) {
          const employee = risk.assessment_responses?.employees;
          if (employee?.email) {
            notifications.push({
              type: 'risk_alert',
              recipient_email: employee.email,
              subject: `🚨 Alerta: Risco ${risk.exposure_level} detectado`,
              message: `
                <h2>Alerta de Risco ${risk.exposure_level.toUpperCase()}</h2>
                <p>Olá ${employee.name},</p>
                <p>Sua avaliação psicossocial detectou um nível de risco <strong>${risk.exposure_level}</strong>.</p>
                <p><strong>Score:</strong> ${risk.risk_score}%</p>
                <p>É importante que você entre em contato com o RH ou gestor da empresa para as devidas providências.</p>
                <p>Empresa: ${employee.companies?.name}</p>
                <br>
                <p>Atenciosamente,<br>Sistema PSI</p>
              `,
              priority: risk.exposure_level === 'critico' ? 'high' : 'medium',
              assessment_id: risk.assessment_response_id
            });
          }
        }
        console.log(`Encontrados ${notifications.length} alertas de risco para enviar`);
      }
    }

    // 2. VERIFICAR ALERTAS DE PRAZO
    if (notificationSettings.deadline_alerts) {
      console.log('Verificando alertas de prazo...');
      
      const warningDate = new Date();
      warningDate.setDate(warningDate.getDate() + (notificationSettings.deadline_warning_days || 7));

      const { data: duePlans, error: planError } = await supabase
        .from('action_plans')
        .select(`
          *,
          companies (name)
        `)
        .lte('due_date', warningDate.toISOString().split('T')[0])
        .neq('status', 'completed')
        .is('deadline_notification_sent', null);

      if (planError) {
        console.error('Erro ao buscar planos com prazo:', planError);
      } else if (duePlans && duePlans.length > 0) {
        // Buscar emails dos responsáveis ou admins
        const { data: companyUsers, error: userError } = await supabase
          .from('user_companies')
          .select(`
            users (email),
            companies (name)
          `)
          .in('company_id', duePlans.map(p => p.company_id));

        if (!userError && companyUsers) {
          for (const plan of duePlans) {
            const companyEmails = companyUsers
              .filter(uc => uc.companies?.name === plan.companies?.name)
              .map(uc => uc.users?.email)
              .filter(Boolean);

            for (const email of companyEmails) {
              const daysUntilDue = Math.ceil((new Date(plan.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              notifications.push({
                type: 'deadline_alert',
                recipient_email: email as string,
                subject: `⏰ Plano de Ação próximo do prazo: ${plan.title}`,
                message: `
                  <h2>Alerta de Prazo</h2>
                  <p>O plano de ação <strong>"${plan.title}"</strong> está próximo do prazo de conclusão.</p>
                  <p><strong>Prazo:</strong> ${new Date(plan.due_date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Dias restantes:</strong> ${daysUntilDue} dias</p>
                  <p><strong>Status atual:</strong> ${plan.status}</p>
                  <p><strong>Prioridade:</strong> ${plan.priority}</p>
                  <br>
                  <p>Por favor, verifique o andamento das ações necessárias.</p>
                  <p>Empresa: ${plan.companies?.name}</p>
                  <br>
                  <p>Atenciosamente,<br>Sistema PSI</p>
                `,
                priority: daysUntilDue <= 2 ? 'high' : 'medium',
                action_plan_id: plan.id
              });
            }
          }
        }
      }
    }

    // 3. ENVIAR NOTIFICAÇÕES
    if (notifications.length > 0) {
      console.log(`Enviando ${notifications.length} notificações...`);
      
      for (const notification of notifications) {
        try {
          // Chamar edge function de envio de email
          const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-assessment-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: notification.recipient_email,
              subject: notification.subject,
              html: notification.message,
              priority: notification.priority
            })
          });

          if (emailResponse.ok) {
            console.log(`Email enviado para: ${notification.recipient_email}`);
            
            // Marcar como enviado
            if (notification.assessment_id) {
              await supabase
                .from('psychosocial_risk_analysis')
                .update({ notification_sent_at: new Date().toISOString() })
                .eq('assessment_response_id', notification.assessment_id);
            }
            
            if (notification.action_plan_id) {
              await supabase
                .from('action_plans')
                .update({ deadline_notification_sent: new Date().toISOString() })
                .eq('id', notification.action_plan_id);
            }
          } else {
            console.error(`Erro ao enviar email para ${notification.recipient_email}:`, await emailResponse.text());
          }
        } catch (emailError) {
          console.error(`Erro no envio do email:`, emailError);
        }
      }

      // Atualizar última execução
      await supabase
        .from('notification_settings')
        .update({ last_notification_sent: new Date().toISOString() })
        .eq('id', notificationSettings.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications_sent: notifications.length,
        message: `Processamento concluído. ${notifications.length} notificações enviadas.`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Erro no processamento de notificações:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);