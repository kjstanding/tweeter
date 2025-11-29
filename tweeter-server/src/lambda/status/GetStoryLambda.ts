import { PagedStatusItemRequest, PagedStatusItemResponse } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
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
      statuses: statuses,
      hasMore: hasMore,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get story',
      statuses: [],
      hasMore: false,
    };
  }
};
