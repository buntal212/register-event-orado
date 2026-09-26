<template>
  <q-page class="registration-page">
    <header class="page-header">
      <div class="header-content">
        <router-link class="brand" to="/" aria-label="Kembali ke beranda ORADO">
          <span class="brand-logo"><img :src="logoOrado" alt="Logo ORADO" /></span>
          <span><strong>ORADO</strong><small>EVENT REGISTRATION</small></span>
        </router-link>
        <q-btn flat no-caps color="white" icon="home" label="Beranda" to="/" />
      </div>
    </header>

    <main class="content">
      <section class="intro">
        <div>
          <span class="eyebrow"><q-icon name="how_to_reg" /> PENDAFTARAN EVENT</span>
          <h1>Daftarkan tim Anda.</h1>
          <p>
            Lengkapi data tim dan dua atlet. Pastikan seluruh data sudah sesuai sebelum dikirim.
          </p>
        </div>
        <div class="step-indicator" aria-label="Tahapan pendaftaran">
          <span class="active"><b>1</b> Data tim</span><i></i><span><b>2</b> Atlet</span><i></i
          ><span><b>3</b> Bukti</span>
        </div>
      </section>

      <q-form class="form-card" @submit.prevent="simpan">
        <section class="form-section team-section">
          <div class="section-title">
            <span class="section-icon"><q-icon name="groups" /></span>
            <div>
              <small>LANGKAH 01</small>
              <h2>Data Tim</h2>
            </div>
          </div>
          <div class="field-grid">
            <q-select
              v-model="form.master_event_id"
              class="full-width"
              :options="opsi"
              emit-value
              map-options
              outlined
              dense
              label="Pilih event"
              :loading="store.loading"
              :rules="[wajib('Silakan pilih event terlebih dahulu.')]"
              ><template #prepend><q-icon name="emoji_events" color="primary" /></template
              ><template #no-option
                ><q-item
                  ><q-item-section>Tidak ada event yang tersedia.</q-item-section></q-item
                ></template
              ></q-select
            >
            <q-input
              v-model.trim="form.nama_tim"
              class="full-width"
              outlined
              dense
              label="Nama tim"
              :rules="[wajib('Nama tim wajib diisi.')]"
              ><template #prepend><q-icon name="badge" color="primary" /></template
            ></q-input>
          </div>
        </section>

        <div class="athlete-grid">
          <section class="form-section athlete-section">
            <div class="section-title">
              <span class="section-icon number">01</span>
              <div>
                <small>DATA PEMAIN</small>
                <h2>Atlet Satu</h2>
              </div>
            </div>
            <div class="field-grid">
              <q-input
                v-model.trim="form.nik_atlet_satu"
                outlined
                dense
                label="NIK atlet"
                :rules="[wajib('NIK atlet satu wajib diisi.')]"
                ><template #prepend><q-icon name="credit_card" color="primary" /></template
              ></q-input>
              <q-input
                v-model.trim="form.nama_atlet_satu"
                outlined
                dense
                label="Nama lengkap"
                :rules="[wajib('Nama atlet satu wajib diisi.')]"
                ><template #prepend><q-icon name="person" color="primary" /></template
              ></q-input>
              <q-input
                v-model="form.tanggal_lahir_atlet_satu"
                outlined
                dense
                type="date"
                label="Tanggal lahir"
                stack-label
                :rules="[wajib('Tanggal lahir atlet satu wajib diisi.')]"
                ><template #prepend><q-icon name="cake" color="primary" /></template
              ></q-input>
              <q-select
                v-model="form.jenis_kelamin_atlet_satu"
                :options="gender"
                outlined
                dense
                label="Jenis kelamin"
                :rules="[wajib('Jenis kelamin atlet satu wajib dipilih.')]"
                ><template #prepend><q-icon name="wc" color="primary" /></template
              ></q-select>
              <q-input
                v-model.trim="form.no_hp_atlet_satu"
                class="full-width"
                outlined
                dense
                label="Nomor WhatsApp"
                inputmode="tel"
                :rules="[wajib('Nomor WhatsApp atlet satu wajib diisi.')]"
                ><template #prepend><q-icon name="phone" color="primary" /></template
              ></q-input>
            </div>
          </section>
          <section class="form-section athlete-section">
            <div class="section-title">
              <span class="section-icon number">02</span>
              <div>
                <small>DATA PEMAIN</small>
                <h2>Atlet Dua</h2>
              </div>
            </div>
            <div class="field-grid">
              <q-input
                v-model.trim="form.nik_atlet_dua"
                outlined
                dense
                label="NIK atlet"
                :rules="[wajib('NIK atlet dua wajib diisi.')]"
                ><template #prepend><q-icon name="credit_card" color="primary" /></template
              ></q-input>
              <q-input
                v-model.trim="form.nama_atlet_dua"
                outlined
                dense
                label="Nama lengkap"
                :rules="[wajib('Nama atlet dua wajib diisi.')]"
                ><template #prepend><q-icon name="person" color="primary" /></template
              ></q-input>
              <q-input
                v-model="form.tanggal_lahir_atlet_dua"
                outlined
                dense
                type="date"
                label="Tanggal lahir"
                stack-label
                :rules="[wajib('Tanggal lahir atlet dua wajib diisi.')]"
                ><template #prepend><q-icon name="cake" color="primary" /></template
              ></q-input>
              <q-select
                v-model="form.jenis_kelamin_atlet_dua"
                :options="gender"
                outlined
                dense
                label="Jenis kelamin"
                :rules="[wajib('Jenis kelamin atlet dua wajib dipilih.')]"
                ><template #prepend><q-icon name="wc" color="primary" /></template
              ></q-select>
              <q-input
                v-model.trim="form.no_hp_atlet_dua"
                outlined
                dense
                label="Nomor WhatsApp"
                inputmode="tel"
                :rules="[wajib('Nomor WhatsApp atlet dua wajib diisi.')]"
                ><template #prepend><q-icon name="phone" color="primary" /></template
              ></q-input>
            </div>
          </section>
        </div>
        <div class="submit-area">
          <div>
            <p>
              <q-icon name="verified_user" /> Data akan diproses setelah Anda mengirim pendaftaran.
            </p>
            <TurnstileWidget
              ref="turnstileWidget"
              :site-key="turnstileSiteKey"
              @success="terimaTokenTurnstile"
              @expired="() => resetTurnstile('token-kedaluwarsa')"
              @error="() => resetTurnstile('widget-error')"
            />
          </div>
          <q-btn
            unelevated
            no-caps
            type="submit"
            color="primary"
            icon-right="arrow_forward"
            :loading="isSubmitting"
            :disable="isSubmitting || !turnstileToken"
            label="Kirim Pendaftaran"
          />
        </div>
      </q-form>
    </main>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Notify } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import logoOrado from '@/assets/orado/logo-white.svg'
