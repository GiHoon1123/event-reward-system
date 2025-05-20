import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryLockManager {
  private readonly locks = new Map<string, boolean>();

  acquire(key: string): boolean {
    if (this.locks.has(key)) return false;
    this.locks.set(key, true);
    return true;
  }

  release(key: string): void {
    this.locks.delete(key);
  }

  isLocked(key: string): boolean {
    return this.locks.has(key);
  }
}
