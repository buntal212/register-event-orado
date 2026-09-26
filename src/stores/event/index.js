import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

export const useEventStore = defineStore('event', {
  state: () => ({
    loading: false,
    items: [],
    hasNextPage: true,
    loadingBagan: false,
    event: null,
    peserta: [],
    pasangan: [],
    params: {
      page: 1,
      per_page: 10,
      search: null,
    },
  }),

  actions: {
    async getData(append = false) {
      if (this.loading) return false

      this.loading = true

      try {
        const response = await api.get('/v3/event/list', { params: this.params })
        const data = response.data?.data ?? {}
        const items = data.data ?? []

        this.items = append ? [...this.items, ...items] : items
        this.hasNextPage = Boolean(data.next_page_url)

        return true
      } catch (error) {
        if (!append) this.items = []
        this.hasNextPage = false
        Notify.create({
          type: 'negative',
          position: 'top',
          message: error.response?.data?.message || 'Data event tidak dapat dimuat.',
        })

        return false
      } finally {
        this.loading = false
      }
    },

    async loadNextPage() {
      if (!this.hasNextPage || this.loading) return false

      this.params.page += 1
      const berhasil = await this.getData(true)
      if (!berhasil) this.params.page -= 1

      return berhasil
    },

    async resetData() {
      this.params.page = 1
      this.items = []
      this.hasNextPage = true

      return this.getData()
    },

    async getBagan(eventId) {
      this.loadingBagan = true
      this.event = null
      this.peserta = []
      this.pasangan = []

      try {
        const response = await api.get(`/v3/event/list/${eventId}/bagan`)
        this.event = response.data?.data?.event ?? null
        this.peserta = response.data?.data?.peserta ?? []
        this.pasangan = response.data?.data?.pasangan ?? []
      } catch (error) {
        Notify.create({
          type: 'negative',
          position: 'top',
          message: error.response?.data?.message || 'Bagan turnamen tidak dapat dimuat.',
        })
      } finally {
        this.loadingBagan = false
      }
    },
  },
})
