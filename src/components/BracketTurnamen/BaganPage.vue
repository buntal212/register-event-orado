<template>
  <q-page class="bracket-page">
    <main class="bracket-content">
      <q-btn
        class="back-button"
        round
        flat
        icon="arrow_back"
        color="black"
        aria-label="Kembali"
        @click="router.push('/event')"
      />
      <q-btn
        class="fullscreen-button"
        round
        flat
        :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        color="black"
        :aria-label="isFullscreen ? 'Keluar dari layar penuh' : 'Tampilkan layar penuh'"
        @click="toggleFullscreen"
      >
        <q-tooltip>{{ isFullscreen ? 'Keluar layar penuh' : 'Layar penuh' }}</q-tooltip>
      </q-btn>

      <q-inner-loading :showing="store.loadingBagan" color="primary">
        <q-spinner-dots size="36px" />
      </q-inner-loading>

      <section v-if="!store.loadingBagan && bagan" class="bracket-board">
        <div
          ref="bracketViewport"
          class="bracket-viewport"
          :style="{
            height: `${tinggiBaganTampil}px`,
            '--skala-cetak': skalaCetakBagan,
            '--lebar-cetak': `${bagan.lebar * skalaCetakBagan}px`,
            '--tinggi-cetak': `${bagan.tinggi * skalaCetakBagan}px`,
          }"
        >
          <div
            ref="bracketCanvas"
            class="bracket-canvas"
            :style="{
              width: `${bagan.lebar}px`,
              height: `${bagan.tinggi}px`,
              transform: `translateX(${offsetKiriBagan}px) scale(${skalaBagan})`,
            }"
          >
            <img
              class="event-watermark"
              src="@/assets/orado/logo-white.svg"
              alt=""
              aria-hidden="true"
              :style="{ left: `${bagan.watermarkX}px`, top: `${bagan.watermarkY}px` }"
            />
            <svg
              v-for="domino in watermarkDomino"
              :key="domino.id"
              class="domino-watermark"
              viewBox="0 0 100 150"
              aria-hidden="true"
              :style="{
                left: `${domino.x}px`,
                top: `${domino.y}px`,
                transform: `rotate(${domino.putaran}deg)`,
              }"
            >
              <rect x="14" y="10" width="72" height="130" rx="15" />
              <path d="M 14 75 H 86" />
              <circle
                v-for="(pip, index) in pipDomino(domino.atas, false)"
                :key="`atas-${index}`"
                :cx="pip.x"
                :cy="pip.y"
                r="5"
              />
              <circle
                v-for="(pip, index) in pipDomino(domino.bawah, true)"
                :key="`bawah-${index}`"
                :cx="pip.x"
                :cy="pip.y"
                r="5"
              />
            </svg>
            <div
              class="event-identity"
              :style="{ left: `${bagan.identitasEventX}px`, top: `${bagan.identitasEventY}px` }"
            >
              <span>BAGAN <em>TURNAMEN</em></span>
              <strong>{{ store.event?.nama_event || 'EVENT ORADO' }}</strong>
              <small>
                <q-icon name="calendar_month" size="16px" />
                {{ store.event?.kode_event || 'ORADO Kota Probolinggo' }}
              </small>
            </div>
            <svg
              class="bracket-lines"
              :viewBox="`0 0 ${bagan.lebar} ${bagan.tinggi}`"
              :width="bagan.lebar"
              :height="bagan.tinggi"
              aria-hidden="true"
            >
              <path v-for="(jalur, index) in bagan.jalur" :key="index" :d="jalur" />
            </svg>

            <article
              v-for="pertandingan in bagan.pertandingan"
              :key="pertandingan.id"
              class="match-card"
              :style="{ left: `${pertandingan.x}px`, top: `${pertandingan.y}px` }"
            >
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': pertandingan.timSatu.kosong }"
                :title="detailAtlet(pertandingan.timSatu)"
              >
                <span>{{ pertandingan.timSatu.nama }}</span>
              </div>
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': pertandingan.timDua.kosong }"
                :title="detailAtlet(pertandingan.timDua)"
              >
                <span>{{ pertandingan.timDua.nama }}</span>
              </div>
            </article>

            <article
              class="match-card match-card--final"
              :style="{ left: `${bagan.final.x}px`, top: `${bagan.final.y}px` }"
            >
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': bagan.final.timSatu.kosong }"
                :title="detailAtlet(bagan.final.timSatu)"
              >
                <span>{{ bagan.final.timSatu.nama }}</span>
              </div>
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': bagan.final.timDua.kosong }"
                :title="detailAtlet(bagan.final.timDua)"
              >
                <span>{{ bagan.final.timDua.nama }}</span>
              </div>
            </article>

            <article
              class="match-card match-card--third-place"
              :style="{ left: `${bagan.juaraTiga.x}px`, top: `${bagan.juaraTiga.y}px` }"
            >
              <div class="third-place-label">PEREBUTAN JUARA 3</div>
              <div v-if="bagan.juaraTiga.pemenang" class="third-place-result">
                JUARA 3: {{ bagan.juaraTiga.pemenang.nama }}
              </div>
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': bagan.juaraTiga.timSatu.kosong }"
                :title="detailAtlet(bagan.juaraTiga.timSatu)"
              >
                <span>{{ bagan.juaraTiga.timSatu.nama }}</span>
              </div>
              <div
                class="team-slot"
                :class="{ 'team-slot--kosong': bagan.juaraTiga.timDua.kosong }"
                :title="detailAtlet(bagan.juaraTiga.timDua)"
              >
                <span>{{ bagan.juaraTiga.timDua.nama }}</span>
              </div>
            </article>

            <div
              class="champion-mark"
              :style="{ left: `${bagan.final.x - 54}px`, top: `${bagan.hasilAkhirY}px` }"
            >
              <div class="champion-trophy">
                <img src="@/assets/orado/trophy-gold-laurel-clean.png" alt="Piala juara" />
              </div>
              <div class="champion-title">HASIL AKHIR</div>
              <div class="champion-result">
                <div class="champion-result-row">
                  <span>JUARA 1</span>
                  <strong>{{ bagan.final.pemenang?.nama || 'Belum ditentukan' }}</strong>
                </div>
                <div class="champion-result-row">
                  <span>JUARA 2</span>
                  <strong>{{ bagan.final.juaraDua?.nama || 'Belum ditentukan' }}</strong>
                </div>
                <div class="champion-result-row">
                  <span>JUARA 3</span>
                  <strong>{{ bagan.juaraTiga.pemenang?.nama || 'Belum ditentukan' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer v-if="!store.loadingBagan && bagan" class="bracket-footer">
        <div class="bracket-footer-message">
          <q-icon name="emoji_events" size="21px" />
          <strong>Selamat Bertanding, Junjung Sportifitas</strong>
        </div>
        <div class="bracket-footer-tags">
          #DominoNaikKelas&nbsp;&nbsp; #OradoMemintarkanIndonesia&nbsp;&nbsp;
          #OradoProbolinggoOdikTerus
        </div>
      </footer>

      <div v-else-if="!store.loadingBagan" class="empty-state">
        Event ini belum memiliki kuota peserta. Tentukan kuota peserta terlebih dahulu agar bagan
        dapat dibuat.
      </div>

    </main>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBracketTurnamenStore } from '@/stores/bracket-turnamen'

const LEBAR_KARTU = 142
const TINGGI_KARTU = 52
const JARAK_RONDE = 38
const JARAK_BARIS = 56
const PADDING = 16
const JARAK_FINAL = 48
const TINGGI_AREA_BAGAN = 116

const route = useRoute()
const router = useRouter()
const store = useBracketTurnamenStore()
const bracketViewport = ref(null)
const bracketCanvas = ref(null)
const lebarViewport = ref(0)
const tinggiLayar = ref(window.innerHeight)
const isFullscreen = ref(false)
let resizeObserver

const ruangTombolKanan = computed(() => 0)
const timTerdaftar = computed(() => {
  const daftarTim = new Map()

  store.peserta.forEach((peserta) => {
    const namaTim = peserta.nama_tim?.trim()
    if (!namaTim || daftarTim.has(namaTim)) return

    const rinci = peserta.rincis?.[0]
    daftarTim.set(namaTim, {
      id: peserta.id,
      nama: namaTim,
      atlet: [rinci?.nama_atlet_satu, rinci?.nama_atlet_dua].filter(Boolean),
    })
  })

  return [...daftarTim.values()]
})
const pasanganBagan = computed(() => store.pasangan)
const gunakanSusunanDefault = computed(() => !store.pasangan.length)

const jumlahPertandinganAwal = computed(() => {
  const kuota = Number(store.event?.kuota_peserta)
  if (!Number.isInteger(kuota) || kuota < 2) return 0

  return pangkatDuaBerikutnya(Math.ceil(kuota / 2)) / 2
})
const baganDasar = computed(() =>
  buatBagan(
    timTerdaftar.value,
    store.event?.kuota_peserta,
    JARAK_BARIS,
    pasanganBagan.value,
    gunakanSusunanDefault.value,
  ),
)
const skalaLebarBagan = computed(() => {
  if (!baganDasar.value || !lebarViewport.value) return 1

  return Math.min(
    1,
    Math.max(0.1, (lebarViewport.value - ruangTombolKanan.value - 8) / baganDasar.value.lebar),
  )
})
const jarakBarisBagan = computed(() => {
  if (!jumlahPertandinganAwal.value) return JARAK_BARIS

  const tinggiTarget = (tinggiLayar.value - TINGGI_AREA_BAGAN) / skalaLebarBagan.value
  return Math.max(JARAK_BARIS, (tinggiTarget - PADDING * 2) / jumlahPertandinganAwal.value)
})
const bagan = computed(() =>
  buatBagan(
    timTerdaftar.value,
    store.event?.kuota_peserta,
    jarakBarisBagan.value,
    pasanganBagan.value,
    gunakanSusunanDefault.value,
  ),
)
const watermarkDomino = computed(() => {
  if (!bagan.value) return []

  const { lebar, tinggi, pertandingan, final, juaraTiga } = bagan.value
  const lebarDomino = 28
  const tinggiDomino = 42
  const margin = 8
  const areaTerpakai = [
    ...pertandingan.map((match) => ({ x: match.x, y: match.y, lebar: LEBAR_KARTU, tinggi: TINGGI_KARTU })),
    { x: final.x, y: final.y, lebar: LEBAR_KARTU, tinggi: TINGGI_KARTU },
    { x: juaraTiga.x, y: juaraTiga.y, lebar: LEBAR_KARTU, tinggi: TINGGI_KARTU + 38 },
    { x: bagan.value.identitasEventX, y: bagan.value.identitasEventY, lebar: 440, tinggi: 160 },
    { x: bagan.value.watermarkX, y: bagan.value.watermarkY, lebar: 520, tinggi: 520 },
    { x: final.x - 54, y: bagan.value.hasilAkhirY, lebar: 250, tinggi: 250 },
  ]
  const berbenturan = (x, y, area) =>
    x < area.x + area.lebar + margin &&
    x + lebarDomino + margin > area.x &&
    y < area.y + area.tinggi + margin &&
    y + tinggiDomino + margin > area.y
  const kandidat = []

  for (let y = 18; y <= tinggi - tinggiDomino - 18; y += 54) {
    for (let x = 18; x <= lebar - lebarDomino - 18; x += 32) {
      if (!areaTerpakai.some((area) => berbenturan(x, y, area))) kandidat.push({ x, y })
    }
  }

  const domino = []
  const kombinasiNilai = [
    [1, 3],
    [2, 5],
    [6, 1],
    [4, 6],
    [0, 2],
    [5, 4],
    [3, 0],
  ]
  const kandidatAcak = kandidat.sort(
    (a, b) => ((a.x * 17 + a.y * 11) % 97) - ((b.x * 17 + b.y * 11) % 97),
  )
  for (const kandidatDomino of kandidatAcak) {
    const terlaluDekat = domino.some(
      (item) => Math.hypot(item.x - kandidatDomino.x, item.y - kandidatDomino.y) < 60,
    )
    if (terlaluDekat) continue

    const nilai = kombinasiNilai[domino.length % kombinasiNilai.length]
    domino.push({
      id: domino.length + 1,
      ...kandidatDomino,
      putaran: ((kandidatDomino.x * 3 + kandidatDomino.y) % 36) - 18,
      atas: nilai[0],
      bawah: nilai[1],
    })
    if (domino.length === 28) break
  }

  return domino
})
const skalaBagan = computed(() => {
  if (!bagan.value || !lebarViewport.value) return 1

  return Math.min(
    1,
    Math.max(0.1, (lebarViewport.value - ruangTombolKanan.value - 8) / bagan.value.lebar),
    Math.max(0.1, (tinggiLayar.value - TINGGI_AREA_BAGAN) / bagan.value.tinggi),
  )
})
const offsetKiriBagan = computed(() => {
  if (!bagan.value || !lebarViewport.value) return 0

  return Math.max(
    0,
    (lebarViewport.value - ruangTombolKanan.value - bagan.value.lebar * skalaBagan.value) / 2,
  )
})
const tinggiBaganTampil = computed(() => (bagan.value ? bagan.value.tinggi * skalaBagan.value : 0))
const skalaCetakBagan = computed(() => {
  if (!bagan.value) return 1

  return Math.min(2.2, 3000 / bagan.value.lebar, 2100 / bagan.value.tinggi)
})

onMounted(async () => {
  window.addEventListener('resize', perbaruiTinggiLayar)
  document.addEventListener('fullscreenchange', perbaruiStatusFullscreen)
  document.addEventListener('keydown', tanganiTombolEscape)
  if (route.query.isi) await router.replace({ path: route.path })
  await store.getBagan(route.params.eventId)
  await nextTick()
  amatiUkuranBagan()
})
watch(bagan, () => nextTick(amatiUkuranBagan))
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', perbaruiTinggiLayar)
  document.removeEventListener('fullscreenchange', perbaruiStatusFullscreen)
  document.removeEventListener('keydown', tanganiTombolEscape)
})

