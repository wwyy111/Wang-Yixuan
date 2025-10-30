<!-- components/WavyBackground.vue -->
<template>
  <div ref="canvasContainer" class="wavy-container"></div>
</template>

<script>
export default {
  name: "WavyBackground",
  props: {
    colors: {
      type: Array,
      default: () => [
        "#F00911",
        "#F3AA00",
        "#F6EE0B",
        "#39E90D",
        "#195ED2",
        "#F00911",
      ],
    },
    seed: {
      type: Number,
      default: 1000,
    },
  },
  mounted() {
    // 初始化波浪背景
    this.wavyBg = new window.WavyWavesBg({
      dom: this.$refs.canvasContainer,
      colors: this.colors,
      seed: this.seed,
    });
  },
  beforeUnmount() {
    // 销毁实例，避免内存泄漏
    if (this.wavyBg) {
      this.wavyBg.destroy();
      this.wavyBg = null;
    }
  },
};
</script>

<style scoped>
.wavy-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
