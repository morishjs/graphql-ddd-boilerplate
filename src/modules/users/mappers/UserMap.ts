import { User } from 'modules/users/domain/User';
import { User as UserModel } from 'modules/users/infra/User';
import UserDTO from 'modules/users/dtos/UserDTO';
import { Mapper } from 'common/infra/Mapper';
import _ from 'lodash';

export default class UserMap extends Mapper<User> {
  public static async toPersistence(user: User): Promise<UserModel | undefined> {
    const userModel: UserModel = {
      id: user.id.toString(),
      name: user.props.name.value,
      email: user.props.email.value,
      phone: user.props.phone.value,
      password: await user.props.password.getHashedValue(),
      profileDetail: user.profileDetail,
    };

    return userModel;
  }

  public static toDTO(user: User): UserDTO {
    const userDTO: UserDTO = {
      ...user.profileDetail,
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      accessToken: user.props.accessToken,
      refreshToken: user.props.refreshToken,
    };

    return userDTO;
  }

  public static persistenceToDomain(u: UserModel): User {
    return User.create({
      ..._.omit(u, ['profileDetail']),
      ...u.profileDetail,
      passwordHashed: true,
    }).getValue();
  }
}
