<template>
  <div class="step-one">
    <!-- 方案上传区域 -->
    <div class="upload-container">
      <div class="upload-header">
        <span class="title">方案上传</span>
        <!-- <div class="icon-wrapper" data-tooltip="这里是方案上传的提示文字">
          <img src="@/assets/assess/tips.png" alt="提示" />
        </div> -->
      </div>
      <div class="upload-content">
        <div 
          class="upload-area" 
          @click="handleUploadClick" 
          @drop.prevent="handleDrop" 
          @dragover.prevent
          ref="uploadAreaRef"
          :class="{ 'error': errors.uploadedImage }"
        >
          <input 
            type="file" 
            ref="fileInput" 
            class="file-input" 
            accept="image/*" 
            @change="handleFileChange"
          />
          <div class="upload-content">
            <template v-if="uploadedImageModel">
              <div class="uploaded-image-container">
                <img :src="uploadedImageModel" alt="已上传图片" class="uploaded-image" />
                <div class="upload-overlay" @click.stop="handleDeleteImage">
                  <div class="upload-text">删除</div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="upload-icon">
                <img src="@/assets/assess/upload.png" alt="上传" />
              </div>
              <div v-if="errors.uploadedImage" class="error-text">请上传方案图片</div>
            </template>
          </div>
        </div>
        
        <div class="design-type-select">
          <div class="select-label">设计稿类型</div>
          <div class="radio-group">
            <div class="radio-item" @click="designTypeModel = 'screenshot'">
              <div class="radio-btn" :class="{ active: designTypeModel === 'screenshot' }"></div>
              <div class="radio-text">界面截图</div>
            </div>
            <div class="radio-item" @click="designTypeModel = 'flowchart'">
              <div class="radio-btn" :class="{ active: designTypeModel === 'flowchart' }"></div>
              <div class="radio-text">流程图</div>
            </div>
          </div>
        </div>
        
        <div class="upload-tips">
          <div class="icon-wrapper">
            <img src="@/assets/assess/tips.png" alt="提示" />
          </div>
          <span>为获得更准确的评估结果，建议上传已完成初步标注或说明的设计图。可使用「图片处理」功能进行编辑。</span>
        </div>
        
        <div class="button-group">
          <button class="btn btn-secondary" @click="showMaterialLibrary = true">素材库上传</button>
          <button class="btn btn-primary" @click="showImageProcessing = true">图片处理</button>
        </div>
      </div>
    </div>
    
    <!-- 基本信息模块 -->
    <div class="basic-info-container">
      <div class="basic-info-header">
        <span class="title">基本信息</span>
      </div>
      
      <div class="basic-info-content">
        <!-- 评估项目名称 -->
        <div class="form-item">
          <div class="form-label">评估项目名称</div>
          <div 
            class="form-input" 
            :class="{ 'error': errors.functionName }"
            ref="functionNameRef"
          >
            <input type="text" v-model="functionNameModel" placeholder="请输入评估项目名称" maxlength="25" />
            <span class="word-count">{{ functionNameModel.length }}/25</span>
          </div>
          <div v-if="errors.functionName" class="error-text">请输入评估项目名称</div>
        </div>
        
        <!-- 评估项目描述 -->
        <div class="form-item">
          <div class="form-label">评估项目描述</div>
          <div 
            class="form-input" 
            :class="{ 'error': errors.functionDesc }"
            ref="functionDescRef"
          >
            <input type="text" v-model="functionDescModel" placeholder="请简要描述功能" maxlength="50" />
            <span class="word-count">{{ functionDescModel.length }}/50</span>
          </div>
          <div v-if="errors.functionDesc" class="error-text">请输入评估项目描述</div>
        </div>
        
        <!-- 被试人数 -->
        <div class="form-item">
          <div class="form-label">
            <span>被试人数</span>
            <div class="icon-wrapper" data-tooltip="这里是被试人数的提示文字">
              <img src="@/assets/assess/ask.png" alt="提示" />
            </div>
          </div>
          <div class="form-tips">设置对每个指标重复评估的次数（推荐值：6）</div>
          <div class="number-input">
            <div class="number-btn minus" @click="handleMinus">
              <img src="@/assets/assess/minus.png" alt="减少" />
            </div>
            <input 
              type="number" 
              v-model.number="subjectCountModel" 
              class="number" 
              min="1" 
              max="8"
              @input="handleNumberInput"
              @blur="handleNumberBlur"
            />
            <div class="number-btn plus" @click="handlePlus">
              <img src="@/assets/assess/plus.png" alt="增加" />
            </div>
          </div>
        </div>
        
        <!-- 评估角色 -->
        <div class="form-item">
          <div class="form-header">
            <div class="form-label">
              <span>评估角色</span>
              <div class="icon-wrapper" data-tooltip="当已分配人数等于被试人数时，新添加的角色数量默认为0；当已分配人数小于被试人数时，新添加的角色数量默认为1。角色数量可以减到0，但不能超过被试人数。">
                <img src="@/assets/assess/ask.png" alt="提示" />
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-secondary" @click="handleAddRole">添加角色</button>
              <button class="btn btn-secondary" @click="handleBatchSettings">批量设置</button>
            </div>
          </div>
          <div class="form-tips">选择用于评估的角色类型并设置角色数量分配</div>
          <div class="role-count-info" :class="{ 'error': errors.roleCount || showCountError }" ref="countInfoRef">
            当前已分配人数：{{ totalAssignedCount }}/{{ subjectCount }}
            <span v-if="errors.roleCount || showCountError" class="error-text">请确保分配人数与被试人数一致</span>
          </div>
          <div class="role-list">
            <div v-for="role in roleList" 
                 :key="role.id" 
                 class="role-item"
                 :class="{ active: role.isActive }"
                 @click="handleRoleActiveChange(role.id)"
                 @mouseenter="handleRoleHover(role.id, true)"
                 @mouseleave="handleRoleHover(role.id, false)">
              <div class="role-tags" v-show="role.isHovered">
                <div v-for="(tag, index) in role.tags" 
                     :key="index" 
                     class="tag">
                  <span>{{ tag.text }}</span>
                </div>
              </div>
              <div v-show="!role.isHovered">
                <div class="role-title">{{ role.name }}</div>
                <div class="role-desc">{{ role.desc }}</div>
              </div>
              <div v-if="role.isActive" class="role-count">
                <div class="number-btn minus" @click.stop="handleRoleCountChange(role.id, 'minus')">
                  <img src="@/assets/assess/minus.png" alt="减少" />
                </div>
                <span class="number">{{ role.count }}</span>
                <div class="number-btn plus" @click.stop="handleRoleCountChange(role.id, 'plus')">
                  <img src="@/assets/assess/plus.png" alt="增加" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 评估指标 -->
        <div class="form-item">
          <div class="form-label">评估指标</div>
          <div 
            class="indicator-select"
            :class="{ 'error': errors.indicators }"
            ref="indicatorsRef"
          >
            <div class="selected-tags" @click="toggleDropdown">
              <div v-for="(tag, index) in selectedIndicators" :key="index" class="tag">
                <span>{{ getIndicatorLabel(tag) }}</span>
                <img src="@/assets/assess/close.png" alt="关闭" @click.stop="removeIndicator(index)" />
              </div>
              <div class="tag-count" v-if="selectedIndicators.length > 0" >
                <span>{{ selectedIndicators.length }}</span>
                <img src="@/assets/assess/close-circle-fill.png" alt="清空" @click.stop="clearIndicators" />
              </div>
              <div v-if="errors.indicators && selectedIndicators.length === 0" class="placeholder-text">请选择至少一个评估指标</div>
            </div>
            <div class="indicator-dropdown" v-if="showDropdown">
              <div class="dropdown-header">
                <span>一级指标</span>
                <span>二级指标</span>
              </div>
              <div class="dropdown-content">
                <div class="indicator-list">
                  <div v-for="(item, index) in indicators" :key="index" 
                       class="indicator-item"
                       :class="{ active: selectedFirstLevel === index }"
                       @mouseenter="handleFirstLevelHover(index)"
                       @click="handleFirstLevelItemClick(index)">
                    <input type="checkbox" 
                           :checked="isFirstLevelSelected(index)"
                           @click.stop="handleFirstLevelChange(index)" />
                    <span>{{ item.label }}</span>
                  </div>
                </div>
                <div class="indicator-list">
                  <div v-for="(item, index) in secondLevelIndicators" :key="index" 
                       class="indicator-item"
                       :class="{ 
                         'disabled': isIndicatorDisabled(item)
                       }"
                       @click="!isIndicatorDisabled(item) && handleSecondLevelItemClick(item)">
                    <input type="checkbox" 
                           :checked="isSecondLevelSelected(item)"
                           :disabled="isIndicatorDisabled(item)"
                           @click.stop="handleSecondLevelChange(item)" />
                    <span :class="{ 'disabled-text': isIndicatorDisabled(item) }">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="errors.indicators" class="error-text">请选择至少一个评估指标</div>
        </div>
      </div>
    </div>

    <!-- 角色抽屉 -->
    <div v-if="showRoleDrawer" class="drawer-mask" @click="handleCloseDrawer">
      <div class="role-drawer" @click.stop>
        <div class="drawer-header">
          <span class="title">添加角色</span>
          <div class="close-btn" @click="handleCloseDrawer">
            <img src="@/assets/assess/close.png" alt="关闭" />
          </div>
        </div>
        
        <div class="drawer-content">
          <!-- 角色名称 -->
          <div class="form-group">
            <div class="form-label">角色名称<span class="required">*</span></div>
            <div class="form-input">
              <input type="text" v-model="roleForm.name" placeholder="请输入角色名称" />
            </div>
          </div>

          <!-- 角色定义 -->
          <div class="form-group">
            <div class="form-label">角色定义</div>
            <div class="form-input">
              <input type="text" v-model="roleForm.desc" placeholder="请输入角色定义（选填）" />
            </div>
          </div>

          <!-- 年龄 -->
          <div class="form-group">
            <div class="form-label">年龄<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in ageOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.age === option.value }"
                   @click="roleForm.age = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- 性别 -->
          <div class="form-group">
            <div class="form-label">性别<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in genderOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.gender === option.value }"
                   @click="roleForm.gender = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- 使用场景 -->
          <div class="form-group">
            <div class="form-label">使用场景<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in sceneOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.scene === option.value }"
                   @click="roleForm.scene = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- 领域专业度 -->
          <div class="form-group">
            <div class="form-label">领域专业度<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in expertiseOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.expertise === option.value }"
                   @click="roleForm.expertise = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- 产品了解度 -->
          <div class="form-group">
            <div class="form-label">产品了解度<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in productKnowledgeOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.productKnowledge === option.value }"
                   @click="roleForm.productKnowledge = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- 目标清晰度 -->
          <div class="form-group">
            <div class="form-label">目标清晰度<span class="required">*</span></div>
            <div class="radio-group">
              <div v-for="option in goalClarityOptions" 
                   :key="option.value"
                   class="radio-btn"
                   :class="{ active: roleForm.goalClarity === option.value }"
                   @click="roleForm.goalClarity = option.value">
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="btn btn-secondary" @click="handleCloseDrawer">取消</button>
          <button class="btn btn-primary" 
                  :class="{ disabled: !isFormComplete }"
                  @click="handleSaveRole">保存</button>
        </div>
      </div>
    </div>

    <!-- 素材库弹窗 -->
    <MaterialUploadDialog 
      v-if="showMaterialLibrary"
      @close="showMaterialLibrary = false"
      @confirm="handleMaterialSelect"
    />
    
    <!-- 图片处理弹窗 -->
    <ImageProcessing 
      v-if="showImageProcessing"
      @close="showImageProcessing = false"
      :image="uploadedImageModel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import MaterialUploadDialog from './MaterialUploadDialog.vue'
