import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'
const peserta = () => ({ nama_peserta: '' })
export const usePendaftaranStore = defineStore('pendaftaran', {
  state: () => ({
    loading: false,
    saving: false,
    events: [],
    form: { master_event_id: null, nama_pendaftar: '', no_hp: '', email: '', peserta: [peserta()] },
  }),
  actions: {
    async getEvents() {
      this.loading = true
      try {
        this.events = (await api.get('/v3/event/tersedia')).data?.data ?? []
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Data event tidak dapat dimuat.',
        })
      } finally {
        this.loading = false
      }
    },
    addPeserta() {
      this.form.peserta.push(peserta())
    },
    hapusPeserta(index) {
      if (this.form.peserta.length > 1) this.form.peserta.splice(index, 1)
    },
    async simpan() {
      this.saving = true
      try {
        const response = await api.post('/v3/event/pendaftaran', this.form)
        Notify.create({
          type: 'positive',
          message: response.data?.message || 'Pendaftaran berhasil.',
        })
        return response.data?.data
      } catch (error) {
        Notify.create({
          type: 'negative',
          message:
            Object.values(error.response?.data?.errors ?? {})?.[0]?.[0] ||
            error.response?.data?.message ||
            'Pendaftaran gagal.',
        })
        return null
      } finally {
        this.saving = false
      }
    },
  },
})
