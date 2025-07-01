
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Server, Key } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EmailServerFormValues } from "../schemas/emailServerSchema";

interface EmailServerFormFieldsProps {
  form: UseFormReturn<EmailServerFormValues>;
}

export function EmailServerFormFields({ form }: EmailServerFormFieldsProps) {
  return (
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
  );
}
