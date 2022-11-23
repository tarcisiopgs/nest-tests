import { Test } from '@nestjs/testing';
import { v4 } from 'uuid';

import { prismaMock } from '../../../tests/prisma/singleton';
import { DatabaseService } from '../../core/database/database.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersService],
      providers: [DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(prismaMock)
      .compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be able to get users', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.findMany.mockResolvedValue([
      {
        id,
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
        createdAt,
        updatedAt,
      },
    ]);

    const data = await usersService.getUsers();

    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThanOrEqual(0);
  });

  it('Should be able to get a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.findUnique.mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const data = await usersService.getUser({ id: '1' });

    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
  });

  it('Should be able to create a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.create.mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const data = await usersService.createUser({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
    expect(data.createdAt.getTime()).toEqual(data.updatedAt.getTime());
  });

  it('Should be able to update a user', async () => {
    const id = v4();
    const name = 'John Doe Updated';
    const createdAt = new Date();
    const updatedAt = new Date(createdAt.getTime() + 30 * 60000);

    prismaMock.user.update.mockResolvedValue({
      id,
      email: 'john@doe.com',
      name,
      password: '123456',
      createdAt,
      updatedAt,
    });

    const data = await usersService.updateUser({ id }, { name });

    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
    expect(data.createdAt.getTime()).toBeLessThan(data.updatedAt.getTime());
  });

  it('Should be able to delete a user', async () => {
    const id = v4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    prismaMock.user.delete.mockResolvedValue({
      id,
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
      createdAt,
      updatedAt,
    });

    const data = await usersService.deleteUser({ id });

    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
  });
});
