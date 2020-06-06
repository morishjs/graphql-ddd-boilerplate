import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class SortArgs {
  @Field(type => String, { nullable: true })
  public sort?: 'asc' | 'desc';
}
