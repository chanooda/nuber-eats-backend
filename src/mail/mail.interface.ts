export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export interface MailTemplateVar {
  key: string;
  value: string;
}
