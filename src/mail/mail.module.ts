import { DynamicModule, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { CONFIG_OPTIONS } from 'src/common/common.const';
import { MailModuleOptions } from './mail.interface';

@Module({
  providers: [MailResolver, MailService],
})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, MailService],
      exports: [MailService],
    };
  }
}
