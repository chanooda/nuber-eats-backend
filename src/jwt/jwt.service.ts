import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.const';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly configOptions: JwtModuleOptions,
  ) {}
  sign(userId: number) {
    return jwt.sign({ id: userId }, this.configOptions.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.configOptions.privateKey);
  }
}
