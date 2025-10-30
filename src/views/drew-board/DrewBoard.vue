<template>
  <div class="material-library">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back-icon" @click="handleBack">
        <img src="@/assets/assess/left.png" alt="返回" />
      </div>
      <div class="title">素材库</div>
    </div>

    <!-- 左侧导航 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span class="title">用户图片</span>
        <input
          type="file"
          ref="fileInput"
          accept="image/*,video/*"
          style="display: none"
          @change="handleFileUpload"
        />
        <button class="btn btn-secondary" @click="triggerFileInput">
          <span>上传素材</span>
        </button>
      </div>

      <!-- 素材列表 -->
      <div class="material-list">
        <div
          v-for="(item, index) in materials"
          :key="index"
          class="material-item"
          @click="handleSelectMaterial(item)"
        >
          <div class="material-preview">
            <img
              v-if="item.type === 'image'"
              :src="item.preview"
              :alt="item.name"
            />
            <video
              v-else-if="item.type === 'video'"
              :src="item.preview"
              controls
            ></video>
            <div class="delete-btn" @click.stop="handleDeleteMaterial(index)">
              ×
            </div>
          </div>
          <div class="material-name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div class="preview-area">
      <ExcalidrawEditor :initial-elements="[]" :read-only="false" />
    </div>

    <!-- 底部按钮 -->
    <div class="footer">
      <button class="btn btn-primary" @click="handleConfirm">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ExcalidrawEditor from "@/components/Excalidraw.vue";
import router from "@/router";

const emit = defineEmits(["close", "select"]);
const fileInput = ref(null);

// 从localStorage加载素材
const loadMaterials = () => {
  const savedMaterials = localStorage.getItem("materials");
  return savedMaterials ? JSON.parse(savedMaterials) : [];
};

// 保存素材到localStorage
const saveMaterials = (materials) => {
  localStorage.setItem("materials", JSON.stringify(materials));
};

const materials = ref(loadMaterials());
const selectedMaterial = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const newMaterial = {
      id: Date.now(),
      name: file.name,
      preview: e.target.result,
      type: file.type.startsWith("image/") ? "image" : "video",
    };
    materials.value.push(newMaterial);
    saveMaterials(materials.value);
  };
  reader.readAsDataURL(file);

  // 重置input，允许重复上传相同文件
  event.target.value = "";
};

const handleDeleteMaterial = (index) => {
  materials.value.splice(index, 1);
  saveMaterials(materials.value);
};

const handleBack = () => {
  emit("close");
  router.go(-1);
};

const handleSelectMaterial = (material) => {
  selectedMaterial.value = material;
};

const handleConfirm = () => {
  if (selectedMaterial.value) {
    emit("select", selectedMaterial.value);
  }
};
</script>

<style scoped lang="scss">
.material-library {
  position: relative;
  width: 1440px;
  height: 800px;
  background: #f7fafc;

  // 顶部导航栏
  .header {
    position: absolute;
    width: 1440px;
    height: 54px;
    left: 0;
    top: 0;
    background: #ffffff;
    border-bottom: 1px solid #e6e5eb;
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
      font-family: "PingFang SC";
      font-size: 20px;
      line-height: 28px;
      color: #2b2b2b;
      display: flex;
      align-items: center;
    }
  }

  // 左侧导航
  .sidebar {
    position: absolute;
    width: 290px;
    height: 746px;
    left: 0;
    top: 54px;
    background: #ffffff;
    box-shadow: inset -1px 0px 0px #e5e6e8;

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 24px;
      height: 22px;
      margin-top: 8px;

      .title {
        font-family: "PingFang SC";
        font-size: 14px;
        line-height: 22px;
        color: #72728b;
      }

      .btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 5px 16px;
        gap: 8px;
        width: 72px;
        height: 22px;
        background: #ffffff;
        border: 1px solid #cac9d4;
        border-radius: 2px;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 500;
        font-size: 10px;
        line-height: 18px;
        color: #474667;
        cursor: pointer;
        flex: none;
        order: 1;
        flex-grow: 0;

        &:hover {
          border-color: #605ce5;
          color: #605ce5;
        }

        .icon-wrapper {
          display: none;
          width: 20px;
          height: 20px;
          flex: none;
          order: 0;
          flex-grow: 0;
        }

        span {
          display: flex;
          align-items: center;
          flex: none;
          order: 1;
          flex-grow: 0;
        }
      }
    }

    .material-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px;
      overflow-y: auto;
      height: calc(100% - 38px);

      .material-item {
        width: 120px;
        cursor: pointer;

        .material-preview {
          position: relative;
          width: 120px;
          height: 120px;
          background: #f2f2f5;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;

          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .delete-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s;
            line-height: 1;
            padding-bottom: 2px;
          }

          &:hover .delete-btn {
            opacity: 1;
          }
        }

        .material-name {
          font-family: "PingFang SC";
          font-size: 12px;
          line-height: 20px;
          color: #2b2b2b;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  // 右侧预览区域
  .preview-area {
    position: absolute;
    width: calc(100% - 290px);
    height: calc(100% - 54px - 80px);
    left: 290px;
    top: 54px;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
  }

  // 底部按钮
  .footer {
    position: absolute;
    width: 100%;
    height: 80px;
    padding-right: 60px;
    left: 0;
    bottom: 0;
    background: #ffffff;
    border-top: 1px solid #e6e5eb;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btn {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 8px 24px;
      gap: 8px;
      width: 80px;
      height: 36px;
      background: #605ce5;
      border-radius: 4px;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #ffffff;
      cursor: pointer;
      border: none;

      &:hover {
        background: #4f4bd9;
      }

      &:active {
        background: #3f3bc7;
      }
    }
  }
}
</style>
