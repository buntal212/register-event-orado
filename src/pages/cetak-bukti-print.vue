<template>
  <q-page class="print-page">
    <div class="toolbar no-print">
      <q-btn flat no-caps icon="close" label="Tutup" @click="tutup" />
      <q-btn unelevated no-caps color="primary" icon="print" label="Cetak" @click="cetak" />
    </div>
    <main v-if="store.data" class="document">
      <div class="watermark"><img :src="logoOrado" alt="" /></div>
      <header class="letterhead">
        <img :src="logoOrado" alt="Logo ORADO" />
        <div>
          <h1>ORADO KOTA PROBOLINGGO</h1>
          <h2>ORGANISASI OLAHRAGA DOMINO</h2>
          <p>Jl. Bengawan Solo No. 100, Jrebeng Kulon, Kedopok, Kota Probolinggo 67229</p>
        </div>
      </header>
      <div class="kop-line"></div>
      <section class="title">
        <small>SURAT KETERANGAN</small>
        <h3>BUKTI PENDAFTARAN EVENT</h3>
        <p>
          Dengan ini menerangkan bahwa tim di bawah ini telah terdaftar pada event
          <b>{{ store.data.event?.nama_event }}</b
          >.
        </p>
        <aside>
          <small>NOMOR REGISTRASI</small><strong>{{ store.data.kode_pendaftaran }}</strong>
        </aside>
      </section>
      <section class="team">
        <small>NAMA TIM</small
        ><strong>{{ store.data.nama_tim || store.data.nama_pendaftar }}</strong>
      </section>
      <section class="athletes">
        <div class="section-label"><b>DATA ATLET</b><span>2 PEMAIN</span></div>
        <article v-for="(athlete, index) in athletes" :key="index">
          <b>0{{ index + 1 }}</b>
          <div>
            <small>ATLET {{ index + 1 }}</small
            ><strong>{{ athlete.name }}</strong
            ><span>NIK: {{ athlete.nik }}</span
            ><span>Tanggal lahir: {{ athlete.birthDate }} · Umur: {{ athlete.age }} tahun</span
            ><span>No. WhatsApp: {{ athlete.phone }}</span>
          </div>
          <em>{{ athlete.gender }}</em>
        </article>
      </section>
      <footer>
        <span>Dicetak {{ tanggalHariIni }}</span
        ><span>Kode event: {{ store.data.kode_event }}</span>
      </footer>
    </main>
    <div v-else-if="!store.loading" class="not-found no-print">
      Bukti pendaftaran tidak ditemukan.
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoOrado from '../../../orado-pengurus/src/assets/orado/logo-white.svg'
import { useBuktiStore } from '@/stores/bukti'

