<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue"
import { StreamItem } from "../types/stream-types"
import { getDurationSince } from "../bin/utils"
import { getUpdatedThumbnailEvery } from "../bin/stream/snapshot"

const props = defineProps<{
  data: StreamItem
}>()

const { thumbnail } = getUpdatedThumbnailEvery(props.data, 3000)
</script>

<template>
  <router-link class="stream-item" :to="{ name: 'Stream', params: { user: props.data.name } }">
    <div class="stream-thumbnail">
      <img :src="thumbnail" alt="" />
    </div>

    <div class="stream-info">
      <strong>{{ props.data.name }}</strong>

      <span>{{ props.data.viewers }} views</span>
      <div class="divider"></div>
      <!-- <span>Streaming for {{ time }} </span> -->
    </div>
  </router-link>
</template>
