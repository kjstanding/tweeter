import { LoginRequest, AuthResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService();

  try {
    const [user, token] = await userService.login(request.alias, request.password);

    return {
      success: true,
      message: null,
      user: user,
      token: token,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
      user: null,
      token: null,
    };
  }
};
