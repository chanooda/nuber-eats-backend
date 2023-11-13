import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';
import { UserEntity } from '../entities/user.entitiy';

@InputType()
export class LoginReqDto extends PickType(UserEntity, ['email', 'password']) {}

@ObjectType()
export class LoginResDto extends CommonRes {
  @Field(() => String, { nullable: true })
  token?: string;
}
