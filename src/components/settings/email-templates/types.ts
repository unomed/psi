
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string; // Make description optional
}
