<template>
  <div class="step-two">
    <!-- 评估图片展示区域 -->
    <div class="assessment-container">
      <!-- 多方案展示区域 -->
      <div class="solution-showcase">
        <!-- 动态遍历上传的图片 -->
        <div 
          v-for="(image, index) in uploadedImages" 
          :key="index" 
          class="solution-block"
        >
          <div class="solution-header">
            <div class="solution-number">
              <div class="circle-number">
                <span>{{ formatSolutionNumber(index + 1) }}</span>
              </div>
              <div class="solution-title">{{ getSolutionTitle(index) }}</div>
              <div class="icon-wrapper" @click="handleEditTitle(index)">
                <img src="@/assets/assess/edit.png" alt="编辑" class="edit-icon" />
              </div>
            </div>
          </div>
          <div class="thumbnails-container">
            <div class="thumbnails-wrapper">
              <img :src="image" alt="评估图片" class="thumbnail-image">
            </div>
          </div>
        </div>
        
        <!-- 如果没有上传图片，显示一个默认块 -->
        <div v-if="uploadedImages.length === 0" class="solution-block">
          <div class="solution-header">
            <div class="solution-number">
              <div class="circle-number">
                <span>01</span>
              </div>
              <div class="solution-title">未上传方案</div>
            </div>
          </div>
          <div class="thumbnails-container">
            <div class="no-image">未上传评估图片</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评估指标设置区域 -->
    <div class="indicator-container">
      <div class="indicator-header">
        <span class="title">评估指标设置</span>
        <div class="indicator-icon-wrapper" data-tooltip="这里是评估指标设置的提示文字">
          <img src="@/assets/assess/tips.png" alt="提示" />
        </div>
      </div>
      <div class="indicator-content">
        <div v-for="(indicator, index) in formattedIndicators" :key="index" class="indicator-item">
          <div class="item-header">
            <span class="title" :data-tooltip="indicator.tooltip">{{ indicator.title }}</span>
            <div class="direction-icon" @click="toggleExpand(indicator.key)">
              <img :src="expandedItemsModel[indicator.key] ? downIcon : upIcon" alt="展开" />
            </div>
          </div>
          <template v-if="expandedItemsModel[indicator.key]">
            <div v-for="item in indicator.items" :key="item.id" class="item-content" style="position:relative;">
              <textarea
                v-model="item.content"
                @input="updateContent(indicator.key, item.id, $event.target.value)"
                class="content-input"
                :placeholder="indicator.placeholder"
                ref="textarea"
              ></textarea>
              <div v-if="indicator.items.length > 1" class="delete-icon" @click="removeAssessmentItem(indicator.key, item.id)" title="删除内容">
                <img src="@/assets/assess/close-circle-fill.png" alt="删除" />
              </div>
            </div>
            <div class="add-button" @click="addAssessmentItem(indicator.key)">
              <div class="plus-icon">
                <img src="@/assets/assess/plus.png" alt="添加" />
              </div>
              <span class="add-text">新增评估内容</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 编辑方案标题弹窗 -->
    <div v-if="showTitleDialog" class="dialog-overlay" @click="showTitleDialog = false">
      <div class="title-dialog" @click.stop>
        <h3>编辑方案名称</h3>
        <div class="dialog-content">
          <input type="text" v-model="editingTitle" placeholder="请输入方案名称" class="title-input" />
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="showTitleDialog = false">取消</button>
          <button class="btn btn-primary" @click="saveTitle">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import downIcon from '@/assets/assess/down.png'
import upIcon from '@/assets/assess/up.png'

