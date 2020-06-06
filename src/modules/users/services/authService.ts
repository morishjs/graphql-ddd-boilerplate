import { JWTClaims, JWTToken, RefreshToken } from '../domain/Jwt';
import { User } from 'modules/users/domain/User';

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  verifyJWT(token: JWTToken): Promise<boolean>;
  createRefreshToken(): RefreshToken;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(email: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}
