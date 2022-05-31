import { IncomingMessage, ServerResponse } from "http";

export interface SSEEvent<T = any> {
  id?: string;
  event: string;
  data: T;
}

export class SSEStore {
  private store: Record<string, SSE>;

  constructor() {
    this.store = {};
  }

  public getStream(streamId: string) {
    return this.store[streamId];
  }

  public getAllStreams() {
    return Object.values(this.store);
  }

  public addStream(streamId: string, stream: SSE) {
    this.store[streamId] = stream;
  }

  public deleteStream(streamId: string) {
    delete this.store[streamId];
  }

  public getStore() {
    return this.store;
  }
}

export class SSE {
  private req: IncomingMessage;
  private res: ServerResponse;

  constructor(req: IncomingMessage, res: ServerResponse, onClose?: Function) {
    this.res = res;
    this.req = req;

    this.res.writeHead(200, this.getInitialHeaders());
    this.req.on("close", () => onClose());
  }

  public send<T>(event: SSEEvent<T>) {
    const eventString = this.stringifyEvent(event);
    this.res.write(eventString);
  }

  private stringifyEvent<T>(event: SSEEvent<T>) {
    return `id: ${event.id}\nevent: ${event.event}\ndata: ${JSON.stringify(
      event.data
    )}\n\n`;
  }

  private getInitialHeaders() {
    return {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
  }
}
