import { AuthToken, User } from 'tweeter-shared';
import { FollowService } from '../model/service/FollowService';
import { MessageView, Presenter } from './Presenter';

export interface UserInfoView extends MessageView {
  setIsFollower(isFollower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;
  private _isLoading: boolean;

  constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
    this._isLoading = false;
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
      }
    }, 'determine follower status');
  }

  public async setNumFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    }, 'get followees count');
  }

  public async setNumFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    }, 'get followers count');
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(authToken, displayedUser);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, 'follow user');

    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.unfollow(authToken, displayedUser);

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, 'unfollow user');

    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
