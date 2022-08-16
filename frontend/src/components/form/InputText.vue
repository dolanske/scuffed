<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import { Error } from "../../bin/validation"

interface Props {
  label?: string
  value: string | number | undefined
  type?: string
  error?: Error
  required?: boolean
  focus?: boolean
}

const self = ref()
const { label, value, type = "text", error, required = false, focus = false } = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:value", value: string): void
}>()

function updateValue(e: any) {
  emit("update:value", e.target.value)
}

onMounted(() => {
  // Autofocus input
  if (focus) {
    // Needs next tick as it wont apply if the DOM was updated just _now_
    nextTick(() => {
      self.value.focus()
    })
  }
})
</script>

<template>
  <div class="form-input" :class="{ 'input-error': error && error.invalid, required: required }">
    <label v-if="label">{{ label }}</label>
    <input
      ref="self"
      v-bind="$attrs"
      tabindex="0"
      class="border-smoke font-14"
      :type="type"
      @input="updateValue"
      :value="value"
    />
    <div class="input-error-list" v-if="error && error.invalid">
      <p v-for="item in error.errors">{{ item }}</p>
    </div>
  </div>
</template>
