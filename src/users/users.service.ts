import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entitiy';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserResDto } from './dtos/craete-user.dto';
import { LoginReqDto, LoginResDto } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CommonRes } from 'src/common/dtos/CommonRes.dto';
import { VerificationEntity } from './entities/verfication.entity';
import { UserProfileResDto } from './dtos/user-profile.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VerificationEntity)
    private readonly verificationRepository: Repository<VerificationEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createUser({
    email,
    password,
    role,
  }: CreateUserDto): Promise<CreateUserResDto> {
    // create user & hash the password

    try {
      const exists = await this.userRepository.findOne({ where: { email } });

      if (exists) {
        return { ok: false, error: '이미 존재하는 계정입니다.' };
      } else {
        const user = this.userRepository.create({
          email,
          password,
          role,
        });
        const savedUser = await this.userRepository.save(user);

        const verification = this.verificationRepository.create({
          user: savedUser,
        });
        await this.verificationRepository.save(verification);
        this.mailService.sendVerificationEmail(user.email, verification.code);

        return { ok: true };
      }
    } catch (e) {
      // make error
      return { ok: false, error: '이미 존재하는 계정입니다.' };
    }
  }

  async login({ email, password }: LoginReqDto): Promise<LoginResDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          error: '알맞은 회원정보가 없습니다.',
        };
      }
      console.log(user);
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호입니다.',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<UserProfileResDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw Error('해당 유저가 존재하지 않습니다.');
      return {
        ok: true,
        data: user,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updateProfile(
    userId: number,
    { email, password }: UpdateProfileDto,
  ): Promise<CommonRes> {
    try {
      const { data: user } = await this.findById(userId);

      if (email || password) {
        user.verification = false;
        const verification = this.verificationRepository.create({ user });
        await this.verificationRepository.save(verification);
        this.mailService.sendVerificationEmail(user.email, verification.code);
        return {
          ok: true,
        };
      }
      if (email) user.email = email;
      if (password) user.password = password;

      this.userRepository.save(user);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteUser(userId: number): Promise<CommonRes> {
    try {
      await this.userRepository.delete(userId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async verifyUser(code: string): Promise<CommonRes> {
    const verification = await this.verificationRepository.findOne({
      where: {
        code,
      },
      relations: ['user'],
    });

    try {
      if (verification) {
        const user = verification.user;
        user.verification = true;
        await this.userRepository.save(user);
        await this.verificationRepository.delete(verification.id);
        return {
          ok: true,
        };
      }
      throw new Error('잘못된 code 입니다.');
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
