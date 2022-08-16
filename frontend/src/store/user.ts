import { defineStore } from "pinia"

export type User = {
  username: string
}

interface State {
  user: User
  isLogged: boolean
}

export const useUser = defineStore("user", {
  state: () =>
    ({
      user: {},
      isLogged: false
    } as State),
  actions: {},
  getters: {}
})
