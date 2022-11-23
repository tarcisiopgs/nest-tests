import { Test } from '@nestjs/testing';
import { v4 } from 'uuid';

import { DatabaseService } from '../../core/database/database.service';
import { prismaMock } from '../../../tests/mocks/prisma/singleton';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(prismaMock)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('Should be able to get users', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.findMany.mockResolvedValueOnce([
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

    prismaMock.user.findUnique.mockResolvedValueOnce({
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

  it('Should be able to create a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.create.mockResolvedValueOnce({
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

    prismaMock.user.update.mockResolvedValueOnce({
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

    prismaMock.user.delete.mockResolvedValueOnce({
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
    prismaMock.user.findMany.mockRejectedValueOnce(null);

    await expect(usersController.index()).rejects.toThrow();
  });

  it('Should not be able to get a user', async () => {
    const id = v4();

    prismaMock.user.findUnique.mockRejectedValueOnce(null);

    await expect(usersController.show({ id })).rejects.toThrow();
  });

  it('Should not be able to create a user', async () => {
    prismaMock.user.create.mockRejectedValueOnce(null);

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

    prismaMock.user.update.mockRejectedValueOnce(null);

    await expect(usersController.update({ id }, { name })).rejects.toThrow();
  });

  it('Should not be able to delete a user', async () => {
    const id = v4();

    prismaMock.user.delete.mockRejectedValueOnce(null);

    await expect(usersController.destroy({ id })).rejects.toThrow();
  });
});
