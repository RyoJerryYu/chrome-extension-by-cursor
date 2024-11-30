// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               unknown
// source: api/v1/inbox_service.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Empty } from "../../google/protobuf/empty";
import { FieldMask } from "../../google/protobuf/field_mask";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "memos.api.v1";

export interface Inbox {
  /**
   * The name of the inbox.
   * Format: inboxes/{id}
   */
  name: string;
  /** Format: users/{id} */
  sender: string;
  /** Format: users/{id} */
  receiver: string;
  status: Inbox_Status;
  createTime?: Date | undefined;
  type: Inbox_Type;
  activityId?: number | undefined;
}

export enum Inbox_Status {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  UNREAD = "UNREAD",
  ARCHIVED = "ARCHIVED",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function inbox_StatusFromJSON(object: any): Inbox_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return Inbox_Status.STATUS_UNSPECIFIED;
    case 1:
    case "UNREAD":
      return Inbox_Status.UNREAD;
    case 2:
    case "ARCHIVED":
      return Inbox_Status.ARCHIVED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Inbox_Status.UNRECOGNIZED;
  }
}

export function inbox_StatusToJSON(object: Inbox_Status): string {
  switch (object) {
    case Inbox_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case Inbox_Status.UNREAD:
      return "UNREAD";
    case Inbox_Status.ARCHIVED:
      return "ARCHIVED";
    case Inbox_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function inbox_StatusToNumber(object: Inbox_Status): number {
  switch (object) {
    case Inbox_Status.STATUS_UNSPECIFIED:
      return 0;
    case Inbox_Status.UNREAD:
      return 1;
    case Inbox_Status.ARCHIVED:
      return 2;
    case Inbox_Status.UNRECOGNIZED:
    default:
      return -1;
  }
}

export enum Inbox_Type {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  MEMO_COMMENT = "MEMO_COMMENT",
  VERSION_UPDATE = "VERSION_UPDATE",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function inbox_TypeFromJSON(object: any): Inbox_Type {
  switch (object) {
    case 0:
    case "TYPE_UNSPECIFIED":
      return Inbox_Type.TYPE_UNSPECIFIED;
    case 1:
    case "MEMO_COMMENT":
      return Inbox_Type.MEMO_COMMENT;
    case 2:
    case "VERSION_UPDATE":
      return Inbox_Type.VERSION_UPDATE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Inbox_Type.UNRECOGNIZED;
  }
}

export function inbox_TypeToJSON(object: Inbox_Type): string {
  switch (object) {
    case Inbox_Type.TYPE_UNSPECIFIED:
      return "TYPE_UNSPECIFIED";
    case Inbox_Type.MEMO_COMMENT:
      return "MEMO_COMMENT";
    case Inbox_Type.VERSION_UPDATE:
      return "VERSION_UPDATE";
    case Inbox_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function inbox_TypeToNumber(object: Inbox_Type): number {
  switch (object) {
    case Inbox_Type.TYPE_UNSPECIFIED:
      return 0;
    case Inbox_Type.MEMO_COMMENT:
      return 1;
    case Inbox_Type.VERSION_UPDATE:
      return 2;
    case Inbox_Type.UNRECOGNIZED:
    default:
      return -1;
  }
}

export interface ListInboxesRequest {
  /** Format: users/{id} */
  user: string;
}

export interface ListInboxesResponse {
  inboxes: Inbox[];
}

export interface UpdateInboxRequest {
  inbox?: Inbox | undefined;
  updateMask?: string[] | undefined;
}

export interface DeleteInboxRequest {
  /**
   * The name of the inbox to delete.
   * Format: inboxes/{id}
   */
  name: string;
}

function createBaseInbox(): Inbox {
  return {
    name: "",
    sender: "",
    receiver: "",
    status: Inbox_Status.STATUS_UNSPECIFIED,
    createTime: undefined,
    type: Inbox_Type.TYPE_UNSPECIFIED,
    activityId: undefined,
  };
}

export const Inbox: MessageFns<Inbox> = {
  encode(message: Inbox, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }
    if (message.receiver !== "") {
      writer.uint32(26).string(message.receiver);
    }
    if (message.status !== Inbox_Status.STATUS_UNSPECIFIED) {
      writer.uint32(32).int32(inbox_StatusToNumber(message.status));
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(toTimestamp(message.createTime), writer.uint32(42).fork()).join();
    }
    if (message.type !== Inbox_Type.TYPE_UNSPECIFIED) {
      writer.uint32(48).int32(inbox_TypeToNumber(message.type));
    }
    if (message.activityId !== undefined) {
      writer.uint32(56).int32(message.activityId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Inbox {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInbox();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.sender = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.receiver = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.status = inbox_StatusFromJSON(reader.int32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.createTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.type = inbox_TypeFromJSON(reader.int32());
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.activityId = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Inbox {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      receiver: isSet(object.receiver) ? globalThis.String(object.receiver) : "",
      status: isSet(object.status) ? inbox_StatusFromJSON(object.status) : Inbox_Status.STATUS_UNSPECIFIED,
      createTime: isSet(object.createTime) ? fromJsonTimestamp(object.createTime) : undefined,
      type: isSet(object.type) ? inbox_TypeFromJSON(object.type) : Inbox_Type.TYPE_UNSPECIFIED,
      activityId: isSet(object.activityId) ? globalThis.Number(object.activityId) : undefined,
    };
  },

  toJSON(message: Inbox): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.receiver !== "") {
      obj.receiver = message.receiver;
    }
    if (message.status !== Inbox_Status.STATUS_UNSPECIFIED) {
      obj.status = inbox_StatusToJSON(message.status);
    }
    if (message.createTime !== undefined) {
      obj.createTime = message.createTime.toISOString();
    }
    if (message.type !== Inbox_Type.TYPE_UNSPECIFIED) {
      obj.type = inbox_TypeToJSON(message.type);
    }
    if (message.activityId !== undefined) {
      obj.activityId = Math.round(message.activityId);
    }
    return obj;
  },

  create(base?: DeepPartial<Inbox>): Inbox {
    return Inbox.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Inbox>): Inbox {
    const message = createBaseInbox();
    message.name = object.name ?? "";
    message.sender = object.sender ?? "";
    message.receiver = object.receiver ?? "";
    message.status = object.status ?? Inbox_Status.STATUS_UNSPECIFIED;
    message.createTime = object.createTime ?? undefined;
    message.type = object.type ?? Inbox_Type.TYPE_UNSPECIFIED;
    message.activityId = object.activityId ?? undefined;
    return message;
  },
};

function createBaseListInboxesRequest(): ListInboxesRequest {
  return { user: "" };
}

export const ListInboxesRequest: MessageFns<ListInboxesRequest> = {
  encode(message: ListInboxesRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ListInboxesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListInboxesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListInboxesRequest {
    return { user: isSet(object.user) ? globalThis.String(object.user) : "" };
  },

  toJSON(message: ListInboxesRequest): unknown {
    const obj: any = {};
    if (message.user !== "") {
      obj.user = message.user;
    }
    return obj;
  },

  create(base?: DeepPartial<ListInboxesRequest>): ListInboxesRequest {
    return ListInboxesRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListInboxesRequest>): ListInboxesRequest {
    const message = createBaseListInboxesRequest();
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseListInboxesResponse(): ListInboxesResponse {
  return { inboxes: [] };
}

export const ListInboxesResponse: MessageFns<ListInboxesResponse> = {
  encode(message: ListInboxesResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.inboxes) {
      Inbox.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ListInboxesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListInboxesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.inboxes.push(Inbox.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListInboxesResponse {
    return {
      inboxes: globalThis.Array.isArray(object?.inboxes) ? object.inboxes.map((e: any) => Inbox.fromJSON(e)) : [],
    };
  },

  toJSON(message: ListInboxesResponse): unknown {
    const obj: any = {};
    if (message.inboxes?.length) {
      obj.inboxes = message.inboxes.map((e) => Inbox.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<ListInboxesResponse>): ListInboxesResponse {
    return ListInboxesResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListInboxesResponse>): ListInboxesResponse {
    const message = createBaseListInboxesResponse();
    message.inboxes = object.inboxes?.map((e) => Inbox.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateInboxRequest(): UpdateInboxRequest {
  return { inbox: undefined, updateMask: undefined };
}

export const UpdateInboxRequest: MessageFns<UpdateInboxRequest> = {
  encode(message: UpdateInboxRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.inbox !== undefined) {
      Inbox.encode(message.inbox, writer.uint32(10).fork()).join();
    }
    if (message.updateMask !== undefined) {
      FieldMask.encode(FieldMask.wrap(message.updateMask), writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UpdateInboxRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateInboxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.inbox = Inbox.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.updateMask = FieldMask.unwrap(FieldMask.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateInboxRequest {
    return {
      inbox: isSet(object.inbox) ? Inbox.fromJSON(object.inbox) : undefined,
      updateMask: isSet(object.updateMask) ? FieldMask.unwrap(FieldMask.fromJSON(object.updateMask)) : undefined,
    };
  },

  toJSON(message: UpdateInboxRequest): unknown {
    const obj: any = {};
    if (message.inbox !== undefined) {
      obj.inbox = Inbox.toJSON(message.inbox);
    }
    if (message.updateMask !== undefined) {
      obj.updateMask = FieldMask.toJSON(FieldMask.wrap(message.updateMask));
    }
    return obj;
  },

  create(base?: DeepPartial<UpdateInboxRequest>): UpdateInboxRequest {
    return UpdateInboxRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UpdateInboxRequest>): UpdateInboxRequest {
    const message = createBaseUpdateInboxRequest();
    message.inbox = (object.inbox !== undefined && object.inbox !== null) ? Inbox.fromPartial(object.inbox) : undefined;
    message.updateMask = object.updateMask ?? undefined;
    return message;
  },
};

function createBaseDeleteInboxRequest(): DeleteInboxRequest {
  return { name: "" };
}

export const DeleteInboxRequest: MessageFns<DeleteInboxRequest> = {
  encode(message: DeleteInboxRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DeleteInboxRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteInboxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteInboxRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: DeleteInboxRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteInboxRequest>): DeleteInboxRequest {
    return DeleteInboxRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteInboxRequest>): DeleteInboxRequest {
    const message = createBaseDeleteInboxRequest();
    message.name = object.name ?? "";
    return message;
  },
};

export type InboxServiceDefinition = typeof InboxServiceDefinition;
export const InboxServiceDefinition = {
  name: "InboxService",
  fullName: "memos.api.v1.InboxService",
  methods: {
    /** ListInboxes lists inboxes for a user. */
    listInboxes: {
      name: "ListInboxes",
      requestType: ListInboxesRequest,
      requestStream: false,
      responseType: ListInboxesResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          578365826: [
            new Uint8Array([17, 18, 15, 47, 97, 112, 105, 47, 118, 49, 47, 105, 110, 98, 111, 120, 101, 115]),
          ],
        },
      },
    },
    /** UpdateInbox updates an inbox. */
    updateInbox: {
      name: "UpdateInbox",
      requestType: UpdateInboxRequest,
      requestStream: false,
      responseType: Inbox,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([17, 105, 110, 98, 111, 120, 44, 117, 112, 100, 97, 116, 101, 95, 109, 97, 115, 107])],
          578365826: [
            new Uint8Array([
              39,
              58,
              5,
              105,
              110,
              98,
              111,
              120,
              50,
              30,
              47,
              97,
              112,
              105,
              47,
              118,
              49,
              47,
              123,
              105,
              110,
              98,
              111,
              120,
              46,
              110,
              97,
              109,
              101,
              61,
              105,
              110,
              98,
              111,
              120,
              101,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
    /** DeleteInbox deletes an inbox. */
    deleteInbox: {
      name: "DeleteInbox",
      requestType: DeleteInboxRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([4, 110, 97, 109, 101])],
          578365826: [
            new Uint8Array([
              26,
              42,
              24,
              47,
              97,
              112,
              105,
              47,
              118,
              49,
              47,
              123,
              110,
              97,
              109,
              101,
              61,
              105,
              110,
              98,
              111,
              120,
              101,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
  },
} as const;

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create(base?: DeepPartial<T>): T;
  fromPartial(object: DeepPartial<T>): T;
}
