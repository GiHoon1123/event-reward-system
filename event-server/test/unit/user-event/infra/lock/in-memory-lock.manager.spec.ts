import { InMemoryLockManager } from 'src/user-event/infra/lock/in-memory-lock.manager';

describe('InMemoryLockManager', () => {
  let lockManager: InMemoryLockManager;

  beforeEach(() => {
    lockManager = new InMemoryLockManager();
  });

  it('acquire() - 처음 요청은 true를 반환해야 한다', () => {
    const result = lockManager.acquire('key1');
    expect(result).toBe(true);
    expect(lockManager.isLocked('key1')).toBe(true);
  });

  it('acquire() - 이미 잠긴 키는 false를 반환해야 한다', () => {
    lockManager.acquire('key1');
    const result = lockManager.acquire('key1');
    expect(result).toBe(false);
  });

  it('release() - 락 해제 후 다시 acquire 가능해야 한다', () => {
    lockManager.acquire('key1');
    lockManager.release('key1');
    const result = lockManager.acquire('key1');
    expect(result).toBe(true);
  });

  it('isLocked() - 잠긴 키 여부를 반환해야 한다', () => {
    expect(lockManager.isLocked('key1')).toBe(false);
    lockManager.acquire('key1');
    expect(lockManager.isLocked('key1')).toBe(true);
  });
});
