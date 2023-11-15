import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.const';
import { MailModuleOptions, MailTemplateVar } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly configOptions: MailModuleOptions,
  ) {}

  private async sendMail(
    subject: string,
    template: string,
    templateVars: MailTemplateVar[],
  ) {
    const form = new FormData();
    form.append('from', `Nuber Eats <mailgun@${this.configOptions.domain}>`);
    form.append('to', `hanrhfqkq@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    templateVars?.map((templateVar) =>
      form.append(`v:${templateVar.key}`, templateVar.value),
    );
    try {
      await fetch(
        `https://api.mailgun.net/v3/${this.configOptions.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.configOptions.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
  sendVerificationEmail(email: string, code: string) {
    this.sendMail('testing', 'nuber-eats-validation-code', [
      { key: 'name', value: email },
      { key: 'code', value: code },
    ]);
  }
}
