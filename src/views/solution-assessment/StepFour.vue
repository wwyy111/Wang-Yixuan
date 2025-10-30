<template>
  <div class="step-four">
    <!-- 评估结果卡片 -->
    <div class="card">
      <div class="card-content">
        <!-- 左侧内容区域 -->
        <div class="left-section">
          <div class="image-placeholder">
            <img v-if="uploadedImage" :src="uploadedImage" alt="上传图片" class="preview-image" />
          </div>
          <div class="content-wrapper">
            <h1 class="title">{{ functionName }}</h1>
            <p class="description">{{ functionDesc }}</p>
            <div class="tags">
              <span v-for="(indicator, index) in selectedIndicators" :key="index" class="tag">
                {{ getIndicatorDisplayText(indicator) }}
              </span>
            </div>
          </div>
        </div>
        <!-- 右侧操作区域 -->
        <div class="right-section">
          <div class="share-button">
            <span class="icon-wrapper">
              <img src="@/assets/assess/share.png" alt="share" />
            </span>
            <span class="button-text">导出报告</span>
          </div>
          <div class="score-section">
            <div class="score-icon">
              <img src="@/assets/assess/scores.png" alt="score" />
            </div>
            <div class="score-content">
              <span class="score-label">总得分</span>
              <span class="score-value">{{ calculateAverageScore() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs">
      <div class="tabs-group">
        <div class="tab" :class="{ active: activeTab === 'score' }" @click="activeTab = 'score'" ref="scoreTab">
          <span class="text">评分情况</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'" ref="commentTab">
          <span class="text">可用性测试总结</span>
        </div>
        <div class="sliding-bar" :style="slidingBarStyle"></div>
      </div>
    </div>

    <!-- 评分内容区域 -->
    <div v-if="activeTab === 'score'" class="score-container">
      <!-- 左侧7角图卡片 -->
      <div class="score-card">
        <div class="chart-container">
          <RadarChart 
            :data="getIndicatorAverageScores()"
            :indicators="getIndicatorNames()"
          />
        </div>
      </div>

      <!-- 右侧评分卡片 -->
      <div class="score-card">
        <div class="score-tip">
          <div class="notice">
            <img src="@/assets/assess/tips.png" alt="提示" />
          </div>
          <span class="tip-text">点击"得分"列数字可跳转查看对应评价</span>
        </div>
        <div class="score-content">
          <div
            v-for="(column, index) in getScoreConfig()"
            :key="index"
            class="score-column"
            :style="{ width: column.width }"
          >
            <div class="column-header">
              <span class="title">{{ column.title }}</span>
              <div class="sort-icon">
                <img src="@/assets/assess/sort.png" alt="排序" />
              </div>
            </div>
            <div class="column-items">
              <template v-if="column.title === '得分'">
                <div
                  v-for="(item, itemIndex) in column.items"
                  :key="itemIndex"
                  class="score-row"
                >
                  <div
                    v-for="(score, scoreIndex) in item.scores"
                    :key="scoreIndex"
                    class="score-item"
                    :style="{
                      background: scoreColors[score].bgColor,
                      color: scoreColors[score].color
                    }"
                    @click="goToStepThree(itemIndex, scoreIndex)"
                  >
                    {{ score }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="(item, itemIndex) in column.items"
                  :key="itemIndex"
                  class="column-item"
                >
                  {{ item.label || item.value }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价内容区域 -->
    <div v-if="activeTab === 'comment'" class="comment-container">
      <div class="filter-section">
        <div class="filter-container">
          <!-- 筛选问题 -->
          <div class="filter-group">
            <div class="filter-label">
              <div class="search-icon">
                <img src="@/assets/assess/search.png" alt="search" />
              </div>
              <span>筛选问题:</span>
            </div>
            <div class="filter-buttons">
              <div
                v-for="option in filterOptions"
                :key="option.value"
                class="filter-button"
                :class="[
                  option.value,
                  { active: selectedFilter === option.value }
                ]"
                @click="selectedFilter = option.value"
              >
                <span>{{ option.label }}</span>
              </div>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <!-- 指标筛选 -->
          <div class="filter-group">
            <div class="filter-buttons">
              <div
                v-for="option in metricOptions"
                :key="option.value"
                class="filter-button metric"
                :class="{ active: selectedMetric === option.value }"
                @click="selectedMetric = option.value"
              >
                <span>{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片区域 -->
      <div class="cards-container">
        <!-- 设计稿预览卡片 -->
        <div class="preview-card">
          <div class="preview-content">
            <div class="preview-image-container">
              <img :src="uploadedImage" />
            </div>
          </div>
        </div>

        <!-- 第二个卡片 -->
        <div class="second-card">
          <div class="card-header">
            <!-- 问题列表/原文对照标签 -->
            <div class="heading-3">
              <div class="tabs-small">
                <div class="tab-text">
                  <span class="title">问题列表</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <!-- 评论列表内容 -->
            <div class="comment-list">
              <div class="comment-item" v-for="(item, index) in filteredComments" :key="index">
                <div class="comment-header" @click="toggleComment(index)">
                  <div class="header-top">
                    <div class="direction">
                      <img 
                        src="@/assets/assess/down.png" 
                        alt="展开/收起" 
                        :style="{ transform: expandedComments[index] ? 'rotate(0deg)' : 'rotate(180deg)' }"
                      />
                    </div>
                    <div class="comment-title">
                      {{ item.title }}
                    </div>
                  </div>
                  <div class="status-buttons">
                    <div class="roundbutton" :class="getSatisfactionClass(item)">
                      <span>{{ getSatisfactionText(item) }}</span>
                    </div>
                    <div class="roundbutton indicator">
                      <span>{{ item.displayIndicator || (item.indicator.includes('/') ? item.indicator.split('/')[1] : item.indicator) }}</span>
                    </div>
                  </div>
                </div>
                <div v-show="expandedComments[index]">
                  <div 
                    v-for="(content, contentIndex) in item.contents" 
                    :key="`${index}-${contentIndex}`" 
                    class="comment-body"
                    :style="{ marginTop: contentIndex > 0 ? '4px' : '0' }"
                  >
                    <span v-html="formatContent(content)"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RadarChart from '@/components/RadarChart.vue'

// 接收数据
const props = defineProps({
  functionName: {
    type: String,
    default: '电商APP商品详情页设计评估'
  },
  functionDesc: {
    type: String,
    default: '功能xxxaaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  uploadedImage: {
    type: String,
    default: null
  },
  assessmentData: {
    type: Object,
    default: null
  }
})

// 定义事件
const emit = defineEmits(['go-to-step-three'])

const activeTab = ref('score')
const selectedFilter = ref('all')
const selectedMetric = ref('all')
const scoreTab = ref(null)
const commentTab = ref(null)
const expandedComments = ref([true, true, true, true, true]) // 控制评论展开状态

// 计算指标展示文本
const getIndicatorDisplayText = (indicator) => {
  if (typeof indicator === 'string') {
    // 如果是字符串且包含/，只返回二级指标
    if (indicator.includes('/')) {
      return indicator.split('/')[1];
    }
    return indicator;
  }
  
  if (indicator.value && typeof indicator.value === 'string') {
    // 直接返回二级指标标签
    return indicator.label;
  }
  
  if (indicator.parent && indicator.name) {
    // 只返回name（二级指标）
    return indicator.name;
  }
  
  if (indicator.firstLevel && indicator.secondLevel) {
    // 只返回二级指标
    return indicator.secondLevel;
  }
  
  if (indicator.primaryIndicator && indicator.name) {
    // 只返回name（二级指标）
    return indicator.name;
  }
  
  if (indicator.name) {
    return indicator.name;
  }
  
  if (indicator.label) {
    return indicator.label;
  }
  
  return '未命名';
}

// 计算平均分数
const calculateAverageScore = () => {
  if (!props.assessmentData || !props.assessmentData.assessmentList || props.assessmentData.assessmentList.length === 0) {
    return '4.5'; // 默认分数
  }
  
  let totalScore = 0;
  let count = 0;
  
  props.assessmentData.assessmentList.forEach(section => {
    section.cards.forEach(card => {
      if (!card.loading && card.score) {
        totalScore += parseFloat(card.score);
        count++;
      }
    });
  });
  
  if (count === 0) return '0.0';
  return (totalScore / count).toFixed(1);
}

const slidingBarStyle = computed(() => {
  const activeElement = activeTab.value === 'score' ? scoreTab.value : commentTab.value
  if (!activeElement) return {}
  
  return {
    width: `${activeElement.offsetWidth}px`,
    transform: `translateX(${activeElement.offsetLeft}px)`
  }
})

// 筛选问题配置
const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'very-unsatisfied', label: '非常不满意', count: 1, color: '#CB272D', bgColor: '#FFECE8' },
  { value: 'unsatisfied', label: '不满意', count: 1, color: '#D25F00', bgColor: '#FFF7E8' },
  { value: 'normal', label: '一般', count: 1, color: '#DDC11D', bgColor: '#FEFCE8' },
  { value: 'satisfied', label: '满意', count: 1, color: '#0E42D2', bgColor: '#E8F3FF' },
  { value: 'very-satisfied', label: '非常满意', count: 1, color: '#009A29', bgColor: '#E8FFEA' }
]

// 指标配置
const metricOptions = computed(() => {
  // 始终包含"全部"选项
  const options = [
    { value: 'all', label: '全部' }
  ];
  
  // 添加从selectedIndicators提取的指标选项
  if (props.selectedIndicators && props.selectedIndicators.length > 0) {
    props.selectedIndicators.forEach((indicator, index) => {
      options.push({
        value: `metric${index}`,
        label: getIndicatorDisplayText(indicator)
      });
    });
  }
  
  return options;
});

// 评分颜色配置
const scoreColors = {
  1: { color: '#CB272D', bgColor: '#FFECE8' },
  2: { color: '#D25F00', bgColor: '#FFF7E8' },
  3: { color: '#F1CC36', bgColor: '#FEFCE8' },
  4: { color: '#0E42D2', bgColor: '#E8F3FF' },
  5: { color: '#009A29', bgColor: '#E8FFEA' }
}

// 评分卡片配置
const scoreConfig = {
  columns: [
    {
      title: '指标',
      width: '100px',
      items: [
        { label: '指标111' },
        { label: '指标2' },
        { label: '指标3' },
        { label: '指标4' },
        { label: '指标5' },
        { label: '指标6' }
      ]
    },
    {
      title: '得分',
      width: '240px',
      items: [
        {
          scores: [1, 2, 3, 4, 5, 1, 2, 3]
        },
        {
          scores: [2, 3, 3, 3, 4, 4, 4, 5]
        },
        {
          scores: [2, 3, 3, 3, 4, 4, 4, 5]
        },
        {
          scores: [2, 3, 3, 3, 4, 4, 4, 5]
        },
        {
          scores: [2, 3, 3, 3, 4, 4, 4, 5]
        },
        {
          scores: [2, 3, 3, 3, 4, 4, 4, 5]
        }
      ]
    },
    {
      title: '均分',
      width: '80px',
      items: [
        { value: '3.5' },
        { value: '4.2' },
        { value: '3.4' },
        { value: '4.6' },
        { value: '4.6' },
        { value: '4.6' }
      ]
    }
  ]
}

const commentList = ref([
  {
    title: '功能重复、分区模糊，影响理解与操作路径选择',
    indicator: '易操作性/是否符合直觉与习惯用法',
    averageScore: 2,
    contents: [
      '**结构基本合理，但入口冗余、分类模糊，对目标不清用户不够友好。**',
      '**信息冗余与功能重复严重（如"画质修复"三处出现）**，破坏了用户对功能分区的预期一致性。',
      '操作路径直观，**但"视频美容"类入口与九宫格中部分功能重复**，导致用户在理解"应该点哪里"时存在犹豫，降低了操作直觉性。',
      '**存在功能重复（如"画质修复"出现在多个区域"）**和图标分组不清，略增加理解负担。',
      '**功能层级存在重复和主次不清的问题**，使得新用户无法快速判断入口选择，容易走"回头路"或试错。',
      '**多处功能冗余（如"AI扩展"重复出现）**，增加了理解负担。'
    ]
  },
  {
    title: '图标语义抽象或模糊，特别是"脑洞特效"',
    indicator: '易操作性/是否符合直觉与习惯用法',
    averageScore: 3,
    contents: [
      '**"脑洞特效"图标：3分 → 风格吸引人，视觉有趣，但图标和名称语义不够直观，需试探点击理解。**',
      '**部分图标语义缺乏直觉性（尤其是"脑洞特效"）**，容易令目标感不强的用户产生疑惑或忽略。',
      '**例如"脑洞特效"图标缺乏语义对应，名称抽象**，违背了图标/文案应协同传达功能意义的直觉认知原则。',
      '**图标与功能语义匹配弱，难以直观理解**；对初次使用者不友好，不利于快速识别。',
      '**"脑洞特效"命名与图标不符合行业共识或大众语义联想**，对低熟用户不够友好。',
      '**"脑洞特效"图标在视觉符号和语义联想上较弱**，难以通过图形推测功能，降低易理解性。',
      '**"脑洞特效"图标语义脱离**，用户无法仅靠图形识别。'
    ]
  },
  {
    title: '"最近使用"下拉栏设计合理但缺乏引导或可见性',
    indicator: '易操作性/是否符合直觉与习惯用法',
    averageScore: 4,
    contents: [
      '**下拉"最近使用"：4分 → 交互方式贴近系统习惯，直觉性强，但缺乏引导提示**，发现门槛略高。',
      '**下拉区域缺乏发现性提示**，对于中低活跃用户是一个隐性功能，难以形成使用习惯。',
      '**机制是用户熟悉的，但没有显著提示或引导**，让该功能被"隐藏"，首次使用时用户难以发现，从而影响直觉符合度。',
      '**但缺少提示，导致易被忽视。**虽然界面在部分设计上遵循了常见平台习惯...',
      '**多处缺乏必要的引导元素（如动画、提示语、状态高亮）**，使得功能虽合理但使用门槛偏高。',
      '**下拉栏虽设计合理，但入口提示不明显**，违背了"可感知性"的直觉操作原则。'
    ]
  },
  {
    title: '图标体系不统一',
    indicator: '易操作性/是否符合直觉与习惯用法',
    averageScore: 1,
    contents: [
      '该首页在直觉性设计方面达到了基本可用标准，**但尚未形成统一、清晰的图标语言与功能分层逻辑**，对初次使用者并不完全友好。'
    ]
  },
  {
    title: '整体结构贴合习惯但术语命名仍需优化',
    indicator: '易操作性/是否符合直觉与习惯用法',
    averageScore: 5,
    contents: [
      'Wink首页整体上在界面结构与交互逻辑上较好地贴合了用户习惯...**但个别功能图标和术语命名上存在偏差，未能充分利用用户直觉联想**，降低了首次使用时的理解效率。'
    ]
  },
  {
    title: '命名语义模糊/功能不明确',
    indicator: '易学性/文案信息的易理解性',
    averageScore: 2,
    contents: [
      '**"魔法照片"虽具吸引力，但含义模糊，不利于功能识别；"配方"最为抽象，缺乏上下文提示**，对视频编辑领域用户存在明显理解障碍。',
      '**"魔法照片"与"配方"都存在较强语义模糊**。',
      '**"配方"的命名则非常不直观，显著拉低整体可理解性**；"魔法照片"虽然有吸引力，但功能不明确',
      '**存在重要功能名称模糊、无助解释或图文不匹配**等问题，特别是"配方"和"魔法照片"对不具备强目标导向的用户来说理解负担较高。',
      '**"配方"命名抽象，与视频编辑语境脱节**，缺少直观关联性。',
      '**"配方"则严重不清晰，拖累整体认知体验**。',
      '**"配方""魔法照片"这类命名带有营销意味或创意成分**，对不熟悉产品的新用户缺乏清晰引导，理解成本较高。',
      '**个别文案（如"配方"）对新用户极不友好，几乎无法从字面理解含义**，拉低整体评分'
    ]
  },
  {
    title: '命名风格不统一/理解成本高',
    indicator: '易学性/文案信息的易理解性',
    averageScore: 3,
    contents: [
      '**三个功能的命名风格不统一，有的偏技术功能（如"视频截图"），有的偏情绪营销（如"魔法照片"），有的则过于抽象（如"配方"）**，降低了整体认知效率。',
      '**使用了部分"创意化"命名（如"魔法""配方"）**，对我这种目标不明确的用户来说，初始理解困难。',
      '**整体文案风格不统一**，有的偏口语吸引眼球，有的过于模糊，没有统一文案策略或分层引导'
    ]
  },
  {
    title: '缺乏辅助性说明/缺自解释性',
    indicator: '易学性/文案信息的易理解性',
    averageScore: 1,
    contents: [
      '**图标风格统一，但未能有效增强文案的解释性。**',
      '**缺乏辅助解释机制：无二级文案或悬浮提示，依赖用户点击或尝试探索，不利于快速上手和目标达成。**'
    ]
  },
  {
    title: '图标语义不直观/需依赖文字',
    indicator: '清晰性/界面元素清晰度',
    averageScore: 2,
    contents: [
      '如**"脑洞特效""魔法照片""AI扩展"等，若无文字说明，图形本身难以准确传达功能用途**，对目标不明确用户不够友好。',
      '**图形与功能名称的直觉联想度偏低**，对非专业用户尤其不友好，需依赖文字理解。',
      '**部分图标抽象，对低目标感用户理解有门槛**',
      '**如"转Live格式"与"魔法照片"，对于低目标用户不够友好**',
      '**个别图标（如"脑洞特效"）象征意义略显模糊**',
      '**"转Live格式"和"修Live"图标在形状与构图上几乎一致**，容易混淆，尤其对新用户来说辨识度下降。',
      '**"脑洞特效"图标使用🎉表情符号，新用户难以根据图形推断其具体作用**',
      '**如"AI扩展"、"脑洞特效"的图形表现不够自解释，需依赖文字。**'
    ]
  },
  {
    title: '视觉主次不明显/层级感弱',
    indicator: '清晰性/界面元素清晰度',
    averageScore: 3,
    contents: [
      '**图标优先级层级感不足，视觉上看不出哪个更重要**',
      '**所有图标大小风格几乎一致，缺乏视觉引导重点**',
      '**图标与文字、图标之间间隔偏紧，导致视觉呼吸感不足，有压迫感。**'
    ]
  },
  {
    title: '模块边界弱/不利于识别',
    indicator: '清晰性/界面元素清晰度',
    averageScore: 2,
    contents: [
      '**图标小、阴影弱，若背景视频动态性强或颜色复杂，图标可能不够突出，影响快速识别。**',
      '**顶部"下拉唤出"区域边界不够突出，风格不一致，存在视觉割裂感，影响整体辨识。**',
      '**"最近使用"区块视觉突出程度略弱，与下方功能区辨识度不够强**',
      '**顶部"最近使用"模块边界弱化**，其背景模糊+阴影浅，视觉层级不够明显'
    ]
  },
  {
    title: '图标视觉区分度不足',
    indicator: '清晰性/界面布局合理性',
    averageScore: 2,
    contents: [
      '**界面缺乏视觉引导**，例如图标间没有明显的层级感或颜色差异；',
      '页面偏暗背景与统一的白色图标导致**区分度不足**，易使用户视觉游移。',
      '底部功能区域图标密集，图标风格相近，**首次使用者可能不易一眼识别功能分组逻辑**。'
    ]
  },
  {
    title: '信息布局密集/缺乏间隔',
    indicator: '清晰性/界面布局合理性',
    averageScore: 3,
    contents: [
      '整体排版有逻辑，**但略显信息密集**',
      '**界面功能布局较多集中于中下部**，虽然分类逻辑存在，但缺乏明显的分区标题或视觉隔断，容易让人产生堆叠感'
    ]
  },
  {
    title: '标签设计协调性不足',
    indicator: '清晰性/界面布局合理性',
    averageScore: 4,
    contents: [
      '唯一减分点在于部分**"热门"标签显得突兀**，与整体设计协调度略低。'
    ]
  },
  {
    title: '入口提示不明显/缺乏引导',
    indicator: '清晰性/信息、功能入口容易找到',
    averageScore: 2,
    contents: [
      '**下拉菜单这种交互模式对非重度用户不够明显**，容易被忽略',
      '**下拉区"最近使用"设计合理，但初次使用者可能不会发现这是可以"下拉唤出"的**，入口不够明显',
      '**仍存在小部分低频功能（如"脑洞特效"）入口不够明显。**',
      '**需要向下滚动才会看到更多娱乐类入口**，这对目标明确的用户增加了路径长度'
    ]
  },
  {
    title: '图标/命名不直观或存在混淆',
    indicator: '清晰性/信息、功能入口容易找到',
    averageScore: 3,
    contents: [
      '**大部分图标（如"AI扩展""转Live格式"）不具备直观性**，图形+文案难以理解',
      '**"AI美容"与"视频美容"命名相近**，可能造成轻微混淆。',
      '**"修Live"与"转Live格式"的命名关系不够清晰**，可能误导。'
    ]
  }
])

const toggleComment = (index) => {
  expandedComments.value[index] = !expandedComments.value[index]
}

// 获取指标平均分数
const getIndicatorAverageScores = () => {
  if (!props.assessmentData || !props.assessmentData.assessmentList || props.assessmentData.assessmentList.length === 0) {
    return [2.5, 3.1, 4.8, 3.0, 4.0, 2.7, 1.5]; // 默认数据
  }
  
  const indicatorScores = {};
  const indicatorCounts = {};
  
  // 遍历所有评估项，计算每个指标的总分和数量
  props.assessmentData.assessmentList.forEach(section => {
    const indicatorName = section.title;
    indicatorScores[indicatorName] = 0;
    indicatorCounts[indicatorName] = 0;
    
    section.cards.forEach(card => {
      if (!card.loading && card.score) {
        indicatorScores[indicatorName] += parseFloat(card.score);
        indicatorCounts[indicatorName]++;
      }
    });
  });
  
  // 计算每个指标的平均分
  const result = [];
  Object.keys(indicatorScores).forEach(key => {
    if (indicatorCounts[key] > 0) {
      result.push(parseFloat((indicatorScores[key] / indicatorCounts[key]).toFixed(1)));
    }
  });
  
  return result;
}

// 获取指标名称
const getIndicatorNames = () => {
  if (!props.assessmentData || !props.assessmentData.assessmentList || props.assessmentData.assessmentList.length === 0) {
    return ['指标1', '指标2', '指标3', '指标4', '指标5', '指标6', '指标7']; // 默认数据
  }
  
  // 提取所有评估项的标题作为雷达图的指标名称
  return props.assessmentData.assessmentList.map(section => {
    // 如果标题格式为"一级/二级"，只提取二级部分以保持简洁
    const parts = section.title.split('/');
    return parts.length > 1 ? parts[1] : section.title;
  });
}

// 获取评分卡片配置
const getScoreConfig = () => {
  if (!props.assessmentData || !props.assessmentData.assessmentList || props.assessmentData.assessmentList.length === 0) {
    return scoreConfig.columns; // 使用默认配置
  }
  
  // 构建评分配置
  const columns = [
    {
      title: '指标',
      width: '100px',
      items: props.assessmentData.assessmentList.map(section => {
        const parts = section.title.split('/');
        return { 
          label: parts.length > 1 ? parts[1] : section.title
        };
      })
    },
    {
      title: '得分',
      width: '240px',
      items: props.assessmentData.assessmentList.map(section => {
        // 提取该指标下所有卡片的分数
        const scores = [];
        section.cards.forEach(card => {
          if (!card.loading && card.score) {
            scores.push(parseInt(card.score));
          }
        });
        
        // 如果分数不足，补充默认分数
        while (scores.length < 8) {
          scores.push(3);
        }
        
        return { scores };
      })
    },
    {
      title: '均分',
      width: '80px',
      items: props.assessmentData.assessmentList.map(section => {
        // 计算均分
        let totalScore = 0;
        let count = 0;
        
        section.cards.forEach(card => {
          if (!card.loading && card.score) {
            totalScore += parseFloat(card.score);
            count++;
          }
        });
        
        const avgScore = count > 0 ? (totalScore / count).toFixed(1) : '0.0';
        return { value: avgScore };
      })
    }
  ];
  
  return columns;
}

const goToStepThree = (itemIndex, scoreIndex) => {
  // 发送事件给父组件，包含位置信息
  emit('go-to-step-three', {
    sectionIndex: itemIndex,
    cardIndex: scoreIndex
  })
}

// 根据评分获取满意度文本
const getSatisfactionText = (item) => {
  // 获取指标均分
  const indicatorScore = getIndicatorAverageScore(item.indicator);
  // 四舍五入
  const score = Math.round(indicatorScore);
  
  switch(score) {
    case 1: return '非常不满意';
    case 2: return '不满意';
    case 3: return '一般';
    case 4: return '满意';
    case 5: return '非常满意';
    default: return '一般';
  }
}

// 根据评分获取满意度类名
const getSatisfactionClass = (item) => {
  // 获取指标均分
  const indicatorScore = getIndicatorAverageScore(item.indicator);
  // 四舍五入
  const score = Math.round(indicatorScore);
  
  switch(score) {
    case 1: return 'very-unsatisfied';
    case 2: return 'unsatisfied';
    case 3: return 'normal';
    case 4: return 'satisfied';
    case 5: return 'very-satisfied';
    default: return 'normal';
  }
}

// 根据指标名称获取均分
const getIndicatorAverageScore = (indicatorName) => {
  if (!props.assessmentData || !props.assessmentData.assessmentList || props.assessmentData.assessmentList.length === 0) {
    // 如果没有评估数据，使用commentList中的averageScore
    const item = commentList.value.find(c => {
      // 处理带有一级指标的情况，只比较二级指标
      if (c.indicator.includes('/') && indicatorName.includes('/')) {
        return c.indicator.split('/')[1] === indicatorName.split('/')[1];
      }
      return c.indicator === indicatorName;
    });
    return item ? item.averageScore : 3;
  }
  
  // 从指标名称中提取一级指标（如果存在）
  const primaryIndicator = indicatorName.includes('/') ? indicatorName.split('/')[0] : indicatorName;
  
  // 在评估数据中查找对应指标
  const section = props.assessmentData.assessmentList.find(s => s.title.includes(primaryIndicator));
  if (!section) {
    // 如果找不到对应指标，使用commentList中的averageScore
    const item = commentList.value.find(c => {
      // 处理带有一级指标的情况，只比较二级指标
      if (c.indicator.includes('/') && indicatorName.includes('/')) {
        return c.indicator.split('/')[1] === indicatorName.split('/')[1];
      }
      return c.indicator === indicatorName;
    });
    return item ? item.averageScore : 3;
  }
  
  // 计算该指标的均分
  let totalScore = 0;
  let count = 0;
  
  section.cards.forEach(card => {
    if (!card.loading && card.score) {
      totalScore += parseFloat(card.score);
      count++;
    }
  });
  
  return count > 0 ? totalScore / count : 3;
}

// 格式化评论内容，将**文字**转换为加粗显示
const formatContent = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #605CE5;">$1</strong>');
}

