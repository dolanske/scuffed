import Stream from "../views/Stream.vue"
import StreamList from "../views/StreamList.vue"

export default [
  {
    path: "/:user",
    name: "Stream",
    component: Stream
  },
  {
    path: "/streams",
    name: "Streams",
    component: StreamList,
    meta: {
      // title: _t("All streams")
      _title: "All streams"
    }
  }
]
