import { Buffer } from 'buffer';
import { AuthPresenter, AuthView } from './AuthPresenter';

export interface RegisterView extends AuthView {
  setImageUrl(url: string): void;
  setImageFileExtension(extension: string): void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private _imageBytes: Uint8Array;

  constructor(view: RegisterView) {
    super(view);
    this._imageBytes = new Uint8Array();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doAuthOperation(async () => {
      return this.service.register(firstName, lastName, alias, password, this.imageBytes, imageFileExtension);
    }, rememberMe);
  }

  protected navigationURL(): string {
    return '/';
  }

  protected operationDescription(): string {
    return 'register user';
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents = imageStringBase64.split('base64,')[1];

        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, 'base64');

        this._imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageFileExtension('');
      this._imageBytes = new Uint8Array();
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split('.').pop();
  }

  public get imageBytes(): Uint8Array {
    return this._imageBytes;
  }
}
