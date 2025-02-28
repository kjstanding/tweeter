import { AuthToken, User } from 'tweeter-shared';
import { UserService } from '../model/service/UserService';
import { Presenter, View } from './Presenter';

export interface UserNavigationView extends View {
  setDisplayedUser(user: User): void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private service: UserService;

  constructor(view: UserNavigationView) {
    super(view);
    this.service = new UserService();
  }

  public async navigateToUser(targetString: string, currentUser: User, authToken: AuthToken): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(targetString);

      const user = await this.service.getUser(authToken, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, 'get user');
  }

  private extractAlias(value: string): string {
    const index = value.indexOf('@');
    return value.substring(index);
  }
}
