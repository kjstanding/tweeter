import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  setIsFollower(isFollower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
  displayErrorMessage(message: string): void;
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private service: UserService;

  constructor(view: UserInfoView) {
    this.service = new UserService();
    this.view = view;
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
    }
  }

  public async setNumFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
    }
  }

  public async setNumFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
    }
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const [followerCount, followeeCount] = await this.service.follow(authToken, displayedUser);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    }
  }

  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const [followerCount, followeeCount] = await this.service.unfollow(authToken, displayedUser);

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    }
  }
}
