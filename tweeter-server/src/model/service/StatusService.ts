import { Status, FakeData, StatusDTO } from 'tweeter-shared';

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem ? Status.fromDTO(lastItem) : null,
      pageSize
    );
    const statusDTOs = statuses.map((status) => status.dto);
    return [statusDTOs, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem ? Status.fromDTO(lastItem) : null,
      pageSize
    );
    const statusDTOs = statuses.map((status) => status.dto);
    return [statusDTOs, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    // TODO: Call the server to post the status
    await new Promise((f) => setTimeout(f, 2000));
  }
}
