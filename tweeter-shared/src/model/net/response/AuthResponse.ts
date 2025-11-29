import { TweeterResponse } from './TweeterResponse';
import { UserDTO } from '../../dto/UserDTO';

export interface AuthResponse extends TweeterResponse {
  readonly user: UserDTO | null;
  readonly token: string | null;
}
