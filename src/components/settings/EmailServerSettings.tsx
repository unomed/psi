import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Server, Key } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEmailServerSettings } from "@/hooks/settings/useEmailServerSettings";

const emailServerSchema = z.object({
  smtpServer: z.string().min(1, "O servidor SMTP é obrigatório"),
  smtpPort: z.string().regex(/^\d+$/, "A porta deve ser um número"),
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
  senderEmail: z.string().email("Email inválido"),
  senderName: z.string().min(1, "O nome do remetente é obrigatório"),
});

type EmailServerFormValues = z.infer<typeof emailServerSchema>;

export default function EmailServerSettings() {
  const { settings, isLoading, updateSettings } = useEmailServerSettings();
  const form = useForm<EmailServerFormValues>({
    resolver: zodResolver(emailServerSchema),
    defaultValues: {
      smtpServer: settings?.smtp_server || "",
      smtpPort: settings?.smtp_port?.toString() || "587",
      username: settings?.username || "",
      password: settings?.password || "",
      senderEmail: settings?.sender_email || "",
      senderName: settings?.sender_name || ""
    }
  });

  const onSubmit = (data: EmailServerFormValues) => {
    updateSettings({
      smtp_server: data.smtpServer,
      smtp_port: parseInt(data.smtpPort),
      username: data.username,
      password: data.password,
      sender_email: data.senderEmail,
      sender_name: data.senderName
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Servidor de Email</CardTitle>
        <CardDescription>
          Configure as informações do servidor SMTP para envio de emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="smtpServer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servidor SMTP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Server className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="smtp.exemplo.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porta SMTP</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="587" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="seu@email.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" type="password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Remetente</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="noreply@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Remetente</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua Empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Salvar Configurações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