// 筛选后的评论列表
const filteredComments = computed(() => {
  // 如果选择"全部"指标，或者没有指标筛选条件
  if (selectedMetric.value === 'all' && selectedFilter.value === 'all') {
    return commentList.value.map(item => ({
      ...item,
      // 如果indicator包含/，只保留二级指标
      displayIndicator: item.indicator.includes('/') ? item.indicator.split('/')[1] : item.indicator
    }));
  }
  
  return commentList.value.filter(item => {
    // 先根据满意度筛选
    const satisfactionMatch = selectedFilter.value === 'all' || 
      getSatisfactionClass(item) === selectedFilter.value;
    
    // 再根据指标筛选
    let metricMatch = true;
    if (selectedMetric.value !== 'all') {
      // 获取指标选项的标签文本
      const selectedMetricLabel = metricOptions.value.find(
        option => option.value === selectedMetric.value
      )?.label || '';
      
      // 检查评论的指标是否匹配所选指标
      if (item.indicator.includes('/') && selectedMetricLabel) {
        // 只比较二级指标
        metricMatch = item.indicator.split('/')[1] === selectedMetricLabel;
      } else {
        metricMatch = item.indicator === selectedMetricLabel;
      }
    }
    
    // 添加displayIndicator属性用于显示
    item.displayIndicator = item.indicator.includes('/') ? item.indicator.split('/')[1] : item.indicator;
    
    return satisfactionMatch && metricMatch;
  }).map(item => ({
    ...item,
    // 如果indicator包含/，只保留二级指标
    displayIndicator: item.indicator.includes('/') ? item.indicator.split('/')[1] : item.indicator
  }));
});
</script>

