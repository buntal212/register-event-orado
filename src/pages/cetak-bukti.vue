<template>
  <q-page class="proof-page">
    <header class="page-header no-print">
      <div class="header-content">
        <router-link class="brand" to="/" aria-label="Kembali ke beranda ORADO">
          <span class="brand-logo"><img :src="logoOrado" alt="Logo ORADO" /></span>
          <span><strong>ORADO</strong><small>EVENT REGISTRATION</small></span>
        </router-link>
        <q-btn flat no-caps color="white" icon="home" label="Beranda" to="/" />
      </div>
    </header>

    <main class="content">
      <section class="intro no-print">
        <span class="eyebrow"><q-icon name="receipt_long" /> BUKTI PENDAFTARAN</span>
        <h1>Cetak bukti pendaftaran.</h1>
        <p>Masukkan nomor registrasi untuk melihat dan mencetak bukti pendaftaran tim.</p>
      </section>

      <q-form class="search-card no-print" @submit="store.tampilkan">
        <q-input v-model.trim="store.kode" outlined dense label="Kode pendaftaran" :rules="[wajib]">
          <template #prepend><q-icon name="confirmation_number" color="primary" /></template>
        </q-input>
        <q-btn
          unelevated
          no-caps
          type="submit"
          color="primary"
          icon="search"
          :loading="store.loading"
          label="Tampilkan"
        />
      </q-form>

      <section v-if="store.data" class="proof-card">
        <div class="proof-top">
          <div class="proof-brand">
            <span class="proof-logo"><img :src="logoOrado" alt="ORADO" /></span>
            <div><strong>ORADO</strong><small>KOTA PROBOLINGGO</small></div>
          </div>
          <span class="official"><q-icon name="verified" /> TERDAFTAR</span>
        </div>
        <div class="proof-heading">
          <div>
            <small>BUKTI PENDAFTARAN EVENT</small>
            <h2>{{ store.data.event?.nama_event || 'Event ORADO' }}</h2>
            <p>
              <q-icon name="location_on" />
              {{ store.data.event?.lokasi || 'Lokasi akan diinformasikan' }}
            </p>
          </div>
          <div class="registration-code">
            <small>NOMOR REGISTRASI</small><strong>{{ store.data.kode_pendaftaran }}</strong>
          </div>
        </div>
        <div class="team-box">
          <span><q-icon name="groups" /></span>
          <div>
            <small>NAMA TIM</small
            ><strong>{{ store.data.nama_tim || store.data.nama_pendaftar }}</strong>
          </div>
        </div>
        <div class="participant-heading"><span>DATA ATLET</span><i></i><small>2 PEMAIN</small></div>
        <div class="athlete-list">
          <article v-for="(athlete, index) in athletes" :key="athlete.name" class="athlete-row">
            <span class="athlete-number">0{{ index + 1 }}</span>
            <div>
              <small>ATLET {{ index + 1 }}</small
              ><strong>{{ athlete.name }}</strong
              ><span>NIK: {{ athlete.nik }}</span>
            </div>
            <span class="gender">{{ athlete.gender }}</span>
          </article>
        </div>
        <div class="proof-footer">
          <span><q-icon name="event_available" /> Dicetak {{ tanggalHariIni }}</span>
          <span>Kode event: {{ store.data.kode_event }}</span>
        </div>
        <div class="proof-actions no-print">
          <q-btn
            flat
            no-caps
            color="primary"
            icon="arrow_back"
            label="Cari kode lain"
            @click="reset"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="print"
            label="Cetak Bukti"
            @click="cetak"
          />
        </div>
      </section>

      <section v-else-if="!store.loading" class="empty-state no-print">
        <q-icon name="description" /><strong>Bukti pendaftaran akan tampil di sini.</strong
        ><span>Masukkan kode seperti REG-00001 pada kolom di atas.</span>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logoOrado from '@/assets/orado/logo-white.svg'
import { useBuktiStore } from '@/stores/bukti'

