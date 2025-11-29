import { PagedItemRequest, PagedItemResponse, UserDTO } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: PagedItemRequest<UserDTO>): Promise<PagedItemResponse<UserDTO>> => {
  const followService = new FollowService();

  try {
    const [users, hasMore] = await followService.loadMoreFollowers(
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
      message: error instanceof Error ? error.message : 'Failed to get followers',
      items: [],
      hasMore: false,
    };
  }
};
