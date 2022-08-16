<script setup lang="ts">
import InputSlider from "../../components/form/InputSlider.vue"
import { ref, reactive, onMounted, watch } from "vue"
import { isEven } from "../../bin/utils"
import { onKeyStroke, useMagicKeys, whenever } from "@vueuse/core"
import { Stream } from "../../bin/stream/stream"

const defaultVolume = Number(localStorage.getItem("stream-vol") ?? 30)
const defaultIncrement = 5
const streamEl = ref<HTMLMediaElement>()
const stream = ref<Stream>()

onMounted(() => {
  const el = document.querySelector<HTMLMediaElement>("#video")

  if (el) {
    streamEl.value = el
    streamEl.value.volume = defaultVolume / 100
  }
})

// Video controls
const state = reactive({
  playing: false,
  UI: true,
  UIHover: false,
  volume: defaultVolume,
  UIVolume: false
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

onKeyStroke(["k"], () => {
  if (state.playing) Pause()
  else Play()
})

whenever(Space, () => {
  if (state.playing) Pause()
  else Play()
})

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
  <div class="stream">
    <router-link
      class="stream-button exit"
      :to="{ name: 'Streams' }"
      data-title-right="Back to stream list"
    >
      <Icon code="west" />
    </router-link>

    <div class="stream-video">
      <video
        v-if="true"
        class="video"
        id="video"
        preload="metadata"
        poster=""
        @pause="state.playing = false"
        @play="state.playing = true"
      >
        <source src="/test.mp4" type="video/mp4" />
      </video>

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
        :data-title-top="`Volume (${state.volume}%)`"
        @click="state.UIVolume = !state.UIVolume"
      >
        <Icon :code="state.volume === 0 ? 'volume_off' : 'volume_up'" />
      </button>

      <InputSlider v-if="state.UIVolume" v-model:value="state.volume" />

      <!-- <button class="stream-button" data-title-top="Mute"><Icon code="volume_off" /></button> -->
      <!-- <div class="flex-1"></div> -->
      <!-- <button class="stream-button" data-title-top="Open chat"><Icon code="chat" /></button> -->

      <!-- <div class="flex-1"></div> -->
    </div>
  </div>
</template>
