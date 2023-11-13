import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;

  @ValidateNested()
  @Type(() => UpdateRestaurantInput)
  @Field(() => UpdateRestaurantInput)
  data: UpdateRestaurantInput;
}
