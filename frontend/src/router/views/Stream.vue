<script setup lang="ts">
import InputSlider from "../../components/form/InputSlider.vue"
import { ref, reactive, onMounted, watch, computed, onBeforeUnmount, onUnmounted } from "vue"
import { isEven } from "../../bin/utils"
import { onKeyStroke, useMagicKeys, whenever } from "@vueuse/core"
//@ts-ignore
import { MseStream } from "../../bin/stream/stream"
import { useRoute } from "vue-router"
import { isArray } from "lodash"

const route = useRoute()

const defaultVolume = Number(localStorage.getItem("stream-vol") ?? 30)
const defaultIncrement = 5
const streamEl = ref<HTMLMediaElement>()
// const stream = ref<Stream>()
let stream: any = null
const user = computed(() => (isArray(route.params.user) ? route.params.user[0] : route.params.user))

onMounted(() => {
  const el = document.querySelector<HTMLMediaElement>("#video")

  // If video element is mounted
  if (el) {
    // Set up and save to reactive var
    streamEl.value = el
    streamEl.value.volume = defaultVolume / 100

    // SECTION Begin streaming
    // startStream(user.value)

    stream = new MseStream(`wss://scuffed.tv/api/streams/${user.value}/video`)
    stream.video = el
    stream.attachStream()
  }
})

onUnmounted(() => {
  // Remove stream before exiting the page
  stream.removeStream()
})

// Video controls
const state = reactive({
  loading: false,
  playing: false,
  UI: true,
  UIHover: false,
  volume: defaultVolume,
  UIVolume: false,
  fullscreen: false
})

const Play = () => (streamEl.value ? streamEl.value.play() : null)
const Pause = () => (streamEl.value ? streamEl.value.pause() : null)

// Mouse movement
let timeout: any

document.addEventListener("mousemove", (e) => {
  clearTimeout(timeout)

  if (state.playing) {
    state.UI = true
    timeout = setTimeout(() => {
      if (!state.UIHover) {
        state.UI = false
        state.UIVolume = false
      }
    }, 2000)
  }
})

watch(
  () => state.playing,
  (val) => {
    if (val) {
    } else {
      state.UI = true
    }
  }
)

/**
 * Keyboard shortcuts & control
 */
const { Equal, Minus, Space } = useMagicKeys()

// Play / pause state
onKeyStroke(["k"], () => {
  if (state.playing) Pause()
  else Play()
})

whenever(Space, () => {
  if (state.playing) Pause()
  else Play()
})

// Controls fullscreen
onKeyStroke(["f"], () => {
  state.fullscreen = !state.fullscreen
})

// Mute volume
let prevVolume: number = 0
onKeyStroke(["m"], () => toggleMute())

function toggleMute() {
  if (state.volume === 0) {
    // Back to previous volume
    state.volume = prevVolume
  } else {
    prevVolume = state.volume
    state.volume = 0
  }
}

whenever(Equal, () => {
  state.volume = Math.min(100, state.volume + defaultIncrement)
})

whenever(Minus, () => {
  state.volume = Math.max(0, state.volume - defaultIncrement)
})

watch(
  // Control stream volume
  () => state.volume,
  (value) => {
    state.UIVolume = true
    localStorage.setItem("stream-volume", String(value))

    if (streamEl.value) {
      streamEl.value.volume = value / 100
    }
  }
)
</script>

<template>
  <div class="stream" :class="{ 'is-fullscreen': state.fullscreen }">
    <router-link
      class="stream-button exit"
      :to="{ name: 'Streams' }"
      data-title-right="Back to stream list"
    >
      <Icon code="west" />
    </router-link>

    <div class="stream-video" :class="{ 'is-full': state.fullscreen }">
      <video
        v-if="true"
        class="video"
        id="video"
        preload="metadata"
        poster=""
        @pause="state.playing = false"
        @play="state.playing = true"
      ></video>

      <template v-else>
        <h2>dolanske is offline</h2>
        <img :src="`/images/${isEven(Date.now()) ? 'nostream2' : 'sleepy'}.png`" alt="" />
        <router-link :to="{ name: 'Streams' }" class="button">Other streams</router-link>
      </template>
    </div>
    <div
      class="stream-controls"
      v-if="streamEl"
      :class="{ active: state.UI }"
      @mouseenter="state.UIHover = true"
      @mouseleave="state.UIHover = false"
    >
      <button class="stream-button" v-show="!state.playing" @click="Play()" data-title-top="Play">
        <Icon code="play_arrow" />
      </button>
      <button class="stream-button" v-show="state.playing" @click="Pause()" data-title-top="Pause">
        <Icon code="pause" />
      </button>

      <button
        class="stream-button"
        @click="state.fullscreen = !state.fullscreen"
        :data-title-top="state.fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
      >
        <Icon :code="state.fullscreen ? 'fullscreen_exit' : 'fullscreen'" />
      </button>

      <!-- @click="state.UIVolume = !state.UIVolume" -->
      <button
        class="stream-button"
        :data-title-top="`Volume (${state.volume}%)`"
        @click="toggleMute()"
      >
        <Icon :code="state.volume === 0 ? 'volume_off' : 'volume_up'" />
      </button>

      <!-- <InputSlider v-if="state.UIVolume" v-model:value="state.volume" /> -->
      <InputSlider v-model:value="state.volume" />

      <!-- <button class="stream-button" data-title-top="Mute"><Icon code="volume_off" /></button> -->
      <!-- <div class="flex-1"></div> -->
      <!-- <button class="stream-button" data-title-top="Open chat"><Icon code="chat" /></button> -->

      <!-- <div class="flex-1"></div> -->

      <div class="divider"></div>

      <span class="stream-button">
        <Icon code="info" />

        <ul class="stream-keyboard-controls">
          <li>
            <div>
              <kbd><span>K | Space</span></kbd>
            </div>

            <p>Toggle Stream</p>
          </li>

          <li>
            <div>
              <kbd><span>F</span></kbd>
            </div>

            <p>Toggle Fullscreen</p>
          </li>

          <li>
            <div>
              <kbd><span>+</span></kbd>
            </div>
            <p>Increase Volume</p>
          </li>

          <li>
            <div>
              <kbd><span>-</span></kbd>
            </div>
            <p>Decrease Volume</p>
          </li>

          <li>
            <div>
              <kbd><span>M</span></kbd>
            </div>
            <p>Mute</p>
          </li>
        </ul>
      </span>
    </div>
  </div>
</template>
