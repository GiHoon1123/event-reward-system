// src/user-event/infra/kafka/login-event.consumer.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncreaseLoginCountCommand } from 'src/user-event/application/command/increase-login-count.command';
import { UserProgressService } from 'src/user-event/application/service/user-progress.service';

interface LoginEventPayload {
  email: string;
  loginAt: string;
}

@Controller()
export class LoginEventConsumer {
  constructor(private readonly userProgressService: UserProgressService) {}

  @MessagePattern('login_event') // ✅ Kafka 토픽 이름
  async handleLoginEvent(@Payload() message: LoginEventPayload) {
    console.log('[Consumer] 메시지 수신:', message);
    const command = new IncreaseLoginCountCommand(message.email);
    await this.userProgressService.increaseLoginCount(command);
  }
}
