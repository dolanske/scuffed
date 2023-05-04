"use strict"

import { get } from "../fetch"
import { API_URL } from "../config"
import { onUnmounted, reactive, ref } from "vue"
import { StreamItem } from "../../types/stream-types"

// # Snapshot
// https://scuffed.tv/api/streams/dolanske/snapshot

// #Video
// https://scuffed.tv/api/streams/dolanske/video

interface VideoDecoder {
  dstWidth: number
  dstHeight: number
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  video: HTMLVideoElement
}

class VideoDecoder {
  constructor(dstWidth: number, dstHeight: number) {
    this.dstWidth = dstWidth
    this.dstHeight = dstHeight

    this.canvas = document.createElement("canvas")
    this.canvas.width = dstWidth
    this.canvas.height = dstHeight
    this.context = this.canvas.getContext("2d")

    if (this.context) {
      this.context.imageSmoothingEnabled = false
    }

    this.video = document.createElement("video")
    this.video.muted = true
    this.video.crossOrigin = "anonymous" // TODO: maybe remove this? ask jokler
  }

  async decode(url: string): Promise<string> {
    this.video.src = url

    const getFrame = new Promise((resolve, reject) => {
      // This gets a video frame
      this.video
        .play()
        .catch((e) => reject(e))
        .then(() => this.video.pause())

      this.video.onpause = () => {
        let newWidth = this.dstWidth
        let newHeight = this.dstHeight

        if (this.video.videoWidth > this.video.videoHeight) {
          newHeight = (this.dstWidth / this.video.videoWidth) * this.video.videoHeight
        } else {
          newWidth = (this.dstHeight / this.video.videoHeight) * this.video.videoWidth
        }

        this.canvas.width = newWidth
        this.canvas.height = newHeight

        if (this.context) {
          this.context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, newWidth, newHeight) // prettier-ignore
        }

        resolve(this.canvas)
      }
    })

    return await getFrame
      .then((frame: any) => {
        return frame.toDataURL()
      })
      .catch((e) => {
        console.log(e)
        return ""
      })
  }
}

/**
 * Vue composable function which returns the list of streams and their thumbnails every provided <ms>
 *
 * @default frequency is 10 seconds
 */
export function updateStreamsEvery(frequency: number = 10000) {
  const streams = ref<StreamItem[]>([])
  const loading = ref<boolean>(true)

  // Set up interval
  const interval: NodeJS.Timeout = setInterval(updateStreams, frequency)

  // Run once
  updateStreams()

  // Decode thumbnails and assign stream list to reactive variable
  async function updateStreams() {
    streams.value = await get<StreamItem[]>("/stream/")
    loading.value = false
  }

  onUnmounted(() => {
    clearInterval(interval)
  })

  return {
    streams,
    loading
  }
}

/**
 * Fetch stream thumbnail in specified frequency
 */

export const thumbnailDecoder = new VideoDecoder(600, 400)

export function getUpdatedThumbnailEvery(streamObject: StreamItem, frequency: number = 5000) {
  const thumbnail = ref<string>()
  // Set up interval
  const interval: NodeJS.Timeout = setInterval(updateThumbnail, frequency)

  // run once
  updateThumbnail()

  async function updateThumbnail() {
    thumbnail.value = await thumbnailDecoder.decode(
      `${API_URL}/streams/${streamObject.name}/preview`
    )
  }

  onUnmounted(() => {
    clearInterval(interval)
  })

  return {
    thumbnail
  }
}
