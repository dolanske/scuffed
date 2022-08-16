import Main from "../views/Home.vue"
import Docs from "../views/Docs.vue"
import Login from "../views/Login.vue"
import DocsViewer from "../views/DocsViewer.vue"

export default [
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Main" }
  },
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: {
      title: "Scuffed.tv // budget streams"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      _title: "Log in"
    }
  },
  {
    path: "/documentation/",
    name: "Docs",
    component: Docs,
    meta: {
      title: "Documentation"
    },
    children: [
      {
        path: "/documentation/:doc",
        name: "ViewDoc",
        component: DocsViewer
      }
    ]
  }
]
