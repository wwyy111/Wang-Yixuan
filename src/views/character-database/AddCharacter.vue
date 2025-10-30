<template>
  <div class="add-character">
    <!-- 角色名称 -->
    <div class="form-group">
      <div class="form-label">角色名称<span class="required">*</span></div>
      <div class="form-input">
        <input
          type="text"
          v-model="roleForm.name"
          placeholder="请输入角色名称"
        />
      </div>
    </div>

    <!-- 角色定义 -->
    <div class="form-group">
      <div class="form-label">角色定义</div>
      <div class="form-input">
        <input
          type="text"
          v-model="roleForm.des"
          placeholder="请输入角色定义"
        />
      </div>
    </div>

    <!-- 年龄 -->
    <div class="form-group">
      <div class="form-label">年龄<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in ageOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.age === option.value }"
          @click="roleForm.age = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 性别 -->
    <div class="form-group">
      <div class="form-label">性别<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in genderOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.gender === option.value }"
          @click="roleForm.gender = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 使用场景 -->
    <div class="form-group">
      <div class="form-label">使用场景<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in sceneOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.scene === option.value }"
          @click="roleForm.scene = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 领域专业度 -->
    <div class="form-group">
      <div class="form-label">领域专业度<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in expertiseOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.expertise === option.value }"
          @click="roleForm.expertise = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 产品了解度 -->
    <div class="form-group">
      <div class="form-label">产品了解度<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in productKnowledgeOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.productKnowledge === option.value }"
          @click="roleForm.productKnowledge = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 目标清晰度 -->
    <div class="form-group">
      <div class="form-label">目标清晰度<span class="required">*</span></div>
      <div class="radio-group">
        <div
          v-for="option in goalClarityOptions"
          :key="option.value"
          class="radio-btn"
          :class="{ active: roleForm.goalClarity === option.value }"
          @click="roleForm.goalClarity = option.value"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <div class="drawer-footer">
      <button class="btn btn-secondary" @click="handleCloseDrawer">取消</button>
      <button
        class="btn btn-primary"
        :class="{ disabled: !isFormComplete }"
        @click="handleSaveRole"
      >
        保存
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["save", "close"]);

// 角色表单数据
const roleForm = ref({
  name: "",
  des: "",
  age: "",
  gender: "",
  scene: "",
  expertise: "",
  productKnowledge: "",
  goalClarity: "",
  background: "",
});

// 年龄选项
const ageOptions = [
  { label: "18-24", value: "18-24" },
  { label: "25-34", value: "25-34" },
  { label: "35-44", value: "35-44" },
  { label: "45-55", value: "45-55" },
  { label: "55+", value: "55+" },
];

// 性别选项
const genderOptions = [
  { label: "男", value: "男" },
  { label: "女", value: "女" },
];

// 使用场景选项
const sceneOptions = [
  { label: "社交娱乐", value: "社交娱乐" },
  { label: "工作学习", value: "工作学习" },
];

// 专业度选项
const expertiseOptions = [
  { label: "高", value: "领域专业度高" },
  { label: "低", value: "领域专业度低" },
];

// 产品了解度选项
const productKnowledgeOptions = [
  { label: "高", value: "产品了解度高" },
  { label: "低", value: "产品了解度低" },
];

// 目标清晰度选项
const goalClarityOptions = [
  { label: "高", value: "目标清晰度高" },
  { label: "低", value: "目标清晰度低" },
];

// 计算属性：检查表单是否完整
const isFormComplete = computed(() => {
  const {
    name,

    age,
    gender,
    scene,
    expertise,
    productKnowledge,
    goalClarity,
  } = roleForm.value;
  return (
    name &&
    age &&
    gender &&
    scene &&
    expertise &&
    productKnowledge &&
    goalClarity
  );
});

// 处理保存角色
const handleSaveRole = () => {
  if (!isFormComplete.value) return;

  emit("save", roleForm.value);
  // 重置表单
  roleForm.value = {
    name: "",
    des: "",
    age: "",
    gender: "",
    scene: "",
    expertise: "",
    productKnowledge: "",
    goalClarity: "",
    background: "",
  };
};

// 处理关闭抽屉
const handleCloseDrawer = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.add-character {
  .form-group {
    margin-bottom: 34px;
    display: flex;
    align-items: center;
    gap: 20px;

    .form-label {
      font-family: "PingFang SC";
      font-size: 13px;
      line-height: 22px;
      color: #2b2b2b;
      // width: 65px;
      flex-shrink: 0;
      .required {
        color: #f53f3f;
      }
    }

    .form-input {
      flex: 1;
      input {
        width: 100%;
        height: 40px;
        padding: 8px;
        border: 1px solid #e6e5eb;
        border-radius: 4px;
        font-size: 13px;
        line-height: 21px;
        color: #2b2b2b;

        &::placeholder {
          color: rgba(43, 43, 43, 0.4);
        }
      }
    }

    .radio-group {
      display: flex;
      background: #f2f3f5;
      border-radius: 2px;
      padding: 2px;
      width: auto;
      flex-shrink: 0;

      .radio-btn {
        padding: 4px 12px;
        font-size: 14px;
        line-height: 22px;
        color: #474667;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        white-space: nowrap;

        &.active {
          background: #ffffff;
          color: #605ce5;
        }
      }
    }
  }

  .drawer-footer {
    padding: 25px 16px;
    border-top: 1px solid #e6e5eb;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;

    .btn {
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 16px;
      line-height: 24px;
      cursor: pointer;

      &.btn-secondary {
        background: #ffffff;
        border: 1px solid #cac9d4;
        color: #474667;
      }

      &.btn-primary {
        background: #605ce5;
        color: #ffffff;
        border: none;
      }

      &.disabled {
        background: #cac9d4;
        cursor: not-allowed;

        &:hover {
          background: #cac9d4;
        }
      }
    }
  }
}
</style>
