import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn(() => null),
            findMany: jest.fn(() => null),
            findUnique: jest.fn(() => null),
            update: jest.fn(() => null),
            delete: jest.fn(() => null),
          }),
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('must be able to create a user', async () => {
    const spy = jest.spyOn(usersService, 'create');

    spy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          id: '123',
          email: 'john@doe.com',
          name: 'John Doe',
          password: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    const response = await usersController.create({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(response.data).toHaveProperty('id');

    spy.mockReset();
    spy.mockRestore();
  });

  it('must not be able to create a user', async () => {
    const spy = jest.spyOn(usersService, 'create');

    spy.mockRejectedValue({ error: true });

    try {
      await usersController.create({
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);

      spy.mockReset();
      spy.mockRestore();
    }
  });

  it('must be able to get all users', async () => {
    const spy = jest.spyOn(usersService, 'findMany');

    spy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([]);
      });
    });

    const response = await usersController.findMany();

    expect(response.data).toBeInstanceOf(Array);

    spy.mockReset();
    spy.mockRestore();
  });

  it('must not be able to get all users', async () => {
    const spy = jest.spyOn(usersService, 'findMany');

    spy.mockRejectedValue({ error: true });

    try {
      await usersController.findMany();
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);

      spy.mockReset();
      spy.mockRestore();
    }
  });

  it('must be able to get a user', async () => {
    const spy = jest.spyOn(usersService, 'findUnique');

    spy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          id: '123',
          email: 'john@doe.com',
          name: 'John Doe',
          password: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    const response = await usersController.findUnique({ id: '123' });

    expect(response.data).toHaveProperty('id');

    spy.mockReset();
    spy.mockRestore();
  });

  it('must not be able to get a user', async () => {
    const spy = jest.spyOn(usersService, 'findUnique');

    spy.mockRejectedValue({ error: true });

    try {
      await usersController.findUnique({ id: '123' });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);

      spy.mockReset();
      spy.mockRestore();
    }
  });

  it('must be able to update a user', async () => {
    const spy = jest.spyOn(usersService, 'update');

    spy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          id: '123',
          email: 'john@doe.com',
          name: 'John Doe updated',
          password: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    const response = await usersController.update(
      { id: '123' },
      { name: 'John Doe updated' },
    );

    expect(response.data.name).toContain('updated');

    spy.mockReset();
    spy.mockRestore();
  });

  it('must not be able to update a user', async () => {
    const spy = jest.spyOn(usersService, 'update');

    spy.mockRejectedValue({ error: true });

    try {
      await usersController.update({ id: '123' }, { name: 'John Doe updated' });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);

      spy.mockReset();
      spy.mockRestore();
    }
  });

  it('must be able to delete a user', async () => {
    const spy = jest.spyOn(usersService, 'delete');

    spy.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    });

    const response = await usersController.delete({ id: '123' });

    expect(response).toHaveProperty('message');

    spy.mockReset();
    spy.mockRestore();
  });

  it('must not be able to delete a user', async () => {
    const spy = jest.spyOn(usersService, 'delete');

    spy.mockRejectedValue({ error: true });

    try {
      await usersController.delete({ id: '123' });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);

      spy.mockReset();
      spy.mockRestore();
    }
  });
});
