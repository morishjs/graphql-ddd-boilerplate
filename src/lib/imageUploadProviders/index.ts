import { env } from '../../env';
import Google from './google';
import Local from './local';
import TE from 'fp-ts/lib/TaskEither';

export interface IImageUploadProvider {
  upload(images: string[], makePublic?: boolean): TE.TaskEither<Error, string[]>;
  uploadByURLs(urls: string[]): TE.TaskEither<Error, string[]>;
  delete(imageLinks: string[]): TE.TaskEither<Error, boolean>;
}

export class ImageUploadProviderFactory {
  public static create(): IImageUploadProvider {
    const provider = env.imageUploadProvider.service;

    if (provider === 'google') {
      return new Google();
    } else {
      return new Local();
    }
  }
}
