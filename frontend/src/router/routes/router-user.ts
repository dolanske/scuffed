import Account from "../views/Account.vue"
import AccountPassword from "../views/AccountPassword.vue"

export default [
  {
    path: "/account",
    name: "Account",
    component: Account
  },
  {
    path: "/account/password",
    name: "Password",
    component: AccountPassword,
    meta: {
      _title: "Change Password"
    }
  }
]
