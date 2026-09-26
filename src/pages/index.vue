<template>
  <q-page class="home-page">
    <header class="topbar">
      <div class="brand">
        <span class="brand-logo"><img :src="logoOrado" alt="Logo ORADO" /></span>
        <span><strong>ORADO</strong><small>EVENT REGISTRATION</small></span>
      </div>
      <q-badge rounded color="blue-1" text-color="primary" label="KOTA PROBOLINGGO" />
    </header>

    <main class="content">
      <section class="hero">
        <div class="domino-pattern" aria-hidden="true">
          <svg
            v-for="domino in dominoDecorations"
            :key="domino.id"
            class="domino-outline"
            :style="domino.style"
            viewBox="0 0 64 104"
          >
            <rect x="4" y="4" width="56" height="96" rx="11" />
            <path d="M8 52h48" />
            <circle cx="20" cy="27" r="3" />
            <circle cx="44" cy="42" r="3" />
            <circle cx="20" cy="66" r="3" />
            <circle cx="44" cy="80" r="3" />
          </svg>
        </div>
        <div class="hero-copy">
          <span class="eyebrow"><q-icon name="verified" /> PENDAFTARAN RESMI ORADO</span>
          <h1>ORADO KOTA PROBOLINGGO</h1>
          <p>Pilih event, daftarkan tim dan atlet, lalu simpan bukti registrasi dengan cepat.</p>
          <div class="hero-actions">
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="how_to_reg"
              label="Daftar Event"
              to="/pendaftaran"
            />
            <q-btn
              outline
              no-caps
              color="white"
              icon="print"
              label="Cetak Bukti"
              to="/cetak-bukti"
            />
          </div>
          <div class="trust">
            <span><q-icon name="task_alt" /> Proses mudah</span
            ><span><q-icon name="security" /> Data aman</span
            ><span><q-icon name="devices" /> Semua perangkat</span>
          </div>
          <div class="campaign-tagline">
            <small>SEMANGAT • SPORTIF • JUARA</small>
            <strong>#DominoNaikKelas</strong>
          </div>
        </div>
      </section>

      <section class="services">
        <div class="section-heading">
          <span>LAYANAN UTAMA</span>
        </div>
        <div class="service-grid">
          <article
            class="service-card"
            tabindex="0"
            @click="$router.push('/pendaftaran')"
            @keyup.enter="$router.push('/pendaftaran')"
          >
            <span class="service-icon"><q-icon name="edit_note" /></span>
            <div>
              <small>01</small>
              <h3>Pendaftaran Event</h3>
              <p>Pilih event yang tersedia dan daftarkan tim beserta dua atlet.</p>
              <b>Mulai daftar <q-icon name="arrow_forward" /></b>
            </div>
          </article>
          <article
            class="service-card"
            tabindex="0"
            @click="$router.push('/cetak-bukti')"
            @keyup.enter="$router.push('/cetak-bukti')"
          >
            <span class="service-icon"><q-icon name="receipt_long" /></span>
            <div>
              <small>02</small>
              <h3>Cetak Bukti</h3>
              <p>Cari nomor registrasi, periksa data, lalu cetak bukti pendaftaran.</p>
              <b>Cari bukti <q-icon name="arrow_forward" /></b>
            </div>
          </article>
          <article
            class="service-card"
            tabindex="0"
            @click="$router.push('/event')"
            @keyup.enter="$router.push('/event')"
          >
            <span class="service-icon"><q-icon name="event" /></span>
            <div>
              <small>03</small>
              <h3>List Event</h3>
              <p>Lihat daftar event ORADO yang pendaftarannya sedang dibuka.</p>
              <b>Lihat event <q-icon name="arrow_forward" /></b>
            </div>
          </article>
        </div>
      </section>
    </main>
    <footer>
      <span>Didukung oleh</span>
      <strong>CV. Udumbara Informatika</strong>
      <small>© {{ new Date().getFullYear() }} ORADO Kota Probolinggo</small>
    </footer>
  </q-page>
</template>

<script setup>
import logoOrado from '@/assets/orado/logo-white.svg'

