<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import { updateStreamsEvery } from "../../bin/stream/snapshot"

import StreamItem from "../../components/StreamItem.vue"

const { streams } = updateStreamsEvery(5000)
</script>

<template>
  <div class="streams">
    <div class="container">
      <template v-if="streams && streams.length > 0">
        <h1>All streams</h1>

        <div class="streams-list">
          <StreamItem v-for="stream in streams" :key="stream.name" :data="stream" />
        </div>
      </template>
      <template v-else>
        <h1>No streams</h1>
        <img class="no-stream" src="/images/nostream.png" alt="" />
      </template>
    </div>
  </div>
</template>
