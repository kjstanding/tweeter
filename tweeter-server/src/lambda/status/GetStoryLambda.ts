import { PagedItemRequest, PagedItemResponse, StatusDTO } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';

export const handler = async (request: PagedItemRequest<StatusDTO>): Promise<PagedItemResponse<StatusDTO>> => {
  const statusService = new StatusService();

  try {
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    return {
      success: true,
      message: null,
      items: statuses,
      hasMore: hasMore,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get story',
      items: [],
      hasMore: false,
    };
  }
};
