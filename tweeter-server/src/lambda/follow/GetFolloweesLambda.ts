import { PagedItemRequest, PagedItemResponse, UserDTO } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: PagedItemRequest<UserDTO>): Promise<PagedItemResponse<UserDTO>> => {
  const followService = new FollowService();

  try {
    const [users, hasMore] = await followService.loadMoreFollowees(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    return {
      success: true,
      message: null,
      items: users,
      hasMore: hasMore,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get followees',
      items: [],
      hasMore: false,
    };
  }
};
