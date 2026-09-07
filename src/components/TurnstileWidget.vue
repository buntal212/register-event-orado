<template>
  <div class="turnstile-widget" :class="{ 'has-error': failed }">
    <div ref="container" />
    <small v-if="!siteKey">Verifikasi keamanan belum dikonfigurasi.</small>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  siteKey: { type: String, required: true },
})
const emit = defineEmits(['success', 'expired', 'error'])
const container = ref(null)
const failed = ref(false)
let widgetId = null

onMounted(async () => {
  if (!props.siteKey) return

  try {
    await loadTurnstile()
    await nextTick()
    widgetId = window.turnstile.render(container.value, {
      sitekey: props.siteKey,
      callback: (token) => {
        failed.value = false
        emit('success', token)
      },
      'expired-callback': () => emit('expired'),
      'error-callback': () => {
        failed.value = true
        emit('error')
      },
    })
  } catch {
    failed.value = true
    emit('error')
  }
})

onBeforeUnmount(() => {
  if (widgetId !== null && window.turnstile) window.turnstile.remove(widgetId)
})

function reset() {
  if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId)
}

defineExpose({ reset })

let scriptPromise
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return scriptPromise
}
</script>

<style scoped>
.turnstile-widget {
  display: flex;
  min-height: 65px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.turnstile-widget.has-error {
  border-radius: 10px;
  outline: 1px solid #e05a5a;
}
.turnstile-widget small {
  color: #b42318;
  font-size: 12px;
}
</style>
