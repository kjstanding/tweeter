import { AuthToken, User } from 'tweeter-shared';
import { Presenter, View } from './Presenter';
import { UserService } from '../model/service/UserService';

export interface AuthView extends View {
  updateUserInfo(currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean): void;
  navigate(url: string): void;
}

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
  private _service: UserService;
  private _isLoading: boolean;

  protected constructor(view: T) {
    super(view);
    this._service = new UserService();
    this._isLoading = false;
  }

  protected async doAuthOperation(
    doServiceRequest: () => Promise<[User, AuthToken]>,
    rememberMe: boolean
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      const [user, authToken] = await doServiceRequest();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(this.navigationURL());
    }, this.operationDescription());

    this._isLoading = false;
  }

  protected abstract navigationURL(): string;

  protected abstract operationDescription(): string;

  protected get service(): UserService {
    return this._service;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
