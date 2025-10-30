<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :size="size"
    :disabled="disabled"
    :inline="inline"
    @validate="emit('validate', $event)"
  >
    <template v-for="item in formItems" :key="item.prop">
      <!-- 表单项 -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        :label-width="item.labelWidth || undefined"
        :required="item.required"
        :rules="item.rules"
      >
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input' || item.type === undefined"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :clearable="item.clearable !== false"
          :disabled="item.disabled"
          :show-password="item.showPassword"
          :prefix-icon="item.prefixIcon"
          :suffix-icon="item.suffixIcon"
          @change="handleChange(item.prop)"
        />

        <!-- 数字输入框 -->
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :disabled="item.disabled"
          :min="item.min"
          :max="item.max"
          :step="item.step"
          :controls-position="item.controlsPosition"
          @change="handleChange(item.prop)"
        />

        <!-- 选择器 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请选择${item.label}`"
          :disabled="item.disabled"
          :clearable="item.clearable !== false"
          :multiple="item.multiple"
          :filterable="item.filterable"
          @change="handleChange(item.prop)"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          />
        </el-select>

        <!-- 单选 -->
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="formData[item.prop]"
          :disabled="item.disabled"
          @change="handleChange(item.prop)"
        >
          <el-radio
            v-for="radio in item.options"
            :key="radio.value"
            :label="radio.value"
            :border="item.border"
          >
            {{ radio.label }}
          </el-radio>
        </el-radio-group>

        <!-- 多选 -->
        <el-checkbox-group
          v-else-if="item.type === 'checkbox'"
          v-model="formData[item.prop]"
          :disabled="item.disabled"
          @change="handleChange(item.prop)"
        >
          <el-checkbox
            v-for="checkbox in item.options"
            :key="checkbox.value"
            :value="checkbox.value"
            :border="item.border"
          >
            {{ checkbox.label }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 开关 -->
        <el-switch
          v-else-if="item.type === 'switch'"
          v-model="formData[item.prop]"
          :disabled="item.disabled"
          :active-text="item.activeText"
          :inactive-text="item.inactiveText"
          :active-value="
            item.activeValue !== undefined ? item.activeValue : true
          "
          :inactive-value="
            item.inactiveValue !== undefined ? item.inactiveValue : false
          "
          @change="handleChange(item.prop)"
        />

        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.prop]"
          :type="item.dateType || 'date'"
          :placeholder="item.placeholder || `请选择${item.label}`"
          :disabled="item.disabled"
          :clearable="item.clearable !== false"
          :format="item.format"
          :value-format="item.valueFormat"
          :start-placeholder="item.startPlaceholder"
          :end-placeholder="item.endPlaceholder"
          @change="handleChange(item.prop)"
        />

        <!-- 时间选择器 -->
        <el-time-picker
          v-else-if="item.type === 'time'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder || `请选择${item.label}`"
          :disabled="item.disabled"
          :clearable="item.clearable !== false"
          :format="item.format"
          :value-format="item.valueFormat"
          @change="handleChange(item.prop)"
        />

        <!-- 滑块 -->
        <el-slider
          v-else-if="item.type === 'slider'"
          v-model="formData[item.prop]"
          :min="item.min"
          :max="item.max"
          :disabled="item.disabled"
          :step="item.step"
          :show-input="item.showInput"
          :range="item.range"
          @change="handleChange(item.prop)"
        />

        <!-- 级联选择器 -->
        <el-cascader
          v-else-if="item.type === 'cascader'"
          v-model="formData[item.prop]"
          :options="item.options"
          :props="item.props"
          :placeholder="item.placeholder || `请选择${item.label}`"
          :disabled="item.disabled"
          :clearable="item.clearable !== false"
          :show-all-levels="item.showAllLevels !== false"
          :filterable="item.filterable"
          @change="handleChange(item.prop)"
        />

        <!-- 自定义插槽 -->
        <slot
          v-else-if="item.type === 'slot'"
          :name="item.slotName || item.prop"
          :item="item"
          :form-data="formData"
        />

        <!-- 自定义渲染 -->
        <component
          v-else-if="item.component"
          :is="item.component"
          v-model="formData[item.prop]"
          v-bind="item.componentProps || {}"
          @change="handleChange(item.prop)"
        />
      </el-form-item>
    </template>

    <!-- 表单操作按钮插槽 -->
    <div class="form-actions">
      <slot
        name="actions"
        :form-data="formData"
        :validate="validate"
        :reset-fields="resetForm"
      >
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </slot>
    </div>
  </el-form>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  // 表单配置项
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((item) => item.prop && item.label);
    },
  },
  // 表单数据
  modelValue: {
    type: Object,
    required: true,
  },
  // 表单验证规则
  rules: {
    type: Object,
    default: () => ({}),
  },
  // 标签宽度
  labelWidth: {
    type: String,
    default: "100px",
  },
  // 标签位置
  labelPosition: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right", "top"].includes(value),
  },
  // 尺寸
  size: {
    type: String,
    default: "default",
    validator: (value) => ["large", "default", "small"].includes(value),
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否行内表单
  inline: {
    type: Boolean,
    default: false,
  },
  // 是否显示必填字段的标签旁边的红色星号
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "submit", "validate", "change"]);

const formRef = ref(null);
const formData = ref({ ...props.modelValue });

// 合并表单项的rules和全局rules
const formRules = computed(() => {
  const rules = { ...props.rules };
  props.items.forEach((item) => {
    if (item.rules) {
      rules[item.prop] = item.rules;
    }
  });
  return rules;
});

// 处理表单项变化
const handleChange = (prop) => {
  emit("change", { prop, value: formData.value[prop] });
  emit("update:modelValue", formData.value);
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    emit("submit", formData.value);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
};

// 验证表单
const validate = () => {
  return formRef.value.validate();
};

// 重置验证
const resetValidation = () => {
  return formRef.value.resetFields();
};

// 清除验证
const clearValidate = (props) => {
  return formRef.value.clearValidate(props);
};

// 监听外部modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true }
);

// 暴露方法给父组件
defineExpose({
  validate,
  resetForm,
  resetValidation,
  clearValidate,
});

// 处理表单项配置
const formItems = computed(() => {
  return props.items.map((item) => {
    // 设置默认值
    if (
      item.defaultValue !== undefined &&
      formData.value[item.prop] === undefined
    ) {
      formData.value[item.prop] = item.defaultValue;
    }
    return item;
  });
});
</script>

<style lang="scss" scoped>
.form-actions {
  margin-top: 20px;
  text-align: right;

  .el-button + .el-button {
    margin-left: 12px;
  }
}

// 可以根据需要添加更多样式
</style>
