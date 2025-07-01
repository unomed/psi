
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const companyFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome da empresa precisa ter pelo menos 2 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "CNPJ precisa ter 14 números.",
  }),
  address: z.string().min(5, {
    message: "Endereço precisa ter pelo menos 5 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Cidade precisa ter pelo menos 2 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado precisa ter pelo menos 2 caracteres.",
  }),
  industry: z.string().min(2, {
    message: "Ramo de atividade precisa ter pelo menos 2 caracteres.",
  }),
  contactName: z.string().min(2, {
    message: "Nome do responsável precisa ter pelo menos 2 caracteres.",
  }),
  contactEmail: z.string().email({
    message: "Email inválido.",
  }),
  contactPhone: z.string().min(10, {
    message: "Telefone precisa ter pelo menos 10 números.",
  }),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormValues) => void;
  defaultValues?: Partial<CompanyFormValues>;
}

export function CompanyForm({ onSubmit, defaultValues }: CompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: defaultValues || {
      name: "",
      cnpj: "",
      address: "",
      city: "",
      state: "",
      industry: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      notes: "",
    },
  });

  function handleSubmit(data: CompanyFormValues) {
    onSubmit(data);
    toast.success("Dados da empresa salvos com sucesso!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Empresa ACME Ltda." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0001-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Av. Principal, 1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="SP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ramo de Atividade</FormLabel>
              <FormControl>
                <Input placeholder="Tecnologia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Responsável pelo PGR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="joao.silva@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre a empresa..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </Form>
  );
}
