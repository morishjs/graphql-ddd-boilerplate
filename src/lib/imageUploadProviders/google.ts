import * as uuid from 'uuid';
import { env } from '../../env';
import { IImageUploadProvider } from './index';
import { Bucket, File, SaveOptions, Storage } from '@google-cloud/storage';
import Jimp from 'jimp';
import * as TE from 'fp-ts/lib/TaskEither';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import _ from 'lodash';

export default class Google implements IImageUploadProvider {
  private bucket: Bucket;
  private readonly writeOptions: SaveOptions;

  constructor() {
    const storage = new Storage();
    this.bucket = storage.bucket(env.imageUploadProvider.google.bucketName);
    this.writeOptions = {
      metadata: {
        contentType: 'image/jpeg',
      },
    };
  }

  public upload(images: string[], makePublic?: boolean): TE.TaskEither<Error, string[]> {
    const uploadImages = pipe(
      images,
      A.map(img => this.put(img, makePublic)),
      A.array.sequence(TE.taskEither),
    );
    return TE.map((files: File[]) => files.map(file => this.getPublicURL(file)))(uploadImages);
  }

  public uploadByURLs(urls: string[]): TE.TaskEither<Error, string[]> {
    const imageURLs = pipe(
      urls,
      A.map(url => this.uploadByURL(url)),
    );

    return A.array.sequence(TE.taskEither)(imageURLs);
  }

  public delete(imageLinks: string[]): TE.TaskEither<Error, boolean> {
    const files = pipe(
      imageLinks,
      A.map((imageLink: string) => this.getFileName(imageLink)),
      A.map((fileName: string) => this.bucket.file(fileName)),
    );

    return TE.tryCatch(
      async () => {
        for (const file of files) {
          const [isExistingFile] = await file.exists();
          if (isExistingFile) {
            await file.delete();
          }
        }

        return true;
      },
      reason => new Error(String(reason)),
    );
  }

  private uploadByURL(url: string): TE.TaskEither<Error, string> {
    const file = this.bucket.file(`${this.generateFileName()}.jpeg`);

    const getPublicURL = pipe(
      TE.tryCatch(
        () => Jimp.read(url),
        reason => new Error(String(reason)),
      ),
      TE.chain(img =>
        TE.tryCatch(
          () => img.getBufferAsync('image/jpeg'),
          reason => new Error(String(reason)),
        ),
      ),
      TE.chain(buf =>
        TE.tryCatch(
          () => file.save(buf, this.writeOptions),
          reason => new Error(String(reason)),
        ),
      ),
      TE.map(() => this.getPublicURL(file)),
    );

    return getPublicURL;
  }

  private put(image: string, makePublic?: boolean): TE.TaskEither<Error, File> {
    const file = this.bucket.file(`${this.generateFileName()}.jpeg`);
    const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    return TE.tryCatch(
      () => file.save(buf, _.merge(this.writeOptions, { public: makePublic })).then(() => file),
      reason => new Error(String(reason)),
    );
  }

  private getFileName(imageLink: string): string {
    const bucketName = env.imageUploadProvider.google.bucketName;
    const regStr = '.*/' + `${bucketName}` + '/(.*.jpeg)?';
    const reg = new RegExp(regStr);

    return imageLink.match(reg)[1];
  }

  private generateFileName(): string {
    return uuid.v4();
  }

  private getPublicURL(file: File): string {
    return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
  }
}
