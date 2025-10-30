<template>
  <div class="image-processing">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back-icon" @click="handleBack">
        <img src="@/assets/assess/left.png" alt="返回" />
      </div>
      <div class="title">图片处理</div>
    </div>

    <!-- 右侧画布区域 -->
    <div class="canvas-area">
      <ExcalidrawEditor
        :initial-elements="[]"
        :read-only="false"
      />
    </div>
  </div>
</template>

<script setup>
import ExcalidrawEditor from '@/components/Excalidraw.vue'

defineProps({
  image: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const handleBack = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.image-processing {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: #F7FAFC;

  // 顶部导航栏
  .header {
    position: absolute;
    width: 100%;
    height: 54px;
    left: 0;
    top: 0;
    background: #FFFFFF;
    border-bottom: 1px solid #E6E5EB;
    display: flex;
    align-items: center;
    padding: 0 16px;

    .back-icon {
      width: 20px;
      height: 20px;
      margin-right: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .title {
      font-family: 'PingFang SC';
      font-size: 20px;
      line-height: 28px;
      color: #2B2B2B;
      display: flex;
      align-items: center;
    }
  }

  // 画布区域
  .canvas-area {
    position: absolute;
    width: 100%;
    height: calc(100% - 54px);
    left: 0;
    top: 54px;
    background: #FFFFFF;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style> 