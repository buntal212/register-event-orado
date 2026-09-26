import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'
export const useBuktiStore = defineStore('bukti', {
  state: () => ({ kode: '', noHp: '', publicToken: '', loading: false, data: null }),
  actions: {
    async tampilkan() {
      this.kode = normalisasiKode(this.kode)
      this.publicToken = ''
      this.loading = true
      try {
        this.data = (
          await api.get(`/v3/event/pendaftaran/${this.kode}`, {
            params: { no_hp: this.noHp },
          })
        ).data?.data
      } catch (error) {
        this.data = null
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Bukti pendaftaran tidak ditemukan.',
        })
      } finally {
        this.loading = false
      }
    },
    async tampilkanDenganToken(token = this.publicToken) {
      this.publicToken = String(token || '').trim()
      if (!this.publicToken) return

      this.loading = true
      try {
        this.data = (await api.get(`/v3/event/pendaftaran/bukti/${this.publicToken}`)).data?.data
      } catch (error) {
        this.data = null
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Bukti pendaftaran tidak ditemukan.',
        })
      } finally {
        this.loading = false
      }
    },
  },
})

function normalisasiKode(kode) {
  const nilai = String(kode || '')
    .trim()
    .toUpperCase()

  if (/^\d+$/.test(nilai)) return `REG-${nilai.padStart(5, '0')}`

  return nilai
}
