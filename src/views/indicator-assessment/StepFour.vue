<template>
  <div class="step-four">
    <!-- 评估结果卡片 -->
    <div class="card">
      <div class="card-content">
        <!-- 左侧内容区域 -->
        <div class="left-section">
          <div class="content-with-images">
            <div class="images-scroll-container">
              <div class="images-container">
                <div class="image-placeholder" v-for="(image, index) in uploadedImages" :key="index">
                  <el-image 
                    :src="image" 
                    fit="cover" 
                    class="preview-image" 
                    :preview-src-list="uploadedImages"
                    :initial-index="index"
                    preview-teleported
                  />
                </div>
                <!-- 如果没有上传图片，显示默认提示 -->
                <div v-if="uploadedImages.length === 0 && uploadedImage" class="image-placeholder">
                  <el-image 
                    :src="uploadedImage" 
                    fit="cover" 
                    class="preview-image"
                    :preview-src-list="[uploadedImage]"
                    preview-teleported
                  />
                </div>
                <div v-if="!uploadedImages.length && !uploadedImage" class="image-placeholder">
                  <div class="no-image">未上传图片</div>
                </div>
              </div>
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
        </div>
        <!-- 右侧操作区域 -->
        <div class="right-section">
          <div class="share-button">
            <span class="icon-wrapper">
              <img src="@/assets/assess/share.png" alt="share" />
            </span>
            <span class="button-text">导出报告</span>
          </div>
          <!-- <div class="score-section">
            <div class="score-icon">
              <img src="@/assets/assess/scores.png" alt="score" />
            </div>
            <div class="score-content">
              <span class="score-label">总得分</span>
              <span class="score-value">{{ calculateAverageScore() }}</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs">
      <div class="tabs-group">
        <div class="tab" :class="{ active: activeTab === 'score' }" @click="activeTab = 'score'" ref="scoreTab">
          <span class="text">排序情况</span>
        </div>
        <div class="tab" :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'" ref="commentTab">
          <span class="text">可用性测试总结</span>
        </div>
        <div class="sliding-bar" :style="slidingBarStyle"></div>
      </div>
    </div>

    <!-- 评分内容区域 -->
    <div v-if="activeTab === 'score'" class="score-container">
      <!-- 左侧指标卡片列表 -->
      <div class="indicators-column">
        <div class="indicators-scroll">
          <div 
            class="indicator-card" 
            v-for="(indicator, index) in selectedIndicators" 
            :key="index" 
            :class="{ active: activeIndicator === index }"
            @click="selectIndicator(index)"
          >
            <div class="indicator-title">{{ getIndicatorDisplayText(indicator) }}</div>
            <div class="indicator-desc">{{ getIndicatorDescription(indicator) }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧排名情况卡片 -->
      <div class="ranking-card">
        <!-- 标题栏 -->
        <div class="card-header">
          <div class="header-line"></div>
          <div class="header-title">{{ currentIndicatorTitle }}</div>
        </div>
        
        <!-- 内容区域 -->
        <div class="card-content">
          <!-- 柱状图区域 -->
          <div class="chart-area">
            <!-- 垂直参考线 -->
            <div class="vertical-line"></div>
            
            <!-- 第一行数据条 -->
            <div class="data-row">
              <div class="row-label">AppStore</div>
              <div class="bars-container">
                <div class="bar-primary" :style="{ width: scheme1PrimaryPercent + '%' }" :data-percent="scheme1PrimaryPercent + '%'"></div>
                <div class="bar-secondary" :style="{ width: scheme1SecondaryPercent + '%' }" :data-percent="scheme1SecondaryPercent + '%'"></div>
                <div class="bar-tertiary" :style="{ width: scheme1TertiaryPercent + '%' }" :data-percent="scheme1TertiaryPercent + '%'"></div>
              </div>
            </div>
            
            <!-- 第二行数据条 -->
            <div class="data-row">
              <div class="row-label">支付宝</div>
              <div class="bars-container">
                <div class="bar-primary" :style="{ width: scheme2PrimaryPercent + '%' }" :data-percent="scheme2PrimaryPercent + '%'"></div>
                <div class="bar-secondary" :style="{ width: scheme2SecondaryPercent + '%' }" :data-percent="scheme2SecondaryPercent + '%'"></div>
                <div class="bar-tertiary" :style="{ width: scheme2TertiaryPercent + '%' }" :data-percent="scheme2TertiaryPercent + '%'"></div>
              </div>
            </div>
            
            <!-- 第三行数据条 -->
            <div class="data-row">
              <div class="row-label">微信</div>
              <div class="bars-container">
                <div class="bar-primary" :style="{ width: scheme3PrimaryPercent + '%' }" :data-percent="scheme3PrimaryPercent + '%'"></div>
                <div class="bar-secondary" :style="{ width: scheme3SecondaryPercent + '%' }" :data-percent="scheme3SecondaryPercent + '%'"></div>
                <div class="bar-tertiary" :style="{ width: scheme3TertiaryPercent + '%' }" :data-percent="scheme3TertiaryPercent + '%'"></div>
              </div>
            </div>
            
            <!-- 排名图例 -->
            <div class="rank-legend">
              <div class="legend-item">
                <div class="legend-marker first"></div>
                <div class="legend-label">排名第一</div>
              </div>
              <div class="legend-item">
                <div class="legend-marker second"></div>
                <div class="legend-label">排名第二</div>
              </div>
              <div class="legend-item">
                <div class="legend-marker third"></div>
                <div class="legend-label">排名第三</div>
              </div>
            </div>
          </div>
          
          <!-- 底部结果卡片 -->
          <div class="result-card">
            <div class="result-title">排名情况</div>
            <div class="result-items">
              <div class="result-item">
                <div class="medal-container">
                  <img src="@/assets/assess/first.png" alt="第一名" class="medal-image"/>
                </div>
                <div class="item-name">{{ firstPlatform }}</div>
              </div>
              <div class="result-item">
                <div class="medal-container">
                  <img src="@/assets/assess/second.png" alt="第二名" class="medal-image"/>
                </div>
                <div class="item-name">{{ secondPlatform }}</div>
              </div>
              <div class="result-item">
                <div class="medal-container">
                  <img src="@/assets/assess/third.png" alt="第三名" class="medal-image"/>
                </div>
                <div class="item-name">{{ thirdPlatform }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价内容区域 -->
    <div v-if="activeTab === 'comment'" class="comment-container">
      <!-- 卡片区域 -->
      <div class="cards-container">
        <!-- 左侧指标卡片列表 (复制自score部分) -->
        <div class="indicators-column">
          <div class="indicators-scroll">
            <div 
              class="indicator-card" 
              v-for="(indicator, index) in selectedIndicators" 
              :key="index" 
              :class="{ active: activeIndicator === index }"
              @click="selectIndicator(index)"
            >
              <div class="indicator-title">{{ getIndicatorDisplayText(indicator) }}</div>
              <div class="indicator-desc">{{ getIndicatorDescription(indicator) }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧评价卡片 - 新样式 -->
        <div class="comparison-card">
          <!-- 标题栏 -->
          <div class="card-header">
            <div class="header-line"></div>
            <div class="header-title">{{ currentIndicatorTitle }}</div>
          </div>
          
          <!-- 内容区域 - 三个方案卡片 -->
          <div class="card-content-comparison">
            <!-- 第一名卡片 -->
            <div class="mult-card">
              <!-- 标题栏 -->
              <div class="scheme-header">
                <div class="medal-container">
                  <img src="@/assets/assess/first.png" alt="第一名" class="medal-image"/>
                </div>
                <div class="scheme-title">{{ firstPlatform }}</div>
              </div>
              
              <!-- 图片区域 -->
              <div class="scheme-image">
                <el-image 
                  :src="getSchemeImage(firstPlatform)" 
                  fit="contain" 
                  class="scheme-image-content"
                />
              </div>
              
              <!-- 评价标题 -->
              <div class="comment-title-container">
                <div class="comment-title">综合评价</div>
              </div>
              
              <!-- 评价内容 -->
              <div class="comment-content">
                {{ getCommentContent(firstPlatform) }}
              </div>
            </div>
            
            <!-- 第二名卡片 -->
            <div class="mult-card">
              <!-- 标题栏 -->
              <div class="scheme-header">
                <div class="medal-container">
                  <img src="@/assets/assess/second.png" alt="第二名" class="medal-image"/>
                </div>
                <div class="scheme-title">{{ secondPlatform }}</div>
              </div>
              
              <!-- 图片区域 -->
              <div class="scheme-image">
                <el-image 
                  :src="getSchemeImage(secondPlatform)" 
                  fit="contain" 
                  class="scheme-image-content"
                />
              </div>
              
              <!-- 评价标题 -->
              <div class="comment-title-container">
                <div class="comment-title">综合评价</div>
              </div>
              
              <!-- 评价内容 -->
              <div class="comment-content">
                {{ getCommentContent(secondPlatform) }}
              </div>
            </div>
            
            <!-- 第三名卡片 -->
            <div class="mult-card">
              <!-- 标题栏 -->
              <div class="scheme-header">
                <div class="medal-container">
                  <img src="@/assets/assess/third.png" alt="第三名" class="medal-image"/>
                </div>
                <div class="scheme-title">{{ thirdPlatform }}</div>
              </div>
              
              <!-- 图片区域 -->
              <div class="scheme-image">
                <el-image 
                  :src="getSchemeImage(thirdPlatform)" 
                  fit="contain" 
                  class="scheme-image-content"
                />
              </div>
              
              <!-- 评价标题 -->
              <div class="comment-title-container">
                <div class="comment-title">综合评价</div>
              </div>
              
              <!-- 评价内容 -->
              <div class="comment-content">
                {{ getCommentContent(thirdPlatform) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElImage } from 'element-plus'
// import RadarChart from '@/components/RadarChart.vue' // 已不再使用

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
  uploadedImages: {
    type: Array,
    default: () => []
  },
  assessmentData: {
    type: Object,
    default: null
  }
})

// 指标描述映射表
const indicatorDescriptions = {
  // 易操作性
  'operability_complexity': '系统应通过控件简化、输入方式优化等手段，降低完成指定任务所需的交互复杂度。',
  'operability_efficiency': '系统应支持用户高效完成任务，避免无效步骤与不必要操作，提升关键路径效率。',
  'operability_intuition': '系统操作方式应符合用户的心智模型与行业通用习惯，避免使用反直觉设计或生僻交互方式。',
  
  // 易学性
  'learnability_difficulty': '系统应避免复杂引导或隐藏式功能，使用户在无经验情况下也能完成基础操作。',
  'learnability_comprehension': '系统中的提示语、帮助信息与操作引导应清晰准确，避免歧义，提升内容可理解度。',
  
  // 清晰性
  'clarity_elements': '系统中的图形、按钮、文字等界面元素应具备良好区分度，便于用户识别与操作。',
  'clarity_layout': '系统应合理组织信息结构与控件位置，减少用户记忆负担与视觉寻址时间。',
  'clarity_discovery': '系统应提供显著的功能入口与清晰的信息层级，引导用户快速发现所需内容。',
  
  // 美观度
  'aesthetics_default': '系统界面应具有美观的视觉设计，提供良好的用户体验。',
  
  // 无障碍性
  'accessibility_default': '系统应考虑不同能力用户的需求，提供无障碍访问功能。',
  
  // 效率
  'efficiency_default': '系统应高效响应用户操作，最小化等待时间与操作步骤。',
  
  // 容错性
  'error_default': '系统应能预防用户错误，并在错误发生时提供清晰的修复途径。',
  
  // 满意度
  'satisfaction_default': '系统使用体验应让用户感到愉悦与满意，提高用户忠诚度。'
}

// 柱状图比例数据 - 按指标分类
const chartData = {
  '易操作性/操作的复杂性': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  '易操作性/完成任务的效率': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  '易操作性/是否符合直觉与习惯用法': {
    appstore: [75, 25, 0],
    alipay: [0, 0, 100],
    wechat: [25, 75, 0]
  },
  '易学性/上手难度': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  '易学性/文案信息的易理解性': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  '清晰性/界面元素清晰度': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  '清晰性/界面布局合理性': {
    appstore: [100, 0, 0],
    alipay: [0, 100, 0],
    wechat: [0, 0, 100]
  },
  '清晰性/信息、功能入口容易找到': {
    appstore: [75, 25, 0],
    alipay: [25, 75, 0],
    wechat: [0, 0, 100]
  },
  // 默认数据
  'default': {
    appstore: [0, 0, 0],
    alipay: [0, 0, 0],
    wechat: [0, 0, 0]
  }
}

// 评价内容映射
const commentData = {
  '易操作性/操作的复杂性': {
    'AppStore': "AppStore操作流程极为简洁，入口统一集中于用户头像下的'订阅'页面。整个取消操作仅需三步，页面信息少，跳转少，所有操作集中于一个主功能页。'取消订阅'按钮命名清晰、易识别，无二次确认或迷惑性按钮设计。用户执行任务过程基本不会偏离目标路径，交互连贯性极佳，是三者中操作复杂性最低的平台。",
    '支付宝': "支付宝整体操作流程处于中等水平。用户通过'我的'-'设置'-'支付设置'-'自动续费/免密支付'进行关闭操作，路径虽然稍长，但结构清晰，控件集中。信息密度略高，但页面逻辑较好地聚合了同类功能。按钮较为集中，但个别术语如'免密支付'可能造成歧义。综合来看，支付宝在任务路径设计上相对合理，交互效率尚可。",
    '微信': "微信在操作路径设计上相对复杂。用户需要多次跳转页面，从首页开始逐步进入'服务'、'钱包'、'支付设置'再进入'自动续费'功能，路径层级深、跳转多。按钮布局也不够集中，'关闭扣费服务'按钮往往被隐藏在页面底部，不具备高可见性，缺少高亮提示或引导，使用户操作时容易中断或迷失方向，整体交互体验偏繁琐。"
  },
  '易操作性/完成任务的效率': {
    'AppStore': "AppStore的操作效率最优。进入'订阅'页面后，当前订阅信息一目了然，用户仅需点击取消按钮即可完成任务。整个过程中无多余页面跳转或无效信息，关键路径短、系统响应快，任务反馈清晰。即使首次使用的用户也能在十秒内完成操作，效率显著高于其他两个平台。",
    '支付宝': "支付宝任务完成效率处于中等水平。虽然跳转页面较多，但路径稳定，页面响应速度较快。用户能够在功能页面中较快识别'关闭服务'按钮，虽然文案略有歧义但操作连贯。系统整体支持用户在一个页面完成多个相关设置，能较好支持任务连续完成，效率虽非最高，但仍具可接受水平。",
    '微信': "微信在任务完成效率方面表现较差。多级页面跳转与路径碎片化导致用户完成操作所需时间较长。每一级页面间缺少明显的指引与反馈机制，用户需依赖路径记忆完成任务。'关闭服务'按钮不具备显著的视觉识别度，常需手动滑动页面才能发现，影响关键路径效率，用户在实际操作中易被打断，无法快速达成目标。"
  },
  '易操作性/是否符合直觉与习惯用法': {
    'AppStore': "AppStore高度契合用户的心智模型。取消订阅入口在账户头像后的'订阅'功能中，且命名标准、直白，'取消订阅'为行业通用表达。整个操作过程线性，页面少，无跳转干扰，用户在不参考帮助信息的情况下即可完成全部流程。整体交互方式与主流设计完全一致，极易上手。",
    '支付宝': "支付宝在交互设计上基本符合用户预期。将'自动续费/免密支付'放置在'设置'-'支付设置'中，是符合用户对支付类权限管理认知的路径。部分术语如'免密支付'可能造成与'自动续费'的混淆，但整体操作流程与用户在其他系统中积累的经验接近，较少出现思维跳跃或误判，属于符合行业标准的设计。",
    '微信': "微信的界面交互逻辑较难符合用户的直觉认知。'关闭自动续费'这一操作通常被用户期望在设置或支付中直接完成，但微信将其入口嵌套在'服务'→'钱包'→'支付设置'→'自动续费'路径中，路径跳跃感强，用户需多次探索。按钮命名如'关闭扣费服务'缺乏通俗性，整体交互方式与用户常见的操作模型存在较大偏差，导致体验不自然。"
  },
  '易学性/上手难度': {
    'AppStore': "AppStore具备极低的上手门槛。用户仅需点击头像后进入'订阅'，页面中直接展示所有订阅信息及取消选项，按钮文案直接明了。无多余内容干扰，操作任务清晰、路径简短，操作逻辑天然具备自解释性，即使从未操作过的用户也能快速完成任务。",
    '支付宝': "支付宝的路径虽稍深，但设置逻辑清晰，图标辅助作用显著。用户可通过模块划分较为顺利地找到'自动续费'功能。虽然术语存在一定专业性，但页面结构和按钮命名相对直观，对初次用户具有一定的容错性和引导性，具备较好的试错学习环境。",
    '微信': "微信的上手难度较高。功能入口路径较深，且缺乏界面引导。首次操作用户若不熟悉'服务'与'钱包'的关系，将很难准确找到'支付设置'中隐藏的'自动续费'。页面无高亮提示或任务反馈，按钮术语偏技术化，新用户需反复尝试才能理解流程，学习成本高，不具备良好的自解释能力。"
  },
  '易学性/文案信息的易理解性': {
    'AppStore': "AppStore在文案设计方面表现优秀。'订阅'、'取消订阅'等术语简洁直观，符合大多数用户的语言认知。界面内无冗余信息或模糊词汇，提示语直接表述结果状态。所有操作按钮语义清晰，能准确传达操作含义，极大降低用户理解成本。",
    '支付宝': "支付宝的文案基本清晰，'自动续费'等词汇符合用户语言习惯，但与'免密支付'合并命名存在一定理解难度。操作按钮如'关闭服务'语义略为模糊，不如'取消订阅'更直观。提示语偏少，页面中缺乏对专业术语的解释，对部分用户构成一定理解门槛。",
    '微信': "微信在文案表达方面存在明显不足。按钮如'关闭扣费服务'用语偏系统化，缺乏用户视角，页面缺少辅助解释和术语说明。整体文案设计较难传达功能意图，尤其是对初次操作用户来说，缺乏清晰、直白的操作指令，可能引发歧义或误操作。"
  },
  '清晰性/界面元素清晰度': {
    'AppStore': "AppStore界面元素清晰度最高。图标风格统一，按钮布局规整，文字大小适中，边距留白合理。页面中视觉主次分明，操作按钮对比度强，具备良好的可识别性与交互提示。整体页面风格简洁、导航清晰，是极具参考价值的界面设计。",
    '支付宝': "支付宝界面元素排布较密集但清晰度尚可。图标语义明确，字体颜色对比度较高。部分功能模块图标样式不同，按钮位置不统一，导致界面聚焦难度略高。整体视觉结构仍保持较好区分度，支持用户完成大部分识别任务。",
    '微信': "微信界面在元素视觉方面表现较弱。按钮颜色与背景对比不明显，字体较小，视觉分区模糊。'关闭服务'按钮常位于页面底部，无边框样式或提示标签，用户需滑动页面仔细查找。图标样式一致性不高，界面缺乏焦点强化，降低了用户识别效率。"
  },
  '清晰性/界面布局合理性': {
    'AppStore': "AppStore布局高度聚焦。订阅操作全部集中在同一页面中，按钮位置与内容线性排列，视觉流程自然，用户可从上至下无中断完成操作。页面元素排列紧凑而不拥挤，极具任务导向性。布局合理性表现极佳。",
    '支付宝': "支付宝的界面信息密度大，但模块划分较清晰。每个设置项都有较强的功能归属感，按钮排列有一定规律。'自动续费'页面操作路径稳定，虽然需滑动查找，但整体视觉流程保持一致，布局合理性处于中等水平。",
    '微信': "微信界面布局层级跳跃大，多个功能入口分布在不同模块，用户需频繁滑动、切换才能完成任务。'支付设置'中控件位置不稳定，视觉流程断裂，缺乏引导性布局。整体信息组织分散，视觉路径模糊，使用时缺乏顺畅的视觉节奏。"
  },
  '清晰性/信息、功能入口容易找到': {
    'AppStore': "AppStore入口识别性最强。用户点击头像后即可看到'订阅'，入口标签简洁、位置固定，层级浅，图标及文字均具明显指向性。无需引导文案即可识别功能入口，几乎不存在路径误判，是信息入口可发现性最优的平台。",
    '支付宝': "支付宝入口位置虽然偏深，但分类逻辑清晰，用户只要理解设置结构即可顺利进入。'自动续费/免密支付'名称不够聚焦，但位置固定，界面内具备一定的图标提示支持功能识别，整体入口查找效率中等。",
    '微信': "微信在功能入口查找方面表现最差。用户需从'服务'→'钱包'→'支付设置'→'自动续费'再进入目标功能，路径深且缺乏提示。每一级菜单都未强调任务目标相关性，按钮也无高亮或导航线索，入口识别难度大，用户查找成本高。"
  },
  // 默认评价
  'default': {
    'AppStore': '',
    '支付宝': '',
    '微信': ''
  }
}

// 无需定义未使用的emit

const activeTab = ref('score')
const scoreTab = ref(null)
const commentTab = ref(null)
const activeIndicator = ref(0) // 默认选中第一个指标

// 打印selectedIndicators
onMounted(() => {
  console.log('selectedIndicators:', props.selectedIndicators)
})

// 当前选中的指标标题
const currentIndicatorTitle = computed(() => {
  const indicator = props.selectedIndicators[activeIndicator.value];
  return indicator ? getIndicatorDisplayText(indicator) : '指标1111';
})

// 根据当前选中的指标获取对应的图表数据
const getCurrentChartData = () => {
  if (props.selectedIndicators.length === 0) return chartData.default;
  
  const indicator = props.selectedIndicators[activeIndicator.value];
  if (!indicator) return chartData.default;
  
  const displayText = getIndicatorDisplayText(indicator);
  return chartData[displayText] || chartData.default;
}

// 方案1的数据条宽度比例
const scheme1PrimaryPercent = computed(() => {
  return getCurrentChartData().appstore[0];
})

const scheme1SecondaryPercent = computed(() => {
  return getCurrentChartData().appstore[1];
})

// 方案1的第三段数据条宽度比例
const scheme1TertiaryPercent = computed(() => {
  return getCurrentChartData().appstore[2];
})

// 方案2的数据条宽度比例
const scheme2PrimaryPercent = computed(() => {
  return getCurrentChartData().alipay[0];
})

const scheme2SecondaryPercent = computed(() => {
  return getCurrentChartData().alipay[1];
})

// 方案2的第三段数据条宽度比例
const scheme2TertiaryPercent = computed(() => {
  return getCurrentChartData().alipay[2];
})

// 方案3的数据条宽度比例
const scheme3PrimaryPercent = computed(() => {
  return getCurrentChartData().wechat[0];
})

const scheme3SecondaryPercent = computed(() => {
  return getCurrentChartData().wechat[1];
})

// 方案3的第三段数据条宽度比例
const scheme3TertiaryPercent = computed(() => {
  return getCurrentChartData().wechat[2];
})

// 选择指标
const selectIndicator = (index) => {
  activeIndicator.value = index;
}

// 计算指标展示文本
const getIndicatorDisplayText = (indicator) => {
  if (typeof indicator === 'string') {
    return indicator;
  }
  
  if (indicator.value && typeof indicator.value === 'string') {
    // 处理类似StepTwo中的格式
    const firstLevelCode = indicator.value.split('_')[0];
    const firstLevelText = getFirstLevelText(firstLevelCode);
    return `${firstLevelText}/${indicator.label}`;
  }
  
  if (indicator.parent && indicator.name) {
    return `${indicator.parent}/${indicator.name}`;
  }
  
  if (indicator.firstLevel && indicator.secondLevel) {
    return `${indicator.firstLevel}/${indicator.secondLevel}`;
  }
  
  if (indicator.primaryIndicator && indicator.name) {
    return `${indicator.primaryIndicator}/${indicator.name}`;
  }
  
  if (indicator.name) {
    return indicator.name;
  }
  
  if (indicator.label) {
    return indicator.label;
  }
  
  return '未命名';
}

// 获取指标描述
const getIndicatorDescription = (indicator) => {
  if (!indicator) return '暂无描述';
  
  // 尝试从indicator对象获取value属性作为key
  if (indicator.value && typeof indicator.value === 'string') {
    const key = indicator.value;
    if (indicatorDescriptions[key]) {
      return indicatorDescriptions[key];
    }
    
    // 尝试匹配一级指标
    const firstLevelCode = key.split('_')[0];
    const defaultKey = `${firstLevelCode}_default`;
    if (indicatorDescriptions[defaultKey]) {
      return indicatorDescriptions[defaultKey];
    }
  }
  
  // 尝试构建key (例如：operability_intuition)
  if (indicator.parent && indicator.code) {
    const parentCode = getCodeFromText(indicator.parent);
    const key = `${parentCode}_${indicator.code}`;
    if (indicatorDescriptions[key]) {
      return indicatorDescriptions[key];
    }
  }
  
  // 尝试使用displayText匹配
  const displayText = getIndicatorDisplayText(indicator);
  if (displayText.includes('易操作性/操作的复杂性')) return indicatorDescriptions.operability_complexity;
  if (displayText.includes('易操作性/完成任务的效率')) return indicatorDescriptions.operability_efficiency;
  if (displayText.includes('易操作性/是否符合直觉与习惯用法')) return indicatorDescriptions.operability_intuition;
  if (displayText.includes('易学性/上手难度')) return indicatorDescriptions.learnability_difficulty;
  if (displayText.includes('易学性/文案信息的易理解性')) return indicatorDescriptions.learnability_comprehension;
  if (displayText.includes('清晰性/界面元素清晰度')) return indicatorDescriptions.clarity_elements;
  if (displayText.includes('清晰性/界面布局合理性')) return indicatorDescriptions.clarity_layout;
  if (displayText.includes('清晰性/信息、功能入口容易找到')) return indicatorDescriptions.clarity_discovery;
  
  // 默认返回一级指标描述
  if (displayText.includes('易操作性')) return indicatorDescriptions.operability_default || '系统应便于用户操作，降低使用门槛。';
  if (displayText.includes('易学性')) return indicatorDescriptions.learnability_default || '系统应容易学习，减少用户学习成本。';
  if (displayText.includes('清晰性')) return indicatorDescriptions.clarity_default || '系统界面元素与布局应清晰明了。';
  if (displayText.includes('美观度')) return indicatorDescriptions.aesthetics_default;
  if (displayText.includes('无障碍性')) return indicatorDescriptions.accessibility_default;
  if (displayText.includes('效率')) return indicatorDescriptions.efficiency_default;
  if (displayText.includes('容错性')) return indicatorDescriptions.error_default;
  if (displayText.includes('满意度')) return indicatorDescriptions.satisfaction_default;
  
  return '暂无描述';
}

// 从文本获取代码
const getCodeFromText = (text) => {
  const codeMap = {
    '易操作性': 'operability',
    '易学性': 'learnability',
    '清晰性': 'clarity',
    '美观度': 'aesthetics',
    '无障碍性': 'accessibility',
    '效率': 'efficiency',
    '容错性': 'error',
    '满意度': 'satisfaction'
  };
  
  return codeMap[text] || text.toLowerCase();
}

// 获取一级指标文本
const getFirstLevelText = (code) => {
  const indicatorMap = {
    'operability': '易操作性',
    'learnability': '易学性',
    'clarity': '清晰性',
    'aesthetics': '美观度',
    'accessibility': '无障碍性',
    'efficiency': '效率',
    'error': '容错性',
    'satisfaction': '满意度'
  };
  return indicatorMap[code] || code;
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

// 根据当前指标计算排名顺序
const rankingOrder = computed(() => {
  const currentData = getCurrentChartData();
  
  // 获取各平台排名第一的比例
  const rankings = [
    { name: 'AppStore', value: currentData.appstore[0], platform: 'appstore' },
    { name: '支付宝', value: currentData.alipay[0], platform: 'alipay' },
    { name: '微信', value: currentData.wechat[0], platform: 'wechat' }
  ];
  
  // 按照排名第一的比例降序排序
  return rankings.sort((a, b) => b.value - a.value);
});

// 第一名平台
const firstPlatform = computed(() => rankingOrder.value[0].name);

// 第二名平台
const secondPlatform = computed(() => rankingOrder.value[1].name);

// 第三名平台
const thirdPlatform = computed(() => rankingOrder.value[2].name);

// 获取评价内容
const getCommentContent = (platform) => {
  const indicatorKey = props.selectedIndicators[activeIndicator.value];
  if (!indicatorKey) return commentData.default[platform] || '暂无相关评价内容';
  
  const displayText = getIndicatorDisplayText(indicatorKey);
  const comment = (commentData[displayText] && commentData[displayText][platform]) || commentData.default[platform];
  return comment || '暂无相关评价内容';
}

// 获取方案图片
const getSchemeImage = (platform) => {
  if (platform === 'AppStore' && props.uploadedImages.length > 0) {
    return props.uploadedImages[0];
  } else if (platform === '支付宝' && props.uploadedImages.length > 1) {
    return props.uploadedImages[1];
  } else if (platform === '微信' && props.uploadedImages.length > 2) {
    return props.uploadedImages[2];
  } else if (props.uploadedImage) {
    // 如果没有足够的图片，则使用单张上传的图片
    return props.uploadedImage;
  }
  // 如果没有任何图片，返回空字符串
  return '';
}
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
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
      min-width: 300px;
      
      .content-with-images {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
      }
      
      .images-scroll-container {
        max-width: 280px;
        padding-bottom: 8px;
        
        /* 自定义滚动条样式 */
        &::-webkit-scrollbar {
          height: 6px;
          display: block;
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
      }
      
      .images-container {
        display: flex;
        gap: 8px;
        flex-wrap: nowrap;
        padding-bottom: 2px;
      }
      
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
        cursor: pointer;
        
        &:hover {
          box-shadow: 0 0 8px rgba(96, 92, 229, 0.5);
          transform: scale(1.02);
          transition: all 0.2s ease;
        }
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .no-image {
          color: #72728B;
          font-size: 12px;
          text-align: center;
        }
      }
      
      .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        
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
        
        .content-with-images {
          flex-direction: column;
          align-items: center;
        }
        
        .images-scroll-container {
          max-width: 100%;
          justify-content: center;
        }
        
        .images-container {
          max-width: 100%;
          justify-content: center;
        }
        
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
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  gap: 28px;
  width: 100%;
  height: 520px; /* 增加高度 */
  position: relative;
}

/* 左侧指标卡片列表 */
.indicators-column {
  box-sizing: border-box;
  width: 254px;
  height: 480px; /* 增加高度与右侧卡片匹配 */
  margin: 0 auto;
  flex: none;
  order: 0;
  flex-grow: 0;
  background: #FFFFFF;
  border: 0.75px solid #F2F3F5;
  box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
  border-radius: 9px;
  padding: 16px 0;
  
  .indicators-scroll {
    height: 100%;
    overflow-y: auto;
    padding: 2px 16px;
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #CAC9D4;
      border-radius: 9px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #605CE5;
    }
  }
  
  .indicator-card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px; /* 减小1px，为active状态的边框预留空间 */
    gap: 8px;
    width: 100%;
    min-height: 94px;
    height: auto;
    background: #FFFFFF;
    border: 2px solid transparent; /* 使用透明边框，保持一致宽度 */
    box-shadow: 0 0 0 1px #E5E7EB; /* 使用box-shadow模拟1px边框 */
    border-radius: 6px;
    flex: none;
    align-self: stretch;
    flex-grow: 0;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    
    &:hover:not(.active) {
      box-shadow: 0 0 0 1px #CAC9D4, 0px 2px 5px rgba(71, 70, 103, 0.05);
    }
    
    &.active {
      background: linear-gradient(185.38deg, #E7EBFF -12.06%, #FFFFFF 95.69%);
      border-color: #605CE5; /* 显示紫色边框 */
      box-shadow: 0px 4px 10px rgba(71, 70, 103, 0.1);
      border-radius: 8px;
    }
    
    .indicator-title {
      width: 100%;
      min-height: 22px;
      height: auto;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      align-items: flex-start;
      color: #2B2B2B;
      flex: none;
      order: 0;
      align-self: stretch;
      flex-grow: 0;
      word-break: break-word;
    }
    
    .indicator-desc {
      width: 100%;
      min-height: 36px;
      height: auto;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 18px;
      display: flex;
      align-items: flex-start;
      color: #72728B;
      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;
      word-break: break-word;
      overflow-y: auto;
      max-height: 80px;
    }
  }
}

/* 右侧排名情况卡片 */
.ranking-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  flex: 1;
  min-width: 0;
  height: 480px;
  background: #FFFFFF;
  border: 0.75px solid #F2F3F5;
  box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
  border-radius: 9px;
  order: 1;
  
  .card-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;
    width: 100%;
    height: 21px;
    order: 0;
    align-self: stretch;
    
    .header-line {
      width: 6px;
      height: 21px;
      background: #605CE5;
      flex: none;
      order: 0;
      flex-grow: 0;
    }
    
    .header-title {
      height: 21px;
      font-family: 'Noto Sans SC';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 21px;
      display: flex;
      align-items: center;
      letter-spacing: 0.1em;
      color: #2B2B2B;
      flex: none;
      order: 1;
      flex-grow: 0;
    }
  }
  
  .card-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    gap: 16px;
    width: 100%;
    height: 366px;
    background: #F9F8FD;
    border: 1px solid #F2F2F5;
    border-radius: 4px;
    order: 1;
    align-self: stretch;
    flex-grow: 1;
    position: relative;
    
    /* 柱状图区域 */
    .chart-area {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px; /* 设置柱子间距为20px */
      flex: 1;
      position: relative; /* 添加相对定位，以便垂直线可以绝对定位 */
      
      /* 垂直参考线 */
      .vertical-line {
        position: absolute;
        width: 0;
        height: 131px; /* 增加高度，覆盖三行数据 */
        left: 85px;
        top: -5px;
        border-left: 1px solid #CAC9D4;
        
      }
      
      /* 数据行 */
      .data-row {
        display: flex;
        align-items: center;
        gap: 35px;
        position: relative;
        
        .row-label {
          width: 50px;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: #2B2B2B;
          flex-shrink: 0;
        }
        
        .bars-container {
          display: flex;
          height: 27px;
          flex: 1;
          
          .bar-primary {
            height: 100%;
            background: #615CE5; /* 深紫色 */
            position: relative;
            
            &:hover::after {
              content: attr(data-percent);
              position: absolute;
              top: -30px;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              white-space: nowrap;
              z-index: 10;
            }
          }
          
          .bar-secondary {
            height: 100%;
            background: #A8A6EF; /* 中紫色 */
            position: relative;
            
            &:hover::after {
              content: attr(data-percent);
              position: absolute;
              top: -30px;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              white-space: nowrap;
              z-index: 10;
            }
          }
          
          .bar-tertiary {
            height: 100%;
            background: #E6E7FF; /* 浅紫色 */
            position: relative;
            
            &:hover::after {
              content: attr(data-percent);
              position: absolute;
              top: -30px;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              white-space: nowrap;
              z-index: 10;
            }
          }
        }
      }
      
      /* 排名图例 */
      .rank-legend {
        display: flex;
        justify-content: center;
        gap: 30px; /* 减少间距以适应三个图例 */
        margin-top: 24px;
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .legend-marker {
            width: 16px;
            height: 16px;
            
            &.first {
              background: #615CE5; /* 深紫色 */
            }
            
            &.second {
              background: #A8A6EF; /* 中紫色 */
            }
            
            &.third {
              background: #E6E7FF; /* 浅紫色 */
            }
          }
          
          .legend-label {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            color: #2B2B2B;
          }
        }
      }
    }
    
    /* 结果卡片 */
    .result-card {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      padding: 20px 16px;
      width: 100%;
      max-width: 458px;
      height: 78px;
      background: #FFFFFF;
      border: 1px solid #605CE5;
      border-radius: 4px;
      margin-top: auto;
      
      .result-title {
        width: 64px;
        height: 24px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        display: flex;
        align-items: center;
        color: #605CE5;
        margin-right: 50px;
      }
      
      .result-items {
        display: flex;
        align-items: center;
        gap: 24px;
        
        .result-item {
          display: flex;
          align-items: center;
          gap: 10px;
          
          .medal-container {
            width: 20px;
            height: 24px;
            
            .medal-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          
          .item-name {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #2B2B2B;
          }
        }
      }
    }
  }
}

