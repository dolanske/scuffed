<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

const mode = useColorMode({
  attribute: 'theme',
  modes: {
    light: 'light',
    dark: 'dark',
    tmtu: 'tmtu'
  }
})
</script>

<template>
  <div class="navigation">
    <div class="logo">
      <img src="/images/logo.svg" alt="">
    </div>

    <router-link :to="{ name: 'Main' }">Home</router-link>
    <router-link :to="{ name: 'Streams' }">Streams</router-link>
    <router-link :to="{ name: 'ViewDoc', params: { doc: 'intro' } }">Docs</router-link>

    <router-link class="user-link" :to="{ name: 'Account' }">
      <div class="user-initials">d</div>
      dolanske
    </router-link>
  </div>
</template>
