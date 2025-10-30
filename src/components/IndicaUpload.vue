<template>
  <div class="upload-container">
    <!-- 上传区域 -->
    <div
      class="upload-area"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      :class="{ 'is-dragover': isDragOver }"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <img :src="img1" alt="上传图标" />
        </div>
        <div class="upload-text">点击或将文件拖拽至此区域上传</div>
        <div class="upload-hint">
          支持 PNG、JPG、PDF 文件，单个文件大小不超过 10MB
        </div>
      </div>
      <input
        type="file"
        ref="fileInput"
        class="file-input"
        @change="handleFileChange"
      />
    </div>

    <!-- 文件列表区域 -->
    <div class="file-list" v-if="file">
      <div class="file-item">
        <span class="file-name">{{ file.name }}</span>
        <button class="remove-btn" @click="removeFile">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import img1 from "@/assets/upload-icon.png";

// 文件输入框的引用
const fileInput = ref(null);
// 当前选中的文件
const file = ref(null);
// 是否处于拖拽悬停状态
const isDragOver = ref(false);

/**
 * 触发文件选择对话框
 */
const triggerFileInput = () => {
  fileInput.value.click();
};

/**
 * 处理文件选择变化事件
 * @param {Event} event - 文件输入变化事件
 */
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
  }
};

/**
 * 处理拖拽悬停事件
 * @param {Event} event - 拖拽悬停事件
 */
const handleDragOver = (event) => {
  isDragOver.value = true;
  event.dataTransfer.dropEffect = "copy";
};

/**
 * 处理拖拽离开事件
 */
const handleDragLeave = () => {
  isDragOver.value = false;
};

/**
 * 处理文件拖放事件
 * @param {Event} event - 拖放事件
 */
const handleDrop = (event) => {
  isDragOver.value = false;
  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile) {
    file.value = droppedFile;
  }
};

/**
 * 移除当前选择的文件
 */
const removeFile = () => {
  file.value = null;
  fileInput.value.value = "";
};
</script>

<style lang="scss" scoped>
.upload-container {
  width: 752px;
  height: 136px;
  flex-shrink: 0;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.upload-area {
  width: 752px;
  height: 136px;
  position: relative;
  background-color: #f0f8ff;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  border-radius: 6px;
  border: 1.5px dashed var(--border3, #e6e5eb);
  background: var(--bg2, #f7fafc);

  &.is-dragover {
    border-color: #999;
    background-color: #e0f0ff;
  }
}

.upload-content {
  pointer-events: none; // 防止点击内容时干扰父元素的点击事件
}

.upload-icon {
  margin-top: 18px;
}

.upload-text {
  color: var(--text1, #2b2b2b);
  text-align: center;
  font-family: var(--font-family-Font-1, "PingFang SC");
  font-size: 13.2px;
  font-style: normal;
  font-weight: var(--font-weight-400, 400);
  line-height: normal;
  margin-bottom: 8px;
  margin-top: 11px;
}

.upload-hint {
  // font-size: 0.9rem;
  // color: #666;

  color: var(--border2, #cac9d4);
  text-align: center;
  font-family: var(--font-family-Font-1, "PingFang SC");
  font-size: 10.8px;
  font-style: normal;
  font-weight: var(--font-weight-400, 400);
  line-height: normal;
}

.file-input {
  display: none;
}

.file-list {
  margin-top: 6px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
  padding: 0 0.5rem;

  &:hover {
    color: #666;
  }
}
</style>
