import FixtureLoader from '../utils/FixtureLoader';
import { User } from 'modules/users/infra/User';
import { TypeOf } from 'io-ts';
import { StyleProfile } from '../../src/modules/users/domain/User';

interface Params {
  name?: string;
  email?: string;
  password?: string;
  styleProfile?: TypeOf<typeof StyleProfile>;
  isWadizUser?: boolean;
  phone?: string;
}

export default class UserFactory {
  public static async create(options?: Params): Promise<User> {
    return await FixtureLoader.loadFixture('user', {
      props: {
        name: options?.name,
        email: options?.email,
        phone: options?.phone,
        password: options?.password,
        profileDetail: {
          gender: 'female',
          birthdate: '2020/01/01',
          isWadizUser: options?.isWadizUser,
          styleProfile: options?.styleProfile ?? {
            completedStep: 1,
            data: {
              1: {
                rawAnswer: { userAnswer: 'test_answer' },
                questionAndAnswer: { question: 'test_question', answer: 'test_answer' },
              },
            },
            complete: false,
          },
        },
      },
    });
  }
}
