import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface RegisterView {
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
  displayErrorMessage(message: string): void;
  navigate(url: string): void;
}

export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;
  private _isLoading: boolean;

  constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view;
    this._isLoading = false;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this._isLoading = false;
    }
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