import ImageProcessing from './ImageProcessing.vue'

const props = defineProps({
  functionName: {
    type: String,
    default: ''
  },
  functionDesc: {
    type: String,
    default: ''
  },
  subjectCount: {
    type: Number,
    default: 6
  },
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  roleList: {
    type: Array,
    default: () => []
  },
  uploadedImage: {
    type: String,
    default: null
  },
  originalFile: {
    type: Object,
    default: null
  },
  designType: {
    type: String,
    default: 'screenshot'
  }
})

const emit = defineEmits(['update:functionName', 'update:functionDesc', 'update:subjectCount', 'update:selectedIndicators', 'update:roleList', 'update:uploadedImage', 'update:originalFile', 'update:designType', 'next'])

const fileInput = ref(null)
const showDropdown = ref(false)
const selectedFirstLevel = ref(null)
const showRoleDrawer = ref(false)
const countInfoRef = ref(null)

// 添加额外的引用，用于表单验证和错误提示
const uploadAreaRef = ref(null)
const functionNameRef = ref(null)
const functionDescRef = ref(null)
const indicatorsRef = ref(null)

// 添加错误状态变量
const errors = ref({
  uploadedImage: false,
  functionName: false,
  functionDesc: false,
  indicators: false,
  roleCount: false
})

// 获取路由器实例和角色库Store
const router = useRouter()
const characterStore = useCharacterStore()

