import { AuthToken, PagedItemRequest, PostStatusRequest, Status, StatusDTO } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDTO> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDTO> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreStoryItems(request);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus.dto,
    };
    await this.serverFacade.postStatus(request);
  }
}
