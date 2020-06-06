import * as Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { JWTClaims, JWTToken, RefreshToken } from 'modules/users/domain/Jwt';
import { User } from 'modules/users/domain/User';
import { Inject, Service } from 'typedi';
import { env } from 'env';
import { ObjectLiteral } from 'common/types';
import { IAuthService } from 'modules/users/services/authService';

@Service()
export class RedisAuthService implements IAuthService {
  public jwtHashName = 'activeJwtClients';

  @Inject('cache')
  private redisClient: Redis.Redis;

  public async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
    const keys = await this.redisClient.keys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string> {
    const keys = await this.redisClient.keys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) {
      throw new Error('Username not found for refresh token.');
    }

    const key = keys[0];

    return key.substring(key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1);
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      this.deAuthenticateUser(user.email);
      await this.addToken(user.props.email.value, user.props.refreshToken, user.props.accessToken);
    }
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    await this.clearAllSessions(email);
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      userId: props.userId,
      email: props.email,
    };

    return jwt.sign(claims, env.auth.secret, {
      expiresIn: '1d',
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.auth.secret, (err, decoded) => {
        if (err) {
          return resolve(undefined);
        }
        return resolve(decoded);
      });
    });
  }

  public verifyJWT(accessToken: JWTToken): Promise<boolean> {
    return this.decodeJWT(accessToken).then(d => !!d);
  }

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${email}`);
    return keyValues.map(kv => kv.value);
  }

  private constructKey(email: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  private async addToken(email: string, refreshToken: RefreshToken, token: JWTToken): Promise<any> {
    return await this.redisClient.set(this.constructKey(email, refreshToken), token);
  }

  private async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${email}`);
    const keys = keyValues.map(kv => kv.key);
    return Promise.all(keys.map(key => this.redisClient.del(key)));
  }

  private async getAllKeyValue(wildcard: string): Promise<ObjectLiteral[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.keys(wildcard, async (error: Error, results: string[]) => {
        if (error) {
          return reject(error);
        } else {
          const allResults = await Promise.all(
            results.map(async key => {
              const value = await this.redisClient.get(key);
              return { key, value };
            }),
          );
          return resolve(allResults);
        }
      });
    });
  }
}