<style scoped lang="scss">
/* 卡片容器样式 */
.card {
  background: #FFFFFF;
  box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
  border-radius: 9px;
  padding: 16px 24px;
  width: 100%;
  margin-bottom: 16px;
  
  /* 卡片内容布局 */
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    
    /* 左侧内容区域样式 */
    .left-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 300px;
      
      .image-placeholder {
        width: 78px;
        height: 78px;
        background: rgba(217, 217, 217, 0.65);
        border-radius: 6px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        min-width: 0;
        
        .title {
          font-family: 'Noto Sans SC';
          font-weight: 700;
          font-size: 18px;
          line-height: 24px;
          color: #2B2B2B;
          margin: 0;
          word-break: break-word;
        }
        
        .description {
          font-family: 'Noto Sans SC';
          font-weight: 350;
          font-size: 12px;
          line-height: 18px;
          color: #72728B;
          margin: 0;
          word-break: break-word;
        }
        
        .tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          
          .tag {
            display: flex;
            align-items: center;
            padding: 0 8px;
            height: 20px;
            background: #F3F2FD;
            border-radius: 2px;
            font-family: 'PingFang SC';
            font-size: 12px;
            line-height: 20px;
            color: #605CE5;
          }
        }
      }
    }
    
    /* 右侧操作区域样式 */
    .right-section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      min-width: 94px;
      height: 84px;
      margin-left: auto;
      
      .share-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 3px 16px;
        border: 1px solid #CAC9D4;
        border-radius: 2px;
        width: 100%;
        
        .icon-wrapper {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          img {
            width: 100%;
            height: 100%;
          }
        }
        
        .button-text {
          font-family: 'PingFang SC';
          font-size: 10px;
          line-height: 18px;
          color: #474667;
        }
      }
      
      .score-section {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .score-icon {
          width: 18px;
          height: 21px;
          
          img {
            width: 100%;
            height: 100%;
          }
        }
        
        .score-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          
          .score-label {
            font-family: 'PingFang SC';
            font-size: 8.77px;
            line-height: 15px;
            color: #72728B;
          }
          
          .score-value {
            font-family: 'PingFang SC';
            font-size: 30px;
            line-height: 34px;
            font-weight: 500;
            color: #605CE5;
          }
        }
      }
    }
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .card {
    .card-content {
      .left-section {
        width: 100%;
        
        .content-wrapper {
          width: 100%;
        }
      }
      
      .right-section {
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 16px;
      }
    }
  }
}

