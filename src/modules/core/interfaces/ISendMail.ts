export interface ISendMail {
  to: string[] | string;
  subject?: string;
  from?: string;
  template: string;
  text?: string;
  html?: string;
  context?: Record<string, any>;
}