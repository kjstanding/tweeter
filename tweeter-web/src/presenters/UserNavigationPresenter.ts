import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  setDisplayedUser(user: User): void;
  displayErrorMessage(message: string): void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private service: UserService;

  constructor(view: UserNavigationView) {
    this.service = new UserService();
    this.view = view;
  }

  public async navigateToUser(targetString: string, currentUser: User, authToken: AuthToken): Promise<void> {
    try {
      const alias = this.extractAlias(targetString);

      const user = await this.service.getUser(authToken, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
