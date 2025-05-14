<template>
  <div>
    <h1>Vue Service Worker 离线演示</h1>
    <p>断网后刷新页面，依然可以看到本页面内容。</p>
    <div v-if="!online" class="offline-tip">当前处于离线状态</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      online: navigator.onLine,
    }
  },
  mounted() {
    window.addEventListener('online', this.updateStatus)
    window.addEventListener('offline', this.updateStatus)
  },
  beforeUnmount() {
    window.removeEventListener('online', this.updateStatus)
    window.removeEventListener('offline', this.updateStatus)
  },
  methods: {
    updateStatus() {
      this.online = navigator.onLine
    },
  },
}
</script>

<style scoped lang="less">
h1 {
  font-size: calc(24 * var(--ratio, 2px));
  color: #42b983;
  margin-bottom: calc(16 * var(--ratio, 2px));
}
p {
  font-size: calc(16 * var(--ratio, 2px));
  margin-bottom: calc(12 * var(--ratio, 2px));
}
.offline-tip {
  font-size: 24px;
  color: #fff;
  background: #42b983;
  padding: calc(8 * var(--ratio, 2px)) calc(16 * var(--ratio, 2px));
  border-radius: calc(4 * var(--ratio, 2px));
}
</style>
