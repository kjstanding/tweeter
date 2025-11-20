import { AuthToken, User, FakeData, UserDTO } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async follow(
    token: string,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);
    
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async getIsFollowerStatus(token: string, user: User, selectedUser: User): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  private async getFakeData(lastItem: UserDTO | null, pageSize: number, userAlias: string): Promise<[UserDTO[], boolean]> {
    const [users, hasMore] = FakeData.instance.getPageOfUsers(User.fromDTO(lastItem), pageSize, userAlias);
    const userDTOs = users.map(user => user.dto);
    return [userDTOs, hasMore];
  }


}
