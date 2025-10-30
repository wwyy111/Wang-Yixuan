<template>
  <div class="step-three">
    <!-- 进度展示区域 -->
    <div class="progress-container">
      <span class="progress-title">{{ loadedCards >= totalCards ? '评估已完成' : '正在评估' }}</span>
      <div class="progress-bar">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          <span class="progress-percentage">{{ progress }}%</span>
        </div>
      </div>
      <span v-if="loadedCards < totalCards" class="remaining-time">预计剩余时长：{{ remainingTime }}</span>
    </div>
    
    <!-- 评估卡片区域 -->
    <div class="assessment-container">
      <div v-for="(item, index) in assessmentList" :key="index" class="assessment-section">
        <div class="assessment-header" @click="toggleSection(index)">
          <span class="assessment-title">{{ item.title }}</span>
          <div class="icon-wrapper">
            <img 
              src="@/assets/assess/down_color.png" 
              alt="toggle" 
              class="toggle-icon"
              :class="{ 'collapsed': !item.isExpanded }"
            />
          </div>
        </div>
        
        <div class="assessment-cards" v-show="item.isExpanded">
          <div v-for="(card, cardIndex) in item.cards" :key="cardIndex" class="assessment-card" :class="{ 'loading': card.loading, 'highlighted': card.highlighted }">
            <div class="card-header">
              <span v-if="!card.loading" class="user-name" :class="{ 'user2': card.loading }">{{ card.userName }}</span>
              <div class="score-info">
                <template v-if="!card.loading">
                  <div class="platform-path">{{ card.ranking }}</div>
                </template>
                <img v-else src="@/assets/assess/score.png" alt="score skeleton" style="width:58px;height:22px;object-fit:contain;" />
              </div>
            </div>
            
            <div class="card-content" :class="{ 'loading': card.loading }">
              <template v-if="!card.loading">
                <pre>{{ card.content }}</pre>
              </template>
              <img v-else src="@/assets/assess/infos.png" alt="infos skeleton" style="width:100%;max-width:520px;object-fit:contain;" />
            </div>
            
            <div class="card-tags" :class="{ 'loading': card.loading }">
              <template v-if="!card.loading">
                <div v-for="(tag, tagIndex) in card.tags" :key="tagIndex" class="tag">{{ tag }}</div>
              </template>
              <img v-else src="@/assets/assess/tags.png" alt="tags skeleton" style="height:36px;object-fit:contain;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch, nextTick } from 'vue'

// 定义emit
const emit = defineEmits(['loading-status-change', 'assessment-completed', 'clear-scroll-position'])

// 接收从父组件传递的属性
const props = defineProps({
  functionName: {
    type: String,
    default: ''
  },
  functionDesc: {
    type: String,
    default: ''
  },
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  roleList: {
    type: Array,
    default: () => []
  },
  // 添加新属性，用于判断是否已完成评估
  savedAssessmentData: {
    type: Object,
    default: null
  },
  // 接收滚动位置信息
  scrollToPosition: {
    type: Object,
    default: null
  },
  // 标记是从步骤4跳转过来的
  isFromStepFour: {
    type: Boolean,
    default: false
  }
})

// 可配置的进度和时间
const progress = ref(0)
const remainingTime = ref('')
const totalCards = ref(0) // 总卡片数量
const loadedCards = ref(0) // 已加载的卡片数量