function perbaruiTinggiLayar() {
  tinggiLayar.value = window.innerHeight
}

function perbaruiStatusFullscreen() {
  isFullscreen.value = document.fullscreenElement === document.documentElement
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await document.documentElement.requestFullscreen()
}

async function tanganiTombolEscape(event) {
  if (event.key === 'Escape' && document.fullscreenElement) await document.exitFullscreen()
}

function amatiUkuranBagan() {
  if (!bracketViewport.value) return

  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(([entry]) => {
    lebarViewport.value = entry.contentRect.width
  })
  resizeObserver.observe(bracketViewport.value)
}

function buatBagan(daftarTim, kuotaEvent, jarakBaris, daftarPasangan, gunakanSusunanDefault) {
  const kuota = Number(kuotaEvent)
  if (!Number.isInteger(kuota) || kuota < 2) return null

  const kuotaKiri = Math.ceil(kuota / 2)
  const kuotaKanan = Math.floor(kuota / 2)
  const slotBaganPerSisi = pangkatDuaBerikutnya(Math.max(kuotaKiri, kuotaKanan))
  const jumlahRonde = Math.log2(slotBaganPerSisi)
  const jumlahPertandinganAwal = slotBaganPerSisi / 2
  const tinggiPertandingan = jumlahPertandinganAwal * jarakBaris + PADDING * 2
  const tinggi = tinggiPertandingan + TINGGI_KARTU + PADDING
  const langkahX = LEBAR_KARTU + JARAK_RONDE
  const xKiriAkhir = PADDING + (jumlahRonde - 1) * langkahX
  const xFinal = xKiriAkhir + LEBAR_KARTU + JARAK_FINAL
  const xKananAkhir = xFinal + LEBAR_KARTU + JARAK_FINAL
  const lebar = xKananAkhir + (jumlahRonde - 1) * langkahX + LEBAR_KARTU + PADDING
  const batasTimKiri = Math.ceil(daftarTim.length / 2)
  const timKiri = isiSlot(
    gunakanSusunanDefault ? daftarTim.slice(0, batasTimKiri) : [],
    slotBaganPerSisi,
  )
  const timKanan = isiSlot(
    gunakanSusunanDefault ? daftarTim.slice(batasTimKiri, kuota) : [],
    slotBaganPerSisi,
  )
  const pertandingan = [
    ...buatSisi('kiri', timKiri, jumlahRonde, langkahX, PADDING, tinggiPertandingan, jarakBaris, 0),
    ...buatSisi(
      'kanan',
      timKanan,
      jumlahRonde,
      langkahX,
      lebar - PADDING - LEBAR_KARTU,
      tinggiPertandingan,
      jarakBaris,
      jumlahPertandinganAwal,
    ),
  ]
  const urutanPertandingan = []
  for (let ronde = 0; ronde < jumlahRonde; ronde += 1) {
    urutanPertandingan.push(
      ...pertandingan.filter((match) => match.ronde === ronde && match.sisi === 'kiri'),
      ...pertandingan.filter((match) => match.ronde === ronde && match.sisi === 'kanan'),
    )
  }
  urutanPertandingan.forEach((match, index) => {
    match.nomorPertandingan = index + 1
  })

  const final = {
    id: 'final',
    ronde: jumlahRonde,
    nomorPertandingan: urutanPertandingan.length + 1,
    x: xFinal,
    y: tinggiPertandingan / 2 - TINGGI_KARTU / 2,
    timSatu: timMenunggu(),
    timDua: timMenunggu(),
    pemenang: null,
  }
  const juaraTiga = {
    id: 'juara-tiga',
    ronde: jumlahRonde,
    nomorPertandingan: final.nomorPertandingan + 1,
    x: xFinal,
    y: final.y + TINGGI_KARTU + 18,
    timSatu: timMenunggu(),
    timDua: timMenunggu(),
    pemenang: null,
  }
  const pasanganBerdasarkanNomor = new Map(
    daftarPasangan.map((pasangan) => [pasangan.nomor_pertandingan, pasangan]),
  )
  const timBerdasarkanId = new Map(daftarTim.map((tim) => [tim.id, tim]))

  ;[...pertandingan, final, juaraTiga].forEach((match) => {
    const pasangan = pasanganBerdasarkanNomor.get(match.nomorPertandingan)
    if (!pasangan) return

    match.timSatu = timBerdasarkanId.get(pasangan.tim_satu_id) || timKosong(match.ronde)
    match.timDua = timBerdasarkanId.get(pasangan.tim_dua_id) || timKosong(match.ronde)
    match.pemenang = timBerdasarkanId.get(pasangan.pemenang_id) || null
  })
  final.juaraDua = final.pemenang
    ? [final.timSatu, final.timDua].find((tim) => tim.id !== final.pemenang.id) || null
    : null

  const identitasEventY = Math.max(PADDING + 12, final.y - 390)
  const hasilAkhirY = Math.max(identitasEventY + 160, final.y - 230)

  return {
    kuota,
    kuotaKiri,
    kuotaKanan,
    lebar,
    tinggi,
    pertandingan,
    final,
    juaraTiga,
    hasilAkhirY,
    identitasEventX: final.x + LEBAR_KARTU / 2 - 220,
    identitasEventY,
    watermarkX: lebar / 2 - 260,
    watermarkY: tinggi / 2 - 260,
    jalur: buatJalur(pertandingan, jumlahRonde, final),
  }
}

