import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DenyRolesGuard } from 'src/auth/deny-roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  /**
   *
   * jwt 토큰 발급, 재발급 관련 기능들은 누구나 가능하다.
   * 토큰 관련 api
   */
  @All(['/auth/token/refresh', '/auth/token/*'])
  async token(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  /**
   * 로그인은 누구나 가능하다.
   * 로그인 관련 api
   */
  @All('/auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  /**
   * 유저 등록은 ADMIN만 가능하다.
   * 유저 등록 api
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @All('/auth/register/*')
  async register(@Req() req: Request, @Res() res: Response) {
    console.log('[DEBUG] user in req:', (req as any).user);
    await this.gatewayService.forward(req, res);
  }

  /**
   * 유저의 권한 변경은 ADMIN만 가능 하다
   * 권한 변경 api
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @All('auth/users/change-role')
  async changeRole(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  /**
   *
   * 이벤트 생성, 이벤트 보상 등록 활성 및 비활성화 기능은 ADMIN', 'OPERATOR만 가능하다.
   * 이벤트 생성 관련 api
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @All(['/admin/events', '/admin/events*'])
  async eventSet(@Req() req, @Res() res) {
    return this.gatewayService.forward(req, res);
  }

  /**
   *
   * 모든 유저의 이벤트 보상 획득 내역 확인은 ADMIN, AUDITOR만 가능하다
   * 보상 획득 내역 관련 api
   */
  @All('events/rewards/history*')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR')
  async getAllHistory(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  /**
   *
   * 이벤트 진행률 확인, 이벤트 완료 신청, 수령 가능 보상 조회, 이벤트 보상 요청은 ADMIN, USER만 가능하다
   * 이벤트 참여 및 진행 관련 api
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @All(['/events/users', '/events/users/*'])
  async requestReward(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  /**
   *
   * 이벤트 목록 및 상세 조회, 이벤트에 대한 보상 조회는 ADMIN, USER, OPERATOR만가능하다.
   * 이벤트 조회 api
   */
  @UseGuards(JwtAuthGuard, DenyRolesGuard)
  @Roles('AUDITOR')
  @All(['/events', '/events*'])
  async events(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }
}