// 评估内容表：按照指标和序号组织内容
const assessmentContentTable = {
  '易操作性/是否符合直觉与习惯用法': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的操作路径较符合苹果生态用户的习惯，点击头像后查看账户信息是一种通用认知模式，'订阅'作为核心功能入口位置突出，'取消订阅'按钮命名也直白清晰，不容易误解，用户能顺着直觉完成整个流程。支付宝整体结构符合日常支付类操作路径，从'设置'到'支付设置'，再进入'自动续费'，整个流程虽然层级多但逻辑清晰，界面布局符合用户对"设置"中管理权限的认知。图标与文案大致合理，但有些栏目命名偏向系统内部术语，如'免密支付'，可能引发理解偏差。微信的设计偏离直觉路径。多数用户不会第一时间想到从'服务'页进入'钱包'再跳入'支付设置'查找自动续费管理。'支付设置'作为入口与自动续费关联度不直观，操作路径背离用户常见预期。'关闭扣费服务'的按钮也设计在页面底部，易被忽视。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore对习惯用法的契合度高。用户管理订阅内容的思路在苹果平台中一向通过账户完成，因此通过点击头像管理订阅是直觉操作。'订阅'和'取消订阅'等术语使用规范清晰，操作顺序贴合用户心理预期。支付宝的路径设置符合用户对支付相关权限的认知，'自动续费'集中在'支付设置'模块中，用户容易从经验中推断入口逻辑。但'免密支付'等名词偏系统化，对不熟悉的用户来说稍显生硬。整体操作流程较为规整。微信操作明显偏离直觉路径。从'服务'进入'钱包'，再到'支付设置'，流程跳跃大，功能分组不够贴近用户任务心智模型。'自动续费'标签位置及描述模糊，用户在查找过程中很容易走弯路，甚至误入其他功能模块。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝整体操作方式贴近用户对系统设置的认知逻辑。用户通过'设置'-'支付设置'-'自动续费'，能够沿着熟悉的路径完成目标任务。名称使用贴近日常术语，'关闭服务'表达清晰，路径逻辑自然。AppStore虽然操作简洁，但入口嵌入头像区域，对未形成使用习惯的用户来说不容易第一时间联想到'订阅'管理应通过账户头像进入。整体操作虽线性，但入口点不够普遍化，偏向熟悉苹果系统者。微信设计偏离常规支付操作认知。多数用户认为支付权限应集中于'设置'或'支付'主菜单中，而非'服务'→'钱包'路径。'支付设置'作为路径节点较为生僻，'自动续费'标签也容易与'免密支付'混淆，交互方式不够自然。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore操作流程与平台用户操作习惯高度匹配。用户在AppStore中管理服务订阅本就常见，'订阅'、'取消订阅'等功能按钮标准化明显，不存在理解障碍，符合行业设计语言。支付宝设置项虽多，但模块划分合理，'支付设置'中集成自动续费管理入口，名称虽然专业但不违背用户逻辑。操作顺序基本贴合经验流程。微信路径最不符合用户直觉。'服务'和'钱包'作为入口点偏离主任务逻辑，用户日常更多将其用于支付与生活服务，较少与订阅管理关联。功能名称模糊，界面路径安排分散，易导致误操作。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore符合苹果用户的直觉操作模式。'账户'-'订阅'的路径简洁明了，符合多数用户在App使用中的管理习惯。图标与功能命名标准化、语义清晰，使用顺序易理解，无需多次尝试即可完成。支付宝路径逻辑合理，虽然入口相对隐蔽，但符合设置类任务的操作预期。唯一问题是文案使用偏技术导向，如'免密'概念不够通俗，可能造成误解。但整体流程贴合支付工具常规设计思路。微信路径不直观，'服务'-'钱包'-'支付设置'的逻辑链较难形成统一认知。尤其'支付设置'在多数用户印象中多与安全性挂钩，而非自动扣款，路径断裂明显，缺乏引导性与熟悉感。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝在语言表达和模块分类方面相对规范，'自动续费/免密支付'在'支付设置'中属于合理归属，虽术语略显复杂，但大多数用户可根据支付经验快速理解并操作。路径逻辑贴合设置类心智模型。AppStore整体流程非常标准，但对非技术用户来说'订阅'入口较深，嵌入头像菜单缺乏明显提示，若非已有经验，操作初期会略显陌生。不过一旦熟悉逻辑，整个使用体验就非常自然顺畅。微信操作完全不符合用户直觉。'服务'作为功能入口较为笼统，难以定位具体功能。跳转路径间缺少上下文逻辑支撑，按钮命名偏向系统层级语言，不易与自动续费任务关联，违背操作直觉。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore结构极其简洁，符合主流App中订阅管理路径设计规则。图标语义清晰，功能入口设置在核心账户中，便于统一管理和取消，整个体验与主流国际应用高度一致，用户易于掌握。支付宝虽然信息密度大，但其设置中心设计仍属合理，用户习惯于在设置中查找付款权限管理项。部分术语如'免密'等略带平台内部语义，但不影响用户理解其自动扣费含义。微信路径设计较为跳跃，用户需反复确认功能属于哪个菜单层级。'支付设置'放置位置与预期不符，整体路径显得不够直观，缺少通用设计参考，导致操作偏差率高，学习成本增加。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore取消订阅路径设置合理，用户点击头像查看账户信息是符合通用用户模型的做法。页面元素标准统一，图标与文字均符合系统规范，无生僻术语，使用顺畅无障碍，基本无需思考路径。支付宝设置方式符合用户对复杂支付设置的常规操作习惯。操作方式从设置-支付-自动续费具有可推理性，但部分功能名称如'自动续费/免密支付'合并呈现，可能令用户误解二者用途。微信路径不符合常规习惯。多个页面未形成聚焦关系，'服务'与'支付设置'之间路径不连贯。自动续费功能不集中、分布深层、命名模糊，偏离用户心理预期。整体操作体验缺乏一致性。`
    }
  },
  '易操作性/操作的复杂性': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore整体流程最短，用户仅需点击头像进入账户页面，再点击"订阅"即可看到当前订阅服务，随后点击"取消订阅"即完成关闭。整个过程中页面跳转仅三次，且所有功能位于同一个区域，路径线性、信息聚焦。按钮命名如'取消订阅'也非常直观，不容易误解，整体体验轻松流畅。支付宝操作流程相对较长，但结构清晰。用户需要通过'我的'页面进入设置，再找到支付设置中的'自动续费/免密支付'，然后选择对应服务并点击'关闭服务'。虽然页面跳转四次，但由于操作逻辑较为统一、入口明确，用户可以较快适应。微信的流程最复杂。从首页要进入'服务'，再点进'钱包'，接着进入'支付设置'，再点入'自动续费'，找到服务项后才能点击'关闭扣费服务'。页面跳转高达五级，且每步之间逻辑不明显，缺乏足够的导航提示，极易迷失。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore操作路径简洁直观。点击头像即可看到'订阅'，直接显示所有订阅服务，页面信息干净，无干扰内容。'取消订阅'按钮位于页面底部显眼位置，操作完成度高且反馈明确。整体路径短、线性，易于操作，适合不熟悉界面的普通用户。支付宝通过设置路径找到'自动续费'服务，虽然入口在设置中较深，但逻辑清晰，页面信息分类清楚，多个服务在一个页面聚合展示，减少跳转和查找时间。但界面图标密集、文案略显复杂，视觉负担较重。微信的操作路径冗长且碎片化，用户需要记住多个跳转路径。'支付设置'选项位于页面最底部，不易发现，同时'自动续费'与其他设置混在一起，不容易一眼识别，流程跳转繁琐，对操作流程的记忆要求较高，不利于目标任务顺利完成。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝在操作复杂性方面较优，用户可以通过点击右上角设置按钮直接进入'支付设置'，再点击'自动续费/免密支付'进入相关服务列表，操作逻辑较为集中，路径虽然略长但每一步都有清晰标题提示，用户不容易迷路。AppStore操作路径更短，但入口隐藏在用户头像中，对不熟悉AppStore账户管理入口的用户不够直观。从'订阅'进入后页面较为简洁，但前期入口发现成本略高，稍不熟悉的用户容易忽略。微信的路径是三者中最复杂的，入口分散且深度较大。用户必须从'服务'转入'钱包'，再点击'支付设置'，找到'自动续费'才能操作目标项目。流程较多、分支复杂，缺乏路径提示与聚焦按钮设计。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore结构清晰简洁，进入个人头像后点击'订阅'即展示所有订阅服务。取消按钮在服务卡片下方显眼位置，文案明晰。整个路径跳转少，页面设计纯净，对低经验用户非常友好。支付宝在入口发现上稍显复杂，需要通过多个层级进入设置，再定位到'自动续费'功能。不过设置页面分类较清晰，用户在了解逻辑后容易掌握，流程也相对集中，功能聚合度高。微信路径跳转最多，从首页进入'服务'、'钱包'、'支付设置'、'自动续费'，再进入具体项目才能关闭。各页面缺乏引导提示，按钮设计位置隐蔽，'关闭扣费服务'藏在最底部，用户需要主动滚动才能发现，增加误操作或放弃风险。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore在操作复杂性上表现最优，整体只需三步，从头像进入订阅后可以快速查看和取消当前订阅。路径清晰，信息指向性强，没有中间无效跳转，也没有多余干扰。'取消订阅'按钮直接出现在页面中部，极具引导性。支付宝次之，设置路径在'我的'-'设置'-'支付设置'-'自动续费'，按钮相对聚集，用户可快速完成。问题在于页面中存在多个图标与功能堆叠，用户可能一时间难以聚焦。微信路径较为冗长，包含五级跳转，且从主页面进入'服务'这一步就容易让用户迷失。'支付设置'入口被隐藏在钱包页面底部，不仅需要滑动，用户还要对'自动续费'逻辑有所了解才能定位目标功能。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝虽然跳转路径略长，但每一层级命名合理，'自动续费/免密支付'功能分类明确，服务列表集中，用户能很快锁定要取消的项目。路径虽然非极简，但任务聚焦好，适合非专业用户操作。AppStore操作路径简单，页面信息整洁，从订阅页面可立即看到全部服务和取消按钮。问题在于入口位置较为隐蔽，嵌套在头像-账户页中，对于不熟悉App设置入口的用户易忽略。微信操作流程最复杂。从服务页跳转到钱包，再到支付设置，整个路径碎片化明显，中间没有明显反馈提示，操作方式切换频繁，用户容易因跳转太多而失去耐心。每一步按钮命名也偏向专业，识别难度较高。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore在用户操作路径上高度清晰，用户通过图标进入订阅中心后，服务展示和取消功能一目了然。页面无额外信息干扰，交互方式统一，操作连续性好，适合大部分用户直觉理解。支付宝虽然路径稍长，但各个设置项逻辑分类明确，用户在了解一次后可快速操作。'自动续费'分类页中聚合多个服务，减少重复跳转。信息虽多，但操作路径顺畅。微信路径设计最不合理，入口分散，跳转频率高，尤其'支付设置'位置非常靠下。用户在多个跳转中可能失去耐心或误判路径。服务详情页的'关闭扣费服务'按钮放置位置偏下，缺乏引导性。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore路径短、逻辑清晰。从用户头像到订阅再到取消操作只需3步，按钮突出、文案明确。页面设计上取消订阅功能位置固定，不依赖二级弹窗或多重确认，降低了操作误解的可能性。支付宝通过'我的'-'设置'-'支付设置'进入'自动续费'，整体路径合理但页面层级偏多，部分功能被多个图标分散展示，存在用户误点或跳出任务的风险，但整体仍可接受。微信路径过于复杂，从首页至功能页面需多次跳转，每页信息组织较弱。'自动续费'功能位于列表中段，缺乏高亮或图标提示；'关闭扣费服务'按钮藏于页面底部，未设置突出引导，整体操作体验最差。`
    }
  },
  '易操作性/完成任务的效率': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore在完成关闭自动续费任务上的效率最高。整个流程仅需三步：点击头像、进入'订阅'、点击'取消订阅'即可完成，任务路径最短，步骤明确，系统响应快速。所有关键信息集中展示，基本无干扰内容，用户几乎不需要确认或跳出主路径。支付宝表现中等，用户需从'我的'-'设置'-'支付设置'-'自动续费/免密支付'中逐层查找，虽然逻辑相对清晰，但页面跳转较多，耗时增加。任务目标明确，功能响应也较快，但每层级信息过多略影响效率。微信效率最低。路径分散、页面跳转繁复，从首页到关闭功能最少需五步操作。'支付设置'位于页面底部，系统没有提示或快速入口引导，用户在多次页面切换中容易中断任务，找不到路径需重复尝试。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的取消订阅流程最简洁，页面设计突出关键路径，取消操作一步直达，不涉及确认弹窗或分支判断。关键路径长度短，且每一步页面加载迅速，内容聚焦。用户几乎不会偏离主任务路径，整个任务可在10秒内完成。支付宝需要经过较多页面才能找到目标服务。虽然最终操作按钮明确、加载流畅，但入口层级偏深，每一步都可能引发任务中断。尤其在'支付设置'中同时展示大量设置项，用户需短暂停留辨别，影响完成效率。微信页面分布最复杂。完成一次关闭操作需进行五步跳转，而且系统没有设置路径指引，也无快捷方式。用户若不熟悉流程，常需反复查找；系统无任何自动推荐或快速选项支持，影响关键路径效率。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝虽然流程相较AppStore多一至两步，但在页面逻辑安排与反馈响应方面仍表现较为高效。每一步页面加载迅速，功能明确，支持用户快速识别目标。最终'关闭服务'按钮也具备高响应性与可视性，完成操作顺畅。AppStore结构简单，但由于入口嵌套在用户头像内，部分用户需要时间寻找路径。虽然取消本身非常直接，但寻找入口过程耗时增加。操作一旦上手就很快完成，但首次使用者整体用时略长。微信完成任务效率较低，页面跳转多、路径复杂。'自动续费'设置入口与'关闭'按钮彼此分离，部分功能在页面底部无突出标识，且系统无辅助信息提示用户是否完成取消，任务达成存在不确定性。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的整体效率表现最佳。无论从点击步骤还是页面结构看，取消路径都高度聚焦。取消操作几乎无确认弹窗，且页面首次加载即展示订阅详情，极大压缩操作时间。系统反馈明确，流程无中断或等待。支付宝流程略显冗长，特别是在跳转层级中需要频繁辨认图标。虽然各页面加载快，但内容量大，用户需在多项中甄别目标服务，处理时间增加。若非高频操作用户，识别目标入口略有挑战。微信完成关闭自动续费流程时效率明显偏低。主要问题在于路径碎片化严重，各页面间缺少引导文字。跳转过程中部分按钮命名模糊，如'支付设置'不易联想到自动扣费，导致用户执行步骤多、反应慢。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore三步完成取消操作，逻辑清晰。每一层级中只展示最相关的信息，避免用户误点其他操作，执行效率极高。所有订阅服务集中展示在一页，取消按钮位置明确，几乎无信息噪音或操作干扰。支付宝在实际操作中虽有更多页面，但逻辑连贯性不错，用户可顺利跟进。页面反馈速度快，取消操作按钮无多余确认机制，执行响应性好。但若用户首次接触设置路径，需一定辨识时间，降低首次效率。微信路径跳转繁多、系统提示不明确。多个页面无明显反馈，尤其进入'自动续费'后仍需多次点击查找目标服务。'关闭扣费服务'位置偏下，需手动滑动页面，容易遗漏或误操作，效率最低。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝在效率方面略优于AppStore。虽然步骤略多，但所有设置均集中在'支付设置'模块，用户只需按流程执行即可顺利关闭续费。功能入口明显、响应速度快，用户几乎不会卡顿或迷失路径。AppStore主路径较短，但在首次操作时寻找'订阅'入口可能存在延迟。若用户不知该入口在头像页中，需反复尝试搜索，实际操作效率略打折扣。不过，一旦找到路径后，执行速度非常快。微信路径复杂、操作繁琐且存在跳转间歇。每个页面信息多且重点不突出，缺少显著的'自动续费'提示标签，按钮样式普通，不易捕捉。整体过程中用户需频繁滑动和识别，操作效率较差。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的'订阅管理'路径几乎无分支，订阅项和取消按钮在同页，操作连贯、无需跳出当前流程，效率极高。即便是首次操作的用户也能快速完成，操作顺利无中断。支付宝步骤略多但流程清晰。设置层级合理，自动续费项集中展示，点击关闭服务后无需额外弹窗确认。响应时间快，但信息展示密度大，用户可能会因寻找具体服务而稍有停顿。微信从服务到钱包再到支付设置，涉及至少五次点击。且页面切换过程中缺少上下文提示，'关闭服务'按钮放在页面底部，用户需滑动查找。任务路径不集中，完成效率受限。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore操作简洁高效。页面跳转少，用户在一个统一界面内即可查看订阅详情并完成取消操作。取消按钮命名直白，系统反馈明确，点击后任务即完成，无等待或弹窗干扰，是三者中效率最优。支付宝流程中规中矩。虽然页面跳转次数偏多，但每页操作要素明确，流程不易出错。缺点是功能入口在设置页中层级较深，不利于快速定位；同时，服务项目过多时，用户需花时间查找具体项。微信效率较差，主要由于路径过于复杂且按钮布局不合理。多个入口处无明显提示，跳转页面间无线索引导，用户需靠记忆完成操作。'关闭扣费服务'按钮位置过低，需滑动，影响节奏感。`
    }
  },
  '易学性/上手难度': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的上手难度最低。首次打开页面后，用户只需点击头像便可进入订阅管理页面，整个路径没有复杂的分支或隐蔽操作。界面自解释性强，'订阅'、'取消订阅'等词汇清晰明了，不容易产生理解偏差，按钮也布置在显眼区域。支付宝的引导性较强，在设置路径中层级虽然较多，但每个设置项命名规范，较容易让用户理解功能所在位置。不过对于首次使用者而言，仍需要几次点击尝试，特别是理解'免密支付'与'自动续费'的区别。微信上手难度最大。用户必须从'服务'进入'钱包'，再层层进入'支付设置'，路径跳跃大且缺乏直观提示。页面命名偏向系统语言，难以与任务目标直接关联，用户可能在多次点击后仍无法成功完成任务。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore界面结构清晰，步骤简单，无需辅助引导或额外帮助说明，用户可顺利完成操作。取消功能位于最核心的'订阅'页面中，入口显眼，操作指向性强，上手几乎无障碍。支付宝设置路径虽然不是最直观，但布局合理。新用户通过浏览设置列表能够比较容易发现'自动续费'功能。图标图形搭配适中，有一定的视觉辅助，能降低上手门槛。微信路径跳转复杂，功能入口隐藏较深，页面层级多。用户需要熟悉微信的'服务'-'钱包'-'支付设置'结构，且系统无任何主动提示。对不了解钱包结构的新用户极具挑战，容易陷入试错和路径偏移。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝的模块设计清晰合理，用户即使没有经验，也能通过逻辑推理完成任务。系统提供的名称和图标基本可读，操作后也有明确反馈，不容易走错路径。'自动续费'作为设置项出现在支付菜单下，符合一般心智预期。AppStore路径较短，但'订阅'入口隐藏在用户头像页面中，对于初次使用者容易忽略。虽然操作本身简单，但若找不到入口，整个流程容易中断。平台缺乏显式引导说明，对小白用户来说仍有上手障碍。微信流程不具备自解释性。入口不集中，用户需从多个板块跳转定位任务，尤其'支付设置'选项在页面最底部，需滑动查找。术语较模糊，路径无明显引导，易在初次尝试中失败。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore通过统一账户管理订阅内容的方式，使操作路径短且集中。图标通用、页面整洁，且取消按钮显眼，用户无需学习即可操作。即使从未取消过服务，也能在第一次尝试中顺利完成。支付宝设置分类较清晰，引导语言也相对友好。'自动续费/免密支付'名称在首次接触时可能会让人困惑，但用户可通过页面结构与图标做出合理判断。整体逻辑仍较为线性，对上手有一定帮助。微信设计对于新用户不友好。入口路径与常规操作分离，无法通过常识判断应在何处操作。路径隐蔽、信息堆叠严重，用户需多次试错才能找到入口。无操作反馈、术语专业化加剧了使用障碍。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore流程设计考虑了初次用户的行为习惯，从点击头像到进入订阅管理仅需数步，无需说明也能理解流程。术语标准，视觉引导清晰，任务目标明确。即使没有经验也可以直接完成关闭操作。支付宝虽设置项较多，但页面结构清晰，'自动续费'入口命名合理，图标辅助强，有助于新用户识别任务入口。唯一障碍在于'免密支付'与'自动续费'的结合，可能需要用户二次确认理解。微信路径复杂、内容分散，初次用户不容易找到'支付设置'入口，任务逻辑较为跳跃。术语不直观，页面反馈不明显，用户难以确认操作是否成功，需反复尝试与摸索，增加学习负担。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝对初次使用者较友好。路径逻辑贴近设置流程，信息聚合度高。页面元素组织有序，任务引导线性，虽术语略专业但整体自解释性强。点击过程中系统无明显干扰信息，容错性高。AppStore页面简洁，操作集中在'订阅'页，但首次进入需用户识别头像为功能入口，部分用户可能会感到陌生。若无先验经验，入口发现有一定门槛。但页面整体自解释性依然较好。微信新用户极易卡在路径入口阶段。'服务'入口难以联想到支付设置或订阅功能。导航顺序模糊，任务反馈不明显。整个路径缺少清晰引导和反馈机制，不利于用户第一次完成操作。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore结构高度清晰，入口在账户管理区，任务功能高度聚合。取消订阅操作无需跳出流程，无额外干扰信息。用户操作过程中只需识别'订阅'和'取消订阅'按钮即可，适合首次接触者。支付宝设置较规范，虽然步骤多，但路径稳定。自动续费与支付设置逻辑一致，用户只需按部就班执行。部分术语专业，但仍能理解。页面结构稳定，帮助用户在首次操作中掌握完整路径。微信路径跳跃明显，页面内容堆叠，对无经验用户极不友好。任务执行中缺乏提示与反馈，多个页面之间缺乏引导，用户必须自行探索路径。操作中易中断，无法高效完成首次任务。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore操作非常线性，用户通过头像进入账户后即可进入'订阅'页面。操作方式贴合新用户使用心理，页面提示清晰，界面信息少，无需额外说明即可完成取消操作，适合首次使用。支付宝路径较长但指引明确。用户进入'支付设置'后可找到'自动续费'，页面图文结合、图标引导清晰，术语虽略偏专业，但整体可理解。新用户经过一次尝试后能快速上手。微信设计严重依赖路径记忆。入口跳转多，页面按钮不突出，术语理解困难。缺乏路径线索提示与高亮操作反馈，用户在首次操作中多以反复试探、摸索方式完成，体验压力大。`
    }
  },
  '易学性/文案信息的易理解性': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore在文案表达上非常规范，使用了'订阅'、'取消订阅'等标准术语，语言直白、层级清晰，不涉及平台术语或模糊表达，普通用户几乎不会误解，易于快速识别和决策。整个流程中无出现冗长提示，按钮语义也非常清晰。支付宝使用'自动续费/免密支付'作为主功能命名，虽然结构准确，但'免密支付'这一表达相对偏向平台内部逻辑，部分用户可能不清楚其是否等同于自动扣费。此外'关闭服务'表达相对抽象，不如'取消订阅'直接。微信的术语使用最不清晰。从'支付设置'进入'自动续费'后，用户看到的是'关闭扣费服务'，缺少上下文说明，不够明确。页面中没有明显解释或帮助信息辅助理解，术语也偏向系统化，普通用户理解成本高。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore中每一项文案都精准传达功能意图。'订阅'与'取消订阅'在用户习惯中已经标准化，操作按钮语义清晰、语言通俗。系统没有使用不常见术语或缩写，且文案简洁，避免信息干扰。支付宝的表述准确但偏专业。'自动续费'属于常见词，但与'免密支付'合并使用，容易让用户误以为两者功能相同，产生理解歧义。提示信息存在，但缺少进一步说明功能差异，按钮如'关闭服务'不够聚焦。微信按钮使用'关闭扣费服务'这一较少见表达，不够具体，且缺乏任务说明或引导，页面中没有明确区分扣费类型，术语也未解释其作用，用户需依赖经验猜测含义，容易误操作或疑惑。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝的提示信息较为完整，术语在大多数情况下通俗易懂。'自动续费'、'免密支付'虽不完全等同，但页面结构能帮助用户推理理解，'关闭服务'命名中性，需稍加理解后可完成操作。AppStore语言更加标准，但部分取消流程中并无明确提示说明，例如'订阅到期后是否仍保留'，对部分用户来说不够友好。但整体文案依然非常清晰。微信文案表达模糊。'关闭扣费服务'使用了内部操作术语，没有上下文说明，功能名与任务目标脱节，页面无引导信息，普通用户较难理解每一步所指操作对象。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore文案术语统一、表达直接。'订阅'、'取消订阅'是行业标准语言，不存在理解偏差。提示语少而精准，能迅速引导用户完成操作，不会出现歧义。支付宝在按钮语言上存在抽象性，例如'关闭服务'与用户实际意图'取消自动扣费'间存在认知差异，页面文字解释不足，用户需联想或试探理解。微信中多处按钮表达为'关闭扣费服务'，缺少相关性说明，且整个页面信息量大，但无清晰引导或术语说明。文案表述不具备良好解释力，非熟练用户难以准确识别功能。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore所使用的文案通俗标准。按钮命名直观，例如'取消订阅'高度符合用户语言习惯。系统提示信息精炼有力，用户一眼可理解，无需二次确认。支付宝文案相对混合，术语中性但略显生硬。'自动续费/免密支付'虽覆盖面广，但表达不够聚焦，易引发误解。'关闭服务'语义模糊，不如'取消'更具操作性。微信在表达上不够用户导向。操作项如'支付设置'、'关闭扣费服务'均为平台术语，缺少辅助解释。页面未设置友好提示或帮助说明，普通用户上手理解难度较大。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝的文案表达较为中性，虽然存在专业术语，但整体结构和层级足够支持用户进行理解判断。'关闭服务'虽不够直白，但通过上下文用户仍能判断其作用，页面未出现明显误导性表述。AppStore按钮命名与功能表达完全一致，极具指导性。'取消订阅'是用户心智模型中直接可对应的操作命名，界面内容少且聚焦，理解门槛极低。微信的页面内容虽然文字量不大，但文案缺乏说明性，尤其是'扣费服务'与'自动续费'之间未作区分。页面布局未辅助文案表达，按钮语义也不够清楚，影响整体理解效率。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore整体使用通用语言，信息层级合理，无冗余信息干扰。'取消订阅'是行业内通行表达，用户无需推理便可理解。界面中无多余术语，文字指令直接明了，信息友好度高。支付宝存在语义模糊问题。'免密支付'容易被误解为安全权限设置而非扣款设置，用户在操作时需多加思考。页面引导语句较少，导致术语含义需通过环境反推，影响信息清晰度。微信语言表达与用户心智模型脱节，'关闭扣费服务'难以精确传达操作意图。页面整体缺少辅助文案或友好语气提示，对缺乏背景知识的用户不友好，解释力差。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore按钮命名规范，语言简洁明了。取消操作配套的提示语直截了当，不含歧义。术语如'订阅'、'取消订阅'均为通用表达，界面中没有引发误解的描述，极具清晰性。支付宝在命名上存在优化空间。'自动续费/免密支付'合并展现让用户难以区分两个功能含义，'关闭服务'的表述也偏系统化。页面无解释语句辅助说明，理解上需靠用户自行推断。微信页面语言不够通俗。术语较多且不常见，操作项表述为'关闭扣费服务'在无帮助文字情况下显得晦涩。页面中文案缺乏用户视角，理解难度高。`
    }
  },
  '清晰性/界面元素清晰度': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore界面元素非常清晰，图标简洁，文字排版规范，界面留白充足，信息不堆叠。按钮采用统一格式，点击区域明确，字体颜色与背景对比度高，视觉层级清楚。整体界面设计贴合iOS系统风格，操作区域一目了然。支付宝整体界面元素较为密集，图标种类繁多，不同功能区使用不同样式的图标与字号，虽然分类明确但会产生一定视觉负担。部分按钮色彩不突出，导致用户需要更长时间定位操作目标。微信界面中部分功能文字较小，配色灰白不够醒目，界面密度高而缺乏清晰划分。'关闭扣费服务'按钮位于页面底部，颜色与背景对比不足，整体视觉引导性差，需滚动查找才能发现，清晰度最低。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore界面干净，内容布局紧凑但不过度密集。文字大小适中，图标设计统一且具备明确语义，操作按钮边界分明，容易聚焦注意力，整体界面视觉层级清楚。支付宝界面色彩丰富，功能入口较多，造成界面元素略显拥挤。部分文字字体偏小，尤其在服务列表中可读性略差。图标辨识度较高，但页面缺乏统一节奏，视觉焦点不突出。微信界面元素排列松散，部分功能区无明显区块边界，图标风格一致性弱。字体颜色灰度偏低，按钮与背景未形成有效对比，用户难以快速定位操作项，清晰度有待提升。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝图标清晰，按钮边框与文字对比度较强。虽信息密度大，但各模块视觉分区明确，主次分明，便于识别。色彩与排版方式在功能区之间形成自然分隔，操作区域突出。AppStore界面整体偏白色调，图标语义明显，但界面信息较少时可能导致空旷感，按钮不带边框，仅靠颜色变化，部分用户不容易第一时间识别其为可点击区域。微信界面无明显视觉区块划分，按钮样式不统一，文字提示区域颜色不显眼。整体布局看似简洁，但实际缺乏视觉焦点，页面滚动后用户更难识别关键按钮。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore界面元素规整，按钮采用统一形状与风格，页面配色简洁统一。字体大小适宜，图标排列规范，所有可交互元素均有明显的视觉提示。整个界面结构对视觉感知非常友好。支付宝在视觉上略显拥挤。服务项列表中图标尺寸不一、文字过多，容易引起视觉疲劳。操作按钮如'关闭服务'无统一高亮或强调效果，视觉辨识度略低。微信界面设计简洁但过于依赖页面结构提示，颜色使用保守，未有效突出重点按钮。'关闭扣费服务'无明显提示颜色或样式，整体界面元素在引导性方面较弱，用户难以快速聚焦。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore采用了iOS系统风格标准组件，图标、按钮与文字在视觉上统一、可读性强。界面排版合理，空白区恰当，操作路径中各元素分布均衡，用户一眼可辨。支付宝图标虽然具备语义性，但布局较紧密，尤其在'自动续费'服务列表页面，多项功能堆叠，视觉焦点不明确，可能使用户产生选择困难。微信整体颜色对比度偏低，字体与背景层次不明显。页面缺乏模块分割线，按钮无轮廓样式，视觉引导性弱。尤其底部'关闭'按钮藏于滚动区，明显缺乏重点突出。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝在界面视觉呈现方面较为整齐，图标与文字排版整体和谐。按钮设计虽不够统一，但配色较好，功能区识别容易，虽然信息量大但页面不会产生视觉混乱。AppStore按钮边缘轮廓不明显，页面偏白，若环境光强烈可能影响用户阅读。图标与功能按钮使用文字颜色差异而非边框区分，略降低视觉辨识度。微信的文字过细，配色偏灰，视觉显著性差。多个功能并列排布但未划分视觉区域，用户难以在界面中建立清晰导航线索，按钮样式也无差异强化提示，整体不够清晰。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore布局逻辑性强，操作按钮固定在内容区域下方，不易错过。所有界面文字大小一致，颜色对比高，即便在夜间模式下依旧保持良好可读性。图标风格统一、形状清晰。支付宝页面稍显复杂，各功能区域边界不明确，服务列表中按钮颜色变化不明显。虽然图标具有一定语义性，但在多个按钮并列时，用户仍需花费较多精力识别。微信页面配色低饱和度设计虽减少了视觉冲击，但对关键按钮的突出效果弱。字体大小不统一，缺乏操作反馈样式。按钮设计不具备足够的视觉引导力，清晰度最低。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore中每一个视觉元素都具备统一风格，图标简洁、按钮颜色明确，页面排版逻辑清晰、导航流畅。界面中无多余内容，操作区块划分明显，用户识别效率高。支付宝在内容展示上较为饱和，虽然图标标注清楚，但页面视觉密度高，尤其是支付设置内，信息聚集导致视觉干扰。按钮风格缺乏统一设计规范。微信页面元素层级模糊、文字和图标颜色对比度偏低，缺乏焦点强化。操作按钮与说明性文字混排，界面阅读节奏混乱，容易造成视觉疲劳。`
    }
  },
  '清晰性/界面布局合理性': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的布局最为合理，整个界面信息聚焦于一个订阅管理页面，内容紧凑却不拥挤。所有按钮和信息结构按任务流程依序排列，用户视线几乎无需跳转即可完成整个取消过程。导航区与操作区分布合理，操作步骤几乎不依赖记忆。支付宝的界面层次较多，每个页面模块信息丰富，但缺乏明显引导路线。虽然设置中心结构清晰，但自动续费和免密支付信息堆叠后导致操作元素之间位置较为紧凑，用户需浏览多个区域才能完成操作。微信界面布局松散但结构不清，多个入口之间未形成明确视觉路线。任务执行过程中需频繁滑动查找目标控件，'关闭扣费服务'按钮也被放在页面底部，用户需主动滑动查找，极易忽略目标。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore布局采用高度聚合的订阅管理页面设计，所有信息、按钮、功能入口在一个主页面内完成，视觉流程顺畅自然，信息区与操作区清晰分割，用户视线动线短，任务流连贯。支付宝虽然功能区分得较细，但自动续费页面内有多个服务选项，信息排列略显密集。整体视觉路线略微碎片化，用户需判断多个功能入口，任务完成效率受视觉组织方式影响。微信的页面中控件未统一对齐，尤其在'支付设置'及'自动续费'中，功能按钮之间间隔不稳定。路径跳转时页面布局缺少引导性与聚合性，导致用户需要反复滑动和记忆操作路线。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝页面结构相对更为清晰。设置页按功能分类组织，每个模块之间保持较好分隔。'自动续费'列表采用图标配文字方式，视觉聚焦自然，引导路径较合理。用户可通过视觉区域快速判定任务路径。AppStore页面虽然干净整洁，但所有内容集中在一个页面，缺乏模块分割时用户容易忽略某些功能点。页面排版偏简，按钮过于接近内容边缘，在部分分辨率设备上容易发生点击偏差。微信的界面在功能组织上逻辑松散，控件位置未形成稳定结构。页面中不同功能堆叠无明显层级感。路径跳转后页面结构变化较大，用户在完成任务过程中视觉寻址难度较高。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore布局具有极高的任务聚合性。所有功能集中展示在'订阅'页面，信息排列有序、层级清晰。按钮固定在功能内容后方，操作不易错过。整个取消过程无需页面跳出或多次确认。支付宝设置路径层次感明确，但'自动续费'入口偏深。页面中图标排列紧凑，用户需要在多个视觉区域切换。虽然不至于迷路，但确实增加了用户的思考与视觉负担。微信布局整体缺乏聚焦感。功能路径穿插于多个子页面中，尤其'支付设置'中多个控件之间无逻辑引导，视觉节奏断裂明显，用户完成整个流程需频繁滑动页面并自主判断控件位置。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore界面任务导向明确，布局符合用户的操作顺序。内容聚焦于一个页面内，无需频繁切换或滚动查找。信息排布清晰，取消按钮置于内容区下方，符合用户点击习惯。支付宝页面模块较多，按钮位置常被其他信息挤压，尤其在服务多时页面上下结构拉长，用户需滑动查找目标功能。虽然页面结构清楚，但信息区聚合度一般，存在视觉跳跃感。微信页面逻辑松散，从服务进入钱包再到支付设置，每个页面布局风格不同，缺乏一致性。'自动续费'页面内容段落不明确，控件层级不清晰，用户需依靠经验记忆步骤。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝界面层级感强，页面分区明晰。按钮、图标排列整齐有序，虽然设置模块略多，但用户可按区域推进，路径逻辑明确。'自动续费'列表在结构上支持横向比较，便于识别服务。AppStore虽然布局整洁，但所有内容集中在一页，页面之间缺乏结构分层。用户首次进入后容易因页面简洁而忽略重要按钮。取消按钮与服务信息排布紧凑，易产生操作误点。微信页面之间视觉连续性差。路径跳转后每页风格差异大，布局不连贯。按钮间距不统一，部分页面需滚动多次才能找到功能控件。用户难以从视觉线索判断任务执行顺序。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore布局简洁高效，功能区域分布符合操作逻辑。页面排版稳定、间距合理，用户几乎无需上下滑动即可查看完整订阅内容与操作按钮。按钮位置符合阅读路径，极具引导性。支付宝设置页中的模块间距控制尚可，但由于服务项较多，自动续费信息未置顶，用户需要滚动才能发现目标服务。视觉跳转略多，界面结构仍具一定指导性。微信布局最大问题在于缺乏一致性与线索聚合。各页面设计风格不统一，用户进入不同界面后需重新适应控件排列。重要功能控件散布各处，路径记忆负担重。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的订阅页面结构简单且直观。各模块排列自上而下，视觉流顺畅，用户完成取消任务几乎只需跟随自然阅读顺序点击即可。控件排列一致，任务无跳转感。支付宝布局稍显复杂。页面信息多而集中，各模块之间未设置明显分隔，视觉跳转性强。操作按钮经常被其他内容包围，用户需识别多个元素后才能定位目标。微信整体布局分裂感强，用户需从多个菜单进入各类功能页面，每个页面结构不同，无法形成统一阅读节奏。'关闭服务'按钮位置不稳定，操作节奏易中断。`
    }
  },
  '清晰性/信息、功能入口容易找到': {
    1: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的'订阅'功能入口设在用户头像点击后的账户页，入口固定，标签清晰。即使用户首次操作，只要进入账户界面即可快速找到，路径简短、层级浅、入口语义明确，是三者中最易发现的功能入口。支付宝的'自动续费/免密支付'入口位于'设置'-'支付设置'路径中，虽然位置较深，但入口固定，页面中的功能按钮排布有序，用户若能判断路径逻辑即可准确进入。但合并后的入口命名不够聚焦，需花时间辨识其包含内容。微信入口最不易发现。用户需先从首页点击'服务'，再进入'钱包'，再进入'支付设置'才能看到'自动续费'。其中'支付设置'按钮本身较不显眼，功能入口层级深、路径跳转多，用户很难一次性准确找到，入口突出度最低。`
    },
    2: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore的订阅入口在头像下，虽然入口深一层，但由于页面简洁且功能聚合性强，'订阅'一词本身具有高度识别性。位置固定且显眼，用户只需两步即可定位，入口可识别性强。支付宝入口位置较深，但集中在'支付设置'模块中，对熟悉支付宝的用户而言较为清晰。按钮标注内容较多，图标语义存在歧义，'免密'可能令用户忽略该入口实际与自动扣费相关。微信的自动续费功能路径零散，按钮命名模糊，页面布局层层嵌套，入口不具备显著提示，尤其'关闭扣费服务'入口不直接呈现。用户需自行尝试多种路径，查找成本最高。`
    },
    3: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝功能入口较为明确。用户从'我的'-'设置'-'支付设置'逐步进入'自动续费'，整体结构规范，按钮名称虽略生硬但路径相对标准。入口位置固定，熟悉逻辑后查找较为顺利。AppStore订阅入口嵌入账户设置内，不常使用的用户可能忽略头像中的功能聚合入口。缺少文字指引说明该入口具备管理扣费功能的作用，对非高频用户来说发现成本偏高。微信入口层层嵌套，从'服务'-'钱包'-'支付设置'-'自动续费'，结构分散且入口不显眼。尤其在'支付设置'页中，按钮样式无高亮，文字标签模糊，用户难以快速判断其关联功能。`
    },
    4: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore功能入口集中，订阅管理为主页面一级功能，无需二次跳转查找，用户点击头像即可快速定位订阅服务。'取消订阅'按钮直接位于订阅卡片下，任务入口显著。支付宝入口位置略深但逻辑清晰，进入设置后功能按钮在页面中央，使用频率高的用户可迅速识别。但初次用户需理解'支付设置'中包含的功能范围，命名仍有提升空间。微信路径分散，自动续费入口位于多个中间页面之后。缺少导航提示或视觉聚焦，用户需多次点击并记住功能位置，任务入口位置靠下，易被遗漏，整体查找体验较差。`
    },
    5: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore入口聚焦，路径短，仅通过点击头像即可进入。'订阅'功能在账户信息页面醒目位置，入口图标一致性高、位置固定，查找路径非常清晰，几乎无需引导。支付宝功能入口集中在'支付设置'，入口逻辑较强，但路径至少三级跳转。页面中入口未特别突出，若用户不清楚'免密支付'即为自动扣费则需多次尝试，入口辨识度中等。微信入口散乱，按钮分布在不同子模块中。'服务'模块内无说明指向'钱包'，用户需靠经验进入。'支付设置'在'钱包'中位置靠下，功能入口缺乏突出设计，用户往往需要多次滑动查找。`
    },
    6: {
      ranking: "支付宝 > AppStore > 微信",
      content: `支付宝在功能入口设置上逻辑合理。'自动续费/免密支付'入口虽然合并，但命名包含两个关键操作概念，结构清晰。图标标识明确，入口位置固定，首次操作仍较易识别。AppStore入口在账户信息页中显得较为隐藏。若无相关经验，用户可能忽略'订阅'项的功能范围。虽然页面简洁，但缺少辅助提示或标签引导新用户识别功能路径。微信功能入口最深、路径最杂。跳转过程无语义提示、入口图标不具引导性。操作按钮命名不规范，如'关闭扣费服务'与'自动续费'关系不明，入口查找过程易导致误判。`
    },
    7: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore功能入口虽在头像点击后一级页面，但由于内容集中、路径短，'订阅'项本身具备高度辨识度。操作按钮也集中在该界面，功能指向明确，入口聚焦性强。支付宝设置路径直观，虽然入口层级稍深，但排布在'支付设置'区域显著位置，入口名称含'自动续费'关键词，有助于用户快速识别。微信入口不集中且信息提示不足。多个功能散落于不同板块，'支付设置'入口本身无高亮或图标提示。用户往往需反复探索，难以第一时间完成入口定位。`
    },
    8: {
      ranking: "AppStore > 支付宝 > 微信",
      content: `AppStore入口逻辑集中，通过点击头像访问订阅功能是多数用户熟悉的操作方式。入口文字清晰、固定在顶部导航页，识别性强，整体任务入口查找极为顺利。支付宝入口虽在设置路径中，但归类合理，图标清晰，入口名称中含有'自动续费'，查找基本依赖操作逻辑。页面内入口按钮未特别突出，需花费1-2秒辨识。微信任务入口设计过于分散，从首页至功能页路径冗长。各页面跳转无明显视觉提示或路径指示，入口名称与任务关联度低，入口位置无强调，极易错过目标。`
    }
  }
}

// 评估列表数据
const assessmentList = ref([])

// 记录是否已经执行过高亮动画
const hasHighlighted = ref(false)

// 初始化评估列表
onMounted(() => {
  // 重置高亮状态
  hasHighlighted.value = false
  
  // 如果已经有保存的评估数据，直接使用
  if (props.savedAssessmentData) {
    assessmentList.value = props.savedAssessmentData.assessmentList;
    loadedCards.value = props.savedAssessmentData.loadedCards;
    totalCards.value = props.savedAssessmentData.totalCards;
    progress.value = 100; // 直接显示100%
    return; // 不再执行后续初始化和加载逻辑
  }

  // 通知父组件禁用按钮
  emit('loading-status-change', true)
  
  // 根据selectedIndicators生成评估标题
  const assessmentItems = props.selectedIndicators.map(indicator => {
    // 处理指标标题，显示为"一级/二级"的格式
    let title = '';
    
    if (typeof indicator === 'object') {
      // 从指标中提取一级和二级指标
      if (indicator.value && typeof indicator.value === 'string') {
        // 处理类似StepTwo中的格式：从value中提取一级指标代码
        const firstLevelCode = indicator.value.split('_')[0];
        // 映射代码到实际一级指标文本
        const firstLevelText = getFirstLevelText(firstLevelCode);
        title = `${firstLevelText}/${indicator.label}`;
      }
      // 如果有parent属性和name属性
      else if (indicator.parent && indicator.name) {
        title = `${indicator.parent}/${indicator.name}`;
      } 
      // 如果有firstLevel和secondLevel属性
      else if (indicator.firstLevel && indicator.secondLevel) {
        title = `${indicator.firstLevel}/${indicator.secondLevel}`;
      }
      // 如果有primaryIndicator和name属性
      else if (indicator.primaryIndicator && indicator.name) {
        title = `${indicator.primaryIndicator}/${indicator.name}`;
      }
      // 如果只有name属性
      else if (indicator.name) {
        title = indicator.name;
      }
      // 如果只有label属性
      else if (indicator.label) {
        title = indicator.label;
      }
      // 其他情况
      else {
        title = '未命名';
      }
    } else {
      // 如果是字符串，直接使用
      title = indicator;
    }
    
    return {
      title: title,
      isExpanded: true,
      cards: []
    };
  })

  // 计算卡片总数并创建初始化的加载中卡片
  let allCards = [];
  let cardCount = 0;
  
  // 为每个评估项添加角色卡片
  assessmentItems.forEach(item => {
    let cardIndex = 1; // 角色卡片序号
    let itemCards = [];
    
    // 遍历角色列表
    props.roleList.forEach((role, index) => {
      // 根据role的count决定添加多少个卡片
      if (role.count > 0) {
        for (let i = 0; i < role.count; i++) {
          // 从内容表中获取对应的内容
          const contentData = assessmentContentTable[item.title]?.[cardIndex];
          
          // 如果在内容表中没有找到对应的内容，则使用默认值并添加提示
          const scoreValue = contentData ? contentData.score : 3;
          let contentValue = '';
          let rankingValue = ''; // 默认排名
          
          if (contentData) {
            contentValue = contentData.content;
            // 确保从assessmentContentTable中获取ranking属性
            rankingValue = contentData.ranking || rankingValue;
          } else {
            contentValue = `[此指标${item.title}的第${cardIndex}号评估内容未配置]\n\n系统默认显示内容：该指标评估正在进行中，暂无评估结果。`;
            console.warn(`未找到指标"${item.title}"的第${cardIndex}号评估内容，将使用默认内容`);
          }
          
          // 生成角色标签
          const tags = [];
          if (role.tags && Array.isArray(role.tags)) {
            role.tags.forEach(tag => {
              if (tag.text) tags.push(tag.text);
            });
          } else {
            tags.push('男', '25-34', '学习办公', '领域专业度高', '产品了解度高', '目标清晰度高');
          }
          
          // 添加卡片（初始状态为加载中）
          const card = {
            userName: `${role.name || `用户${index + 1}`}`,
            score: scoreValue,
            scoreLevel: getScoreLevel(scoreValue),
            content: contentValue,
            ranking: rankingValue, // 设置排名属性
            tags: tags,
            loading: true, // 初始为加载中状态
            cardId: cardCount // 添加一个唯一标识
          };
          
          itemCards.push(card);
          allCards.push({ sectionIndex: assessmentItems.indexOf(item), cardIndex: itemCards.length - 1, card });
          cardCount++;
          cardIndex++; // 增加序号
        }
      }
    })
    
    // 如果没有添加任何卡片，则添加一个加载中的卡片
    if (itemCards.length === 0) {
      const card = {
        userName: '用户',
        loading: true,
        cardId: cardCount
      };
      itemCards.push(card);
      allCards.push({ sectionIndex: assessmentItems.indexOf(item), cardIndex: 0, card });
      cardCount++;
    }
    
    item.cards = itemCards;
  })

  assessmentList.value = assessmentItems;
  totalCards.value = cardCount;
  
  // 更新剩余时间
  updateRemainingTime();
  
  // 开始加载卡片
  startLoadingCards(allCards);
})

// 更新剩余时间
function updateRemainingTime() {
  const remaining = totalCards.value - loadedCards.value;
  const seconds = remaining;
  remainingTime.value = `${seconds}秒`;
}

// 开始加载卡片
function startLoadingCards(allCards) {
  // 移除随机打乱逻辑，改为按顺序加载
  const orderedCards = allCards;
  
  // 每0.3秒加载一个卡片
  const interval = setInterval(() => {
    if (loadedCards.value >= totalCards.value) {
      clearInterval(interval);
      remainingTime.value = '';
      // 通知父组件启用按钮
      emit('loading-status-change', false);
      
      // 通知父组件评估已完成，并传递评估结果
      emit('assessment-completed', {
        assessmentList: assessmentList.value,
        loadedCards: loadedCards.value,
        totalCards: totalCards.value
      });
      
      return;
    }
    
    const nextCard = orderedCards[loadedCards.value];
    if (nextCard) {
      // 更新卡片状态为已加载
      assessmentList.value[nextCard.sectionIndex].cards[nextCard.cardIndex].loading = false;
      loadedCards.value++;
      
      // 更新剩余时间
      updateRemainingTime();
      
      // 更新进度
      progress.value = Math.floor((loadedCards.value / totalCards.value) * 100);
    }
  }, 300);
}

// 获取评分等级
function getScoreLevel(score) {
  const levels = {
    1: '非常不满意',
    2: '不满意',
    3: '一般',
    4: '满意',
    5: '非常满意'
  }
  return levels[score] || '未知'
}

// 获取一级指标文本
function getFirstLevelText(code) {
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

// 切换折叠状态
const toggleSection = (index) => {
  assessmentList.value[index].isExpanded = !assessmentList.value[index].isExpanded
}

// 监听滚动位置变化，只在从步骤4跳转且未执行过高亮时执行
watch(() => props.scrollToPosition, (newVal) => {
  if (newVal && props.isFromStepFour && !hasHighlighted.value) {
    nextTick(() => {
      scrollToCard(newVal.sectionIndex, newVal.cardIndex)
      // 设置已执行过高亮
      hasHighlighted.value = true
      // 通知父组件清除滚动位置
      emit('clear-scroll-position')
    })
  }
}, { immediate: true })

// 滚动到指定卡片
function scrollToCard(sectionIndex, cardIndex) {
  // 确保评估列表已加载
  if (!assessmentList.value || assessmentList.value.length === 0) return
  
  // 确保指定的section存在
  if (!assessmentList.value[sectionIndex]) return
  
  // 确保该section已展开
  if (!assessmentList.value[sectionIndex].isExpanded) {
    toggleSection(sectionIndex)
  }
  
  // 获取卡片DOM元素
  const cardSelector = `.assessment-section:nth-child(${sectionIndex + 1}) .assessment-card:nth-child(${cardIndex + 1})`
  nextTick(() => {
    const cardElement = document.querySelector(cardSelector)
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // 添加高亮效果
      cardElement.classList.add('highlighted')
      
      // 3秒后移除高亮
      setTimeout(() => {
        cardElement.classList.remove('highlighted')
      }, 3000)
    }
  })
}
</script>

<style scoped lang="scss">
/* 进度展示模块 */
.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  padding: 0 24px;
  padding-bottom: 28px;
  background-color: #F8FAFC;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 100;
  
  .progress-title {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #2B2B2B;
    white-space: nowrap;
    min-width: fit-content;
  }

  .progress-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;

    .progress-track {
      width: 100%;
      height: 16px;
      background: #E6E7FF;
      border-radius: 35px;
      overflow: hidden;
      position: relative;

      .progress-fill {
        height: 100%;
        background: #605CE5;
        border-radius: 35px;
        transition: width 0.3s ease;
      }

      .progress-percentage {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #FFFFFF;
        white-space: nowrap;
        z-index: 1;
      }
    }
  }

  .remaining-time {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #72728B;
    white-space: nowrap;
    min-width: fit-content;
  }
}

/* 评估卡片区域 */
.assessment-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding-top: 50px;

  .assessment-section {
    width: 100%;
  }

  .assessment-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 9px;
    width: 100%;
    height: 22px;
    cursor: pointer;
    margin-bottom: 12px;

    .assessment-title {
      font-family: 'Nunito Sans';
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      color: #72728B;
    }

    .icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;

      .toggle-icon {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease;

        &.collapsed {
          transform: rotate(180deg);
        }
      }
    }
  }

  .assessment-cards {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .assessment-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 14px 32px;
      gap: 7px;
      flex: 0 0 calc(50% - 16px);
      min-width: 300px;
      max-width: 584px;
      background: #FFFFFF;
      border: 1px solid #F2F3F5;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      margin-bottom: 16px;

      &.loading {
        .user-name {
          color: #F2F3F5;
        }

        .card-content {
          .loading-line {
            width: 100%;
            height: 20px;
            background: #D9D9D9;
            margin-bottom: 7px;
          }
        }

        .tag {
          background: #F2F3F5;
          color: #F2F3F5;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 2s infinite;
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .user-name {
          font-family: 'Nunito Sans';
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          color: #605CE5;

          &.user2 {
            width: 42px;
            height: 24px;
            color: #F2F3F5;
            text-align: justify;
            flex: none;
            order: 0;
            flex-grow: 0;
          }
        }

        .score-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .score-label {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            color: #000000;
          }

          .score-value {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }

          .score-level {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8px;
            border-radius: 100px;
            height: 22px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 8px;
            line-height: 22px;
          }

          .platform-path {
            width: auto;
            height: 24px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #474667;
          }
        }
      }

      .card-content {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #2B2B2B;
        text-align: justify;
        
        pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }
      }

      .card-tags {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 6px 0;
        gap: 7px;
        flex-wrap: wrap;

        .tag {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 5px;
          height: 22px;
          background: #E6E7FF;
          border-radius: 4px;
          font-family: 'Nunito Sans';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: #605CE5;

          &.loading {
            background: #F2F3F5;
            color: #F2F3F5;
          }
        }
      }
    }
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* 卡片高亮样式 */
.assessment-card.highlighted {
  box-shadow: 0 0 0 2px #605CE5, 0 0 15px rgba(96, 92, 229, 0.5);
  transform: scale(1.02);
  transition: all 0.3s ease;
}
</style> 