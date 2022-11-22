import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue({
        createUser: jest.fn(() => null),
        getUsers: jest.fn(() => null),
        getUser: jest.fn(() => null),
        updateUser: jest.fn(() => null),
        deleteUser: jest.fn(() => null),
      })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('Success states', () => {
    it('Should be able to get users', async () => {
      jest.spyOn(usersService, 'getUsers').mockImplementationOnce(() => {
        return Promise.resolve([]);
      });

      const response = await usersController.index();

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('data');
      expect(response.data).toBeInstanceOf(Array);
    });

    it('Should be able to get a user', async () => {
      jest
        .spyOn(usersService, 'getUser')
        .mockImplementationOnce(({ id }: GetUserDto) => {
          const now = new Date();

          return Promise.resolve({
            id,
            email: 'john@doe.com',
            name: 'John Doe',
            password: '123456',
            createdAt: now,
            updatedAt: now,
          });
        });

      const response = await usersController.show({ id: '1' });

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('data');
      expect(response.data).toBeInstanceOf(Object);
    });

    it('Should de able to create a user', async () => {
      jest
        .spyOn(usersService, 'createUser')
        .mockImplementationOnce(({ email, name, password }: CreateUserDto) => {
          const now = new Date();

          return Promise.resolve({
            id: '1',
            email,
            name,
            password,
            createdAt: now,
            updatedAt: now,
          });
        });

      const response = await usersController.store({
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
      });

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('data');
      expect(response.data.createdAt.getTime()).toEqual(
        response.data.updatedAt.getTime(),
      );
    });

    it('Should be able to update a user', async () => {
      jest
        .spyOn(usersService, 'updateUser')
        .mockImplementationOnce(
          ({ id }: GetUserDto, { email, name, password }: UpdateUserDto) => {
            const createdAt = new Date();
            const updatedAt = new Date(createdAt.getTime() + 30 * 60000);

            return Promise.resolve({
              id,
              email,
              name,
              password,
              createdAt,
              updatedAt,
            });
          },
        );

      const response = await usersController.update(
        { id: '1' },
        {
          email: 'john_updated@doe.com',
          name: 'John Doe Updated',
          password: '123456789',
        },
      );

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('data');
      expect(response.data.createdAt.getTime()).toBeLessThan(
        response.data.updatedAt.getTime(),
      );
    });

    it('Should be able to delete a user', async () => {
      jest.spyOn(usersService, 'deleteUser').mockImplementationOnce(() => {
        return Promise.resolve();
      });

      const response = await usersController.destroy({ id: '1' });

      expect(response).toHaveProperty('message');
      expect(response).not.toHaveProperty('data');
    });
  });

  describe('Error states', () => {
    it('Should not be able to get users', async () => {
      jest.spyOn(usersService, 'getUsers').mockImplementationOnce(() => {
        return Promise.reject();
      });

      expect(usersController.index()).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('Should not be able to get a user', async () => {
      jest.spyOn(usersService, 'getUser').mockImplementationOnce(() => {
        return Promise.reject();
      });

      expect(usersController.show({ id: '1' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('Should not be able to create a user', async () => {
      jest.spyOn(usersService, 'createUser').mockImplementationOnce(() => {
        return Promise.reject();
      });

      expect(
        usersController.store({
          email: 'john@doe.com',
          name: 'John Doe',
          password: '123456',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('Should not be able to update a user', async () => {
      jest.spyOn(usersService, 'updateUser').mockImplementationOnce(() => {
        return Promise.reject();
      });

      expect(
        usersController.update(
          { id: '1' },
          {
            email: 'john_updated@doe.com',
            name: 'John Doe Updated',
            password: '123456789',
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('Should not be able to delete a user', async () => {
      jest.spyOn(usersService, 'deleteUser').mockImplementationOnce(() => {
        return Promise.reject();
      });

      expect(usersController.destroy({ id: '1' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
