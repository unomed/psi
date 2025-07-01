
import { EmailTemplate } from "../types";

export interface EmailTemplateFormProps {
  mode: 'create' | 'edit';
  template?: EmailTemplate;
  onSubmit: (values: any) => void;
  allowedTemplateNames?: string[];
}

export interface EmailTemplateFormValues {
  name?: string;
  subject: string;
  body: string;
  description?: string;
}