// 指标数据
const indicators = ref([
  {
    label: '易操作性',
    description: '适用于工具型或任务导向产品的可用性测评，重点关注任务效率、学习成本与信息清晰度。',
    children: [
      { 
        label: '操作的复杂性', 
        value: 'operability_1',
        description: '系统应通过控件简化、输入方式优化等手段，降低完成指定任务所需的交互复杂度。'
      },
      { 
        label: '完成任务的效率', 
        value: 'operability_2',
        description: '系统应支持用户高效完成任务，避免无效步骤与不必要操作，提升关键路径效率。'
      },
      { 
        label: '是否符合直觉与习惯用法', 
        value: 'operability_3',
        description: '系统操作方式应符合用户的心智模型与行业通用习惯，避免使用反直觉设计或生僻交互方式。'
      }
    ]
  },
  {
    label: '易学性',
    description: '适用于工具型或任务导向产品的可用性测评，重点关注任务效率、学习成本与信息清晰度。',
    children: [
      { 
        label: '上手难度', 
        value: 'learnability_1',
        description: '系统应避免复杂引导或隐藏式功能，使用户在无经验情况下也能完成基础操作。'
      },
      { 
        label: '文案信息的易理解性', 
        value: 'learnability_2',
        description: '系统中的提示语、帮助信息与操作引导应清晰准确，避免歧义，提升内容可理解度。'
      }
    ]
  },
  {
    label: '清晰性',
    description: '适用于工具型或任务导向产品的可用性测评，重点关注任务效率、学习成本与信息清晰度。',
    children: [
      { 
        label: '界面元素清晰度', 
        value: 'clarity_1',
        description: '系统中的图形、按钮、文字等界面元素应具备良好区分度，便于用户识别与操作。'
      },
      { 
        label: '界面布局合理性', 
        value: 'clarity_2',
        description: '系统应合理组织信息结构与控件位置，减少用户记忆负担与视觉寻址时间。'
      },
      { 
        label: '信息、功能入口容易找到', 
        value: 'clarity_3',
        description: '系统应提供显著的功能入口与清晰的信息层级，引导用户快速发现所需内容。'
      }
    ]
  }
])

// 二级指标列表
const secondLevelIndicators = computed(() => {
  if (selectedFirstLevel.value === null) return []
  return indicators.value[selectedFirstLevel.value].children
})

// 判断指标是否禁用（界面截图情况下）
const isIndicatorDisabled = (indicator) => {
  if (designTypeModel.value !== 'screenshot') return false
  
  // 界面截图类型时，以下指标不可选
  const disabledIndicators = [
    'operability_1', // 易操作性/操作的复杂性
    'operability_2', // 易操作性/完成任务的效率
    'learnability_1' // 易学性/上手难度
  ]
  
  return disabledIndicators.includes(indicator.value)
}

// 使用计算属性实现双向绑定
const functionNameModel = computed({
  get: () => props.functionName,
  set: (value) => emit('update:functionName', value)
})

const functionDescModel = computed({
  get: () => props.functionDesc,
  set: (value) => emit('update:functionDesc', value)
})

const subjectCountModel = computed({
  get: () => props.subjectCount,
  set: (value) => emit('update:subjectCount', value)
})

const roleListModel = computed({
  get: () => props.roleList,
  set: (value) => emit('update:roleList', value)
})

// 使用roleListModel替代roleList
const showCountError = ref(false)

// 预设角色
const presetRoles = [
  // {
  //   id: 1,
  //   name: "领域专家女性",
  //   desc: "了解产品但目标不明确的女性用户",
  //   isActive: true,
  //   count: 4,
  //   tags: [
  //     { text: "女" },
  //     { text: "25-34" },
  //     { text: "社交娱乐" },
  //     { text: "领域专业度高" },
  //     { text: "产品了解度高" },
  //     { text: "目标清晰度低" }
  //   ]
  // },
  // {
  //   id: 2,
  //   name: "年轻男性目标明确",
  //   desc: "不熟悉产品但目标明确的男性用户",
  //   isActive: true,
  //   count: 2,
  //   tags: [
  //     { text: "男" },
  //     { text: "18-24" },
  //     { text: "社交娱乐" },
  //     { text: "领域专业度高" },
  //     { text: "产品了解度低" },
  //     { text: "目标清晰度高" }
  //   ]
  // }
]

// 计算当前已分配的总人数
const totalAssignedCount = computed(() => {
  return roleListModel.value.reduce((total, role) => {
    return total + role.count
  }, 0)
})

// 检查是否满足人数要求
const isCountValid = computed(() => {
  return totalAssignedCount.value === props.subjectCount
})

