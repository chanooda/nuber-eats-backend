import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/commonReq.dto';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entitiy';
import { v4 as uuid } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity('Verification')
export class VerificationEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @BeforeInsert()
  createCode() {
    this.code = uuid().replaceAll('-', '');
  }
}
