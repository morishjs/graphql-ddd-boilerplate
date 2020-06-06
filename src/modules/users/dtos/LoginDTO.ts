import { JWTToken, RefreshToken } from '../domain/Jwt';

import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class LoginDTO {
  @Field()
  public userId: string;

  @Field()
  public accessToken: JWTToken;

  @Field()
  public refreshToken: RefreshToken;
}
