import { createChannel, createClientFactory, FetchTransport } from "nice-grpc-web";
import { MemoServiceDefinition } from "../../proto/src/proto/api/v1/memo_service";

const channel = createChannel(
  'http://localhost:8080',  // Update this to your backend URL
  FetchTransport({
    credentials: "include",
  })
);

const clientFactory = createClientFactory();

export const memoServiceClient = clientFactory.create(MemoServiceDefinition, channel); 