<template>
  <div class="solution-assessment">
    <!-- 步骤条区域 -->
    <div class="steps-container">
      <div class="steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="['step', step.status]"
        >
          <div class="step-progress">
            <div :class="['progress-segment', { active: step.status !== 'pending' }]"></div>
            <div v-if="index < steps.length - 1" class="progress-gap"></div>
          </div>
          <div class="step-main">
            <div class="step-circle">
              <img :src="getStepIcon(step.status)" :alt="step.status" />
              <span v-if="step.status !== 'completed'" class="step-number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="step-content">
              <span class="step-title">{{ step.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 步骤内容区域 -->
    <StepOne
      v-if="currentStep === 0"
      ref="stepOneRef"
      v-model:functionName="stepData.stepOne.functionName"
      v-model:functionDesc="stepData.stepOne.functionDesc"
      v-model:subjectCount="stepData.stepOne.subjectCount"
      v-model:selectedIndicators="stepData.stepOne.selectedIndicators"
      v-model:roleList="stepData.stepOne.roleList"
      v-model:uploadedImage="stepData.stepOne.uploadedImage"
      v-model:originalFile="stepData.stepOne.originalFile"
      v-model:designType="stepData.stepOne.designType"
      v-model:uploadedImages="stepData.stepOne.uploadedImages"
      v-model:uploadAreas="stepData.stepOne.uploadAreas"
    />
    <StepTwo
      v-if="currentStep === 1"
      v-model:indicators="stepData.stepTwo.indicators"
      v-model:expandedItems="stepData.stepTwo.expandedItems"
      v-model:uploadAreas="stepData.stepOne.uploadAreas"
      :selectedIndicators="stepData.stepOne.selectedIndicators"
      :uploadedImage="stepData.stepOne.uploadedImage"
      :uploadedImages="stepData.stepOne.uploadedImages"
    />
    <StepThree
      v-if="currentStep === 2"
      :functionName="stepData.stepOne.functionName"
      :functionDesc="stepData.stepOne.functionDesc"
      :selectedIndicators="stepData.stepOne.selectedIndicators"
      :roleList="stepData.stepOne.roleList"
      :savedAssessmentData="stepData.stepThree.savedAssessmentData"
      :scrollToPosition="stepData.stepThree.scrollToPosition"
      :isFromStepFour="stepData.stepThree.isFromStepFour"
      @loading-status-change="handleStepThreeLoading"
      @assessment-completed="handleAssessmentCompleted"
      @clear-scroll-position="clearScrollPosition"
    />
    <StepFour
      v-if="currentStep === 3"
      :functionName="stepData.stepOne.functionName"
      :functionDesc="stepData.stepOne.functionDesc"
      :selectedIndicators="stepData.stepOne.selectedIndicators"
      :uploadedImage="stepData.stepOne.uploadedImage"
      :uploadedImages="stepData.stepOne.uploadedImages"
      :assessmentData="stepData.stepThree.savedAssessmentData"
      @go-to-step-three="handleGoToStepThree"
    />
    
    <!-- 底部导航 -->
    <div class="bottom-nav">
      <div class="nav-content">
        <button class="btn btn-secondary" v-if="currentStep > 0" @click="handlePrevStep" :disabled="isStepThreeLoading">上一步</button>
        <button class="btn btn-primary" v-if="currentStep < steps.length - 1" @click="handleNextStep" :disabled="isStepThreeLoading">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, provide, computed } from 'vue'
import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import StepFour from './StepFour.vue'

defineOptions({
  name: 'SolutionAssessment'
})

// 统一管理所有步骤的数据
const stepData = reactive({
  // 第一步数据
  stepOne: {
    functionName: '',
    functionDesc: '',
    subjectCount: 6,
    selectedIndicators: [],
    roleList: [],
    uploadedImage: null,
    originalFile: null,
    designType: 'screenshot',
    uploadedImages: [], // 添加多图片数组
    uploadAreas: [
      { image: null, file: null },
      { image: null, file: null }
    ] // 添加上传区域数据，默认两个上传框
  },
  // 第二步数据
  stepTwo: {
    indicators: [],
    expandedItems: {} // 保存指标展开/折叠状态
  },
  // 第三步数据
  stepThree: {
    savedAssessmentData: null, // 保存评估结果
    scrollToPosition: null, // 保存需要滚动到的位置信息
    isFromStepFour: false // 标记是否从步骤四跳转
  },
  // 第四步数据
  stepFour: {
    // 第四步的数据
  }
})

// 将评估结果通过provide提供给子组件
provide('assessmentResult', computed(() => stepData.stepThree.savedAssessmentData))

const stepOneRef = ref(null)
const currentStep = ref(0)

// completed active pending
const steps = ref([
  {
    title: '评估内容设置',
    status: 'active'
  },
  {
    title: '评估指标设置',
    status: 'pending'
  },
  {
    title: '开始评估',
    status: 'pending'
  },
  {
    title: '评估结果',
    status: 'pending'
  }
])

const getStepIcon = (status) => {
  const icons = {
    completed: new URL('@/assets/assess/complete.png', import.meta.url).href,
    active: new URL('@/assets/assess/proceed.png', import.meta.url).href,
    pending: new URL('@/assets/assess/other.png', import.meta.url).href
  }
  return icons[status]
}

// 处理上一步
const handlePrevStep = () => {
  if (currentStep.value > 0) {
    // 更新当前步骤状态为待处理
    steps.value[currentStep.value].status = 'pending'
    // 更新上一步状态为激活
    steps.value[currentStep.value - 1].status = 'active'
    
    // 如果是从步骤4返回步骤3，设置isFromStepFour为false
    if (currentStep.value === 3 && currentStep.value - 1 === 2) {
      stepData.stepThree.isFromStepFour = false
    }
    
    currentStep.value--
  }
}

// 处理下一步
const handleNextStep = () => {
  if (currentStep.value === 0) {
    // 如果是第一步，调用StepOne组件的handleNextStep方法
    const canProceed = stepOneRef.value.handleNextStep()
    if (canProceed) {
      // 更新当前步骤状态为已完成
      steps.value[currentStep.value].status = 'completed'
      // 更新下一步状态为激活
      steps.value[currentStep.value + 1].status = 'active'
      currentStep.value++
    }
  } else if (currentStep.value < steps.value.length - 1) {
    // 更新当前步骤状态为已完成
    steps.value[currentStep.value].status = 'completed'
    // 更新下一步状态为激活
    steps.value[currentStep.value + 1].status = 'active'
    
    // 如果是从步骤3前进到步骤4，设置isFromStepFour为false
    if (currentStep.value === 2 && currentStep.value + 1 === 3) {
      stepData.stepThree.isFromStepFour = false
    }
    
    currentStep.value++
  }
}

// 监听stepOne中selectedIndicators的变化
watch(() => stepData.stepOne.selectedIndicators, (newVal) => {
  // 当指标选择发生变化时，清空步骤2中的indicators数据
  if (newVal && Array.isArray(newVal)) {
    stepData.stepTwo.indicators = []
    stepData.stepTwo.expandedItems = {}
  }
}, { deep: true })

// 增加一个状态控制按钮是否禁用
const isStepThreeLoading = ref(false)

// 处理StepThree加载状态
const handleStepThreeLoading = (loading) => {
  isStepThreeLoading.value = loading
}

// 处理StepThree评估完成
const handleAssessmentCompleted = (assessmentData) => {
  // 保存评估结果
  stepData.stepThree.savedAssessmentData = assessmentData
}

// 处理从步骤四跳转到步骤三
const handleGoToStepThree = (payload) => {
  // 更新当前步骤状态
  steps.value[currentStep.value].status = 'completed'
  steps.value[2].status = 'active'
  currentStep.value = 2
  
  // 标记为从步骤四跳转
  stepData.stepThree.isFromStepFour = true
  
  // 存储需要滚动到的位置信息
  stepData.stepThree.scrollToPosition = payload
}

// 清除滚动位置信息
const clearScrollPosition = () => {
  stepData.stepThree.scrollToPosition = null
}
</script>
<style>
/* 全局样式 - 用于覆盖外部组件的样式 */
.content-wrapper {
  padding-top: 0 !important;
}

/* tooltip统一样式 */
[data-tooltip] {
  position: relative;
  cursor: help;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: normal;
  z-index: 1000;
  margin-bottom: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  max-width: 250px;
  width: max-content;
}

[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

/* 不同位置的提示 */
[data-tooltip-bottom]::after {
  bottom: auto;
  top: 100%;
  margin-bottom: 0;
  margin-top: 4px;
}

[data-tooltip-bottom]:hover::after {
  transform: translateX(-50%) translateY(4px);
}
</style>
<style scoped lang="scss">
/* 步骤导航样式 */
.solution-assessment {
  min-height: 100vh;
  background: #F7FAFC;
  margin-bottom: 100px;
  margin-top: 56px;
  padding: 0 24px 24px 24px;
  
  /* 步骤条容器 */
  .steps-container {
    width: 100%;
    min-width: 400px;
    position: absolute;
    padding: 0 24px;
    top: 64px;
    left: 0;
    background: #F7FAFC;
    padding-bottom: 16px;
    z-index: 10;

    .steps {
      width: 100%;
      display: flex;
      justify-content: space-between;
      
      .step {
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 80px;
        
        .step-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          display: flex;
          align-items: center;
          
          .progress-segment {
            flex: 1;
            height: 100%;
            background: #88869C;
            
            &.active {
              background: #605CE5;
            }
          }
          
          .progress-gap {
            width: 8px;
            flex-shrink: 0;
          }
        }
        
        .step-main {
          display: flex;
          align-items: center;
          margin-top: 16px;
          min-width: 60px;
        }
        
        .step-circle {
          position: relative;
          width: 24px;
          height: 24px;
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .step-number {
            position: absolute;
            font-family: 'PingFang SC';
            font-size: 10.39px;
            line-height: 16px;
            color: #88869C;
          }
        }
        
        .step-content {
          .step-title {
            font-family: 'PingFang SC';
            font-size: 14.84px;
            line-height: 21px;
            color: #474667;
            white-space: nowrap;
          }
        }
        
        &.active {
          .step-circle {
            .step-number {
              color: #605CE5;
            }
          }
        }
      }
    }
  }
}

/* 底部导航样式 */
.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 72px;
  z-index: 100;
  box-sizing: border-box;

  .nav-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0px -5px 10.9px rgba(96, 92, 229, 0.1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 32px;
    box-sizing: border-box;
    border-radius: 6px 6px 0 0;

    .btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 5px 16px;
      gap: 8px;
      height: 32px;
      border-radius: 6px;
      font-family: 'PingFang SC';
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
      transition: all 0.3s ease;

      &.btn-secondary {
        background: #FFFFFF;
        border: 1px solid #CAC9D4;
        color: #474667;
        margin-right: 16px;

        &:hover {
          border-color: #605CE5;
          color: #605CE5;
        }
      }

      &.btn-primary {
        background: #605CE5;
        border: none;
        color: #FFFFFF;

        &:hover {
          background: #4F4BD6;
        }
      }
    }
  }
}
</style> 