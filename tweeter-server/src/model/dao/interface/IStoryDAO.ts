import { StatusDTO } from 'tweeter-shared';

export interface IStoryDAO {
  addStatusToStory(status: StatusDTO): Promise<void>;

  getStory(authorAlias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]>;
}
