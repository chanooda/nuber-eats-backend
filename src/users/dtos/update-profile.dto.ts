import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';
import { UserEntity } from '../entities/user.entitiy';

@InputType('input')
export class UpdateProfileDto extends PartialType(
  PickType(UserEntity, ['email', 'password']),
) {}

@ObjectType()
export class UpdateProfileResDto extends CommonRes {}