const store = useBuktiStore()
const route = useRoute()
const wajib = (value) => !!value || 'Kode pendaftaran wajib diisi.'
const detail = computed(() => store.data?.rincis?.[0] || {})
const athletes = computed(() => [
  {
    name: detail.value.nama_atlet_satu || detail.value.nama_peserta || '-',
    nik: detail.value.nik_atlet_satu || detail.value.nik || '-',
    gender: detail.value.jenis_kelamin_atlet_satu || '-',
  },
  {
    name: detail.value.nama_atlet_dua || '-',
    nik: detail.value.nik_atlet_dua || '-',
    gender: detail.value.jenis_kelamin_atlet_dua || '-',
  },
])
const tanggalHariIni = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date())
onMounted(() => {
  if (route.query.kode) {
    store.kode = route.query.kode
    store.tampilkan()
  }
})
function reset() {
  store.kode = ''
  store.data = null
}
function cetak() {
  window.open(
    `/cetak-bukti-print?kode=${encodeURIComponent(store.data.kode_pendaftaran)}`,
    '_blank',
  )
}
</script>

<style scoped>
.proof-page {
  min-height: 100vh;
  color: #153e6d;
  background: radial-gradient(circle at 98% 0, #dff1ff, transparent 28%), #f4f8fc;
}
.page-header {
  background: linear-gradient(110deg, #00285c, #076cc4);
  box-shadow: 0 5px 18px #0035662e;
}
.header-content,
.content {
  width: min(900px, 100%);
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
.brand-logo,
.proof-logo {
  display: grid;
  place-items: center;
  border: 1px solid #ffffff3d;
  background: #ffffff17;
}
.brand-logo {
  width: 42px;
  height: 42px;
  padding: 4px;
  border-radius: 12px;
}
.brand-logo img {
  width: 32px;
  height: 32px;
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
  padding-top: 41px;
  padding-bottom: 58px;
}
.intro {
  text-align: center;
}
.eyebrow {
  color: #0871c9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}
.intro h1 {
  margin: 7px 0 8px;
  color: #0d3d72;
  font-size: clamp(29px, 5vw, 42px);
  line-height: 1.1;
}
.intro p {
  margin: 0;
  color: #66809f;
}
.search-card {
  display: flex;
  gap: 10px;
  align-items: start;
  max-width: 620px;
  margin: 27px auto 24px;
  padding: 10px;
  border: 1px solid #d9e7f2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 28px #0f4a8310;
}
.search-card .q-input {
  flex: 1;
}
.search-card .q-btn {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 700;
}
.proof-card {
  overflow: hidden;
  max-width: 720px;
  margin: 30px auto 0;
  border: 1px solid #d7e5f2;
  border-radius: 23px;
  background: #fff;
  box-shadow: 0 20px 48px #073b761a;
}
.proof-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 27px;
  border-bottom: 1px solid #dce9f4;
}
.proof-brand {
  display: flex;
  align-items: center;
  gap: 9px;
}
.proof-logo {
  width: 37px;
  height: 37px;
  padding: 4px;
  border-radius: 10px;
  background: linear-gradient(145deg, #00336f, #0782d8);
}
.proof-logo img {
  width: 27px;
  height: 27px;
}
.proof-brand strong,
.proof-brand small {
  display: block;
}
.proof-brand strong {
  font-size: 14px;
}
.proof-brand small {
  color: #6381a0;
  font-size: 8px;
  letter-spacing: 1px;
}
.official {
  padding: 6px 10px;
  border-radius: 50px;
  color: #087146;
  background: #e3f8ec;
  font-size: 10px;
  font-weight: 800;
}
.proof-heading {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  padding: 29px 30px 22px;
  color: #fff;
  background: linear-gradient(125deg, #002c63, #0879d0);
}
.proof-heading small,
.team-box small,
.participant-heading small,
.athlete-row small,
.registration-code small {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}
.proof-heading h2 {
  max-width: 400px;
  margin: 7px 0;
  color: #fff;
  font-size: 25px;
  line-height: 1.15;
}
.proof-heading p {
  margin: 0;
  color: #c9e8ff;
  font-size: 12px;
}
.registration-code {
  display: grid;
  align-self: start;
  padding: 11px 13px;
  border: 1px solid #ffffff3d;
  border-radius: 11px;
  background: #ffffff12;
}
.registration-code small {
  color: #bfe1ff;
}
.registration-code strong {
  margin-top: 3px;
  font-size: 15px;
}
.team-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 30px;
  padding: 15px;
  border: 1px solid #dceaf4;
  border-radius: 13px;
  background: #f5faff;
}
.team-box > span {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
  color: #0870c9;
  background: #dceeff;
  font-size: 20px;
}
.team-box small,
.athlete-row small {
  display: block;
  color: #6684a2;
}
.team-box strong {
  display: block;
  margin-top: 2px;
  color: #174675;
  font-size: 18px;
}
.participant-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 30px 10px;
  color: #0b5fa8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
}
.participant-heading i {
  height: 1px;
  flex: 1;
  background: #d6e4f0;
}
.participant-heading small {
  color: #8299b1;
}
.athlete-list {
  padding: 0 30px;
}
.athlete-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px dashed #d9e5f0;
}
.athlete-number {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 10px;
  color: #0870c9;
  background: #e5f2ff;
  font-size: 12px;
  font-weight: 800;
}
.athlete-row div {
  min-width: 0;
  flex: 1;
}
.athlete-row strong {
  display: block;
  margin: 2px 0;
  color: #173f6b;
}
.athlete-row div > span {
  color: #7088a1;
  font-size: 11px;
}
.gender {
  padding: 5px 8px;
  border-radius: 20px;
  color: #477194;
  background: #edf4f9;
  font-size: 10px;
}
.proof-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 20px 30px 0;
  padding-top: 14px;
  border-top: 1px solid #e0eaf3;
  color: #7790a8;
  font-size: 10px;
}
.proof-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 20px 30px;
  background: #f8fbfe;
}
.proof-actions .q-btn {
  border-radius: 10px;
  font-weight: 700;
}
.empty-state {
  display: grid;
  justify-items: center;
  gap: 8px;
  max-width: 510px;
  margin: 32px auto;
  padding: 40px 20px;
  border: 1px dashed #c5d8e9;
  border-radius: 19px;
  color: #7791aa;
  text-align: center;
}
.empty-state .q-icon {
  color: #7cb6e9;
  font-size: 48px;
}
.empty-state strong {
  color: #315b84;
}
.empty-state span {
  font-size: 12px;
}
@media (max-width: 600px) {
  .header-content,
  .content {
    padding-right: 16px;
    padding-left: 16px;
  }
  .header-content {
    min-height: 67px;
  }
  .header-content .q-btn {
    min-height: 34px;
    padding: 0 7px;
    font-size: 11px;
  }
  .header-content .q-btn .q-icon {
    font-size: 18px;
  }
  .content {
    padding-top: 29px;
  }
  .intro p {
    font-size: 14px;
  }
  .search-card {
    display: grid;
    margin-top: 21px;
  }
  .search-card .q-btn {
    width: 100%;
  }
  .proof-card {
    margin-top: 24px;
    border-radius: 18px;
  }
  .proof-top {
    padding: 17px;
  }
  .proof-heading {
    display: grid;
    padding: 24px 18px;
  }
  .proof-heading h2 {
    font-size: 22px;
  }
  .registration-code {
    width: max-content;
  }
  .team-box,
  .participant-heading,
  .athlete-list {
    margin-right: 18px;
    margin-left: 18px;
    padding-right: 0;
    padding-left: 0;
  }
  .team-box {
    padding: 13px;
  }
  .athlete-list {
    padding-bottom: 0;
  }
  .proof-footer {
    display: grid;
    margin-right: 18px;
    margin-left: 18px;
  }
  .proof-actions {
    padding: 17px;
  }
  .proof-actions .q-btn {
    font-size: 11px;
  }
}

