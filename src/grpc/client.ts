import {
  CallOptions,
  Client,
  ClientMiddleware,
  ClientMiddlewareCall,
  createChannel,
  createClientFactory,
  FetchTransport,
  Metadata,
} from "nice-grpc-web";
import { MemoServiceDefinition } from "../../proto/src/proto/api/v1/memo_service";

let memoServiceClient: Client<MemoServiceDefinition>;

async function createMemoServiceClient() {
  const { endpoint, token } = await chrome.storage.sync.get([
    "endpoint",
    "token",
  ]);

  const channel = createChannel(
    endpoint || "http://localhost:5230",
    FetchTransport({
      credentials: "include",
    })
  );

  const loggingMiddleware: ClientMiddleware =
    async function* devtoolsLoggingMiddleware<Request, Response>(
      call: ClientMiddlewareCall<Request, Response>,
      options: CallOptions
    ): AsyncGenerator<Response, Response | void, undefined> {
      const req = call.request;
      let resp;
      try {
        resp = yield* call.next(call.request, options);
        return resp;
      } finally {
        console.log(
          `gRPC to ${call.method.path}\n\nrequest:\n${JSON.stringify(
            req
          )}\n\nresponse:\n${JSON.stringify(resp)}`
        );
      }
    };

  const bearerAuthMiddleware: (token: string) => ClientMiddleware = (token) => {
    return (call, options) =>
      call.next(call.request, {
        ...options,
        metadata: Metadata(options.metadata).set(
          "authorization",
          `Bearer ${token}`
        ),
      });
  };

  const clientFactory = createClientFactory()
    .use(loggingMiddleware)
    .use(bearerAuthMiddleware(token || ""));

  return clientFactory.create(MemoServiceDefinition, channel);
}

export async function getMemoServiceClient() {
  if (!memoServiceClient) {
    memoServiceClient = await createMemoServiceClient();
  }
  return memoServiceClient;
}
