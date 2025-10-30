<!-- 素材库上传弹窗 -->
<template>
  <div class="material-upload-overlay" @click.self="closeDialog">
    <div class="material-upload-dialog">
      <!-- 标题栏 -->
      <div class="dialog-header">
        <h1 class="dialog-title">素材库</h1>
        <div class="close-btn" @click="closeDialog">
          <img src="@/assets/assess/close.png" alt="关闭" />
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="dialog-content">
        <div class="materials-grid">
          <div 
            v-for="(material, index) in materials" 
            :key="index" 
            class="material-card"
            :class="{ 'selected': selectedMaterial === index }"
            @click="selectMaterial(index)"
          >
            <!-- 勾选框 -->
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                :checked="selectedMaterial === index"
                @click.stop
                @change="selectMaterial(index)"
              />
            </label>
            
            <!-- 图片预览区域 -->
            <div class="material-image">
              <img :src="material.image" alt="素材图片" />
            </div>
            
            <!-- 标签区域 -->
            <div class="material-tag">
              <span>{{ material.tag }}</span>
            </div>
            
            <!-- 底部信息 -->
            <div class="material-info">
              <div class="material-title">{{ material.title }}</div>
              <div class="material-time">{{ material.time }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部操作区 -->
      <div class="dialog-footer">
        <button 
          class="confirm-btn" 
          @click="handleConfirm"
          :class="{ 'disabled': selectedMaterial === null }"
          :disabled="selectedMaterial === null"
        >确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义事件
const emit = defineEmits(['close', 'confirm']);

// 选中的素材索引
const selectedMaterial = ref(null);

// 素材数据
const materials = ref([
  {
    image: new URL('@/assets/assess/material/美团月付还款;流程图.png', import.meta.url).href,
    tag: '流程图',
    title: '美团月付还款',
    time: '今天 16:05'
  },
  {
    image: new URL('@/assets/assess/material/AppStore-关闭续费;流程图.png', import.meta.url).href,
    tag: '流程图',
    title: 'AppStore-关闭续费',
    time: '今天 16:05'
  },
  {
    image: new URL('@/assets/assess/material/支付宝-关闭续费;流程图.png', import.meta.url).href,
    tag: '流程图',
    title: '支付宝-关闭续费',
    time: '今天 16:05'
  },
  {
    image: new URL('@/assets/assess/material/微信-关闭续费;流程图.png', import.meta.url).href,
    tag: '流程图',
    title: '微信-关闭续费',
    time: '今天 16:05'
  },
  {
    image: new URL('@/assets/assess/material/wink首页;界面截图.png', import.meta.url).href,
    tag: '界面截图',
    title: 'wink首页',
    time: '今天 16:05'
  },
  {
    image: new URL('@/assets/assess/material/文心智能体平台-智能体商店;界面截图.png', import.meta.url).href,
    tag: '界面截图',
    title: '文心智能体平台-智能体商店',
    time: '今天 16:05'
  }
]);

// 选择素材
const selectMaterial = (index) => {
  if (selectedMaterial.value === index) {
    selectedMaterial.value = null;
  } else {
    selectedMaterial.value = index;
  }
};

// 关闭弹窗
const closeDialog = () => {
  emit('close');
};

// 确认按钮处理
const handleConfirm = () => {
  if (selectedMaterial.value !== null) {
    emit('confirm', materials.value[selectedMaterial.value]);
  }
};
</script>

<style lang="scss" scoped>
.material-upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.material-upload-dialog {
  position: relative;
  width: 921px;
  height: 604px;
  border-radius: 9px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #E6E5EB;
  
  .dialog-title {
    width: 100px;
    height: 28px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #2B2B2B;
  }
  
  .close-btn {
    position: absolute;
    width: 21.62px;
    height: 20px;
    right: 20px;
    top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 20px;
      height: 20px;
    }
  }
}

.dialog-content {
  position: relative;
  width: 100%;
  height: 472px;
  overflow-y: auto;
  padding: 10px 35px;
  box-sizing: border-box;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #72728B;
    border-radius: 70px;
  }
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(3, 273px);
  grid-gap: 16px;
  justify-content: center;
}

.material-card {
  position: relative;
  width: 273px;
  height: 207px;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }
  
  &.selected {
    position: relative;
    
    &::after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      left: -1.47%;
      right: -1.47%;
      top: -1.93%;
      bottom: 13.04%;
      border: 2px solid #605CE5;
      border-radius: 12px;
      z-index: 1;
    }
  }
  
  .checkbox-container {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 2;
    
    input[type="checkbox"] {
      /* Auto layout */
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 0px;
      width: 14px;
      height: 14px;
      flex: none;
      order: 0;
      flex-grow: 0;

      /* bg */
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background: #FFFFFF;
      border: 2px solid #E5E6EB;
      border-radius: 2px;
      flex: none;
      order: 0;
      flex-grow: 0;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;

      &:checked {
        background: #605CE5;
        border-color: #605CE5;

        &::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 2px;
          width: 3px;
          height: 5px;
          border: solid white;
          border-width: 0 1.5px 1.5px 0;
          transform: rotate(45deg) translate(-1px, -1px);
        }
      }

      &:hover {
        border-color: #605CE5;
      }
    }
  }
  
  .material-image {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 14.98%;
    border-radius: 8px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #D9D9D9;
    }
  }
  
  .material-tag {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 8px;
    gap: 10px;
    left: 5px;
    top: 69.08%;
    height: 20px;
    background: #F3F2FD;
    border-radius: 2px;
    z-index: 1;
    
    span {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      display: flex;
      align-items: center;
      color: #605CE5;
    }
  }
  
  .material-info {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    gap: 10px;
    left: 0;
    right: 0;
    top: 89.37%;
    bottom: 0;
    
    .material-title {
      flex: 1;
      height: 22px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      align-items: center;
      color: #2B2B2B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .material-time {
      min-width: 80px;
      height: 18px;
      font-family: 'Nunito Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 18px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #72728B;
      white-space: nowrap;
      flex-shrink: 0;
      text-align: right;
    }
  }
}

.dialog-footer {
  position: absolute;
  width: 100%;
  height: 72px;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #FFFFFF;
  padding-right: 30px;
  box-sizing: border-box;
  border-top: 1px solid #E6E5EB;
  
  .confirm-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 24px;
    gap: 8px;
    width: 80px;
    height: 44px;
    background: #605CE5;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;
    
    &:hover {
      background: #4F4CDB;
    }
    
    &.disabled {
      background: #CAC9D4;
      cursor: not-allowed;
      
      &:hover {
        background: #CAC9D4;
      }
    }
  }
}
</style> 