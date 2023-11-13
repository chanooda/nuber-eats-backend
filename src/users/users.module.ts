import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entitiy';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { VerificationEntity } from './entities/verfication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VerificationEntity])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
