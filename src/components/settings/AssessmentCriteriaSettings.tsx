
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RiskMatrixSettingsForm from "./RiskMatrixSettingsForm";

export const AssessmentCriteriaSettings = () => {
  return (
    <Tabs defaultValue="riskLevels" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="riskLevels">Níveis de Risco</TabsTrigger>
        <TabsTrigger value="sampling">Amostragem</TabsTrigger>
        <TabsTrigger value="governance">Governança</TabsTrigger>
        <TabsTrigger value="periodicity">Periodicidade</TabsTrigger>
      </TabsList>
      
      <TabsContent value="riskLevels" className="space-y-6">
        <RiskMatrixSettingsForm />
      </TabsContent>
      
      <TabsContent value="sampling" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regras de Amostragem</CardTitle>
            <CardDescription>
              Configure os critérios para amostragem de avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minEmployeePercentage">
                  Porcentagem mínima de funcionários
                </Label>
                <Input
                  id="minEmployeePercentage"
                  type="number"
                  defaultValue={30}
                  min={0}
                  max={100}
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireAllSectors">
                    Exigir todos os setores?
                  </Label>
                  <Switch id="requireAllSectors" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="governance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regras de Governança</CardTitle>
            <CardDescription>
              Configure os critérios de governança para avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyManagers">
                  Notificar gerentes em casos de alto risco
                </Label>
                <Switch id="notifyManagers" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireReassessment">
                  Exigir reavaliação para alto risco
                </Label>
                <Switch id="requireReassessment" defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="periodicity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Periodicidade</CardTitle>
            <CardDescription>
              Configure as regras de periodicidade para avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reassessmentMaxDays">
                  Dias máximos para reavaliação
                </Label>
                <Input
                  id="reassessmentMaxDays"
                  type="number"
                  defaultValue={90}
                  min={1}
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRecurrenceReminders">
                    Habilitar lembretes de recorrência
                  </Label>
                  <Switch id="enableRecurrenceReminders" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