// 处理下一步
const handleNextStep = () => {
  // 重置所有错误状态
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = false
  })
  
  let isValid = true
  let firstErrorElement = null

  // 验证图片是否上传
  if (!uploadedImageModel.value) {
    errors.value.uploadedImage = true
    isValid = false
    firstErrorElement = uploadAreaRef.value
  }

  // 验证评估项目名称
  if (!functionNameModel.value.trim()) {
    errors.value.functionName = true
    isValid = false
    if (!firstErrorElement) firstErrorElement = functionNameRef.value
  }

  // 验证评估项目描述
  if (!functionDescModel.value.trim()) {
    errors.value.functionDesc = true
    isValid = false
    if (!firstErrorElement) firstErrorElement = functionDescRef.value
  }

  // 验证指标选择
  if (props.selectedIndicators.length === 0) {
    errors.value.indicators = true
    isValid = false
    if (!firstErrorElement) firstErrorElement = indicatorsRef.value
  }

  // 验证角色分配人数
  if (!isCountValid.value) {
    errors.value.roleCount = true
    showCountError.value = true
    isValid = false
    if (!firstErrorElement) firstErrorElement = countInfoRef.value
  }

  // 如果有错误，滚动到第一个错误元素
  if (!isValid && firstErrorElement) {
    // 先滚动到错误元素
    nextTick(() => {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 为了更好的用户体验，先让滚动动画完成，再显示错误提示
      setTimeout(() => {
        // 这里可以添加额外的UI反馈，如闪烁错误边框等
        const animateError = (el) => {
          if (el) {
            el.classList.add('error-highlight');
            setTimeout(() => {
              el.classList.remove('error-highlight');
            }, 600);
          }
        };
        
        animateError(firstErrorElement);
      }, 300); // 给滚动动画300ms的时间
    });
    return false;
  }

  // 所有验证通过，调用父组件的下一步方法
  showCountError.value = false
  emit('next')
  return true
}

// 暴露方法给父组件
defineExpose({
  handleNextStep
})

// 监听人数变化，如果满足要求就重置错误状态
watch(totalAssignedCount, (newVal) => {
  if (newVal === props.subjectCount) {
    showCountError.value = false
    errors.value.roleCount = false
  }
})

// 角色表单数据
const roleForm = ref({
  name: '',
  desc: '',
  age: '',
  gender: '',
  scene: '',
  expertise: '',
  productKnowledge: '',
  goalClarity: '',
  background: ''
})

// 计算属性：检查表单是否完整
const isFormComplete = computed(() => {
  const { name, age, gender, scene, expertise, productKnowledge, goalClarity } = roleForm.value
  return name && age && gender && scene && expertise && productKnowledge && goalClarity
})

// 年龄选项
const ageOptions = [
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45+', value: '45+' }
]

// 性别选项
const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]

// 使用场景选项
const sceneOptions = [
  { label: '社交娱乐', value: '社交娱乐' },
  { label: '工作学习', value: '工作学习' }
]

// 专业度选项
const expertiseOptions = [
  { label: '高', value: '高' },
  { label: '低', value: '低' }
]

// 产品了解度选项
const productKnowledgeOptions = [
  { label: '高', value: '高' },
  { label: '低', value: '低' }
]

// 目标清晰度选项
const goalClarityOptions = [
  { label: '高', value: '高' },
  { label: '低', value: '低' }
]

// 上传图片相关
const uploadedImageModel = computed({
  get: () => props.uploadedImage,
  set: (value) => emit('update:uploadedImage', value)
})

const originalFileModel = computed({
  get: () => props.originalFile,
  set: (value) => emit('update:originalFile', value)
})

const designTypeModel = computed({
  get: () => props.designType,
  set: (value) => emit('update:designType', value)
})

// 监听设计稿类型变化
watch(designTypeModel, (newType) => {
  if (newType === 'screenshot') {
    // 界面截图类型时，清空所有已选指标
    emit('update:selectedIndicators', [])
  }
})

const handleUploadClick = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 处理文件上传逻辑
    console.log('Selected file:', file)
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请只上传图片格式的文件')
      return
    }
    
    // 保存原始文件对象
    originalFileModel.value = file
    
    // 创建文件预览
    if (uploadedImageModel.value) {
      URL.revokeObjectURL(uploadedImageModel.value)
    }
    uploadedImageModel.value = URL.createObjectURL(file)
    
    // 清空文件输入框，确保用户可以重新上传同一个文件
    event.target.value = ''
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    // 处理拖拽上传逻辑
    console.log('Dropped file:', file)
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请只上传图片格式的文件')
      return
    }
    
    // 保存原始文件对象
    originalFileModel.value = file
    
    // 创建文件预览
    if (uploadedImageModel.value) {
      URL.revokeObjectURL(uploadedImageModel.value)
    }
    uploadedImageModel.value = URL.createObjectURL(file)
  }
}

// 处理角色数量变化
const handleRoleCountChange = (roleId, type) => {
  const role = roleListModel.value.find(item => item.id === roleId)
  if (role) {
    if (type === 'minus') {
      // 允许减到0
      role.count = Math.max(0, role.count - 1)
    } else if (type === 'plus') {
      // 检查当前总分配人数是否已达到被试人数
      const currentTotal = totalAssignedCount.value
      if (currentTotal < props.subjectCount) {
        role.count++
      }
    }
  }
}

const handleMinus = () => {
  // 如果当前分配的总人数大于要减少后的被试人数，则不允许减少
  if (props.subjectCount > 1 && totalAssignedCount.value <= props.subjectCount - 1) {
    emit('update:subjectCount', props.subjectCount - 1)
  }
}

const handlePlus = () => {
  if (props.subjectCount < 8) {
    emit('update:subjectCount', props.subjectCount + 1)
  }
}

const handleNumberInput = (event) => {
  const value = parseInt(event.target.value)
  if (!isNaN(value)) {
    // 确保输入的值不小于当前已分配的总人数
    const minValue = Math.max(1, totalAssignedCount.value)
    if (value < minValue) {
      emit('update:subjectCount', minValue)
    } else if (value > 8) {
      emit('update:subjectCount', 8)
    } else {
      emit('update:subjectCount', value)
    }
  }
}

const handleNumberBlur = () => {
  if (isNaN(props.subjectCount)) {
    // 如果输入无效，设置为当前已分配的总人数和6中的较大值
    emit('update:subjectCount', Math.max(6, totalAssignedCount.value))
  }
}

// 处理一级指标hover
const handleFirstLevelHover = (index) => {
  selectedFirstLevel.value = index
}

