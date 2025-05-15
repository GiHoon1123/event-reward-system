import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // 인증 없이 열려 있는 경로들
  @All('/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 인증 없이 열려 있는 경로들
  @All('/auth/signup')
  async signup(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 인증 없이 열려 있는 경로들
  @All('/tokens/refresh')
  @Public()
  async refresh(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 역할 변경은 ADMIN만 허용
  @All('/users/roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async changeRole(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // user 전용 조회
  @All('/rewards/history/me')
  @UseGuards(JwtAuthGuard)
  async getOwnHistory(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 어드민용 전체 이력 조회
  @All('/rewards/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR', 'AUDITOR')
  async getAllHistory(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 유저 보상 요청
  @All('/user-event/rewards/:eventId')
  @UseGuards(JwtAuthGuard) // ✅ 인증만 필요, 역할 제한 없음
  async requestReward(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 수령 가능 보상 목록 조회
  @All('/user-event/rewards/:eventId/available')
  @UseGuards(JwtAuthGuard) // ✅ 인증만 필요, 역할 제한 없음
  async getAvailableRewards(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  //  관리자 전용 경로
  @All('/admin/events')
  @Roles('ADMIN', 'OPERATOR')
  async createEvent(@Req() req, @Res() res) {
    return this.gatewayService.forward(req, res);
  }

  @All('/admin/events/:eventId/rewards')
  @Roles('ADMIN', 'OPERATOR')
  async addRewards(@Req() req, @Res() res) {
    return this.gatewayService.forward(req, res);
  }

  //  Public 조회 경로
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
