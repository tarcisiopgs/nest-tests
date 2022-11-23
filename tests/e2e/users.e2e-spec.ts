import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { exec } from 'child_process';

import { AppModule } from '../../src/app.module';

describe('[END-TO-END] UsersController', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      exec('yarn prisma migrate reset -f', (error, stdout) => {
        if (error) reject(error);

        resolve(stdout);
      });
    });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  describe('[POST] /users', () => {
    it('Should be able to create a user', (done) => {
      request(app.getHttpServer())
        .post('/users')
        .send({ email: 'john@doe.com', name: 'John', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((error, response) => {
          if (error) return done(error);

          userId = response.body.data.id;

          return done();
        });
    });

    it('Should not be able to create a user with an invalid email address', (done) => {
      request(app.getHttpServer())
        .post('/users')
        .send({ email: 'johndoe.com', name: 'John', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain('email must be an email');

          return done();
        });
    });

    it('Should not be able to create a user with a name containing numbers', (done) => {
      request(app.getHttpServer())
        .post('/users')
        .send({ email: 'john@doe.com', name: 'John123', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain(
            'name must contain only letters (a-zA-Z)',
          );

          return done();
        });
    });

    it('Should not be able to create a user with a short password', (done) => {
      request(app.getHttpServer())
        .post('/users')
        .send({ email: 'john@doe.com', name: 'John', password: '12345' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain(
            'password must be longer than or equal to 6 characters',
          );

          return done();
        });
    });
  });

  describe('[GET] /users', () => {
    it('Should be able to get users', (done) => {
      request(app.getHttpServer())
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data.length).toBeGreaterThanOrEqual(0);

          return done();
        });
    });
  });

  describe('[GET] /users/:id', () => {
    it('Should be able to get a user', (done) => {
      request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Object);
          expect(response.body.data).toHaveProperty('id');
          expect(response.body.data).toHaveProperty('createdAt');
          expect(response.body.data).toHaveProperty('updatedAt');

          return done();
        });
    });

    it('Should not be able to get a user with a wrong id', (done) => {
      request(app.getHttpServer())
        .get('/users/123')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain('id must be a UUID');

          return done();
        });
    });
  });

  describe('[PUT] /users/:id', () => {
    it('Should be able to update a user', (done) => {
      request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ email: 'john_updated@doe.com' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Object);
          expect(response.body.data).toHaveProperty('id');
          expect(response.body.data).toHaveProperty('createdAt');
          expect(response.body.data).toHaveProperty('updatedAt');

          return done();
        });
    });

    it('Should not be able to update a user with an invalid email address', (done) => {
      request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ email: 'johndoe.com', name: 'John', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain('email must be an email');

          return done();
        });
    });

    it('Should not be able to update a user with a name containing numbers', (done) => {
      request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ email: 'john@doe.com', name: 'John123', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain(
            'name must contain only letters (a-zA-Z)',
          );

          return done();
        });
    });

    it('Should not be able to update a user with a short password', (done) => {
      request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({ email: 'john@doe.com', name: 'John', password: '12345' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain(
            'password must be longer than or equal to 6 characters',
          );

          return done();
        });
    });

    it('Should not be able to update a user with a wrong id', (done) => {
      request(app.getHttpServer())
        .put('/users/123')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain('id must be a UUID');

          return done();
        });
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('Should be able to delete a user', (done) => {
      request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Object);
          expect(response.body.data).toHaveProperty('id');
          expect(response.body.data).toHaveProperty('createdAt');
          expect(response.body.data).toHaveProperty('updatedAt');

          return done();
        });
    });

    it('Should not be able to delete a user with a wrong id', (done) => {
      request(app.getHttpServer())
        .delete('/users/123')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((error, response) => {
          if (error) return done(error);

          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBeInstanceOf(Array);
          expect(response.body.message).toContain('id must be a UUID');

          return done();
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      exec('yarn prisma migrate reset -f', (error, stdout) => {
        if (error) reject(error);

        resolve(stdout);
      });
    });
  });
});
