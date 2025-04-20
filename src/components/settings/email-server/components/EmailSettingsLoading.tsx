
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EmailSettingsLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Servidor de Email</CardTitle>
        <CardDescription>Carregando configurações...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  );
}
