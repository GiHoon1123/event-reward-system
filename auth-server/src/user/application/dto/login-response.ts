export class LoginResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