const store = useBuktiStore()
const route = useRoute()
const router = useRouter()
const detail = computed(() => store.data?.rincis?.[0] || {})
const athletes = computed(() => [
  {
    name: detail.value.nama_atlet_satu || detail.value.nama_peserta || '-',
    nik: detail.value.nik_atlet_satu || detail.value.nik || '-',
    gender: detail.value.jenis_kelamin_atlet_satu || '-',
    birthDate: formatTanggal(detail.value.tanggal_lahir_atlet_satu || detail.value.tanggal_lahir),
    age: hitungUmur(detail.value.tanggal_lahir_atlet_satu || detail.value.tanggal_lahir),
    phone: detail.value.no_hp_atlet_satu || detail.value.no_hp || '-',
  },
  {
    name: detail.value.nama_atlet_dua || '-',
    nik: detail.value.nik_atlet_dua || '-',
    gender: detail.value.jenis_kelamin_atlet_dua || '-',
    birthDate: formatTanggal(detail.value.tanggal_lahir_atlet_dua),
    age: hitungUmur(detail.value.tanggal_lahir_atlet_dua),
    phone: detail.value.no_hp_atlet_dua || '-',
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
function cetak() {
  window.print()
}
function formatTanggal(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}
function hitungUmur(value) {
  if (!value) return '-'

  const birthDate = new Date(`${value}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--

  return age >= 0 ? age : '-'
}
function tutup() {
  window.close()
  if (!window.closed) router.push('/cetak-bukti')
}
</script>

<style scoped>
.print-page {
  min-height: 100vh;
  background: #65707a;
  padding: 14px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: min(900px, 100%);
  margin: 0 auto 10px;
}
.toolbar .q-btn {
  font-weight: 700;
}
.document {
  position: relative;
  isolation: isolate;
  width: min(820px, 100%);
  min-height: 1050px;
  margin: auto;
  padding: 36px 62px 68px;
  color: #071f42;
  background: #fff;
  box-shadow: 0 3px 12px #0004;
}
.watermark {
  position: absolute;
  z-index: 0;
  top: 52%;
  left: 50%;
  width: 360px;
  height: 360px;
  opacity: 0.06;
  transform: translate(-50%, -50%);
}
.watermark img {
  width: 100%;
  height: 100%;
  filter: brightness(0) saturate(100%) invert(20%) sepia(64%) saturate(1353%) hue-rotate(178deg)
    brightness(86%);
}
.document > *:not(.watermark) {
  position: relative;
  z-index: 1;
}
.letterhead {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 78px;
}
.letterhead > img {
  position: absolute;
  left: 0;
  width: 88px;
  height: 88px;
  filter: brightness(0) saturate(100%) invert(20%) sepia(64%) saturate(1353%) hue-rotate(178deg)
    brightness(86%);
}
.letterhead div {
  display: grid;
  gap: 1px;
  text-align: center;
}
.letterhead h1,
.letterhead h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
}
.letterhead h1 {
  line-height: 1.05;
  font-size: 23px;
}
.letterhead h2 {
  margin-top: 0;
  line-height: 1.05;
  font-size: 18px;
}
.letterhead p {
  max-width: 480px;
  margin: 1px auto 0;
  color: #315b7c;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.35px;
  line-height: 1.2;
}
.kop-line {
  height: 5px;
  margin-top: 16px;
  border-top: 2px solid #071f42;
  border-bottom: 1px solid #071f42;
}
.title {
  position: relative;
  margin-top: 39px;
  padding: 20px 24px;
  color: #fff;
  background: linear-gradient(125deg, #002b60, #087ad1);
}
.title > small,
.team small,
.athletes small {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}
.title h3 {
  margin: 9px 0;
  font-size: 27px;
  font-weight: 500;
}
.title p {
  margin: 0;
  font-size: 13px;
}
.title aside {
  position: absolute;
  top: 20px;
  right: 24px;
  display: grid;
  padding: 11px;
  border: 1px solid #ffffff55;
  border-radius: 9px;
  background: #ffffff10;
}
.title aside small {
  color: #c8e9ff;
  font-size: 8px;
}
.title aside strong {
  margin-top: 4px;
  font-size: 15px;
}
.team {
  margin-top: 26px;
  padding: 17px 21px;
  border: 1px solid #cdddea;
  border-radius: 11px;
  background: #f7fbff;
}
.team small,
.team strong {
  display: block;
}
.team strong {
  margin-top: 5px;
  color: #0d4279;
  font-size: 20px;
}
.athletes {
  margin-top: 29px;
}
.section-label {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #c8d9e8;
  color: #075eaa;
  font-size: 11px;
}
.section-label span {
  color: #5c7796;
  font-size: 10px;
  font-weight: 700;
}
.athletes article {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 17px 9px;
  border-bottom: 1px dashed #cbdce9;
}
.athletes article > b {
  color: #0872cb;
  font-size: 13px;
}
.athletes article div {
  display: grid;
  flex: 1;
}
.athletes article small {
  color: #5e7c99;
  font-size: 9px;
}
.athletes article strong {
  margin: 4px 0;
  color: #113c6d;
}
.athletes article span {
  color: #4d6f8e;
  font-size: 11px;
}
.athletes em {
  color: #315f8d;
  font-size: 11px;
  font-style: normal;
}
footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #c8d9e8;
  color: #4b6c8b;
  font-size: 10px;
}
.not-found {
  width: min(820px, 100%);
  margin: auto;
  padding: 50px;
  color: #123f70;
  background: #fff;
  text-align: center;
}
@page {
  size: A4;
  margin: 0;
}
@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    padding: 0;
    background: #fff;
  }
  .document {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    padding: 10mm 16mm 18mm;
    box-shadow: none;
  }
  .title {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
.title {
  margin-top: 34px;
  padding: 0 0 18px;
  color: #0b294c;
  border-bottom: 1px solid #153f6d;
  background: transparent;
  text-align: center;
}
.title h3 {
  margin: 7px 0 10px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 700;
  text-decoration: underline;
}
.title p {
  max-width: 550px;
  margin: 0 auto;
  color: #203d5d;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;
  line-height: 1.55;
}
.title aside {
  top: 7px;
  right: 0;
  padding: 8px 11px;
  border: 1px solid #153f6d;
  border-radius: 3px;
  background: #fff;
  text-align: left;
}
.title aside small {
  color: #315b7c;
}
.title aside strong {
  color: #0b294c;
}
.team {
  border-color: #9db4ca;
  border-radius: 3px;
  background: #fff;
}
.section-label {
  color: #0b294c;
  border-bottom-color: #7895af;
}
.athletes article {
  border-bottom-color: #a8bbcc;
}
footer {
  border-top-color: #7895af;
}
</style>
