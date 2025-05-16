import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DenyRoles } from 'src/auth/deny-roles.decorator';
import { DenyRolesGuard } from 'src/auth/deny-roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // 유저 등록은 ADMIN만 가능
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @All('/auth/register')
  async register(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @All('auth/users/change-role')
  async changeRole(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 인증 없이 열려 있는 경로들
  @All('/auth/tokens/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 인증 없이 열려 있는 경로들
  @All('/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 유저 보상 요청
  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @DenyRoles('AUDITOR') // 감사자는 접근 불가
  @All('/user-event/rewards/:eventId')
  async requestReward(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 수령 가능 보상 목록 조회
  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @DenyRoles('AUDITOR') // 감사자는 접근 불가
  @All('/user-event/rewards/:eventId/available')
  async getAvailableRewards(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  //  관리자 전용 경로 (이벤트 생성, 이벤트 상태 변경, 보상 추가)
  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @All('/admin/events')
  async eventSet(@Req() req, @Res() res) {
    return this.gatewayService.forward(req, res);
  }

  // user 전용 조회
  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @DenyRoles('AUDITOR') // 감사자는 접근 불가
  @All('events/rewards/history/me')
  async getOwnHistory(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 어드민용 전체 이력 조회
  @All('events/rewards/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR')
  async getAllHistory(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @DenyRoles('AUDITOR') // 감사자는 접근 불가
  @All(['/events', '/events/:eventId'])
  async publicRead(@Req() req, @Res() res) {
    return this.gatewayService.forward(req, res);
  }

  // 🔐 기본 인증 보호 (나머지 라우팅 처리)
  @All('*')
  @UseGuards(JwtAuthGuard)
  async proxy(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }
}
