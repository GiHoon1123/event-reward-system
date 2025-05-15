// src/gateway/gateway.controller.ts
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

  // 🔓 인증 없이 열려 있는 경로들
  @All('/auth/login')
  @Public()
  async login(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  @All('/auth/signup')
  @Public()
  async signup(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 🔐 인증 + 역할 검증이 필요한 경로
  @All('/auth/change-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async changeRole(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }

  // 🔐 그 외 모든 경로에 기본 인증 적용
  @All('*')
  @UseGuards(JwtAuthGuard)
  async proxy(@Req() req: Request, @Res() res: Response) {
    await this.gatewayService.forward(req, res);
  }
}