/* 评价内容区域样式 - 更新后 */
.comment-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
  width: 100%;

  /* 卡片区域样式 */
  .cards-container {
    display: flex;
    gap: 28px;
    width: 100%;
  }

  /* 右侧比较卡片 - 新样式 */
  .comparison-card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 24px;
    gap: 8px;
    margin: 0 auto;
    width: 913px;
    height: 480px; /* 增加高度以容纳更高的卡片 */
    background: #FFFFFF;
    border: 0.75px solid #F2F3F5;
    box-shadow: 0px 0.75px 1.5px rgba(0, 0, 0, 0.05);
    border-radius: 9px;
    flex: 1;
    
    /* 卡片标题栏 */
    .card-header {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 0px;
      gap: 20px;
      width: 100%;
      height: 21px;
      align-self: stretch;
      
      .header-line {
        width: 6px;
        height: 21px;
        background: #605CE5;
        flex: none;
      }
      
      .header-title {
        // width: 78px;
        height: 21px;
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 21px;
        display: flex;
        align-items: center;
        letter-spacing: 0.1em;
        color: #2B2B2B;
      }
    }
    
    /* 卡片内容 - 三个方案横向布局 */
    .card-content-comparison {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 0px;
      gap: 8px;
      width: 100%;
      height: 420px; /* 增加高度以适应内部卡片高度 */
      align-self: stretch;
      flex-wrap: nowrap; /* 确保不换行 */
      
      /* 方案卡片 */
      .mult-card {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        gap: 16px;
        width: calc(33.333% - 6px); /* 三等分减去间距 */
        height: 420px; /* 增加卡片高度 */
        background: #F9F8FD;
        border: 1px solid #F2F2F5;
        border-radius: 4px;
        flex: 0 0 auto; /* 禁止伸缩 */
        
        /* 方案标题栏 */
        .scheme-header {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 0px;
          gap: 10px;
          width: 100%;
          height: 24px;
          
          .medal-container {
            width: 20.87px;
            height: 24px;
            flex-shrink: 0;
            
            .medal-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          
          .scheme-title {
            height: 24px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            display: flex;
            align-items: center;
            color: #2B2B2B;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        
        /* 方案图片区域 */
        .scheme-image {
          width: 100%;
          height: 114px;
          min-height: 114px;
          max-height: 114px;
          background: rgba(217, 217, 217, 0.65);
          border-radius: 4px;
          align-self: stretch;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          flex-shrink: 0;
          
          .scheme-image-content {
            width: 100%;
            height: 114px;
            object-fit: contain;
            flex-shrink: 0;
          }
        }
        
        /* 评价标题区域 */
        .comment-title-container {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 0px;
          gap: 11px;
          width: 100%;
          height: 22px;
          align-self: stretch;
          
          .comment-title {
            width: 56px;
            height: 22px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            color: #605CE5;
          }
        }
        
        /* 评价内容 */
        .comment-content {
          width: 100%;
          // height: 120px; /* 增加高度 */
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 13px;
          line-height: 21px;
          color: #2B2B2B;
          align-self: stretch;
          overflow-y: auto; /* 添加垂直滚动 */
          padding: 2px 4px; /* 增加内边距 */
          text-align: justify; /* 两端对齐，更美观 */
          
          /* 自定义滚动条样式 */
          &::-webkit-scrollbar {
            width: 4px;
          }

          &::-webkit-scrollbar-track {
            background: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background: #CAC9D4;
            border-radius: 9px;
          }

          &::-webkit-scrollbar-thumb:hover {
            background: #605CE5;
          }
        }
      }
    }
  }
}

/* 添加响应式样式 */
@media screen and (max-width: 768px) {
  .comparison-card {
    width: 100%;
    
    .card-content-comparison {
      flex-wrap: wrap;
      height: auto;
      
      .mult-card {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
}
</style> 