
interface TagDebugSectionProps {
  employeeId?: string;
  selectedRole: string | null;
  useAdvancedMode: boolean;
  availableTagTypesCount: number;
  employeeTagsCount: number;
  missingRequiredTagsCount: number;
  isLoadingEmployeeTags: boolean;
  isLoadingTagTypes: boolean;
  isLoadingRequiredTags: boolean;
  systemHealthy: boolean;
}

export function TagDebugSection({
  employeeId,
  selectedRole,
  useAdvancedMode,
  availableTagTypesCount,
  employeeTagsCount,
  missingRequiredTagsCount,
  isLoadingEmployeeTags,
  isLoadingTagTypes,
  isLoadingRequiredTags,
  systemHealthy
}: TagDebugSectionProps) {
  return (
    <>
      {/* Informações técnicas */}
      {employeeId && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>ID do funcionário: {employeeId}</div>
          <div>Função selecionada: {selectedRole || 'Nenhuma'}</div>
          <div>Modo avançado: {useAdvancedMode ? 'Ativo' : 'Disponível'}</div>
        </div>
      )}

      {/* Status detalhado em modo debug */}
      <div className="mt-4 p-3 bg-muted rounded text-xs space-y-1">
        <div>🏷️ Tipos disponíveis: {availableTagTypesCount}</div>
        <div>👤 Tags do funcionário: {employeeTagsCount}</div>
        <div>⚠️ Tags obrigatórias em falta: {missingRequiredTagsCount}</div>
        <div>🔄 Estados de carregamento: 
          Tags={isLoadingEmployeeTags ? "⏳" : "✅"}, 
          Tipos={isLoadingTagTypes ? "⏳" : "✅"}, 
          Obrigatórias={isLoadingRequiredTags ? "⏳" : "✅"}
        </div>
        <div>💚 Sistema saudável: {systemHealthy ? "✅" : "❌"}</div>
        <div>🚀 Modo avançado disponível: ✅</div>
      </div>
    </>
  );
}