// 判断一级指标是否选中
const isFirstLevelSelected = (index) => {
  const firstLevel = indicators.value[index]
  return firstLevel.children.every(child => 
    props.selectedIndicators.some(item => item.value === child.value)
  )
}

// 判断二级指标是否选中
const isSecondLevelSelected = (item) => {
  return props.selectedIndicators.some(selected => selected.value === item.value)
}

// 处理一级指标选择
const handleFirstLevelChange = (index) => {
  const firstLevel = indicators.value[index]
  const isSelected = isFirstLevelSelected(index)
  
  if (isSelected) {
    // 取消选中所有子项
    const newSelectedIndicators = props.selectedIndicators.filter(item => 
      !firstLevel.children.some(child => child.value === item.value)
    )
    emit('update:selectedIndicators', newSelectedIndicators)
  } else {
    // 选中所有非禁用的子项
    const newSelectedIndicators = [...props.selectedIndicators]
    firstLevel.children.forEach(child => {
      if (!isIndicatorDisabled(child) && !newSelectedIndicators.some(item => item.value === child.value)) {
        newSelectedIndicators.push(child)
      }
    })
    emit('update:selectedIndicators', newSelectedIndicators)
  }
}

// 处理二级指标选择
const handleSecondLevelChange = (item) => {
  // 如果指标被禁用，则不响应
  if (isIndicatorDisabled(item)) {
    return
  }

  const newSelectedIndicators = [...props.selectedIndicators]
  const index = newSelectedIndicators.findIndex(selected => selected.value === item.value)
  if (index === -1) {
    newSelectedIndicators.push(item)
  } else {
    newSelectedIndicators.splice(index, 1)
  }
  emit('update:selectedIndicators', newSelectedIndicators)
}

// 移除单个指标
const removeIndicator = (index) => {
  const newSelectedIndicators = [...props.selectedIndicators]
  newSelectedIndicators.splice(index, 1)
  emit('update:selectedIndicators', newSelectedIndicators)
}

// 清空所有指标
const clearIndicators = () => {
  emit('update:selectedIndicators', [])
}

// 切换下拉框显示状态
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  
  // 如果下拉框显示，添加激活样式
  const indicatorSelect = document.querySelector('.indicator-select')
  const basicInfoContainer = document.querySelector('.basic-info-container')
  
  if (showDropdown.value) {
    // 如果下拉框显示，添加激活样式
    if (indicatorSelect) {
      indicatorSelect.classList.add('active')
    }
    // 添加底部间距类
    if (basicInfoContainer) {
      basicInfoContainer.classList.add('dropdown-open')
    }
  } else {
    // 关闭下拉框，移除样式
    if (indicatorSelect) {
      indicatorSelect.classList.remove('active')
    }
    // 移除底部间距类
    if (basicInfoContainer) {
      basicInfoContainer.classList.remove('dropdown-open')
    }
  }
}

// 点击外部关闭下拉框
const closeDropdown = (event) => {
  const indicatorSelect = document.querySelector('.indicator-select')
  if (indicatorSelect && !indicatorSelect.contains(event.target)) {
    showDropdown.value = false
    indicatorSelect.classList.remove('active')
    
    // 移除底部间距类
    const basicInfoContainer = document.querySelector('.basic-info-container')
    if (basicInfoContainer) {
      basicInfoContainer.classList.remove('dropdown-open')
    }
  }
}

// 获取指标标签
const getIndicatorLabel = (item) => {
  const firstLevel = indicators.value.find(indicator => 
    indicator.children.some(child => child.value === item.value)
  )
  if (firstLevel) {
    return `${firstLevel.label}/${item.label}`
  }
  return item.label
}

// 处理角色选中状态变化
const handleRoleActiveChange = (roleId) => {
  const role = roleListModel.value.find(item => item.id === roleId)
  if (role) {
    role.isActive = !role.isActive
  }
}

// 处理添加角色
const handleAddRole = () => {
  showRoleDrawer.value = true
}

// 处理关闭抽屉
const handleCloseDrawer = () => {
  showRoleDrawer.value = false
}

// 处理保存角色
const handleSaveRole = () => {
  if (!isFormComplete.value) return
  
  const newRole = {
    id: roleListModel.value.length + 1,
    name: roleForm.value.name,
    desc: roleForm.value.desc,
    isActive: true,
    // 如果当前已分配人数等于被试人数，则新角色数量为0
    count: totalAssignedCount.value >= props.subjectCount ? 0 : 1,
    tags: [
      { text: roleForm.value.gender },
      { text: roleForm.value.age },
      { text: roleForm.value.scene },
      { text: `领域专业度${roleForm.value.expertise}` },
      { text: `产品了解度${roleForm.value.productKnowledge}` },
      { text: `目标清晰度${roleForm.value.goalClarity}` }
    ]
  }
  roleListModel.value.push(newRole)
  showRoleDrawer.value = false
  // 重置表单
  roleForm.value = {
    name: '',
    desc: '',
    age: '',
    gender: '',
    scene: '',
    expertise: '',
    productKnowledge: '',
    goalClarity: '',
    background: ''
  }
}

// 控制素材库显示
const showMaterialLibrary = ref(false)
// 控制图片处理显示
const showImageProcessing = ref(false)

// 处理素材选择
const handleMaterialSelect = (material) => {
  // 处理选中的素材
  console.log('Selected material:', material);
  
  // 设置上传图片
  if (material && material.image) {
    uploadedImageModel.value = material.image;
    
    // 设置评估项目名称
    if (material.title) {
      functionNameModel.value = material.title;
    }
    
    // 设置设计稿类型
    if (material.tag === '流程图') {
      designTypeModel.value = 'flowchart';
    } else if (material.tag === '界面截图') {
      designTypeModel.value = 'screenshot';
    }
  }
  
  showMaterialLibrary.value = false;
};

// 添加鼠标悬停处理方法
const handleRoleHover = (roleId, isHovered) => {
  const role = roleListModel.value.find(item => item.id === roleId)
  if (role) {
    role.isHovered = isHovered
  }
}

// 批量设置 - 跳转到角色库页面
const handleBatchSettings = () => {
  // 记录当前页面状态
  localStorage.setItem('returnToAssessment', 'true')
  // 跳转到角色库页面
  router.push('/character-database')
}

