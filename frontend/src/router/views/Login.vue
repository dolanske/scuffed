<script setup lang="ts">
import InputText from "../../components/form/InputText.vue"
import { reactive, computed } from "vue"
import { useFormValidation, required, minLength } from "../../bin/validation.js"
import { useRouter } from "vue-router"

const router = useRouter()

/**
 * Signing in
 */

const form = reactive({
  username: "",
  password: ""
})

const rules = computed(() => ({
  username: {
    required
  },
  password: {
    required,
    minLength: minLength(3)
  }
}))

const { errors, validate, reset } = useFormValidation(form, rules, { autoclear: true })

async function submit() {
  validate()
    .then(async () => {
      // Submit
      if (form.username && form.password) {
        // Do auth
        console.log("kinda ok")
        router.push({ name: "StreamList" })
      }
    })
    .catch((errors) => {
      console.log("test", errors)
    })
}
</script>

<template>
  <div class="login">
    <div class="login-container">
      <!-- <img :src="`/images/logo.svg`" alt="" /> -->

      <h1>Scuffed.<b class="brand-gradient">tv</b></h1>
      <form @submit.prevent="submit">
        <InputText
          focus
          type="text"
          label="Name"
          v-model:value="form.username"
          placeholder="Username"
          :error="errors.username"
        />
        <InputText
          type="password"
          label="Password"
          v-model:value="form.password"
          placeholder="VerySecurePassword1"
          :error="errors.password"
        />
      </form>

      <button class="button" @click="submit">&nbsp; Sign In &nbsp;</button>
    </div>
  </div>
</template>
