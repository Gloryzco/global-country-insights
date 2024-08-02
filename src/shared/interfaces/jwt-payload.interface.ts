export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtVerifyOptions {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
