
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeriodicityConfiguration } from "@/hooks/settings/usePeriodicityConfiguration";
import { PeriodicityForm, FormValues } from "./periodicity/PeriodicityForm";
import { PeriodicityLoading } from "./periodicity/PeriodicityLoading";
import { PeriodicityType } from "@/types/settings";

export default function PeriodicitySettings() {
  const { settings, isLoading, updateSettings } = usePeriodicityConfiguration();
  
  const onSubmit = (values: FormValues) => {
    updateSettings({
      default_periodicity: values.defaultPeriodicity,
      risk_high_periodicity: values.riskHighPeriodicity,
      risk_medium_periodicity: values.riskMediumPeriodicity,
      risk_low_periodicity: values.riskLowPeriodicity
    });
  };

  if (isLoading) {
    return <PeriodicityLoading />;
  }

  const defaultValues: FormValues = {
    defaultPeriodicity: settings?.default_periodicity ?? "annual",
    riskHighPeriodicity: settings?.risk_high_periodicity ?? "quarterly",
    riskMediumPeriodicity: settings?.risk_medium_periodicity ?? "semiannual",
    riskLowPeriodicity: settings?.risk_low_periodicity ?? "annual"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Periodicidade</CardTitle>
      </CardHeader>
      <CardContent>
        <PeriodicityForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
}