// 获取角色库中的角色并转换为当前组件需要的格式
const getCharactersFromStore = () => {
  const characters = characterStore.data
  // 筛选出激活的角色
  const activeCharacters = characters.filter(char => char.active)
  
  // 转换为StepOne需要的格式
  return activeCharacters.map((char, index) => ({
    id: char.id || index + 1,
    name: char.name,
    desc: char.des, // 注意字段名转换
    isActive: false, // 已激活的角色设为未选中状态
    count: 0, // 默认数量设为0
    isHovered: false, // 添加鼠标悬停状态
    tags: [
      { text: char.gender },
      { text: char.age },
      { text: char.scene },
      { text: char.expertise },
      { text: char.productKnowledge },
      { text: char.goalClarity }
    ]
  }))
}

// 更新角色列表
const updateRolesFromCharacterStore = () => {
  const charactersFromStore = getCharactersFromStore()
  if (charactersFromStore.length > 0) {
    // 替换现有角色列表
    roleListModel.value = charactersFromStore
    
    // 如果总角色数大于0，进行人数分配
    if (roleListModel.value.length > 0) {
      // 重置所有角色的计数为0
      roleListModel.value.forEach(role => {
        role.count = 0
      })
      
      // 如果需要分配非零人数，可以在这里添加逻辑
      // 例如：将所需人数分配给第一个角色
      if (props.subjectCount > 0 && roleListModel.value.length > 0) {
        roleListModel.value[0].count = props.subjectCount
      }
    }
  }
}

// 在组件挂载时检查是否从角色库返回
onMounted(() => {
  // 重新创建图片URL
  if (originalFileModel.value && !uploadedImageModel.value) {
    uploadedImageModel.value = URL.createObjectURL(originalFileModel.value)
  }
  
  // 先检查角色库是否有已启用的角色
  const activeCharacters = characterStore.data.filter(char => char.active)
  
  if (activeCharacters.length > 0) {
    // 如果角色库中有已启用的角色，直接加载
    updateRolesFromCharacterStore()
  }
  // 检查是否从角色库返回（保留原逻辑以防万一）
  else if (localStorage.getItem('returnToAssessment') === 'true') {
    // 清除标记
    localStorage.removeItem('returnToAssessment')
    // 从角色库更新角色列表
    updateRolesFromCharacterStore()
  }
  // 否则，只有在角色列表为空时才添加预设角色
  else if (roleListModel.value.length === 0) {
    emit('update:roleList', presetRoles)
  }
  
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  // 不再释放URL，因为后续可能会回到这个步骤
  document.removeEventListener('click', closeDropdown)
})

// 监听输入变化，清除对应错误
watch(() => functionNameModel.value, (newVal) => {
  if (newVal.trim()) {
    errors.value.functionName = false;
  }
});

watch(() => functionDescModel.value, (newVal) => {
  if (newVal.trim()) {
    errors.value.functionDesc = false;
  }
});

watch(() => props.selectedIndicators, (newVal) => {
  if (newVal.length > 0) {
    errors.value.indicators = false;
  }
}, { deep: true });

watch(() => uploadedImageModel.value, (newVal) => {
  if (newVal) {
    errors.value.uploadedImage = false;
  }
});

// 添加删除图片的方法
const handleDeleteImage = () => {
  // 清除图片URL
  if (uploadedImageModel.value) {
    URL.revokeObjectURL(uploadedImageModel.value);
  }
  
  // 清空图片和文件
  uploadedImageModel.value = null;
  originalFileModel.value = null;
  
  // 重置任何与图片相关的错误状态
  if (errors.value.uploadedImage) {
    errors.value.uploadedImage = false;
  }
}

// 处理一级指标点击
const handleFirstLevelItemClick = (index) => {
  // 调用handleFirstLevelChange以保持逻辑一致
  handleFirstLevelChange(index)
}

// 处理二级指标点击
const handleSecondLevelItemClick = (item) => {
  // 如果指标被禁用，则不响应
  if (isIndicatorDisabled(item)) {
    return
  }
  // 调用handleSecondLevelChange以保持逻辑一致
  handleSecondLevelChange(item)
}
</script>

<style scoped lang="scss">
/* 上传区域容器 */
.upload-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1184px;
  margin: 0 auto;
  padding: 16px;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #F2F3F5;
  border-radius: 6px;
  
  /* 上传区域头部 */
  .upload-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 24px;
    
    .title {
      font-family: 'PingFang SC';
      font-size: 16px;
      line-height: 24px;
      color: #2B2B2B;
      font-weight: 400;
    }
    
    .icon-wrapper {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  
  /* 文件上传区域 */
  .upload-content {
    padding-left: 85px;
    padding-right: 85px;
  }
  
  .upload-area {
    width: 100%;
    min-height: 160px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    
    .file-input {
      display: none;
    }
    
    .upload-content {
      width: 100%;
      height: 100%;
      min-height: 160px;
      background: #F7FAFC;
      border: 1.5px dashed #CAC9D4;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #605CE5;
        background: #F0F0FF;
      }
      
      .upload-icon {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      
      .uploaded-image-container {
        position: relative;
        height: 160px;
        width: 100%;
        display: flex;
        justify-content: center;
        
        .uploaded-image {
          height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        
        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
          cursor: pointer;
          
          &:hover {
            opacity: 1;
          }
          
          .upload-text {
            color: white;
            font-size: 16px;
            padding: 8px 16px;
            background: rgba(245, 63, 63, 0.8);
            border-radius: 4px;
          }
        }
      }
    }
  }
  
  /* 设计稿类型选择 */
  .design-type-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 43px;
    width: 100%;
    height: 22px;
    padding-top: 16px;
    
    .select-label {
      width: 70px;
      height: 22px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      align-items: center;
      color: #2B2B2B;
      flex: none;
      order: 0;
      flex-grow: 0;
    }
    
    .radio-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      padding: 0px;
      gap: 30px;
      height: 22px;
      flex: none;
      order: 1;
      flex-grow: 0;
      
      .radio-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 8px;
        height: 22px;
        cursor: pointer;
        
        .radio-btn {
          box-sizing: border-box;
          width: 14px;
          height: 14px;
          background: #FFFFFF;
          border: 2px solid #E6E5EB;
          border-radius: 7px;
          flex: none;
          order: 0;
          flex-grow: 0;
          position: relative;
          
          &.active {
            border-color: #605CE5;
            
            &:after {
              content: '';
              position: absolute;
              width: 6px;
              height: 6px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #605CE5;
              border-radius: 50%;
            }
          }
        }
        
        .radio-text {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
          flex: none;
          order: 1;
          flex-grow: 0;
        }
      }
    }
  }
  
  /* 提示文字区域 */
  .upload-tips {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 16px;
    
    .icon-wrapper {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
      }
    }
    span {
      font-family: 'PingFang SC';
      font-size: 14px;
      line-height: 22px;
      color: #2B2B2B;
      white-space: normal;
    }
  }
  
  /* 按钮组 */
  .button-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 24px;
    width: 100%;
    margin-top: 8px;
    white-space: nowrap;
    
    .btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 5px 24px;
      gap: 8px;
      border-radius: 6px;
      font-family: 'PingFang SC';
      font-size: 16px;
      line-height: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      /* 次要按钮样式 */
      &.btn-secondary {
        background: #FFFFFF;
        border: 1px solid #CAC9D4;
        color: #474667;
        
        &:hover {
          border-color: #605CE5;
          color: #605CE5;
        }
      }
      
      /* 主要按钮样式 */
      &.btn-primary {
        background: #605CE5;
        color: #FFFFFF;
        border: none;
        
        &:hover {
          background: #4F4BD6;
        }
      }
    }
  }
}

