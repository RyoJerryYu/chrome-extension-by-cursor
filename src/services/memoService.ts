import { CreateMemoRequest, Memo, Visibility } from '../../proto/src/proto/api/v1/memo_service';
import { getMemosClient } from '../grpc/client';

export class MemoService {
  async createMemo(content: string): Promise<Memo> {
    const client = await getMemosClient();
    const request: CreateMemoRequest = {
      content,
      visibility: Visibility.PRIVATE,
    };

    return await client.memo.createMemo(request);
  }
}

export const memoService = new MemoService(); 