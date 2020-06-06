import decoder from 'ba64';
import moment from 'moment';
import { env } from '../../env';
import { IImageUploadProvider } from './index';
import * as TE from 'fp-ts/lib/TaskEither';

export default class Local implements IImageUploadProvider {
  public upload(images: string[]): TE.TaskEither<Error, string[]> {
    try {
      const imagePaths: string[] = [];

      images.forEach(image => {
        const filePath = env.imageUploadProvider.local.imageDirPath + '/image_' + moment().format();
        if (!env.isTest && image.match(/data:image/)) {
          decoder.writeImageSync(filePath, image);
        }

        imagePaths.push(filePath);
      });

      return TE.right(imagePaths);
    } catch (e) {
      return TE.left(e.message);
    }
  }

  public uploadByURLs(urls: string[]): TE.TaskEither<Error, string[]> {
    // Do nothing
    return TE.right(urls);
  }

  public delete(imageLinks: string[]): TE.TaskEither<Error, boolean> {
    // Do nothing
    return TE.right(true);
  }
}
