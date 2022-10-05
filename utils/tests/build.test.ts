import { build } from '../src/build';

describe('build', () => {
  it('should do the build', async () => {
    const result = await build(`
      import { msg } from 'msg';
      console.log(msg);
    `, {
      'msg': 'export const msg = "hello world";',
    });
    
    expect(result.includes('const msg = "hello world";')).toBe(true);
    expect(result.includes('console.log(msg);')).toBe(true);
  });
});
