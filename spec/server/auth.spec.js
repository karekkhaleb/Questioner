/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import { urlAuth } from './testUtils';

describe('signup api endpoint', () => {
  it('should create the users if all the fields are given', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Buhungiro',
        lastname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    }, (error, response, body) => {
      expect(body.data[0].firstname).toEqual('Buhungiro');
      expect(body.data[0].lastname).toEqual('Caleb');
      expect(body.data[0].email).toEqual('karekkhaleb@gmail.com');
      expect(body.data[0].phoneNumber).toEqual(250722387998);
      expect(body.data[0].userName).toEqual('zoar');
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
  it('should ask for the firstname if absent', (done) => {
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
  it('should ask for the email if absent', (done) => {
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
  it('should ask for the email if absent', (done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Caleb',
        lastname: 'abahungu',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('UserName is required');
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
