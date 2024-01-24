<template>
  <!-- 全局展示功能 -->
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
// screenfull.request()检请求全屏某个元素，即进入全屏的时候，只显示某个元素，退出全屏后进入正常状态，使用时必须传 DOM 请求参数。
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {//screenfull.enabled 检测全屏插件是否可用，返回的是一个 Boolean 值
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()//screenfull.toggle()请求全屏，如果当前是全屏则会退出全屏。
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen//screenfull.isFullscreen返回一个布尔值，当前是否是全屏状态
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
