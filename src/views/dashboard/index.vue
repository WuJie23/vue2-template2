<template>
  <div>
    <div class="element">
      <div class="index">{{ $t('route.dashboard') }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.index {
  font-size: 12px;
  font-weight: 100;
  color: #5a5959;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.element {
  margin-top: 30px;
  margin-left: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 200px;
  height: 200px;
  border-radius: 60px;
  box-shadow: 0 0 80px #e3e3e3;
  animation: rotate 2s linear infinite;

}
</style>