const props = defineProps({
  indicators: {
    type: Array,
    default: () => []
  },
  expandedItems: {
    type: Object,
    default: () => ({})
  },
  uploadedImages: {
    type: Array,
    default: () => []
  },
  uploadedImage: {
    type: String,
    default: null
  },
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  uploadAreas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:indicators', 'update:expandedItems', 'update:uploadAreas'])

// 方案数据
const solutions = ref([
  {
    id: 1,
    title: '微信-关闭续费',
    images: []
  },
  {
    id: 2,
    title: '支付宝-关闭续费',
    images: []
  },
  {
    id: 3,
    title: 'AppStore-关闭续费',
    images: []
  }
])

// 初始化方案图片
onMounted(() => {
  // 处理新版本多图片的情况
  if (props.uploadedImages && props.uploadedImages.length > 0) {
    // 将上传的图片分配到各个方案中
    props.uploadedImages.forEach((img, index) => {
      const solutionIndex = Math.floor(index / 6); // 每个方案最多6张图片
      if (solutionIndex < solutions.value.length) {
        if (!solutions.value[solutionIndex].images) {
          solutions.value[solutionIndex].images = [];
        }
        solutions.value[solutionIndex].images.push(img);
      }
    });
  } 
  // 兼容旧版本单图片的情况
  else if (props.uploadedImage) {
    // 如果只有单张图片，将其添加到第一个方案中
    solutions.value[0].images = Array(6).fill(props.uploadedImage);
    solutions.value[1].images = Array(6).fill(props.uploadedImage);
    solutions.value[2].images = Array(6).fill(props.uploadedImage);
  }
})

// 标题编辑相关状态
const showTitleDialog = ref(false)
const editingTitleIndex = ref(0)
const editingTitle = ref('')

// 获取方案标题
const getSolutionTitle = (index) => {
  if (props.uploadAreas && props.uploadAreas[index] && props.uploadAreas[index].title) {
    return props.uploadAreas[index].title
  }
  return `方案 ${index + 1}`
}

// 处理标题编辑
const handleEditTitle = (index) => {
  editingTitleIndex.value = index
  editingTitle.value = getSolutionTitle(index)
  showTitleDialog.value = true
}

// 保存标题
const saveTitle = () => {
  if (props.uploadAreas && props.uploadAreas[editingTitleIndex.value]) {
    const updatedAreas = [...props.uploadAreas];
    updatedAreas[editingTitleIndex.value] = {
      ...updatedAreas[editingTitleIndex.value],
      title: editingTitle.value
    };
    emit('update:uploadAreas', updatedAreas);
  }
  showTitleDialog.value = false
}

// 格式化方案编号
const formatSolutionNumber = (number) => {
  return String(number).padStart(2, '0');
}

// 将选择的指标格式化为评估列表所需的格式
const formattedIndicators = computed(() => {
  // 如果父组件已有指标数据，使用它
  if (props.indicators && props.indicators.length > 0) {
    return props.indicators
  }
  
  // 否则从selectedIndicators生成新的格式化数据
  const newIndicators = props.selectedIndicators.map((indicator, index) => {
    const expandKey = `indicator_${index}`
    
    // 初始化expandedItems，如果不存在则设为true
    if (expandedItemsModel.value[expandKey] === undefined) {
      expandedItemsModel.value[expandKey] = true
    }
    
    // 从指标中提取父级指标
    const firstLevelLabel = indicator.value.split('_')[0]
    const firstLevelText = getFirstLevelText(firstLevelLabel)
    
    return {
      key: expandKey,
      title: `${firstLevelText}/${indicator.label}`,
      tooltip: indicator.description,
      placeholder: '请根据所选指标，描述您对需要评估分析的功能模块、流程步骤的需求。',
      items: [
        { id: 1, content: '' }
      ]
    }
  })
  
  // 将新格式化数据同步到父组件
  if (newIndicators.length > 0) {
    nextTick(() => {
      emit('update:indicators', newIndicators)
    })
  }
  
  return newIndicators
})

// 获取一级指标文本
const getFirstLevelText = (code) => {
  const indicatorMap = {
    'operability': '易操作性',
    'learnability': '易学性',
    'clarity': '清晰性'
  }
  return indicatorMap[code] || code
}

// 使用计算属性实现双向绑定
const expandedItemsModel = computed({
  get: () => props.expandedItems,
  set: (value) => emit('update:expandedItems', value)
})

const toggleExpand = (key) => {
  const newExpandedItems = { ...expandedItemsModel.value }
  newExpandedItems[key] = !newExpandedItems[key]
  expandedItemsModel.value = newExpandedItems
}

const addAssessmentItem = (key) => {
  // 复制当前指标数据
  const allIndicators = [...formattedIndicators.value]
  const indicatorIndex = allIndicators.findIndex(item => item.key === key)
  
  if (indicatorIndex !== -1) {
    const indicator = allIndicators[indicatorIndex]
    const newId = Math.max(...indicator.items.map(item => item.id)) + 1
    
    // 添加新项目
    indicator.items.push({
      id: newId,
      content: ''
    })
    
    // 更新父组件数据
    emit('update:indicators', allIndicators)
  }
}

const removeAssessmentItem = (key, id) => {
  // 复制当前指标数据
  const allIndicators = [...formattedIndicators.value]
  const indicatorIndex = allIndicators.findIndex(item => item.key === key)
  
  if (indicatorIndex !== -1) {
    const indicator = allIndicators[indicatorIndex]
    if (indicator.items.length > 1) {
      const itemIndex = indicator.items.findIndex(item => item.id === id)
      if (itemIndex !== -1) {
        // 删除项目
        indicator.items.splice(itemIndex, 1)
        // 更新父组件数据
        emit('update:indicators', allIndicators)
      }
    }
  }
}

const updateContent = (key, id, content) => {
  // 复制当前指标数据
  const allIndicators = [...formattedIndicators.value]
  const indicatorIndex = allIndicators.findIndex(item => item.key === key)
  
  if (indicatorIndex !== -1) {
    const indicator = allIndicators[indicatorIndex]
    const itemIndex = indicator.items.findIndex(item => item.id === id)
    
    if (itemIndex !== -1) {
      // 更新内容
      indicator.items[itemIndex].content = content
      // 更新父组件数据
      emit('update:indicators', allIndicators)
      
      nextTick(() => {
        if (event && event.target) {
          adjustTextareaHeight(event.target)
        }
      })
    }
  }
}

const adjustTextareaHeight = (textarea) => {
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
}

// 监听selectedIndicators的变化，当它变化时重新生成indicators数据
watch(() => props.selectedIndicators, (newVal) => {
  if (newVal && newVal.length > 0) {
    // 清空现有指标数据，强制重新生成
    emit('update:indicators', [])
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.assessment-container {
  width: 100%;
  max-width: 1184px;
  margin: 24px auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.solution-showcase {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0;
  gap: 16px;
  width: 100%;
  
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
  }
}

.solution-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 26px;
  flex: 1;
  min-width: 0; // 防止flex项目超出容器
  max-width: 334px;
  
  @media (max-width: 960px) {
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
  }
}

.solution-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  width: 100%;
  height: 30px;
}

.solution-number {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
  height: 30px;
  position: relative;
  
  .icon-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    width: 16px;
    height: 22px;
    margin-left: 13px;
    cursor: pointer;
    
    .edit-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.circle-number {
  position: relative;
  width: 30px;
  height: 30px;
  background: #E6E7FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  span {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #605CE5;
  }
}

.solution-title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #2B2B2B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumbnails-container {
  width: 100%;
}

.thumbnails-wrapper {
  width: 100%;
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .thumbnail-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
}

.no-image {
  width: 100%;
  height: 125px;
  background: #F7F8FA;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  border-radius: 4px;
}

// 指标模块样式
.indicator-container {
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
  
  .indicator-header {
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
    }
    
    .indicator-icon-wrapper {
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
  .indicator-content {
    padding: 0 80px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    max-height: 500px;
    overflow-y: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    .indicator-item {
      flex: 0 0 calc(50% - 8px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 7px 14px;
      gap: 16px;
      background: #F3F2FD;
      border-radius: 4px;
      box-sizing: border-box;
      height: fit-content;

      .item-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 22px;

        .title {
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
        }

        .direction-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }

      .item-content {
        width: 100%;
        background: #FFFFFF;
        border-radius: 4px;
        padding: 8px;

        .content-input {
          width: 100%;
          min-height: 37px;
          border: none;
          resize: none;
          font-family: 'PingFang SC';
          font-size: 13px;
          line-height: 21px;
          color: #2B2B2B;
          outline: none;
          overflow: hidden;
          display: block;

          &::placeholder {
            color: rgba(43, 43, 43, 0.4);
          }
        }
      }

      .add-button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 7px;
        width: 100%;
        height: 37px;
        cursor: pointer;

        .plus-icon {
          width: 20px;
          height: 20px;
          background: #605CE5;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-text {
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          color: #605CE5;
        }
      }
    }
  }
}

.delete-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  z-index: 2;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  
  img {
    width: 100%;
    height: 100%;
  }
}

// 标题编辑弹窗
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.title-dialog {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #2B2B2B;
  }
  
  .dialog-content {
    margin-bottom: 20px;
    
    .title-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #E6E5EB;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      
      &:focus {
        border-color: #605CE5;
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
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
    }
  }
}
</style> 