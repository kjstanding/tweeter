import { RegisterRequest, AuthResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
  const userService = new UserService();

  try {
    const [user, token] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user: user,
      token: token,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
      user: null,
      token: null,
    };
  }
};
