import { IpToInt } from './index';

test('Convert "172.168.5.1" to equal 2896692481', () => {
  expect(IpToInt('172.168.5.1')).toBe(2896692481);
});


test('Convert "172 . 168.5.1" to equal 2896692481', () => {
  expect(IpToInt('172 . 168.5.1')).toBe(2896692481);
});


test('Throws on "1 72.168.5.1"', () => {
  expect(() => {
    IpToInt('1 72.168.5.1');
  })
  .toThrow();
});
