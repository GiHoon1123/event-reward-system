import 'reflect-metadata';
import { DenyRoles } from 'src/auth/deny-roles.decorator';

describe('DenyRoles 데코레이터', () => {
  it('메서드에 denyRoles 메타데이터가 정확히 설정되어야 한다', () => {
    class TestClass {
      @DenyRoles('AUDITOR', 'GUEST')
      testMethod() {}
    }

    // Reflect API를 통해 메타데이터를 가져온다
    const metadata = Reflect.getMetadata(
      'denyRoles',
      TestClass.prototype.testMethod,
    );

    // 기대한 대로 메타데이터가 설정되었는지 확인
    expect(metadata).toEqual(['AUDITOR', 'GUEST']);
  });
});
