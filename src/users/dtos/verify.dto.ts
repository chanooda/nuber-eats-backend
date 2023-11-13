import { InputType, PickType } from '@nestjs/graphql';
import { VerificationEntity } from '../entities/verfication.entity';

@InputType()
export class VerifyReqDto extends PickType(VerificationEntity, ['code']) {}
