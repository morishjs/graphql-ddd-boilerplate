import { Field, Int, ObjectType } from 'type-graphql';
import User from 'modules/users/dtos/UserDTO';

@ObjectType()
export default class Users {
  @Field(type => [User])
  public users: User[];

  @Field(type => Int)
  public total: number;
}
