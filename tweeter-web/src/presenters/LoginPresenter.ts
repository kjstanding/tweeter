import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  updateUserInfo(currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean): void;
  displayErrorMessage(message: string): void;
  navigate(url: string): void;
}

export class LoginPresenter {
  private service: UserService;
  private view: LoginView;
  private _isLoading: boolean;
  private originalUrl: string | undefined;

  constructor(view: LoginView, originalUrl: string | undefined) {
    this.service = new UserService();
    this.view = view;
    this._isLoading = false;
    this.originalUrl = originalUrl;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.originalUrl) {
        this.view.navigate(this.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this._isLoading = false;
    }
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
