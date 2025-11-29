import { PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
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
      users: users,
      hasMore: hasMore,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get followers',
      users: [],
      hasMore: false,
    };
  }
};