/* 基本信息模块样式 */
.basic-info-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1184px;
  margin: 24px auto;
  padding: 16px;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #F2F3F5;
  border-radius: 6px;
  transition: padding-bottom 0.3s ease;
  
  &.dropdown-open {
    padding-bottom: 250px;
  }

  .basic-info-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 24px;

    .title {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      color: #2B2B2B;
    }
  }

  .basic-info-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 85px;
    gap: 16px;
    width: 100%;

    .form-item {
      width: 100%;
      max-width: 984px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .form-label {
        display: flex;
        align-items: center;
        gap: 16px;
        font-family: 'PingFang SC';
        font-size: 14px;
        line-height: 22px;
        color: #2B2B2B;
        white-space: nowrap;
      }

      .icon-wrapper {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
          width: 100%;
          height: 100%;
        }
      }

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .form-label {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
        }

        .form-actions {
          display: flex;
          gap: 8px;

          .btn {
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 5px 16px;
            gap: 8px;
            min-width: 72px;
            height: 22px;
            background: #FFFFFF;
            border: 1px solid #CAC9D4;
            border-radius: 2px;
            flex: none;
            order: 0;
            flex-grow: 0;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 10px;
            line-height: 18px;
            color: #474667;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;

            &:hover {
              border-color: #605CE5;
              color: #605CE5;
            }

            .icon-wrapper {
              display: none;
              width: 20px;
              height: 20px;
              flex: none;
              order: 0;
              flex-grow: 0;

              img {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 8.66%;
                right: 8.66%;
                top: 8.33%;
                bottom: 8.33%;
                background: #474667;
              }
            }
          }
        }
      }

      .form-tips {
        font-family: 'PingFang SC';
        font-size: 12px;
        line-height: 20px;
        color: #72728B;
        white-space: nowrap;
      }

      .role-count-info {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        display: flex;
        align-items: center;
        color: #72728B;
        flex: none;
        flex-grow: 0;
        transition: color 0.3s ease;

        &.error {
          color: #F53F3F;
        }
      }

      .form-input {
        display: flex;
        align-items: center;
        padding: 8px;
        gap: 16px;
        border: 1px solid #E6E5EB;
        border-radius: 4px;

        input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 13px;
          line-height: 21px;
          color: #2B2B2B;

          &::placeholder {
            color: rgba(43, 43, 43, 0.4);
          }
        }

        .word-count {
          font-size: 13px;
          line-height: 21px;
          color: rgba(43, 43, 43, 0.4);
        }
      }

      .number-input {
        display: flex;
        align-items: center;
        gap: 15px;

        .number-btn {
          width: 20px;
          height: 20px;
          background: #605CE5;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          flex-shrink: 0;

          img {
            width: 20px;
            height: 20px;
            pointer-events: none;
            user-select: none;
            -webkit-user-drag: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
        }

        .number {
          font-family: 'PingFang SC';
          font-size: 12px;
          line-height: 17px;
          color: #605CE5;
          flex-shrink: 0;
          width: 30px;
          text-align: center;
          border: none;
          outline: none;
          background: transparent;
          padding: 0;

          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }
      }

      .role-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;

        .role-item {
          width: 150px;
          min-width: 150px;
          min-height: 138px;
          display: flex;
          flex-direction: column;
          padding: 8px;
          box-sizing: border-box;
          transition: all 0.3s ease;

          &.active {
            background: linear-gradient(185.38deg, #E7EBFF -12.06%, #FFFFFF 95.69%);
            border: 2px solid #605CE5;
            border-radius: 8px;

            .role-tags {
              .tag {
                background: #FFFFFF;
              }
            }
          }

          &:not(.active) {
            border: 2px solid #CAC9D4;
            border-radius: 8px;

            .role-tags {
              .tag {
                background: #F3F2FD;
              }
            }
          }

          .role-title {
            font-family: 'PingFang SC';
            font-size: 14px;
            line-height: 22px;
            color: #2B2B2B;
            margin-bottom: 8px;
            height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .role-desc {
            font-family: 'PingFang SC';
            font-size: 12px;
            line-height: 20px;
            color: #72728B;
            margin-bottom: 8px;
            height: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            white-space: normal;
          }

          .role-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: auto;
            height: 90px;
            overflow: hidden;

            .tag {
              display: flex;
              align-items: center;
              padding: 0 4px;
              height: 20px;
              border-radius: 2px;

              span {
                font-family: 'PingFang SC';
                font-size: 12px;
                line-height: 20px;
                color: #605CE5;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }

          .role-count {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 27px;
            margin-top: auto;
            height: 20px;

            .number-btn {
              width: 20px;
              height: 20px;
              background: #605CE5;
              border-radius: 2px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;

              img {
                width: 10px;
                height: 10px;
              }
            }

            .number {
              font-family: 'PingFang SC';
              font-size: 12px;
              line-height: 17px;
              color: #605CE5;
            }
          }
        }
      }

      .indicator-select {
        position: relative;
        width: 100%;
        height: auto;
        min-height: 40px;

        .selected-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
          border: 1px solid #E6E5EB;
          border-radius: 4px;
          min-height: 40px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          transition: border-color 0.3s ease;
        }
        
        &.active .selected-tags {
          border-color: #605CE5;
        }
        
        &.error .selected-tags {
          border-color: #F5634D !important;
        }

        .tag {
          display: flex;
          align-items: center;
          padding: 2px 5px;
          gap: 10px;
          background: #F7FAFC;
          border: 1px solid #CAC9D4;
          border-radius: 2px;
          max-width: calc(100% - 60px);

          span {
            font-size: 12px;
            line-height: 20px;
            color: #2B2B2B;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

            img {
              width: 12px;
              height: 12px;
              cursor: pointer;
              flex-shrink: 0;
            }
          }

          .tag-count {
            display: flex;
            align-items: center;
            position: absolute;
            right: 8px;
            top: 8px;
            background-color: #fff;
            z-index: 1;

            span {
              font-size: 13px;
              line-height: 22px;
              color: #72728B;
              background: #F2F3F5;
              padding: 0 8px;
              border-radius: 90px;
              margin-right: 8px;
            }

            img {
              width: 18px;
              height: 18px;
              cursor: pointer;
            }
          }
        }

      .indicator-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 350px;
        background: #FFFFFF;
        border: 1px solid #E5E6EB;
        border-radius: 4px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
        margin-top: 4px;

        .dropdown-header {
          display: flex;
          padding: 8px 12px;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            left: 33.33%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: #E5E6EB;
          }

          span {
            flex: 1;
            font-size: 12px;
            line-height: 20px;
            color: #86909C;
            text-align: left;
            padding-left: 13px;
            position: relative;

            &:last-child {
              padding-left: 20px;
              flex: 2;
            }
          }
        }

        .dropdown-content {
          display: flex;
          height: 208px;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            left: 33.33%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: #E5E6EB;
          }

          .indicator-list {
            flex: 1;
            padding: 4px 0;
            overflow-y: auto;

            &:last-child {
              flex: 2;
            }

            .indicator-item {
              display: flex;
              align-items: center;
              padding: 7px 12px;
              gap: 4px;
              cursor: pointer;

              &:hover {
                background: #F2F3F5;
              }

              &.active {
                background: #F2F3F5;
              }

              &.disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }

              .disabled-text {
                color: #999;
              }

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

              span {
                font-size: 13px;
                line-height: 22px;
                color: #1D2129;
              }
            }
          }
        }
      }
    }
  }
}

