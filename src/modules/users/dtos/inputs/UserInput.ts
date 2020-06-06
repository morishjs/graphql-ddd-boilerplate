import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field() public email: string;

  @Field() public phone: string;

  @Field() public name: string;

  @Field() public password: string;

  @Field(type => [String], { nullable: true }) public selectboxReasons?: string[];

  @Field(type => String) public gender: string;

  @Field(type => Boolean, { nullable: true }) public isWadizUser?: boolean;

  @Field(type => String) public birthdate: string;

  @Field({ nullable: true }) public allowMarketing?: boolean;
}
