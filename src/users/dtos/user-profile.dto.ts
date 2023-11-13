import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';
import { UserEntity } from '../entities/user.entitiy';

@ArgsType()
export class UserProfileReqDto {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileResData extends UserEntity {}

@ObjectType()
export class UserProfileResDto extends CommonRes {
  @Field(() => UserProfileResData, { nullable: true })
  data?: UserProfileResData;
}
