import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 'asdfasfda', email, password }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('nikunj@gmail.com', 'gaurinik');
    expect(user.password).not.toEqual('gaurinik');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 'as', email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdfasd@gmail.com', 'aasdfads.asdfasd'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 'asdfas', email: 'asdfads', password: 'asdfasd' } as User,
      ]);

    await expect(service.signin('asdf@gmail.com', 'asdfas')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('provides a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 'asdfas',
          email: 'gauri@gmaill.comm	',
          password:
            '85d35ddbf49fdb7d.07dceb059bf0632d7b13b00738b4279a6c75e467e2d4aaf3bbfbd0295909c3cb',
        } as User,
      ]);

    const user = service.signin('gauri@gmaill.comm	', 'Nikunj@gauri3232');

    expect(user).toBeDefined();
  });
});
