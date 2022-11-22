import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

import { DatabaseService } from '../../core/database/database.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let databaseService: DatabaseService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersService],
      providers: [DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        user: {
          create: jest.fn(() => null),
          findMany: jest.fn(() => null),
          findUnique: jest.fn(() => null),
          update: jest.fn(() => null),
          delete: jest.fn(() => null),
        },
      })
      .compile();

    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('Success states', () => {
    it('Should be able to get users', async () => {
      jest
        .spyOn(databaseService.user, 'create')
        .mockImplementationOnce(
          ({ data: { email, name, password } }: any): any => {
            const now = new Date();
            const user: User = {
              id: '1',
              email,
              name,
              password,
              createdAt: now,
              updatedAt: now,
            };

            return Promise.resolve(user);
          },
        );

      const data = await usersService.createUser({
        email: 'john@doe.com',
        name: 'John Doe',
        password: '123456',
      });

      expect(data).toHaveProperty('id');
    });

    // it('must not be able to create a user', async () => {
    //   const spy = jest.spyOn(usersService, 'create');

    //   spy.mockRejectedValue(null);

    //   try {
    //     await usersController.create({
    //       email: 'john@doe.com',
    //       name: 'John Doe',
    //       password: '123456',
    //     });
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);
    //   }

    //   spy.mockReset();
    //   spy.mockRestore();
    // });

    // it('must be able to get all users', async () => {
    //   const response = await usersController.findMany();

    //   expect(response.data).toEqual(
    //     expect.arrayContaining<User>([
    //       expect.objectContaining({ id: expect.stringContaining('-') }),
    //     ]),
    //   );
    // });

    // it('must not be able to get all users', async () => {
    //   const spy = jest.spyOn(usersService, 'findMany');

    //   spy.mockRejectedValue(null);

    //   try {
    //     await usersController.findMany();
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);
    //   }

    //   spy.mockReset();
    //   spy.mockRestore();
    // });

    // it('must be able to get a user', async () => {
    //   const { id } = users[0];

    //   const response = await usersController.findUnique({ id });

    //   expect(response.data).toEqual(
    //     expect.objectContaining({ id: expect.stringContaining('-') }),
    //   );
    // });

    // it('must not be able to get a user', async () => {
    //   const { id } = users[0];
    //   const spy = jest.spyOn(usersService, 'findUnique');

    //   spy.mockRejectedValue(null);

    //   try {
    //     await usersController.findUnique({ id });
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);
    //   }

    //   spy.mockReset();
    //   spy.mockRestore();
    // });

    // it('must be able to update a user', async () => {
    //   const { id } = users[0];

    //   const response = await usersController.update(
    //     { id },
    //     { name: 'John Doe updated' },
    //   );

    //   expect(response.data).toHaveProperty('id');
    // });

    // it('must not be able to update a user', async () => {
    //   const { id } = users[0];
    //   const spy = jest.spyOn(usersService, 'update');

    //   spy.mockRejectedValue(null);

    //   try {
    //     await usersController.update({ id }, { name: 'John Doe updated' });
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);
    //   }

    //   spy.mockReset();
    //   spy.mockRestore();
    // });

    // it('must not be able to delete a user', async () => {
    //   const { id } = users[0];
    //   const spy = jest.spyOn(usersService, 'delete');

    //   spy.mockRejectedValue(null);

    //   try {
    //     await usersController.delete({ id });
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);

    //     spy.mockReset();
    //     spy.mockRestore();
    //   }
    // });

    // it('must be able to delete a user', async () => {
    //   const { id } = users[0];

    //   const response = await usersController.delete({ id });

    //   expect(response).toHaveProperty('message');
    // });
  });

  describe('Error states', () => {});
});
