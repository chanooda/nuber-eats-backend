import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entitiy';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';

@InputType()
export class CreateUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateUserResDto extends CommonRes {}
