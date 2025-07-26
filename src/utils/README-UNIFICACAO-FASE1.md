# 📋 FASE 1 - UNIFICAÇÃO DOS CRITÉRIOS DE RISCO

## ✅ **CONCLUÍDO**

### 1.1 - Análise das Duplicações ✅
- **IDENTIFICADO**: Duplicação entre `/configuracoes/criterios-avaliacao` e `/gestao-riscos`
- **DECISÃO**: Manter ambas páginas com responsabilidades distintas
- **FONTE ÚNICA**: `/configuracoes/criterios-avaliacao` define TODOS os critérios

### 1.2 - Migração de Funcionalidades ✅ 
- **REMOVIDO**: Limites de risco duplicados de `PsychosocialRiskConfigForm`
- **MANTIDO**: Apenas automação e processamento em `/gestao-riscos`
- **DOCUMENTADO**: Todas as responsabilidades no código

### 1.3 - Remoção de Duplicação ✅
- **ELIMINADO**: Card "Limites de Risco Customizados" da página de gestão
- **COMENTADO**: Código explicando o porquê da remoção  
- **UNIFICADO**: Uma única fonte de thresholds

### 1.4 - Unificação de Hooks 🔄
- **CRIADO**: `riskCriteriaUnified.ts` como fonte única
- **MIGRADO**: `useAssessmentResultsData` para usar critérios unificados
- **TODO**: Migrar outros hooks hardcoded

## 🎯 **PRÓXIMOS PASSOS FASE 1**

### 1.5 - Teste de Integração
- [ ] Testar `/configuracoes/criterios-avaliacao` 
- [ ] Verificar se `/gestao-riscos` funciona sem duplicação
- [ ] Validar cálculos de risco consistentes
- [ ] Confirmar que automação usa fonte única

## 📁 **ARQUIVOS MODIFICADOS**

### ✅ Documentados e Unificados:
- `src/components/settings/AssessmentCriteriaSettings.tsx` - Fonte única dos critérios
- `src/pages/GestaoRiscos.tsx` - Consumidor dos critérios (não duplica)
- `src/components/risks/PsychosocialRiskConfigForm.tsx` - Apenas automação
- `src/hooks/useAssessmentResultsData.ts` - Usa critérios unificados
- `src/utils/riskCriteriaUnified.ts` - Nova fonte única

### 🔄 TODO - Próximos a unificar:
- Outros hooks que fazem cálculo de risco hardcoded
- Componentes de automação que definem thresholds
- Relatórios que calculam risco de forma independente

## 🚫 **DUPLICAÇÕES ELIMINADAS**

1. **Thresholds hardcoded** espalhados pelo código
2. **Card de limites** na página de gestão psicossocial
3. **Valores fixos** em hooks de assessment
4. **Cálculos inconsistentes** entre componentes

## ✅ **RESULTADO ESPERADO**

- Uma ÚNICA fonte de verdade para critérios de risco
- Cálculos consistentes em todo o sistema  
- Facilidade de manutenção centralizada
- Eliminação de conflitos entre páginas