const dominoDecorations = [
  { id: 1, style: { top: '6%', right: '9%', transform: 'rotate(19deg) scale(1.08)' } },
  { id: 2, style: { top: '18%', right: '28%', transform: 'rotate(-13deg) scale(0.7)' } },
  { id: 3, style: { top: '46%', right: '12%', transform: 'rotate(28deg) scale(0.84)' } },
  { id: 4, style: { bottom: '-9%', right: '33%', transform: 'rotate(-23deg) scale(1.1)' } },
  { id: 5, style: { bottom: '7%', right: '5%', transform: 'rotate(10deg) scale(0.58)' } },
  { id: 6, style: { top: '-15%', right: '46%', transform: 'rotate(-28deg) scale(0.65)' } },
  { id: 7, style: { bottom: '-18%', left: '4%', transform: 'rotate(31deg) scale(0.76)' } },
]
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  color: #12375f;
  background: radial-gradient(circle at 90% 0, #ddecff 0, transparent 28%), #f5f8fc;
}
.topbar,
.content {
  width: min(1160px, 100%);
  margin: auto;
  padding-right: 28px;
  padding-left: 28px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
  padding-bottom: 18px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
}
.brand-logo {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  padding: 5px;
  border-radius: 14px;
  background: linear-gradient(145deg, #002f6d, #0877d1);
  box-shadow: 0 9px 22px #075fb53d;
}
.brand-logo img {
  width: 37px;
  height: 37px;
  object-fit: contain;
}
.brand > span:last-child strong,
.brand > span:last-child small {
  display: block;
}
.brand strong {
  font-size: 18px;
}
.brand small {
  margin-top: 2px;
  color: #6580a2;
  font-size: 9px;
  letter-spacing: 1.2px;
}
.content {
  padding-top: 16px;
  padding-bottom: 40px;
}
.hero {
  position: relative;
  display: flex;
  min-height: 420px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 58px 7%;
  border-radius: 30px;
  color: #fff;
  background: linear-gradient(130deg, #002657 0%, #034d96 52%, #0983dc 100%);
  box-shadow: 0 24px 55px #083e7829;
}
.hero:after {
  position: absolute;
  right: -130px;
  bottom: -210px;
  width: 530px;
  height: 530px;
  border: 80px solid #ffffff0d;
  border-radius: 50%;
  content: '';
}
.domino-pattern {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.domino-outline {
  position: absolute;
  width: 64px;
  height: 104px;
  fill: none;
  stroke: #d9f0ff;
  stroke-linecap: round;
  stroke-width: 2;
  opacity: 0.14;
}
.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 720px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #bfe3ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
}
.hero h1 {
  max-width: 600px;
  margin: 13px 0 14px;
  font-size: clamp(35px, 5vw, 58px);
  line-height: 1.04;
  letter-spacing: -1.5px;
}
.hero p {
  max-width: 520px;
  margin: 0;
  color: #d8ecff;
  font-size: 16px;
  line-height: 1.65;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 27px;
}
.hero-actions .q-btn {
  min-height: 47px;
  padding: 0 19px;
  border-radius: 11px;
  font-weight: 700;
}
.trust {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 29px;
  color: #c5e4ff;
  font-size: 11px;
}
.trust span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.campaign-tagline {
  display: grid;
  width: fit-content;
  margin-top: 22px;
  padding: 10px 16px;
  border: 1px solid #ffffff3d;
  border-radius: 14px;
  background: #ffffff12;
  backdrop-filter: blur(8px);
}
.campaign-tagline small {
  color: #bfe3ff;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}
.campaign-tagline strong {
  margin-top: 2px;
  color: #fff;
  font-size: 19px;
  letter-spacing: 0.2px;
}
.services {
  padding: 51px 0 10px;
}
.section-heading span {
  color: #0870c8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}
.section-heading h2 {
  margin: 5px 0 5px;
  font-size: 29px;
}
.section-heading p {
  margin: 0;
  color: #6a82a0;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
  margin-top: 20px;
}
.service-card {
  display: flex;
  gap: 17px;
  min-height: 190px;
  padding: 24px;
  border: 1px solid #d9e4f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 7px 22px #174e870a;
  cursor: pointer;
  transition: 0.2s ease;
}
.service-card:hover,
.service-card:focus {
  border-color: #a7ccef;
  box-shadow: 0 17px 35px #174e8717;
  outline: 0;
  transform: translateY(-4px);
}
.service-icon {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  place-items: center;
  border-radius: 15px;
  color: #0870ca;
  background: #e7f3ff;
}
.service-icon .q-icon {
  font-size: 29px;
}
.service-card div {
  min-width: 0;
  flex: 1;
}
.service-card small {
  float: right;
  color: #c7d6e6;
  font-size: 24px;
  font-weight: 800;
}
.service-card h3 {
  margin: 5px 0 8px;
  color: #133f70;
  font-size: 20px;
}
.service-card p {
  margin: 0;
  color: #647d9b;
  line-height: 1.55;
}
.service-card b {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 19px;
  color: #0769c0;
  font-size: 13px;
}
footer {
  display: grid;
  gap: 2px;
  padding: 24px;
  text-align: center;
  color: #7187a2;
  font-size: 12px;
}
footer span {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
footer strong {
  color: #123f70;
  font-size: 14px;
}
footer small {
  margin-top: 5px;
}
@media (max-width: 800px) {
  .hero {
    min-height: 380px;
  }
}
@media (max-width: 640px) {
  .topbar,
  .content {
    padding-right: 16px;
    padding-left: 16px;
  }
  .topbar .q-badge {
    display: none;
  }
  .hero {
    display: block;
    min-height: 0;
    padding: 38px 25px;
    border-radius: 23px;
  }
  .domino-outline {
    opacity: 0.1;
  }
  .hero h1 {
    font-size: 35px;
    letter-spacing: -0.7px;
  }
  .hero p {
    font-size: 14px;
  }
  .trust {
    gap: 11px;
  }
  .services {
    padding-top: 35px;
  }
  .service-grid {
    grid-template-columns: 1fr;
  }
  .service-card {
    min-height: 0;
    padding: 19px;
  }
  .section-heading h2 {
    font-size: 25px;
  }
}
</style>