function isiSlot(daftarTim, jumlahSlot) {
  return Array.from({ length: jumlahSlot }, (_, index) => ({
    nama: daftarTim[index]?.nama || 'Slot kosong',
    atlet: daftarTim[index]?.atlet || [],
    kosong: daftarTim[index]?.kosong ?? !daftarTim[index],
  }))
}

function timKosong(ronde) {
  return ronde === 0 ? { nama: 'Slot kosong', atlet: [], kosong: true } : timMenunggu()
}

function timMenunggu() {
  return { nama: 'Menunggu pemenang', atlet: [], kosong: true }
}

function detailAtlet(tim) {
  if (tim.kosong) return ''
  if (!tim.atlet.length) return 'Data atlet belum tersedia.'

  return `Atlet tim:\n${tim.atlet.join('\n')}`
}

function pipDomino(nilai, bagianBawah) {
  const posisi = {
    0: [],
    1: [[50, 42]],
    2: [[34, 28], [66, 56]],
    3: [[34, 28], [50, 42], [66, 56]],
    4: [[34, 28], [66, 28], [34, 56], [66, 56]],
    5: [[34, 28], [66, 28], [50, 42], [34, 56], [66, 56]],
    6: [[34, 26], [66, 26], [34, 42], [66, 42], [34, 58], [66, 58]],
  }

  return (posisi[nilai] || []).map(([x, y]) => ({ x, y: y + (bagianBawah ? 66 : 0) }))
}

