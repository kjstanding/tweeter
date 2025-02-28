import { AuthToken } from 'tweeter-shared';
import { UserService } from '../model/service/UserService';
import { MessageView, Presenter } from './Presenter';

export interface AppNavbarView extends MessageView {
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private service: UserService;

  constructor(view: AppNavbarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage('Logging Out...', 0);
      await this.service.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, 'log user out');
  }
}
