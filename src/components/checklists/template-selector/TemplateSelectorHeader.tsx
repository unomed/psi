
interface TemplateSelectorHeaderProps {
  // No props needed for static content
}

export function TemplateSelectorHeader({}: TemplateSelectorHeaderProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Selecionar Template de Questionário</h2>
      <p className="text-muted-foreground">
        Escolha um template pré-definido para criar seu questionário
      </p>
    </div>
  );
}
