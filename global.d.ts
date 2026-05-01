import { ZodType } from 'zod';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toMatchSchema(schema: ZodType): Promise<R>;
    }
  }
}
