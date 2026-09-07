import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-orado.test/api',
  headers: { Accept: 'application/json' },
})
export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})
export { api }
