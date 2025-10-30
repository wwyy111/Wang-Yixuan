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
          <div v-for="(material, index) in materials" :key="index" class="material-card">
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
        <button class="confirm-btn" @click="handleConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义事件
const emit = defineEmits(['close', 'confirm']);

// 素材数据
const materials = ref([
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '易学性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '清晰性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  },
  {
    image: 'https://via.placeholder.com/273x176',
    tag: '复用性',
    title: '电商APP商品详情页',
    time: '今天 16:05'
  }
]);

// 关闭弹窗
const closeDialog = () => {
  emit('close');
};

// 确认按钮处理
const handleConfirm = () => {
  emit('confirm');
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
    align-items: flex-end;
    padding: 0px;
    gap: 97px;
    left: 0;
    right: 0;
    top: 89.37%;
    bottom: 0;
    
    .material-title {
      width: 214px;
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
      width: 50px;
      height: 18px;
      font-family: 'Nunito Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 18px;
      display: flex;
      align-items: center;
      color: #72728B;
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
  }
}
</style> 