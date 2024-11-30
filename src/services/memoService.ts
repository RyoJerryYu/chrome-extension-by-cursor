import { CreateMemoRequest, Memo, Visibility, ListMemoTagsRequest, ListMemoTagsResponse } from '../../proto/src/proto/api/v1/memo_service';
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

  async listTags(): Promise<{[key: string]: number}> {
    const client = await getMemosClient();
    const request: ListMemoTagsRequest = {
      parent: "memos/-", // List all tags
      filter: "",  // No filter
    };

    const response = await client.memo.listMemoTags(request);
    return response.tagAmounts;
  }
}

export const memoService = new MemoService(); 