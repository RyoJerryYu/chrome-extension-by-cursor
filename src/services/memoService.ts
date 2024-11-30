import { CreateMemoRequest, Memo, Visibility } from '../../proto/src/proto/api/v1/memo_service';
import { getMemoServiceClient } from '../grpc/client';

export class MemoService {
  async createMemo(content: string): Promise<Memo> {
    const client = await getMemoServiceClient();
    const request: CreateMemoRequest = {
      content,
      visibility: Visibility.PRIVATE,
      resources: [],
      relations: [],
    };

    return await client.createMemo(request);
  }
}

export const memoService = new MemoService(); 