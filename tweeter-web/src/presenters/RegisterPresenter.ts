import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
  updateUserInfo(currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean): void;
  displayErrorMessage(message: string): void;
  navigate(url: string): void;
}

export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;
  private _isLoading: boolean;
  private _imageURL: string;
  private _imageBytes: Uint8Array;
  private _imageFileExtension: string;

  constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view;
    this._isLoading = false;
    this._imageURL = "";
    this._imageBytes = new Uint8Array();
    this._imageFileExtension = "";
  }

  public async doRegister(firstName: string, lastName: string, alias: string, password: string, rememberMe: boolean) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this._isLoading = false;
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._imageURL = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");

        this._imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._imageFileExtension = fileExtension;
      }
    } else {
      this._imageURL = "";
      this._imageBytes = new Uint8Array();
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get imageURL(): string {
    return this._imageURL;
  }

  public get imageBytes(): Uint8Array {
    return this._imageBytes;
  }

  public get imageFileExtension(): string {
    return this._imageFileExtension;
  }
}
