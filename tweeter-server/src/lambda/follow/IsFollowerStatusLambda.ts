import { IsFollowerStatusRequest, IsFollowerStatusResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: IsFollowerStatusRequest): Promise<IsFollowerStatusResponse> => {
  const followService = new FollowService();

  try {
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
      success: true,
      message: null,
      isFollower: isFollower,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to check follower status',
      isFollower: false,
    };
  }
};