function buatSisi(sisi, daftarTim, jumlahRonde, langkahX, xAwal, tinggi, jarakBaris, nomorAwal) {
  const pertandingan = []

  for (let ronde = 0; ronde < jumlahRonde; ronde += 1) {
    const jumlahMatch = daftarTim.length / 2 ** (ronde + 1)
    for (let nomor = 0; nomor < jumlahMatch; nomor += 1) {
      const tengahMatch = PADDING + (2 ** ronde * jarakBaris) / 2 + nomor * 2 ** ronde * jarakBaris
      const awal = ronde === 0 ? nomor * 2 : 0
      const timSatu =
        ronde === 0 ? daftarTim[awal] : { nama: 'Menunggu pemenang', atlet: [], kosong: true }
      const timDua =
        ronde === 0 ? daftarTim[awal + 1] : { nama: 'Menunggu pemenang', atlet: [], kosong: true }
      const posisiX = sisi === 'kiri' ? xAwal + ronde * langkahX : xAwal - ronde * langkahX

      pertandingan.push({
        id: `${sisi}-${ronde}-${nomor}`,
        sisi,
        ronde,
        nomor,
        nomorPertandingan: ronde === 0 ? nomorAwal + nomor + 1 : null,
        x: posisiX,
        y: Math.min(tengahMatch - TINGGI_KARTU / 2, tinggi - PADDING - TINGGI_KARTU),
        tengahY: tengahMatch,
        label: ronde === 0 ? `PERTANDINGAN ${nomor + 1}` : namaRonde(jumlahMatch),
        timSatu,
        timDua,
      })
    }
  }

  return pertandingan
}

