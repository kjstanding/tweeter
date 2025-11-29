import { FollowRequest, FollowCountResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: FollowRequest): Promise<FollowCountResponse> => {
  const followService = new FollowService();

  try {
    const count = await followService.getFollowerCount(request.token, request.selectedUser);

    return {
      success: true,
      message: null,
      count: count,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get follower count',
      count: 0,
    };
  }
};
