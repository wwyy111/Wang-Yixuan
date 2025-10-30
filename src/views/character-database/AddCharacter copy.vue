<template>
  <MyForm
    v-model="formData"
    :items="formItems"
    :rules="formRules"
    label-width="120px"
    @submit="handleSubmit"
    @change="handleChange"
  >
    <!-- 自定义插槽内容 -->
    <template #customSlot="{ item, formData }">
      <el-input v-model="formData[item.prop]" :placeholder="item.placeholder">
        <template #prepend>自定义</template>
      </el-input>
    </template>

    <!-- 自定义操作按钮 -->
    <template #actions="{ formData, validate }">
      <div>
        <el-button @click="cancelFn">取消</el-button>
        <el-button type="primary" @click="saveFn(validate)">保存</el-button>
      </div>
    </template>
  </MyForm>
</template>

<script setup>
import MyForm from "@/components/MyForm.vue";

const emit = defineEmits(["cancel", "save"]);

const formData = ref({
  name: "",
  sex: "",
  age: "",
  scene: "",
  profession: "",
  product: "",
  clear: "",
});

const formItems = [
  {
    prop: "name",
    label: "角色名称",
    type: "input",
    placeholder: "请输入请输入角色名称",
    required: true,
  },
  {
    prop: "sex",
    label: "性别",
    type: "radio",
    options: [
      { label: "男", value: "男" },
      { label: "女", value: "女" },
    ],
  },
  {
    prop: "age",
    label: "年龄",
    type: "select",
    placeholder: "请选择年龄",
    options: [
      { label: "18-24", value: "18-24" },
      { label: "25-34", value: "25-34" },
      { label: "35-44", value: "35-44" },
      { label: "45-54", value: "45-54" },
      { label: "55+", value: "55+" },
    ],
  },
  {
    prop: "scene",
    label: "使用场景",
    type: "select",
    placeholder: "请选择使用场景",
    options: [
      { label: "学习办公", value: "学习办公" },
      { label: "社交娱乐", value: "社交娱乐" },
    ],
  },
  {
    prop: "profession",
    label: "领域专业度",
    type: "select",
    placeholder: "请选择领域专业度",
    options: [
      { label: "领域专业度高", value: "领域专业度高" },
      { label: "领域专业度低", value: "领域专业度低" },
    ],
  },
  {
    prop: "product",
    label: "产品了解度",
    type: "select",
    placeholder: "请选择产品了解度",
    options: [
      { label: "产品了解度高", value: "产品了解度高" },
      { label: "产品了解度低", value: "产品了解度低" },
    ],
  },
  {
    prop: "clear",
    label: "目标清晰度",
    type: "select",
    placeholder: "请选择目标清晰度",
    options: [
      { label: "目标清晰度高", value: "目标清晰度高" },
      { label: "目标清晰度低", value: "目标清晰度低" },
    ],
  },
];

const formRules = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  age: [{ required: true, message: "请选择年龄", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  scene: [{ required: true, message: "请选择使用场景", trigger: "blur" }],
  profession: [
    { required: true, message: "请选择领域专业度", trigger: "blur" },
  ],
  product: [{ required: true, message: "请选择产品了解度", trigger: "blur" }],
  clear: [{ required: true, message: "请选择目标清晰度", trigger: "blur" }],
};

const handleSubmit = (data) => {
  console.log("表单提交:", data);
  // 提交到API等操作
};

const handleChange = ({ prop, value }) => {
  console.log(`字段 ${prop} 变化为:`, value);
};

const customAction = (formData) => {
  console.log("自定义操作:", formData);
};

const cancelFn = () => {
  emit("cancel");
};
const saveFn = (validate) => {
  validate().then(() => {
    emit("save", formData);
  });
};
</script>
