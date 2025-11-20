import { TweeterResponse } from './TweeterResponse';
import { UserDTO } from '../../dto/UserDTO';

export interface PagedUserItemResponse extends TweeterResponse {
  readonly users: UserDTO[];
  readonly hasMore: boolean;
}
