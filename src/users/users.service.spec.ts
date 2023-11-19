import { Test } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entitiy';
import { VerificationEntity } from './entities/verfication.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<UserEntity>;
  let verificationRepository: MockRepository<VerificationEntity>;
  let mailService: MailService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(VerificationEntity),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get(UserService);
    mailService = module.get<MailService>(MailService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    verificationRepository = module.get(getRepositoryToken(VerificationEntity));
  });

  it('service defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserArg = {
      email: '',
      password: '',
      role: 0,
    };

    it('should fail if user exist', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'sadfasdfasdf',
      });
      const result = await service.createUser(createUserArg);

      console.log(result);

      expect(result).toMatchObject({
        ok: false,
        error: '이미 존재하는 계정입니다.',
      });
    });

    it('should create new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createUserArg);
      userRepository.save.mockResolvedValue(createUserArg);
      verificationRepository.create.mockReturnValue({
        code: 'code',
        user: createUserArg,
      });
      const result = await service.createUser(createUserArg);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createUserArg);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createUserArg);
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createUserArg,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createUserArg,
        code: 'code',
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({ ok: true });
    });
  });
  it.todo('login');
  it.todo('findById');
  it.todo('updateProfile');
  it.todo('deleteUser');
  it.todo('verifyUser');
});
