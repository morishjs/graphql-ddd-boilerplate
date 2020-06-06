import { Context } from '../../../api/Context';
import { fromNullable, none, Option } from 'fp-ts/lib/Option';

export interface JWTClaims {
  userId: string;
  email: string;
}

export type JWTToken = string;

export type RefreshToken = string;

export interface IdToken {
  userId: string;
  accessToken: JWTToken;
  refreshToken?: JWTToken;
}

export function getTokenFromCtx(context: Context): Option<IdToken> {
  const container = context.container;
  return container.has('token') ? fromNullable(container.get<IdToken>('token')) : none;
}
