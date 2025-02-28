import { AuthPresenter, AuthView } from './AuthPresenter';

export class LoginPresenter extends AuthPresenter<AuthView> {
  private originalUrl: string | undefined;

  constructor(view: AuthView, originalUrl: string | undefined) {
    super(view);
    this.originalUrl = originalUrl;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    await this.doAuthOperation(async () => {
      return this.service.login(alias, password);
    }, rememberMe);
  }

  protected navigationURL(): string {
    if (!!this.originalUrl) {
      return this.originalUrl;
    } else {
      return '/';
    }
  }

  protected operationDescription(): string {
    return 'log user in';
  }
}
