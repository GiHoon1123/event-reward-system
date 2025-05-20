import { UserLoginEventProgressInfoResponse } from 'src/user-event/application/\bdto/user-login-event-progress-info.response';

describe('UserLoginEventProgressInfoResponse', () => {
  it('로그인 이벤트 진행 정보를 올바르게 저장해야 한다', () => {
    const response = new UserLoginEventProgressInfoResponse('event123', 2, 3);

    expect(response.eventId).toBe('event123');
    expect(response.currentLoginCount).toBe(2);
    expect(response.requiredLoginCount).toBe(3);
  });
});
