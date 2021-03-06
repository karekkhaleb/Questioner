import request from 'request';
import '../../app';
import { urlAuth } from './testUtils';

let defaultUser;
beforeAll((DONE) => {
  request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'default',
      lastname: 'default',
      email: 'default@gmail.com',
      phoneNumber: 250722387998,
      userName: 'default',
      password: 'testpassword',
    },
  }, (error, response, body) => {
    defaultUser = body.data[0].user;
    DONE();
  });
});

describe('signup api endpoint', () => {
  it('should create the users if all the fields are given', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'hello@gmail.com',
        phoneNumber: 250722387998,
        userName: 'testUser',
        password: 'testpassword',
      },
    }, (error, response, body) => {
      expect(body.data[0].user.email).toEqual('hello@gmail.com');
      expect(body.data[0].token).toBeDefined();
      done();
    });
  });
  it('should not allow duplicated emails', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'firstname',
        lastname: 'lastname',
        email: defaultUser.email,
        phoneNumber: 250722387998,
        userName: 'teUser',
        password: 'testpassword',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Email already taken, please chose another one');
      done();
    });
  });
  it('should not allow duplicated emails', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'firstname',
        lastname: 'lastname',
        userName: defaultUser.user_name,
        phoneNumber: 250722387998,
        email: 'teUser@email.com',
        password: 'testpassword',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('userName already taken, please choose another one');
      done();
    });
  });
  it('should ask for the firstname if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        lastname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Firstname is required');
      done();
    });
  });
  it('should ask for the last name if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Lastname is required');
      done();
    });
  });
  it('should ask for the email if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Email is required');
      done();
    });
  });
  it('should ask for a valid email', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        phoneNumber: 250722387998,
        userName: 'zoar',
        email: 'notvalid',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('please enter a valid email address');
      done();
    });
  });
  it('should ask for the phone number if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        email: 'karekkhaleb@gmail.com',
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('PhoneNumber is required');
      done();
    });
  });
  it('should ask for the userName if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        password: 'password',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('UserName is required');
      done();
    });
  });
  it('should ask for the password if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'caleb',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Password is required');
      done();
    });
  });
  it('should tell if the password is too small', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'caleb',
        password: '                                 ',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Password should be at least 3 characters');
      done();
    });
  });
  it('should ask the phone number to be a number', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Buhungiro',
        lastname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 'not a number',
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Phone Number should be a number');
      done();
    });
  });
});
