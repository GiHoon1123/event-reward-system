// test/unit/auth/public.decorator.spec.ts

import 'reflect-metadata';
import { Public, IS_PUBLIC_KEY } from 'src/auth/public.decorator';

describe('Public 데코레이터', () => {
  it('메서드에 isPublic 메타데이터가 true로 설정되어야 한다', () => {
    class TestController {
      @Public()
      testMethod() {}
    }

    const metadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestController.prototype.testMethod,
    );

    expect(metadata).toBe(true);
  });
});
