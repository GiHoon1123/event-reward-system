import { IncreaseLoginCountCommand } from 'src/user-event/application/command/increase-login-count.command';
import { UserLoginEventProgressService } from 'src/user-event/application/service/user-login-event-progress.service';
import { LoginEventConsumer } from 'src/user-event/infra/kafaka/login-event.consumer';

describe('LoginEventConsumer', () => {
  let consumer: LoginEventConsumer;
  let service: UserLoginEventProgressService;

  beforeEach(() => {
    service = {
      increaseLoginCount: jest.fn(),
    } as any;

    consumer = new LoginEventConsumer(service);
  });

  it('정상적인 login_event 메시지를 처리할 수 있어야 한다', async () => {
    const payload = {
      email: 'user@example.com',
      loginAt: new Date().toISOString(),
    };

    await consumer.handleLoginEvent(payload);

    expect(service.increaseLoginCount).toHaveBeenCalledWith(
      new IncreaseLoginCountCommand(payload.email),
    );
  });

  it('email이 누락된 메시지는 예외를 발생시키고 처리하지 않아야 한다', async () => {
    const payload = { loginAt: new Date().toISOString() }; // email 누락
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await consumer.handleLoginEvent(payload as any);

    expect(service.increaseLoginCount).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Consumer] 처리 중 에러 발생:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
