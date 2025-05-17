import 'reflect-metadata';
import { Roles } from 'src/auth/roles.decorator';

describe('Roles 데코레이터', () => {
  it('메서드에 roles 메타데이터가 정확히 설정되어야 한다', () => {
    class TestClass {
      @Roles('ADMIN', 'USER')
      testMethod() {}
    }

    // Reflect API로 메타데이터 조회
    const metadata = Reflect.getMetadata(
      'roles',
      TestClass.prototype.testMethod,
    );

    // 설정한 역할 목록이 그대로 들어가 있는지 확인
    expect(metadata).toEqual(['ADMIN', 'USER']);
  });
});
