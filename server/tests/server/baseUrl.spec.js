import request from 'request';
import '../../app';
import { baseUrl } from './testUtils';

describe('Testing the base url', () => {
  it('should give a proper api endpoint', (done) => {
    request(baseUrl, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
