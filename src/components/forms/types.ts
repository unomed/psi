
import { CompanyData } from "@/types";

export interface CompanyFormProps {
  onSubmit: (data: CompanyData) => Promise<void>;
  initialData?: CompanyData;
  isEdit?: boolean;
  onClose?: () => void; // ADICIONADO
}
