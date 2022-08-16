export interface Source {
  statsContainer: string
  streamUri: string

  // Websocked
  websocket: WebSocket
  videoStarted: boolean

  hasStartedStream: boolean
  hasInFlightUpdates: boolean
  previousBufferRemoval: number

  targetBuffer: number
  frames: []

  controller: AbortController
}

export class Source {
  constructor(url: string) {
    this.streamUri = url
    this.videoStarted = false
    this.hasStartedStream = false
    this.hasInFlightUpdates = false
    this.targetBuffer = 0.5
    // this.stats = new StreamStatistics(this);
    this.frames = []
    this.previousBufferRemoval = performance.now()
  }

  /**
   * Start a stream
   */

  public attachStream() {
    this.controller = new AbortController()
    const signal = this.controller.signal

    // LOG.debug(`Connecting to '${this.streamUri}'`);

    // if (this.onconnectstart != null) {
    //     this.onconnectstart();
    // }

    // this.videoElement.addEventListener("playing", (e) => LOG.debug("playing"), { signal: signal });
    // this.videoElement.addEventListener("pause", (e) => LOG.warn("pause"), { signal: signal });
    // this.videoElement.addEventListener("waiting", (e) => LOG.warn("waiting"), { signal: signal });
    // this.videoElement.addEventListener("stalled", (e) => LOG.warn("stalled"), { signal: signal });
    // this.videoElement.addEventListener("suspend", (e) => LOG.warn("suspend"), { signal: signal });
    // this.videoElement.addEventListener("error", (e) => LOG.error("error"), { signal: signal });

    this.webSocket = new WebSocket(this.streamUri)
    this.webSocket.binaryType = "arraybuffer"

    this.webSocket.addEventListener("close", this.webSocketClose.bind(this), { signal })
    this.webSocket.addEventListener("error", this.webSocketError.bind(this), { signal })
    this.webSocket.addEventListener("open", this.webSocketOpen.bind(this), { signal })
    this.webSocket.addEventListener("message", this.webSocketMessage.bind(this), { signal })

    this.stats.createStatsContainer()
  }
}
