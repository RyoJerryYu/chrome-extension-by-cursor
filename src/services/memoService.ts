import { CreateMemoRequest, Memo, Visibility } from '../../proto/src/proto/api/v1/memo_service';
import { memoServiceClient } from '../grpc/client';

export class MemoService {
  async createMemo(content: string): Promise<Memo> {
    const request: CreateMemoRequest = {
      content,
      visibility: Visibility.PUBLIC,
      resources: [],
      relations: [],
    };

    return await memoServiceClient.createMemo(request);
  }
}

export const memoService = new MemoService(); 