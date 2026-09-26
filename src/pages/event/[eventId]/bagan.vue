<template>
  <header class="app-header">
    <q-toolbar class="sso-toolbar">
      <router-link class="header-brand" to="/">
        <q-avatar size="30px" class="header-logo">
          <img :src="logoOrado" alt="ORADO" />
        </q-avatar>
        <q-toolbar-title>ORADO Kota Probolinggo</q-toolbar-title>
      </router-link>
    </q-toolbar>
  </header>
  <BaganPage />
</template>

<script setup>
import logoOrado from '@/assets/orado/logo-white.svg'
import BaganPage from '@/components/BracketTurnamen/BaganPage.vue'
</script>

<style scoped>
.app-header {
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  border-bottom: 2px solid #eab52c;
  color: #fff;
  background:
    linear-gradient(
      135deg,
      transparent 0 6%,
      rgba(234, 181, 44, 0.95) 6% 7.4%,
      transparent 7.4% 88%,
      rgba(8, 43, 91, 0.68) 88%
    ),
    linear-gradient(135deg, #042e62 0%, #07549a 50%, #052f63 100%);
}
.sso-toolbar {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: none;
  min-height: 58px;
  justify-content: center;
  padding: 0 10px;
}
.header-brand {
  display: flex;
  max-width: calc(100vw - 116px);
  flex: none;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-decoration: none;
}
.header-logo {
  display: grid;
  width: 50px !important;
  height: 50px !important;
  flex: none;
  place-items: center;
  background: transparent;
}
.header-logo img {
  width: 43px;
  height: 43px;
  object-fit: contain;
}
.header-brand :deep(.q-toolbar__title) {
  flex: none;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.35px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .header-brand :deep(.q-toolbar__title) { font-size: 20px; }
}
</style>
