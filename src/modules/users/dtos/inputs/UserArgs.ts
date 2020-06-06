import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class UserArgs {
  @Field(type => String, { nullable: true }) public password: string;
}
