import { FakeData, PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [users, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    users: users,
    hasMore: hasMore
  };
};
