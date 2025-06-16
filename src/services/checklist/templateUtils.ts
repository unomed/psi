
import { ChecklistTemplateType } from "@/types";

export function mapDbTemplateTypeToApp(dbType: string): ChecklistTemplateType {
  console.log("Mapeando tipo de template:", dbType);
  
  const typeMap: Record<string, ChecklistTemplateType> = {
    'disc': 'disc',
    'psicossocial': 'psicossocial',
    'srq20': 'srq20',
    'phq9': 'phq9',
    'gad7': 'gad7',
    'mbi': 'mbi',
    'audit': 'audit',
    'pss': 'pss',
    'copsoq': 'copsoq',
    'jcq': 'jcq',
    'eri': 'eri',
    'personal_life': 'personal_life',
    'evaluation_360': 'evaluation_360',
    'custom': 'custom'
  };

  const mappedType = typeMap[dbType] || 'custom';
  console.log("Tipo mapeado de", dbType, "para", mappedType);
  
  return mappedType;
}
