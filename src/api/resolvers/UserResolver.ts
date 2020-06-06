import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Container, Service } from 'typedi';
import { isLeft } from 'fp-ts/lib/Either';
import { GraphQLError } from 'graphql';
import { CreateUserUseCase } from 'modules/users/useCases/createUser';
import { UserInput } from 'modules/users/dtos/inputs/UserInput';
import UserDTO from 'modules/users/dtos/UserDTO';
import {
  ACTIVE_STYLING_ORDER_EXISTS,
  DOMAIN_VALIDATION_FAIL,
  EMAIL_ALREADY_TAKEN,
  NOT_AUTHENTICATED,
  PASSWORD_NOT_MATCH,
  PHONE_DUPLICATION,
  toMessageWithCode,
  USER_NOT_EXIST,
} from 'lib/graphql/error-codes';
import { LoginUseCase } from 'modules/users/useCases/login';
import { Context } from 'api/Context';
import { GetUserUseCase } from '../../modules/users/useCases/getUser';
import { IdToken } from '../../modules/users/domain/Jwt';
import { UserWithdrawalUseCase } from 'modules/users/useCases/withdrawal';
import { ChangeUserInfoUseCase } from '../../modules/users/useCases/changeUserInfo';
import UserArgs from '../../modules/users/dtos/inputs/UserArgs';
import LoginDTO from '../../modules/users/dtos/LoginDTO';
import { PaginationArgs } from '../args/PaginationArgs';
import { FindByUserOptions, FindOptions, GetUsersUseCase } from '../../modules/users/useCases/getUsers';
import Users from 'modules/users/dtos/Users';
import { fromNullable, getFirstMonoid, isNone, none } from 'fp-ts/lib/Option';
import { VerifyTokenUseCase } from '../../modules/users/useCases/verifyToken';

@Service()
@Resolver()
export class UserResolver {
  @Query(returns => Boolean)
  public async verifyToken(@Arg('userId') userId: string, @Arg('accessToken') accessToken: string): Promise<boolean> {
    const useCase = Container.get(VerifyTokenUseCase);
    const resultOrError = await useCase.execute({ userId, accessToken });

    if (isLeft(resultOrError)) {
      return new GraphQLError(resultOrError.left.errorMessage());
    }

    return resultOrError.right;
  }

  @Query(returns => UserDTO)
  public async getUser(
    @Ctx() context: Context,
    @Arg('userId', { nullable: true }) userId?: string,
    @Arg('withStylingOrders', { nullable: true }) withStylingOrders?: boolean,
  ): Promise<UserDTO> {
    const container = context.container;
    const optionalTokenUserId = container.has('token') ? fromNullable(container.get<IdToken>('token').userId) : none;
    const optionalUserId = getFirstMonoid<string>().concat(optionalTokenUserId, fromNullable(userId));

    if (isNone(optionalUserId)) {
      return new GraphQLError(toMessageWithCode(NOT_AUTHENTICATED));
    }
    const useCase = Container.get<GetUserUseCase>(GetUserUseCase);
    const resultOrError = await useCase.execute({ userId: optionalUserId.value, withStylingOrders });

    if (isLeft(resultOrError)) {
      return new GraphQLError(resultOrError.left.errorMessage());
    }

    return resultOrError.right;
  }

  @Query(returns => Users)
  public async getUsers(@Args() paginationArgs: PaginationArgs): Promise<Users> {
    const useCase = Container.get(GetUsersUseCase);
    const resultOrError = await useCase.execute({ paginationArgs } as FindOptions);

    if (isLeft(resultOrError)) {
      return new GraphQLError(resultOrError.left.errorMessage());
    }

    return resultOrError.right;
  }

  @Query(returns => Users)
  public async getUsersByName(@Arg('userName', { nullable: true }) userName?: string): Promise<Users> {
    const useCase = Container.get(GetUsersUseCase);
    const resultOrError = await useCase.execute({ userName } as FindByUserOptions);

    if (isLeft(resultOrError)) {
      return new GraphQLError(resultOrError.left.errorMessage());
    }

    return resultOrError.right;
  }

  @Mutation(returns => UserDTO)
  public async createUser(@Arg('user') user: UserInput): Promise<UserDTO> {
    const useCase = Container.get(CreateUserUseCase);
    const newUserError = await useCase.execute(user);

    if (isLeft(newUserError)) {
      const error = newUserError.left;

      switch (error.constructor.name) {
        case 'DomainCreationError': {
          return new GraphQLError(toMessageWithCode(DOMAIN_VALIDATION_FAIL, error.errorMessage()));
        }
        case 'EmailDuplication': {
          return new GraphQLError(toMessageWithCode(EMAIL_ALREADY_TAKEN, error.errorMessage()));
        }
        case 'PhoneDuplication': {
          return new GraphQLError(toMessageWithCode(PHONE_DUPLICATION, error.errorMessage()));
        }
        default: {
          return new GraphQLError(newUserError.left.errorMessage());
        }
      }
    } else {
      return newUserError.right;
    }
  }

  @Mutation(returns => LoginDTO)
  public async login(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<LoginDTO> {
    const useCase = Container.get(LoginUseCase);
    const tokenOrError = await useCase.execute({ email, password });

    if (isLeft(tokenOrError)) {
      const error = tokenOrError.left;

      switch (error.constructor.name) {
        case 'PasswordNotMatch': {
          return new GraphQLError(toMessageWithCode(PASSWORD_NOT_MATCH, error.errorMessage()));
        }
        case 'ModelNotExist': {
          return new GraphQLError(toMessageWithCode(USER_NOT_EXIST, error.errorMessage()));
        }
        default: {
          return new GraphQLError(tokenOrError.left.errorMessage());
        }
      }
    } else {
      return tokenOrError.right;
    }
  }

  @Mutation(returns => String)
  public async userWithDrawal(@Ctx() ctx: Context): Promise<string> {
    const useCase = Container.get(UserWithdrawalUseCase);
    const result = await useCase.execute(ctx.container.get('token'));

    if (isLeft(result)) {
      const error = result.left;

      switch (error.constructor.name) {
        case 'ActiveStylingOrderExist': {
          return new GraphQLError(toMessageWithCode(ACTIVE_STYLING_ORDER_EXISTS, error.errorMessage()));
        }
        default:
          return new GraphQLError(error.errorMessage());
      }
    }
    ctx.response.cookie('token', '');
    return result.right;
  }

  @Mutation(returns => Boolean)
  public async changeUserInfo(
    @Ctx() ctx: Context,
    @Args() userArgs: UserArgs,
    @Arg('userId', { nullable: true }) userId?: string,
  ): Promise<boolean> {
    const useCase = Container.get(ChangeUserInfoUseCase);
    const result = await useCase.execute({ userId: userId || ctx.container.get<IdToken>('token').userId, ...userArgs });

    if (isLeft(result)) {
      return new GraphQLError(result.left.errorMessage());
    }

    return result.right;
  }
}
