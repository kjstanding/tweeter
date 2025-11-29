import { FollowRequest, FollowResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const followService = new FollowService();

  try {
    const [followerCount, followeeCount] = await followService.follow(request.token, request.selectedUser);

    return {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Follow failed',
      followerCount: 0,
      followeeCount: 0,
    };
  }
};