/* 标签页导航样式 */
.tabs {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 16px;

  .tabs-group {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
    border-bottom: 1px solid #E6E5EB;
    position: relative;

    .tab {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 7px 0;
      gap: 8px;
      cursor: pointer;
      position: relative;
      z-index: 1;

      .text {
        font-family: 'PingFang SC';
        font-size: 16px;
        line-height: 24px;
        color: #72728B;
        transition: color 0.3s ease;
      }

      &.active {
        .text {
          color: #2B2B2B;
          font-weight: 500;
        }
      }
    }

    .sliding-bar {
      position: absolute;
      bottom: -1px;
      left: 0;
      height: 2px;
      background: #605CE5;
      transition: all 0.3s ease;
    }
  }
}

/* 评分内容区域样式 */
.score-container {
  display: flex;
  gap: 24px;
  width: 100%;
}

.score-card {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  padding: 24px 24px 12px;  /* 减少底部内边距 */
  background: #FFFFFF;
  border: 0.75px solid #F2F3F5;
  box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
  border-radius: 9px;
  height: 350px; /* 设置固定高度 */
  display: flex;
  flex-direction: column;
  position: relative; /* 添加相对定位 */


  .chart-container {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    min-height: 0; /* 允许容器收缩 */
  }

  .score-tip {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 0px 12px;
    gap: 10px;
    width: 100%;
    height: 22px;
    margin-bottom: 8px;

    .notice {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0px;
      width: 22px;
      height: 22px;

      img {
        width: 20px;
        height: 20px;
      }
    }

    .tip-text {
      width: 240px;
      height: 22px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      align-items: center;
      color: #72728B;
    }
  }

  .score-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 312px;
    overflow-y: auto;
    overflow-x: hidden;

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #CAC9D4;
      border-radius: 9px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #B5B4C0;
    }

    .score-column {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &:last-child {
        padding-right: 8px;
      }

      .column-header {
        position: sticky;
        top: 0;
        background: #FFFFFF;
        z-index: 1;
        padding: 4px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 22px;

        .title {
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
          text-align: center;
        }

        .sort-icon {
          width: 10px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }

      .column-items {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .column-item {
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
          white-space: normal;
          overflow: visible;
          word-break: break-word;
          text-align: center;
          padding: 0 4px;
          min-height: 66px; /* 确保有足够的高度来容纳多行文本 */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          min-height: 66px; /* 与column-item保持一致 */
          align-items: center;

          .score-item {
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 46px;
            font-family: 'PingFang SC';
            font-size: 14px;
            line-height: 22px;
            flex-shrink: 0;
            cursor: pointer;
          }
        }
      }
    }
  }
}

