import { AuthToken, FollowRequest, IsFollowerStatusRequest, PagedItemRequest, User, UserDTO } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDTO> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDTO> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreFollowees(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: userToFollow.dto,
    };
    return await this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: userToUnfollow.dto,
    };
    return await this.serverFacade.unfollow(request);
  }

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request: IsFollowerStatusRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    return await this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: user.dto,
    };
    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: user.dto,
    };
    return await this.serverFacade.getFollowerCount(request);
  }
}
