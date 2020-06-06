import { Field, ID, ObjectType } from 'type-graphql';
import { JWTToken, RefreshToken } from '../domain/Jwt';

@ObjectType()
export default class User {
  @Field(type => ID)
  public id: string;

  @Field()
  public name: string;

  @Field()
  public email: string;

  @Field()
  public phone: string;

  @Field()
  public gender: string;

  @Field()
  public birthdate: string;

  @Field(type => String, { nullable: true })
  public accessToken?: JWTToken;

  @Field(type => String, { nullable: true })
  public refreshToken?: RefreshToken;
}
