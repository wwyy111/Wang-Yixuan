<template>
  <div class="step-two">
    <!-- 评估图片展示区域 -->
    <div class="assessment-container">
      <img v-if="uploadedImage" :src="uploadedImage" alt="评估图片" class="assessment-image">
      <div v-else class="no-image">未上传评估图片</div>
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
  </div>
</template>

<script setup>
import { computed, nextTick, watch } from 'vue'
import downIcon from '@/assets/assess/down.png'
import upIcon from '@/assets/assess/up.png'

const props = defineProps({
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  indicators: {
    type: Array,
    default: () => []
  },
  uploadedImage: {
    type: String,
    default: null
  },
  expandedItems: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:indicators', 'update:expandedItems'])

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
// 评估图片展示样式
.assessment-container {
  position: relative;
  width: 800px;
  height: 200px;
  margin: 0 auto 30px auto;
  
  .assessment-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #72728B;
    font-size: 16px;
    background: #F2F3F5;
    border-radius: 6px;
  }
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
</style> 