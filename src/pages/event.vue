<template>
  <router-view v-if="route.params.eventId" />

  <q-page v-else class="event-page">
    <header class="page-header">
      <div class="header-content">
        <router-link class="brand" to="/" aria-label="Kembali ke beranda ORADO">
          <span class="brand-logo"><img :src="logoOrado" alt="Logo ORADO" /></span>
          <span><strong>ORADO</strong><small>EVENT REGISTRATION</small></span>
        </router-link>
        <q-btn flat no-caps color="white" icon="home" label="Beranda" to="/" />
      </div>
    </header>

    <main class="event-content">
      <header class="page-heading">
        <div>
          <span>LIST EVENT</span>
          <p>Pilih event untuk melanjutkan pendaftaran.</p>
        </div>
        <q-btn round flat icon="arrow_back" color="black" aria-label="Kembali" to="/" />
      </header>

      <ListEvent
        :has-next-page="store.hasNextPage"
        :items="store.items"
        :loading="store.loading"
        @muat-berikutnya="onLoad"
      />
    </main>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logoOrado from '@/assets/orado/logo-white.svg'
import ListEvent from '@/components/ListEvent.vue'
import { useEventStore } from '@/stores/event'

const store = useEventStore()
const route = useRoute()

onMounted(() => store.resetData())

async function onLoad(_index, done) {
  await store.loadNextPage()
  done(!store.hasNextPage)
}

</script>

<style scoped>
.event-page {
  min-height: 100vh;
  background: #f5f7fb;
}
.page-header {
  background: linear-gradient(110deg, #00285c, #076cc4);
  box-shadow: 0 5px 18px #0035662e;
}
.header-content,
.event-content {
  width: min(720px, 100%);
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
.event-content {
  min-height: calc(100vh - 76px);
  padding-top: 20px;
  padding-bottom: 40px;
}
.page-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 17px;
}
.page-heading span {
  color: #000;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
}
.page-heading p {
  margin: 4px 0 0;
  color: #000;
  font-size: 12px;
}
@media (max-width: 640px) {
  .header-content,
  .event-content {
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
  .event-content {
    min-height: calc(100vh - 67px);
  }
}
</style>
