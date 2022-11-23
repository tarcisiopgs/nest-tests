import { Test } from '@nestjs/testing';
import { v4 } from 'uuid';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const serviceMock = {
  createUser: jest.fn(() => null),
  getUsers: jest.fn(() => null),
  getUser: jest.fn(() => null),
  updateUser: jest.fn(() => null),
  deleteUser: jest.fn(() => null),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(serviceMock)
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be able to get users', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    jest.spyOn(usersService, 'getUsers').mockResolvedValue([
      {
        id,
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
        createdAt,
        updatedAt,
      },
    ]);

    const response = await usersController.index();

    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThanOrEqual(0);
  });

  it('Should be able to get a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    jest.spyOn(usersService, 'getUser').mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const response = await usersController.show({ id });

    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
  });

  it('Should de able to create a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    jest.spyOn(usersService, 'createUser').mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const response = await usersController.store({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
    expect(response.data.createdAt.getTime()).toEqual(
      response.data.updatedAt.getTime(),
    );
  });

  it('Should be able to update a user', async () => {
    const id = v4();
    const name = 'John Doe Updated';
    const createdAt = new Date();
    const updatedAt = new Date(createdAt.getTime() + 30 * 60000);

    jest.spyOn(usersService, 'updateUser').mockResolvedValue({
      id,
      email: 'john@doe.com',
      name,
      password: '123456',
      createdAt,
      updatedAt,
    });

    const response = await usersController.update({ id }, { name });

    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
    expect(response.data.createdAt.getTime()).toBeLessThan(
      response.data.updatedAt.getTime(),
    );
  });

  it('Should be able to delete a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    jest.spyOn(usersService, 'deleteUser').mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const response = await usersController.destroy({ id });

    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
  });

  it('Should not be able to get users', async () => {
    jest.spyOn(usersService, 'getUsers').mockRejectedValue(null);

    await expect(usersController.index()).rejects.toThrow();
  });

  it('Should not be able to get a user', async () => {
    const id = v4();

    jest.spyOn(usersService, 'getUser').mockRejectedValue(null);

    await expect(usersController.show({ id })).rejects.toThrow();
  });

  it('Should not be able to create a user', async () => {
    jest.spyOn(usersService, 'createUser').mockRejectedValue(null);

    await expect(
      usersController.store({
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toThrow();
  });

  it('Should not be able to update a user', async () => {
    const id = v4();
    const name = 'John Doe Updated';

    jest.spyOn(usersService, 'updateUser').mockRejectedValue(null);

    await expect(usersController.update({ id }, { name })).rejects.toThrow();
  });

  it('Should not be able to delete a user', async () => {
    const id = v4();
    jest.spyOn(usersService, 'deleteUser').mockRejectedValue(null);

    await expect(usersController.destroy({ id })).rejects.toThrow();
  });
});
