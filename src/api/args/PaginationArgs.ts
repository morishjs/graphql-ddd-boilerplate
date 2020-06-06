import { ArgsType, Field, Int } from 'type-graphql';
import { SortArgs } from './SortArgs';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { defaultValue: 1, nullable: true })
  public page;

  @Field(type => Int, { defaultValue: 25, nullable: true })
  public size;
}

@ArgsType()
export class PaginationAndSortArgs extends SortArgs {
  @Field(type => Int, { defaultValue: 1, nullable: true })
  public page;

  @Field(type => Int, { defaultValue: 25, nullable: true })
  public size;
}