import TurnstileWidget from '@/components/TurnstileWidget.vue'
import { usePendaftaranStore } from '@/stores/pendaftaran'

const store = usePendaftaranStore()
const router = useRouter()
const route = useRoute()
const gender = ['Laki-laki', 'Perempuan']
const wajib = (pesan) => (nilai) => !!nilai || pesan
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
const turnstileToken = ref('')
const turnstileWidget = ref(null)
const isSubmitting = ref(false)
let submitSequence = 0
let tokenSequence = 0
const form = reactive({
  master_event_id: null,
  nama_tim: '',
  nik_atlet_satu: '',
  nama_atlet_satu: '',
  tanggal_lahir_atlet_satu: '',
  jenis_kelamin_atlet_satu: '',
  no_hp_atlet_satu: '',
  nik_atlet_dua: '',
  nama_atlet_dua: '',
  tanggal_lahir_atlet_dua: '',
  jenis_kelamin_atlet_dua: '',
  no_hp_atlet_dua: '',
})
const opsi = computed(() =>
  store.events.map((event) => ({
    label: `${event.nama_event} (${event.kode_event})`,
    value: event.id,
  })),
)
onMounted(async () => {
  await store.getEvents()

  const eventId = Number(route.query.event)
  if (store.events.some((event) => event.id === eventId)) form.master_event_id = eventId
})

function terimaTokenTurnstile(token) {
  turnstileToken.value = token
  tokenSequence += 1
  console.info('[Turnstile Pendaftaran] Token dibuat', {
    token_sequence: tokenSequence,
    token_length: token.length,
  })
}

async function simpan() {
  if (isSubmitting.value) {
    console.warn('[Turnstile Pendaftaran] Submit ganda diblokir')
    return
  }

  if (!turnstileToken.value) {
    Notify.create({ type: 'warning', message: 'Selesaikan verifikasi keamanan terlebih dahulu.' })
    return
  }

  isSubmitting.value = true
  submitSequence += 1
  const requestId = submitSequence
  const token = turnstileToken.value

  // Token Turnstile bersifat sekali pakai; kosongkan sebelum POST agar tidak mungkin terkirim ulang.
  turnstileToken.value = ''
  console.info('[Turnstile Pendaftaran] Submit dimulai', {
    request_id: requestId,
    token_sequence: tokenSequence,
    token_length: token.length,
  })

  try {
    const data = await store.simpan({ ...form, turnstile_token: token })
    if (data) router.push(`/cetak-bukti?token=${encodeURIComponent(data.public_token)}`)
  } finally {
    resetTurnstile('respons-selesai', requestId)
    isSubmitting.value = false
  }
}

