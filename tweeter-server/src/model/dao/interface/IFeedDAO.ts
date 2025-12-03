import { StatusDTO } from 'tweeter-shared';

export interface IFeedDAO {
  addStatusToFeed(userAlias: string, status: StatusDTO): Promise<void>;

  getFeed(userAlias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;

  batchWriteFeedItems(followers: string[], status: StatusDTO): Promise<void>;
}