/* 抽屉遮罩层 */
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

/* 角色抽屉样式 */
.role-drawer {
  position: relative;
  width: 509px;
  height: 100vh;
  background: #FFFFFF;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .drawer-header {
    height: 64px;
    padding: 18px 32px;
    border-bottom: 1px solid #E6E5EB;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-family: 'PingFang SC';
      font-size: 20px;
      line-height: 28px;
      color: #2B2B2B;
    }

    .close-btn {
      width: 20px;
      height: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .drawer-content {
    flex: 1;
    padding: 36px 56px;
    overflow-y: auto;

    .form-group {
      margin-bottom: 34px;
      display: flex;
      align-items: center;
      gap: 20px;

      .form-label {
        font-family: 'PingFang SC';
        font-size: 13px;
        line-height: 22px;
        color: #2B2B2B;
        width: 75px;
        flex-shrink: 0;

        .required {
          color: #F53F3F;
        }
      }

      .form-input {
        flex: 1;
        input {
          width: 100%;
          height: 40px;
          padding: 8px;
          border: 1px solid #E6E5EB;
          border-radius: 4px;
          font-size: 13px;
          line-height: 21px;
          color: #2B2B2B;

          &::placeholder {
            color: rgba(43, 43, 43, 0.4);
          }
        }
      }

      .radio-group {
        display: flex;
        background: #F2F3F5;
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
            background: #FFFFFF;
            color: #605CE5;
          }
        }
      }
    }
  }

  .drawer-footer {
    padding: 25px 16px;
    border-top: 1px solid #E6E5EB;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;

    .btn {
      padding: 5px 16px;
      border-radius: 6px;
      font-size: 14px;
      // line-height: 22px;
      cursor: pointer;

      &.btn-secondary {
        background: #FFFFFF;
        border: 1px solid #CAC9D4;
        color: #474667;
      }

      &.btn-primary {
        background: #605CE5;
        color: #FFFFFF;
        border: none;
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
}

/* 添加弹窗样式 */
.material-library {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 错误样式 */
.error {
  border-color: #F53F3F !important;
}

.error-text {
  color: #F53F3F;
  font-size: 12px;
  line-height: 20px;
  margin-top: 4px;
}

.upload-area.error .upload-content {
  border-color: #F53F3F !important;
}

.placeholder-text {
  color: rgba(43, 43, 43, 0.4);
  font-size: 13px;
  line-height: 21px;
}

.role-count-info.error {
  color: #F53F3F;
  
  .error-text {
    margin-left: 8px;
  }
}

.form-input.error {
  border-color: #F53F3F;
}

.indicator-select.error .selected-tags {
  border-color: #F53F3F;
}

/* 上传区域错误样式 */
.upload-area {
  &.error {
    .upload-content {
      border-color: #F53F3F !important;
    }
    
    .error-text {
      margin-top: 8px;
      text-align: center;
    }
  }
}

/* 错误高亮动画 */
@keyframes errorHighlight {
  0% { box-shadow: 0 0 0 0 rgba(245, 63, 63, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(245, 63, 63, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 63, 63, 0); }
}

.error-highlight {
  animation: errorHighlight 0.6s ease-in-out;
}
</style> 