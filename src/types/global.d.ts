declare global {
  interface Window {
    ethereum: any
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }
}