function buatJalur(pertandingan, jumlahRonde, final) {
  const jalur = []
  for (const sisi of ['kiri', 'kanan']) {
    for (let ronde = 0; ronde < jumlahRonde - 1; ronde += 1) {
      const sumber = pertandingan.filter((match) => match.sisi === sisi && match.ronde === ronde)
      const tujuan = pertandingan.filter(
        (match) => match.sisi === sisi && match.ronde === ronde + 1,
      )

      for (let index = 0; index < sumber.length; index += 2) {
        const pertama = sumber[index]
        const kedua = sumber[index + 1]
        const target = tujuan[index / 2]
        const keluar = sisi === 'kiri' ? pertama.x + LEBAR_KARTU : pertama.x
        const keluarKedua = sisi === 'kiri' ? kedua.x + LEBAR_KARTU : kedua.x
        const masuk = sisi === 'kiri' ? target.x : target.x + LEBAR_KARTU
        const tengahX = (keluar + masuk) / 2

        jalur.push(
          `M ${keluar} ${pertama.tengahY} H ${tengahX} V ${kedua.tengahY} H ${keluarKedua}`,
        )
        jalur.push(`M ${tengahX} ${target.tengahY} H ${masuk}`)
      }
    }

    const terakhir = pertandingan.find(
      (match) => match.sisi === sisi && match.ronde === jumlahRonde - 1,
    )
    const keluar = sisi === 'kiri' ? terakhir.x + LEBAR_KARTU : terakhir.x
    const masuk = sisi === 'kiri' ? final.x : final.x + LEBAR_KARTU
    jalur.push(`M ${keluar} ${terakhir.tengahY} H ${masuk}`)
  }

  return jalur
}

