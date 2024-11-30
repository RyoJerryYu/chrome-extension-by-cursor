import {
  CallOptions,
  ClientMiddleware,
  ClientMiddlewareCall,
  createChannel,
  createClientFactory,
  FetchTransport,
  Metadata,
} from "nice-grpc-web";
import { MemoServiceDefinition } from "../../proto/src/proto/api/v1/memo_service";

const channel = createChannel(
  "http://localhost:5230", // Update this to your backend URL
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
  .use(bearerAuthMiddleware("eyJhbGciOiJIUzI1NiIsImtpZCI6InYxIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiUnlvSmVycnlZdSIsImlzcyI6Im1lbW9zIiwic3ViIjoiMSIsImF1ZCI6WyJ1c2VyLmFjY2Vzcy10b2tlbiJdLCJpYXQiOjE3MTY1Mzk2MTF9.03Wn892HSe8vtS4hiQeGfZ1cwyko5l8xJ3kH_AlYeuE"));

export const memoServiceClient = clientFactory.create(
  MemoServiceDefinition,
  channel
);