/* Tampilan ringkas untuk halaman pemeriksaan bukti; kop resmi ada di halaman cetak khusus. */
.proof-top {
  position: static;
  display: flex;
  min-height: 0;
  padding: 20px 27px;
  border-bottom: 1px solid #dce9f4;
}
.proof-logo {
  position: static;
  width: 37px;
  height: 37px;
  padding: 4px;
  border: 1px solid #ffffff3d;
  border-radius: 10px;
  background: linear-gradient(145deg, #00336f, #0782d8);
}
.proof-logo img {
  width: 27px;
  height: 27px;
  filter: none;
}
.proof-brand strong {
  font-size: 14px;
  letter-spacing: normal;
}
.proof-brand small {
  margin-top: 0;
  font-size: 8px;
  font-weight: 400;
}
.official {
  position: static;
}
@media print {
  .no-print {
    display: none !important;
  }
  .proof-page {
    background: #fff;
  }
  .content {
    width: 100%;
    padding: 0;
  }
  .proof-card {
    max-width: none;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .proof-heading {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .proof-actions {
    display: none;
  }
}

.proof-card {
  position: relative;
  isolation: isolate;
}
.proof-card > *:not(.watermark) {
  position: relative;
  z-index: 1;
}
.watermark {
  position: absolute;
  z-index: 0;
  top: 51%;
  left: 50%;
  width: 335px;
  height: 335px;
  opacity: 0.055;
  pointer-events: none;
  transform: translate(-50%, -50%);
}
.watermark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(25%) sepia(71%) saturate(1183%) hue-rotate(178deg)
    brightness(82%);
}
.proof-logo {
  width: 40px;
  height: 40px;
}
.proof-logo img {
  width: 29px;
  height: 29px;
}
.proof-brand strong {
  font-size: 12px;
  letter-spacing: 0.15px;
}
.proof-brand small {
  margin-top: 2px;
  font-size: 7px;
  font-weight: 800;
}
@media (max-width: 600px) {
  .watermark {
    width: 260px;
    height: 260px;
  }
}
@media print {
  .watermark {
    opacity: 0.045;
  }
}

.proof-top {
  position: relative;
  display: block;
  min-height: 110px;
  padding: 20px 30px 14px;
  border-bottom: 5px double #123f70;
}
.letterhead {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  padding-right: 96px;
}
.proof-logo {
  position: absolute;
  left: 30px;
  width: 70px;
  height: 70px;
  padding: 7px;
  border: 0;
  border-radius: 0;
  background: transparent;
}
.proof-logo img {
  width: 56px;
  height: 56px;
  filter: brightness(0) saturate(100%) invert(21%) sepia(50%) saturate(1618%) hue-rotate(178deg)
    brightness(82%);
}
.letterhead-title {
  display: grid;
  justify-items: center;
  color: #0b294c;
  text-align: center;
}
.letterhead-title strong {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  letter-spacing: 0.3px;
}
.letterhead-title b {
  margin-top: 2px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 15px;
}
.letterhead-title small {
  margin-top: 5px;
  color: #355a7d;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.7px;
}
.official {
  position: absolute;
  top: 23px;
  right: 28px;
}
@media (max-width: 600px) {
  .proof-top {
    min-height: 101px;
    padding: 16px 17px 12px;
  }
  .letterhead {
    min-height: 65px;
    padding-right: 0;
    padding-left: 52px;
  }
  .proof-logo {
    top: 18px;
    left: 17px;
    width: 48px;
    height: 48px;
    padding: 3px;
  }
  .proof-logo img {
    width: 42px;
    height: 42px;
  }
  .letterhead-title strong {
    font-size: 12px;
  }
  .letterhead-title b {
    font-size: 10px;
  }
  .letterhead-title small {
    font-size: 6px;
  }
  .official {
    top: auto;
    right: 17px;
    bottom: 12px;
    font-size: 8px;
  }
}

/* Tampilan ringkas untuk halaman pemeriksaan bukti; kop resmi ada di halaman cetak khusus. */
.proof-top {
  position: static;
  display: flex;
  min-height: 0;
  padding: 20px 27px;
  border-bottom: 1px solid #dce9f4;
}
.proof-logo {
  position: static;
  width: 37px;
  height: 37px;
  padding: 4px;
  border: 1px solid #ffffff3d;
  border-radius: 10px;
  background: linear-gradient(145deg, #00336f, #0782d8);
}
.proof-logo img {
  width: 27px;
  height: 27px;
  filter: none;
}
.proof-brand strong {
  font-size: 14px;
  letter-spacing: normal;
}
.proof-brand small {
  margin-top: 0;
  font-size: 8px;
  font-weight: 400;
}
.official {
  position: static;
}
@media (max-width: 600px) {
  .proof-top {
    min-height: 0;
    padding: 17px;
  }
  .proof-logo {
    width: 37px;
    height: 37px;
    padding: 4px;
  }
  .proof-logo img {
    width: 27px;
    height: 27px;
  }
  .official {
    font-size: 10px;
  }
}
</style>
