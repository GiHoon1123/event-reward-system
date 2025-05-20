// src/user-event/infra/kafka/login-event.consumer.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncreaseLoginCountCommand } from 'src/user-event/application/command/increase-login-count.command';
import { UserLoginEventProgressService } from 'src/user-event/application/service/user-login-event-progress.service';

interface LoginEventPayload {
  email: string;
  loginAt: string;
}

@Controller()
export class LoginEventConsumer {
  constructor(
    private readonly userLoginEventProgressService: UserLoginEventProgressService,
  ) {}

  @MessagePattern('login_event')
  async handleLoginEvent(@Payload() message: LoginEventPayload) {
    try {
      console.log('[Consumer] 수신 메시지:', message);

      if (!message.email) {
        throw new Error('email 누락됨');
      }

      const command = new IncreaseLoginCountCommand(message.email);
      await this.userLoginEventProgressService.increaseLoginCount(command);

      console.log('[Consumer] 처리 완료:', message.email);
    } catch (err) {
      console.error('[Consumer] 처리 중 에러 발생:', err);
    }
  }
}
