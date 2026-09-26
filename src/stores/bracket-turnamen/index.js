import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'

export const useBracketTurnamenStore = defineStore('bracket-turnamen', {
  state: () => ({
    loadingBagan: false,
    loadingPengisian: false,
    savingPengisian: false,
    event: null,
    peserta: [],
    pasangan: [],
    formPasangan: [],
  }),

  actions: {
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