/* 评价内容区域样式 */
.comment-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px 20px;
  background: #FFFFFF;
  border: 1px solid #F2F3F5;
  box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
  border-radius: 9px;
  box-sizing: border-box;

  .filter-section {
    .filter-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 12px;
      width: 100%;
      min-height: 18px;
      flex-wrap: wrap;

      .filter-group {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-height: 18px;
        flex-wrap: wrap;

        .filter-label {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 18px;
          flex-shrink: 0;

          .search-icon {
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;

            img {
              width: 100%;
              height: 100%;
            }
          }

          span {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 10px;
            line-height: 18px;
            color: #72728B;
            display: flex;
            align-items: center;
          }
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
          min-width: 0;

          .filter-button {
            display: flex;
            align-items: center;
            padding: 1px 8px;
            border-radius: 100px;
            cursor: pointer;
            font-family: 'PingFang SC';
            font-style: normal;
            font-size: 8px;
            line-height: 16px;
            height: 18px;
            gap: 2px;
            transition: all 0.3s ease;
            flex-shrink: 0;

            &.all, &.metric {
              background: #E6E7FF;
              color: #605CE5;
              font-weight: 400;

              &.active {
                background: #605CE5;
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.very-unsatisfied {
              background: v-bind('filterOptions[1].bgColor');
              color: v-bind('filterOptions[1].color');
              
              &.active {
                background: v-bind('filterOptions[1].color');
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.unsatisfied {
              background: v-bind('filterOptions[2].bgColor');
              color: v-bind('filterOptions[2].color');
              
              &.active {
                background: v-bind('filterOptions[2].color');
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.normal {
              background: v-bind('filterOptions[3].bgColor');
              color: v-bind('filterOptions[3].color');
              
              &.active {
                background: v-bind('filterOptions[3].color');
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.satisfied {
              background: v-bind('filterOptions[4].bgColor');
              color: v-bind('filterOptions[4].color');
              
              &.active {
                background: v-bind('filterOptions[4].color');
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.very-satisfied {
              background: v-bind('filterOptions[5].bgColor');
              color: v-bind('filterOptions[5].color');
              
              &.active {
                background: v-bind('filterOptions[5].color');
                color: #FFFFFF;
                font-weight: 500;
              }
            }

            &.indicator {
              background: #E6E7FF;
              color: #605CE5;
              overflow: visible;
              white-space: normal;
            }

            .count {
              margin-left: 4px;
            }
          }
        }
      }

      .vertical-divider {
        width: 0.75px;
        height: 15px;
        background: #E6E5EB;
        margin: 0 6px;
        flex-shrink: 0;
      }
    }
  }

  /* 卡片区域样式 */
  .cards-container {
    display: flex;
    gap: 18px;
    width: 100%;
    margin-top: 18px;
  }

  .preview-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    min-width: 0;
    height: 350px; /* 固定高度 */
    background: #F3F4F6;
    border-radius: 6px;
    position: relative;
    isolation: isolate;
    z-index: 1;
    overflow: hidden;

    .preview-content {
      width: 100%;
      height: 100%;
      position: relative;
      overflow-x: scroll; /* 改为始终显示滚动条 */
      overflow-y: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 改回靠左对齐，方便长图滚动 */
      padding: 0;

      /* 自定义滚动条样式 */
      &::-webkit-scrollbar {
        height: 7px;
        display: block; /* 确保滚动条始终显示 */
      }

      &::-webkit-scrollbar-track {
        background: #e0e0e0;
        border-radius: 32px;
      }

      &::-webkit-scrollbar-thumb {
        background: #605CE5;
        border-radius: 32px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #4F4BC7;
      }

      .preview-image-container {
        display: flex;
        justify-content: center; /* 默认居中显示 */
        align-items: center;
        height: calc(100% - 40px); /* 减去上下边距 */
        min-width: max-content; /* 确保容器可以适应图片实际宽度 */
        padding: 20px 0; /* 添加上下内边距20px */
        margin: 0 auto; /* 居中容器 */
        
        /* 当图片宽度超出容器时，会自动显示滚动条，此时靠左对齐 */
        img {
          height: 100%; /* 高度等于父容器 */
          width: auto; /* 宽度自适应 */
          object-fit: cover; /* 使用 aspectFill 模式 */
          border-radius: 4px;
        }
      }
    }
  }

  .second-card {
    flex: 1;
    min-width: 0;
    background: #F3F4F6;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    padding: 14px 20px;
    gap: 13px;
    height: 350px; /* 设置固定高度与左侧卡片一致 */
    box-sizing: border-box; /* 确保padding不影响总高度 */

    .card-header {
      .heading-3 {
        display: flex;
        flex-direction: row;
        // justify-content: center;
        // align-items: flex-start;
        padding: 0;
        gap: 11px;
        width: 100%;
        height: 31px;
        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;

        .tabs-small {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 5px 0;
          gap: 8px;
          width: 152px;
          height: 31px;
          flex: none;
          order: 0;
          flex-grow: 0;

          .tab-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0 8px;
            width: 68px;
            height: 21px;
            flex: none;
            order: 0;
            flex-grow: 0;
            cursor: pointer;

            &:last-child {
              order: 2;
            }

            .title {
              width: 52px;
              height: 21px;
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 500;
              font-size: 13px;
              line-height: 21px;
              color: #2B2B2B;
              flex: none;
              order: 0;
              flex-grow: 0;
            }

            &.active {
              .title {
                color: #605CE5;
              }
            }
          }

          .divider {
            width: 0;
            height: 12px;
            border: 1px solid #88869C;
            flex: none;
            order: 1;
            flex-grow: 0;
            margin: 0 4px;
          }
        }
      }
    }

    .card-content {
      flex: 1;
      overflow-y: auto;
      min-height: 0; /* 允许内容区域收缩 */

      .comment-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        height: calc(100% - 10px); /* 减去一点间距以避免滚动条超出 */
        overflow-y: auto;

        /* 自定义滚动条样式 */
        &::-webkit-scrollbar {
          width: 7px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #CAC9D4;
          border-radius: 9px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: #B5B4C0;
        }

        .comment-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;

          .comment-header {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 18px 12px;
            background: #FFFFFF;
            border: 1px solid #F2F2F5;
            border-radius: 7px;
            cursor: pointer;

            .header-top {
              display: flex;
              align-items: flex-start;
              gap: 10px;
            }

            .direction {
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;

              img {
                width: 16px;
                height: 16px;
                transition: transform 0.3s ease;
              }
            }

            .status-buttons {
              display: flex;
              gap: 4px;
              flex-wrap: wrap;
              margin-left: 34px; /* 与上方标题对齐 */
              
              .roundbutton {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1px 8px;
                height: 18px;
                border-radius: 100px;
                font-family: 'PingFang SC';
                font-size: 8px;
                line-height: 16px;
                font-weight: 500;
                white-space: nowrap;

                &:first-child {
                  background: #605CE5;
                  color: #FFFFFF;
                }
                
                &.very-unsatisfied {
                  background: v-bind('filterOptions[1].bgColor');
                  color: v-bind('filterOptions[1].color');
                }
                
                &.unsatisfied {
                  background: v-bind('filterOptions[2].bgColor');
                  color: v-bind('filterOptions[2].color');
                }
                
                &.normal {
                  background: v-bind('filterOptions[3].bgColor');
                  color: v-bind('filterOptions[3].color');
                }
                
                &.satisfied {
                  background: v-bind('filterOptions[4].bgColor');
                  color: v-bind('filterOptions[4].color');
                }
                
                &.very-satisfied {
                  background: v-bind('filterOptions[5].bgColor');
                  color: v-bind('filterOptions[5].color');
                }
                
                &.indicator {
                  background: #E6E7FF;
                  color: #605CE5;
                  overflow: visible;
                  white-space: normal;
                }
              }
            }

            .comment-title {
              flex: 1;
              font-family: 'PingFang SC';
              font-size: 13px;
              line-height: 21px;
              font-weight: 500;
              color: #72728B;
              min-width: 0;
              word-break: break-all;
              padding-right: 30px;
            }
          }

          .comment-body {
            padding: 6px 12px;
            background: #E6E7FF;
            border-radius: 7px;
            width: 100%;
            box-sizing: border-box;
            font-family: 'PingFang SC';
            font-size: 13px;
            line-height: 21px;
            color: #2B2B2B;
            flex-shrink: 0;

            .highlight {
              color: #605CE5;
            }
          }
        }
      }
    }
  }
}
</style> 