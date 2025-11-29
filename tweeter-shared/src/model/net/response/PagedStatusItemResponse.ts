import { TweeterResponse } from './TweeterResponse';
import { StatusDTO } from '../../dto/StatusDTO';

export interface PagedStatusItemResponse extends TweeterResponse {
  readonly statuses: StatusDTO[];
  readonly hasMore: boolean;
}
