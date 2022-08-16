import { RouteLocationNormalized } from "vue-router"

const LABEL = "Scuffed.tv"

export default async function (to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (to?.meta?.title) {
    document.title = String(to.meta.title)
  } else if (to.meta._title) {
    document.title = `${to.meta._title} // ${LABEL}`
  }
}
