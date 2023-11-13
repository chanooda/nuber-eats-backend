import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entitiy';
import { UserService } from './users.service';
import { LoginReqDto, LoginResDto } from './dtos/login.dto';
import { CreateUserDto, CreateUserResDto } from './dtos/craete-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileReqDto, UserProfileResDto } from './dtos/user-profile.dto';
import {
  UpdateProfileDto,
  UpdateProfileResDto,
} from './dtos/update-profile.dto';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';
import { VerifyReqDto } from './dtos/verify.dto';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserResDto)
  async createAccount(
    @Args('input') createUserDto: CreateUserDto,
  ): Promise<CreateUserResDto> {
    return await this.userService.createUser(createUserDto);
  }

  @Mutation(() => LoginResDto)
  async login(@Args('input') loginReqDto: LoginReqDto): Promise<LoginResDto> {
    return await this.userService.login(loginReqDto);
  }

  @Query(() => UserEntity)
  @UseGuards(AuthGuard)
  me(@AuthUser() user: UserEntity) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Query(() => UserProfileResDto)
  async userProfile(
    @Args() userProfileReqDto: UserProfileReqDto,
  ): Promise<UserProfileResDto> {
    return await this.userService.findById(userProfileReqDto.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateProfileResDto)
  async updateUserProfile(
    @AuthUser() user: UserEntity,
    @Args('input') updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileResDto> {
    return await this.userService.updateProfile(user.id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CommonRes)
  async deleteUser(@AuthUser() user: UserEntity) {
    return this.userService.deleteUser(user.id);
  }

  @Mutation(() => CommonRes)
  verifyUser(@Args('input') { code }: VerifyReqDto) {
    return this.userService.verifyUser(code);
  }
}
