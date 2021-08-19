class HttpError extends Error {
  response: any
  data: any
  status: any
}

export default async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(input, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    if (response.ok) {
      return data
    }

    const error = new HttpError(response.statusText)
    error.status = response.status
    error.response = response
    error.data = data
    throw error
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message }
    }
    error.status = 500
    throw error
  }
}
