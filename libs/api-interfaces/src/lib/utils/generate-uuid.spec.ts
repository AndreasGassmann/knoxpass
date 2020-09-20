import { generateGUID } from './generate-uuid';

describe('generateGUID', () => {
  it('should generate a GUID', async () => {
    const res = await generateGUID();
    expect(res.length).toEqual(36);
  });
});
