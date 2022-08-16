import { merge } from "lodash"

export const rootUrl = "https://scuffed.tv"
export const url = process.env.NODE_ENV === "development" ? "127.0.0.1:8080" : rootUrl

export function get<T = any>(url: string, options?: {}) {
  return _handleFetch(
    url,
    merge(
      {
        method: "GET"
      },
      options
    )
  ) as Promise<T>
}

export function post(url: string, body: object | string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      },
      options
    )
  )
}

export function put(url: string, body: object | string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      },
      options
    )
  )
}

/**
 * Special function to handle file uploads
 */

export function upload(url: string, body: object | string, options?: object) {
  return _handleFetch(url, {
    method: "POST",
    body,
    ...options
  })
}

export function del(url: string, options?: object) {
  return _handleFetch(
    url,
    merge(
      {
        method: "DELETE"
      },
      options
    )
  )
}

// Private handler functions

async function _handleFetch(url: string, options: object) {
  // const token = localStorage.getItem("bearer_token")

  merge(options, {
    mode: "cors"
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  })

  return fetch(rootUrl + url, options).then(_handleResponse)
}

async function _handleResponse(response: Response) {
  console.log(response)

  // Reset on 403
  // if ([401, 403].includes(response.status)) {
  //   localStorage.removeItem("user")
  //   localStorage.removeItem("bearer_token")

  //   setTimeout(() => {
  //     if (window.location.href === "/login") {
  //       window.location.href = "/login"
  //     }

  //     return Promise.reject({
  //       message: "Unexpected issue. Please clear site data, reload and try again."
  //     })
  //   }, 50)
  // }

  return response.json().then((res: {}) => {
    if (!response.ok || response.status !== 200) {
      return Promise.reject({
        status: response.status,
        message: response.statusText,
        data: res
      })
    }

    return res
  })
}
