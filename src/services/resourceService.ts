import { Resource, CreateResourceRequest } from '../../proto/src/proto/api/v1/resource_service';
import { getMemosClient } from '../grpc/client';

export class ResourceService {
  async createResource(file: File): Promise<Resource> {
    const client = await getMemosClient();
    
    // Read file as bytes
    const content = new Uint8Array(await file.arrayBuffer());
    
    const request: CreateResourceRequest = {
      resource: {
        name: "",
        uid: "",
        filename: file.name,
        content: content,
        externalLink: "",
        type: file.type,
        size: file.size,
        memo: undefined,
      }
    };

    return await client.resource.createResource(request);
  }
}

export const resourceService = new ResourceService(); 