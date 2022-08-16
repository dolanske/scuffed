import { createRouter, createWebHistory } from "vue-router"

import afterEach from "./guards/afterEach"
import beforeEach from "./guards/beforeEach"
import beforeResolve from "./guards/beforeResolve"

import RouterMain from "./routes/router-main"
import RouterUser from "./routes/router-user"
import RouterStream from "./routes/router-stream"

const router = createRouter({
  history: createWebHistory(),
  routes: [...RouterMain, ...RouterUser, ...RouterStream]
})

router.beforeResolve(beforeResolve)
router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