function resetTurnstile(reason, requestId = null) {
  turnstileToken.value = ''
  console.info('[Turnstile Pendaftaran] Widget direset', {
    reason,
    request_id: requestId,
  })
  turnstileWidget.value?.reset()
}
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
  color: #163b66;
  background: radial-gradient(circle at 96% 4%, #dff0ff, transparent 29%), #f4f8fc;
}
.page-header {
  background: linear-gradient(110deg, #00285c, #076cc4);
  box-shadow: 0 5px 18px #0035662e;
}
.header-content,
.content {
  width: min(1060px, 100%);
  margin: auto;
  padding-right: 28px;
  padding-left: 28px;
}
.header-content {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  text-decoration: none;
}
.brand-logo {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  padding: 4px;
  border: 1px solid #ffffff3d;
  border-radius: 12px;
  background: #ffffff17;
}
.brand-logo img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.brand strong,
.brand small {
  display: block;
}
.brand strong {
  font-size: 16px;
}
.brand small {
  margin-top: 1px;
  color: #c2e3ff;
  font-size: 8px;
  letter-spacing: 1.1px;
}
.content {
  padding-top: 39px;
  padding-bottom: 55px;
}
.intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 25px;
  margin: 0 5px 26px;
}
.eyebrow {
  color: #0571ca;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
}
.intro h1 {
  margin: 7px 0;
  color: #0e3d72;
  font-size: clamp(30px, 5vw, 43px);
  line-height: 1.08;
}
.intro p {
  max-width: 530px;
  margin: 0;
  color: #66809f;
  line-height: 1.55;
}
.step-indicator {
  display: flex;
  align-items: center;
  color: #66809f;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.step-indicator span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.step-indicator b {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 50%;
  color: #63809f;
  background: #dfe8f2;
}
.step-indicator .active {
  color: #086ac3;
}
.step-indicator .active b {
  color: #fff;
  background: #0871ca;
}
.step-indicator i {
  width: 18px;
  height: 1px;
  margin: 0 5px;
  background: #c6d6e5;
}
.form-card {
  overflow: hidden;
  border: 1px solid #dae7f2;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 18px 48px #073b7615;
}
.form-section {
  padding: 27px 30px;
}
.team-section {
  background: linear-gradient(105deg, #f8fbff, #edf6ff);
}
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 21px;
}
.section-icon {
  display: grid;
  width: 43px;
  height: 43px;
  place-items: center;
  border-radius: 13px;
  color: #0870ca;
  background: #dceeff;
  font-size: 23px;
}
.section-icon.number {
  color: #fff;
  background: linear-gradient(145deg, #014c97, #0787dc);
  font-size: 14px;
  font-weight: 800;
}
.section-title small {
  color: #5580aa;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}
.section-title h2 {
  margin: 2px 0 0;
  color: #163e6e;
  font-size: 20px;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.full-width {
  grid-column: 1/-1;
}
.athlete-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.athlete-grid .form-section + .form-section {
  border-left: 1px solid #e3edf5;
}
.athlete-section {
  padding-top: 30px;
  padding-bottom: 30px;
}
.submit-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 17px;
  padding: 19px 30px;
  border-top: 1px solid #e1ebf4;
  background: #fbfdff;
}
.submit-area p {
  margin: 0;
  color: #64819e;
  font-size: 12px;
}
.submit-area p .q-icon {
  color: #0871c8;
}
.submit-area :deep(.turnstile-widget) {
  margin-top: 10px;
}
.submit-area .q-btn {
  min-height: 45px;
  padding: 0 20px;
  border-radius: 11px;
  font-weight: 700;
}
@media (max-width: 780px) {
  .intro {
    display: block;
  }
  .step-indicator {
    margin-top: 19px;
  }
  .athlete-grid {
    grid-template-columns: 1fr;
  }
  .athlete-grid .form-section + .form-section {
    border-top: 1px solid #e3edf5;
    border-left: 0;
  }
}
@media (max-width: 560px) {
  .header-content,
  .content {
    padding-right: 16px;
    padding-left: 16px;
  }
  .header-content {
    min-height: 67px;
  }
  .header-content .q-btn {
    padding: 5px;
    font-size: 0;
  }
  .header-content .q-btn .q-icon {
    font-size: 21px;
  }
  .content {
    padding-top: 28px;
  }
  .intro {
    margin: 0 2px 19px;
  }
  .intro h1 {
    font-size: 31px;
  }
  .intro p {
    font-size: 14px;
  }
  .step-indicator {
    font-size: 10px;
  }
  .step-indicator i {
    width: 10px;
    margin: 0 3px;
  }
  .form-card {
    border-radius: 18px;
  }
  .form-section {
    padding: 22px 18px;
  }
  .field-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .submit-area {
    display: grid;
    padding: 18px;
  }
  .submit-area .q-btn {
    width: 100%;
  }
  .team-section {
    padding-top: 23px;
  }
}
</style>
