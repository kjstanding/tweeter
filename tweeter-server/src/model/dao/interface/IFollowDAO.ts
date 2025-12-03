import { UserDTO } from 'tweeter-shared';

export interface IFollowDAO {
  follow(follower: UserDTO, followee: UserDTO): Promise<void>;

  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;

  isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean>;

  getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollower: UserDTO | null
  ): Promise<[UserDTO[], boolean]>;

  getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFollowee: UserDTO | null
  ): Promise<[UserDTO[], boolean]>;

  getFollowerCount(followeeAlias: string): Promise<number>;

  getFolloweeCount(followerAlias: string): Promise<number>;

  getAllFollowers(followeeAlias: string): Promise<string[]>;
}
