const me = {
  name: 'caleb',
  age: 26,
  job: 'softdev',
};

describe('testing my name', () => {
  it('should be my name', () => {
    expect(me.name).toEqual('caleb');
  });
  it('should have the apropriate age', () => {
    expect(me.age).toBe(26);
  });
});