function pangkatDuaBerikutnya(angka) {
  return 2 ** Math.ceil(Math.log2(Math.max(angka, 2)))
}

function namaRonde(jumlahMatch) {
  if (jumlahMatch === 1) return 'FINAL SISI'
  if (jumlahMatch === 2) return 'SEMIFINAL'
  if (jumlahMatch === 4) return 'PEREMPAT FINAL'
  return `RONDE ${jumlahMatch * 2}`
}
</script>

<style scoped>
.bracket-page {
  position: fixed;
  top: 58px;
  right: 0;
  left: 0;
  z-index: 1;
  height: calc(100vh - 58px);
  width: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 0;
  background:
    radial-gradient(circle at 50% 38%, rgba(44, 119, 191, 0.08), transparent 30%),
    linear-gradient(
      135deg,
      rgba(34, 117, 195, 0.1) 0 7%,
      transparent 7% 49%,
      rgba(34, 117, 195, 0.05) 49% 57%,
      transparent 57%
    ),
    linear-gradient(135deg, #eaf4ff 0%, #fff 30%, #f8fbff 70%, #e7f2ff 100%);
}
.bracket-content {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
}
.back-button {
  position: absolute;
  z-index: 3;
  top: 4px;
  right: 4px;
  border: 1px solid rgba(179, 197, 215, 0.8);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(27, 57, 96, 0.12);
}
.fullscreen-button {
  position: absolute;
  z-index: 3;
  top: 48px;
  right: 4px;
  border: 1px solid rgba(179, 197, 215, 0.8);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(27, 57, 96, 0.12);
}
.match-card,
.champion-mark,
.empty-state {
  color: #000;
}
.bracket-board,
.empty-state {
  overflow: hidden;
  border: 1px solid #b9d8f2;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 14px 34px rgba(24, 73, 128, 0.16);
}
.empty-state {
  border-radius: 18px;
}
.bracket-footer {
  position: relative;
  display: grid;
  height: 56px;
  flex: none;
  align-content: center;
  justify-items: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  background:
    linear-gradient(135deg, transparent 0 89%, #efbe2d 89% 92%, transparent 92%),
    linear-gradient(
      135deg,
      rgba(16, 96, 174, 0.4) 0 12%,
      transparent 12% 24%,
      rgba(16, 96, 174, 0.23) 24% 36%,
      transparent 36%
    ),
    linear-gradient(135deg, #032c5c, #064d91 52%, #032a58);
  color: #fff;
  text-align: center;
}
.bracket-footer::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 110px;
  background: linear-gradient(135deg, rgba(0, 20, 50, 0.36) 0 42%, transparent 42%);
  content: '';
}
.bracket-footer-message,
.bracket-footer-tags {
  position: relative;
  z-index: 1;
}
.bracket-footer-message {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  line-height: 1.2;
}
.bracket-footer-message :deep(.q-icon) {
  color: #f5bf2f;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.28));
}
.bracket-footer-tags {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.94);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15px;
}
.bracket-viewport {
  position: relative;
  overflow: hidden;
  transition: height 0.2s ease;
  background-color: #172738;
  background-image: linear-gradient(
    135deg,
    rgba(81, 171, 244, 0.16) 0 7%,
    transparent 7% 48%,
    rgba(81, 171, 244, 0.08) 48% 58%,
    transparent 58%
  );
}
.bracket-canvas {
  position: relative;
  min-width: 100%;
  transform-origin: top left;
}
.event-watermark {
  position: absolute;
  z-index: 0;
  width: 520px;
  height: 520px;
  opacity: 0.1;
  filter: brightness(0) invert(1);
  pointer-events: none;
}
.domino-watermark {
  position: absolute;
  z-index: 0;
  width: 28px;
  height: 42px;
  overflow: visible;
  opacity: 0.72;
  transform-origin: center;
  pointer-events: none;
}
.domino-watermark rect,
.domino-watermark path {
  fill: rgba(67, 145, 212, 0.08);
  stroke: rgba(111, 186, 243, 0.3);
  stroke-width: 2.5;
}
.domino-watermark path { fill: none; }
.domino-watermark circle { fill: rgba(111, 186, 243, 0.28); }
.event-identity {
  position: absolute;
  z-index: 2;
  display: grid;
  width: 440px;
  justify-items: center;
  padding: 15px 24px;
  box-sizing: border-box;
  border: 2px solid #f0be2f;
  border-radius: 20px;
  background:
    linear-gradient(
      135deg,
      transparent 0 16%,
      rgba(30, 113, 192, 0.2) 16% 28%,
      transparent 28% 77%,
      rgba(30, 113, 192, 0.18) 77%
    ),
    linear-gradient(135deg, #04366f, #0759a5 55%, #043165);
  box-shadow:
    0 10px 22px rgba(9, 61, 116, 0.25),
    inset 0 1px rgba(255, 255, 255, 0.25);
  color: #fff;
  pointer-events: none;
  text-align: center;
}
.event-identity span {
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 3px;
}
.event-identity span em {
  color: #f4c33b;
  font-style: normal;
}
.event-identity strong {
  display: -webkit-box;
  max-width: 100%;
  margin: 6px 0 7px;
  overflow: hidden;
  color: #fff;
  font-size: 29px;
  font-weight: 900;
  letter-spacing: -0.4px;
  line-height: 1.08;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.event-identity small {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5f2ff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
}
.bracket-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bracket-lines path {
  fill: none;
  stroke: #58abef;
  stroke-width: 1.8;
}
.match-card {
  position: absolute;
  z-index: 1;
  width: 142px;
  overflow: visible;
}
.match-card--final {
  width: 142px;
}
.match-card--third-place {
  width: 142px;
}
.third-place-label {
  width: max-content;
  margin: 0 auto 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #07569f;
  color: #fff;
  font-size: 8px;
  font-weight: 900;
  line-height: 1;
  text-align: center;
}
.third-place-result {
  margin-bottom: 3px;
  color: #07569f;
  font-size: 8px;
  font-weight: 900;
  line-height: 1;
  text-align: center;
}
.match-card--third-place .team-slot {
  border-color: #a76b00;
  background: #fff7e4;
}
.team-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 24px;
  min-height: 0;
  gap: 4px;
  padding: 2px 6px;
  margin-bottom: 2px;
  border: 1px solid #d04444;
  border-radius: 7px;
  background: linear-gradient(180deg, #fff7f7, #ffd1d1);
  box-shadow: 0 4px 10px rgba(157, 42, 42, 0.22);
  color: #861f1f;
  font-size: 12px;
  font-weight: 700;
}
.match-card--final .team-slot {
  border-color: #e4a81e;
  background: linear-gradient(180deg, #fffdf5, #ffefbd);
}
.team-slot + .team-slot:not(.team-slot--kosong) {
  border-color: #d6a313;
  background: linear-gradient(180deg, #fffbed, #ffe49a);
  color: #765508;
}
.team-slot span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.team-slot--kosong {
  border-color: #b4c8dc !important;
  background: linear-gradient(180deg, #fafdff, #eaf2fa) !important;
  color: #54708d !important;
  font-style: italic;
  font-weight: 500;
}
.champion-mark {
  position: absolute;
  display: flex;
  width: 250px;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  color: #0a4f94;
}
.champion-trophy {
  position: relative;
  display: grid;
  width: 136px;
  height: 82px;
  place-items: center;
}
.champion-trophy img {
  display: block;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 4px rgba(128, 83, 0, 0.28));
  transform: translateY(-42px);
}
.champion-title {
  margin: 0 0 8px;
  padding: 6px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #063c76, #0a69b8);
  box-shadow: 0 4px 8px rgba(12, 72, 129, 0.18);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.3px;
  text-align: center;
}
.champion-result {
  width: 100%;
  overflow: hidden;
  border: 1px solid #e5a820;
  border-radius: 10px;
  background: linear-gradient(135deg, #fffdf4, #fff0c9);
  box-shadow: 0 7px 14px rgba(117, 85, 23, 0.16);
}
.champion-result-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 7px;
  align-items: center;
  padding: 5px 9px;
  font-size: 11px;
  line-height: 1.15;
}
.champion-result-row + .champion-result-row {
  border-top: 1px solid #ecd69e;
}
.champion-result-row span {
  padding: 4px 5px;
  border-radius: 5px;
  background: #e0e6eb;
  color: #173d65;
  font-weight: 900;
  text-align: center;
}
.champion-result-row:first-child span {
  background: #f1bd2b;
  color: #1f2c3a;
}
.champion-result-row:last-child span {
  background: #d88943;
  color: #fff;
}
.champion-result-row strong {
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.empty-state {
  padding: 34px;
  font-size: 12px;
  text-align: center;
}
.dialog-pertandingan {
  width: min(92vw, 460px);
  border-radius: 14px;
}
.dialog-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.dialog-heading strong,
.dialog-heading span {
  display: block;
  color: #000;
}
.dialog-heading strong {
  font-size: 16px;
}
.dialog-heading span {
  margin-top: 4px;
  font-size: 12px;
}
.dialog-form {
  display: grid;
  gap: 12px;
}

@media print {
  @page {
    size: A1 landscape;
    margin: 8mm;
  }

  :global(.q-header),
  :global(.q-drawer),
  :global(.q-footer) {
    display: none !important;
  }

  :global(.q-page-container) {
    padding: 0 !important;
  }

  .bracket-page {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    background: #fff;
  }

  .bracket-content {
    display: block;
    height: auto;
  }

  .back-button,
  .bracket-footer {
    display: none !important;
  }

  .bracket-board {
    overflow: visible;
    border: 0;
    box-shadow: none;
  }

  .bracket-viewport {
    width: var(--lebar-cetak) !important;
    height: var(--tinggi-cetak) !important;
    overflow: visible;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .bracket-canvas {
    min-width: 0;
    transform: scale(var(--skala-cetak)) !important;
  }
}

</style>
