export const initData = [
  {
    id: "p1",
    title: "产品易用性评估指标",
    description:
      "适用于工具型或任务导向产品的可用性测评，重点关注任务效率、学习成本与信息清晰度。",
    children: [
      {
        id: 1,
        primaryIndicator: "易操作性",
        pid: "p1",
        secondaryIndicators: [
          {
            id: 101,
            name: "操作的复杂性",
            interpretation:
              "系统通过控件简化、输入方式优化等手段，降低完成指定任务所需的交互复杂度。",
          },
          {
            id: 102,
            name: "完成任务的效率",
            interpretation:
              "系统应支持用户高效完成任务，避免无效步骤与不必要操作，提升关键路径效率。",
          },
          {
            id: 103,
            name: "是否符合直觉与习惯用法",
            interpretation:
              "系统操作方式应符合用户的心智能模型与行业通用习惯，避免使用反直觉设计或生僻交互方式。",
          },
        ],
      },
      {
        id: 2,
        primaryIndicator: "易学性",
        pid: "p1",
        secondaryIndicators: [
          {
            id: 104,
            name: "上手难度",
            interpretation:
              "系统应避免复杂引导或隐藏式功能，使用户在无经验情况下也能完成基础操作。",
          },
          {
            id: 105,
            name: "文案信息的易解性",
            interpretation:
              "系统中的提示、帮助信息与操作引导应清晰准确，避免歧义，提升内容可理解度。",
          },
        ],
      },
      {
        id: 3,
        primaryIndicator: "清晰性",
        pid: "p1",
        secondaryIndicators: [
          {
            id: 106,
            name: "界面元素清晰度",
            interpretation:
              "系统中的图形、按钮、文字等界面元素应具备良好区分度，便于用户识别与操作。",
          },
          {
            id: 107,
            name: "界面布局合理性",
            interpretation:
              "系统应合理组织信息结构与控件位置，减少用户记忆负担与视觉寻查时间。",
          },
          {
            id: 108,
            name: "信息/功能入口容易找到",
            interpretation:
              "系统应提供显著的功能入口与清晰的信息层级，引导用户快速发现所需内容。",
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "Garrett用户体验要素模型",
    description:
      "适用于从战略到界面全流程设计的系统性评估，侧重于分层级拆解用户体验的构建逻辑，覆盖从产品目标到视觉表现的完整路径。",
    children: [
      {
        id: 4,
        primaryIndicator: "目标契合度",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 109,
            name: "/",
            interpretation:
              "系统在提供用户需求与业务战略时，能够确保界面行为与整体目标一致，避免偏离核心方向。",
          },
        ],
      },
      {
        id: 5,
        primaryIndicator: "功能覆盖度",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 110,
            name: "/",
            interpretation:
              "系统提供的功能和内容应完整覆盖用户在当前场景下的预期需求，避免遗漏或冗余。",
          },
        ],
      },
      {
        id: 6,
        primaryIndicator: "信息架构清晰度",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 111,
            name: "/",
            interpretation:
              "系统在呈现多层内容或功能入口时，能够以清晰的结构组织信息，帮助用户迅速识别所需路径与操作区域。",
          },
        ],
      },
      {
        id: 7,
        primaryIndicator: "操作流程合理性",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 112,
            name: "/",
            interpretation:
              "在支持用户完成多步骤任务的过程中，系统能够提供直观的流程引导与操作反馈，确保任务推进顺畅、认知成本可控。",
          },
        ],
      },
      {
        id: 8,
        primaryIndicator: "界面反馈明确性",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 113,
            name: "/",
            interpretation:
              "系统在接收或处理用户操作后，应及时明确地反馈结果状态，帮助用户确认操作有效与否。",
          },
        ],
      },
      {
        id: 9,
        primaryIndicator: "视觉一致性",
        pid: "p2",
        secondaryIndicators: [
          {
            id: 114,
            name: "/",
            interpretation:
              "在界面多模块设计中，系统应维持统一的视觉风格与界面元素，避免因风格割裂而影响用户判断与信任。",
          },
        ],
      },
    ],
  },
  {
    id: "p3",
    title: "Morville用户体验蜂巢模型",
    description:
      "适用于衡量整体产品体验的多维度满意度，强调用户对产品是否有用、可用、可信、合意的综合感受。",
    children: [
      {
        id: 10,
        primaryIndicator: "用户价值感",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 115,
            name: "/",
            interpretation:
              "产品在满足使用需求的同时，应通过内容质量、效率提升或目标支持，为用户创造明确的功能或情感价值。",
          },
        ],
      },
      {
        id: 11,
        primaryIndicator: "操作效率",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 116,
            name: "/",
            interpretation:
              "系统应减少无效步骤与反复行为，支持用户以更少的交互完成预期任务，提高时间利用率。",
          },
        ],
      },
      {
        id: 12,
        primaryIndicator: "信息可找性",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 117,
            name: "/",
            interpretation:
              "用户在查找目标内容或功能入口时，系统能够通过合理布局、标签命名与视觉强化手段，提升目标的可发现性。",
          },
        ],
      },
      {
        id: 13,
        primaryIndicator: "设计可信度",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 118,
            name: "/",
            interpretation:
              "系统在传递关键信息或执行用户指令时，应保持行为一致，状态明确与数据透明，增强用户对其稳定性与可信度的感知。",
          },
        ],
      },
      {
        id: 14,
        primaryIndicator: "使用门槛友好性",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 119,
            name: "/",
            interpretation:
              "对于不同经验或能力层级的用户，系统应提供低门槛的操作方式与辅助引导，以降低使用障碍。",
          },
        ],
      },
      {
        id: 15,
        primaryIndicator: "情感吸引力",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 120,
            name: "/",
            interpretation:
              "系统应通过语气、风格、互动节奏等手段激发用户情绪认同，使其在使用中获得积极体验。",
          },
        ],
      },
      {
        id: 16,
        primaryIndicator: "整体体验满意度",
        pid: "p3",
        secondaryIndicators: [
          {
            id: 121,
            name: "/",
            interpretation:
              "用户在完成操作后，能从系统中获得正向的心理回馈，对整个使用过程产生正面认知。",
          },
        ],
      },
    ],
  },
  {
    id: "p4",
    title: "Lachner定量用户体验评价模型",
    description:
      "适用于结构化量化评分与数据对比分析，覆盖可用性、感受性与外观性三大类九项指标，便于形成可视化评分结果。",
    children: [
      {
        id: 17,
        primaryIndicator: "系统稳定性",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 122,
            name: "/",
            interpretation:
              "系统在多次交互或跨状态操作过程中，应保持功能一致性和响应稳定性，避免逻辑中断或状态失真。",
          },
        ],
      },
      {
        id: 18,
        primaryIndicator: "任务成功率",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 123,
            name: "/",
            interpretation:
              "在执行关键任务过程中，系统应确保路径合理、结果可预期，减少任务失败或用户误判的可能。",
          },
        ],
      },
      {
        id: 19,
        primaryIndicator: "用户掌控感",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 124,
            name: "/",
            interpretation:
              "在多次使用后，系统应支持用户通过熟悉控件与路径实现快速操作，形成良好的操作习惯与熟练度。",
          },
        ],
      },
      {
        id: 20,
        primaryIndicator: "视觉风格统一性",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 125,
            name: "/",
            interpretation:
              "系统在视觉细节、界面层次与排版布局上保持设计一致性，营造专业可信的整体观感。",
          },
        ],
      },
      {
        id: 21,
        primaryIndicator: "品牌识别度",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 126,
            name: "/",
            interpretation:
              "系统在视觉呈现上应体现品牌调性，通过色彩、排版与图形规范一致传达企业形象，增强识别度。",
          },
        ],
      },
      {
        id: 22,
        primaryIndicator: "信息组织合理性",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 127,
            name: "/",
            interpretation:
              "系统内容组织应基于用户心智模型，逻辑清晰、分类合理，确保用户能以最短路径抵达目标信息。",
          },
        ],
      },
      {
        id: 23,
        primaryIndicator: "用户补偿能力",
        pid: "p4",
        secondaryIndicators: [
          {
            id: 128,
            name: "/",
            interpretation:
              "系统在应对操作失败或生成结果不佳时，能够提供合理机制或备选方案，引导用户通过二次操作以输出更好的结果。",
          },
        ],
      },
    ],
  },
  {
    id: "p5",
    title: "Nielsen 可用性原则",
    description:
      "适用于启发式界面评审或问题发现环节，用于快速定位常见的交互与可用性问题。",
    children: [
      {
        id: 24,
        primaryIndicator: "系统状态可见性",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 129,
            name: "/",
            interpretation:
              "系统应在合理时间内通过界面元素、提示或加载动画等方式告知用户当前状态或处理进度。",
          },
        ],
      },
      {
        id: 25,
        primaryIndicator: "语言与认知契合度",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 130,
            name: "/",
            interpretation:
              "系统使用的术语、图标和交互逻辑应贴近日常用语和经验，避免技术性或系统内部语言。",
          },
        ],
      },
      {
        id: 26,
        primaryIndicator: "可撤销性与操作自由度",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 131,
            name: "/",
            interpretation:
              "系统应支持返回、撤销、退出等路径，避免用户陷入无法恢复的状态。",
          },
        ],
      },
      {
        id: 27,
        primaryIndicator: "界面一致性",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 132,
            name: "/",
            interpretation:
              "系统中相似功能应保持操作一致，术语使用统一，符合用户习惯与平台规范。",
          },
        ],
      },
      {
        id: 28,
        primaryIndicator: "操作防护助力",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 133,
            name: "/",
            interpretation:
              "通过限制输入、提供建议或提前确认等方式减少误操作的发生，而非仅依赖错误提示。",
          },
        ],
      },
      {
        id: 29,
        primaryIndicator: "信息可识别性",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 134,
            name: "/",
            interpretation:
              "界面应通过标签、图标或默认内容提示等手段，减少用户必须记住的信息量。",
          },
        ],
      },
      {
        id: 30,
        primaryIndicator: "使用灵活与效率",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 135,
            name: "/",
            interpretation:
              "系统应同时支持初学者与专家用户，例如通过快捷方式、自定义功能提升使用效率。",
          },
        ],
      },
      {
        id: 31,
        primaryIndicator: "视觉简洁性",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 136,
            name: "/",
            interpretation:
              "界面应只展示与任务相关的信息，避免视觉杂乱和信息干扰。",
          },
        ],
      },
      {
        id: 32,
        primaryIndicator: "错误提示与恢复引导",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 137,
            name: "/",
            interpretation:
              "系统应清楚描述错误发生原因，并提供具体解决建议帮助用户恢复操作。",
          },
        ],
      },
      {
        id: 33,
        primaryIndicator: "辅助信息支持度",
        pid: "p5",
        secondaryIndicators: [
          {
            id: 138,
            name: "/",
            interpretation:
              "虽然理想系统应无需帮助，但仍应提供易于查找、聚焦于用户任务的帮助内容。",
          },
        ],
      },
    ],
  },
];

//   const initialData = [
//     {
//       id: 1,
//       primaryIndicator: "易操作性",
//       pid: "p1",
//       secondaryIndicators: [
//         {
//           id: 101,
//           name: "操作的复杂性",
//           interpretation:
//             "系统通过控件简化、输入方式优化等手段，降低完成指定任务所需的交互复杂度。",
//         },
//         {
//           id: 102,
//           name: "完成任务的效率",
//           interpretation:
//             "系统应支持用户高效完成任务，避免无效步骤与不必要操作，提升关键路径效率。",
//         },
//         {
//           id: 103,
//           name: "是否符合直觉与习惯用法",
//           interpretation:
//             "系统操作方式应符合用户的心智能模型与行业通用习惯，避免使用反直觉设计或生僻交互方式。",
//         },
//       ],
//     },
//     {
//       id: 2,
//       primaryIndicator: "易学性",
//       pid: "p1",
//       secondaryIndicators: [
//         {
//           id: 104,
//           name: "上手难度",
//           interpretation:
//             "系统应避免复杂引导或隐藏式功能，使用户在无经验情况下也能完成基础操作。",
//         },
//         {
//           id: 105,
//           name: "文案信息的易解性",
//           interpretation:
//             "系统中的提示、帮助信息与操作引导应清晰准确，避免歧义，提升内容可理解度。",
//         },
//       ],
//     },
//     {
//       id: 3,
//       primaryIndicator: "清晰性",
//       pid: "p1",
//       secondaryIndicators: [
//         {
//           id: 106,
//           name: "界面元素清晰度",
//           interpretation:
//             "系统中的图形、按钮、文字等界面元素应具备良好区分度，便于用户识别与操作。",
//         },
//         {
//           id: 107,
//           name: "界面布局合理性",
//           interpretation:
//             "系统应合理组织信息结构与控件位置，减少用户记忆负担与视觉寻查时间。",
//         },
//         {
//           id: 108,
//           name: "信息/功能入口容易找到",
//           interpretation:
//             "系统应提供显著的功能入口与清晰的信息层级，引导用户快速发现所需内容。",
//         },
//       ],
//     },
//     {
//       id: 4,
//       primaryIndicator: "目标契合度",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 109,
//           name: "/",
//           interpretation:
//             "系统在提供用户需求与业务战略时，能够确保界面行为与整体目标一致，避免偏离核心方向。",
//         },
//       ],
//     },
//     {
//       id: 5,
//       primaryIndicator: "功能覆盖度",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 110,
//           name: "/",
//           interpretation:
//             "系统提供的功能和内容应完整覆盖用户在当前场景下的预期需求，避免遗漏或冗余。",
//         },
//       ],
//     },
//     {
//       id: 6,
//       primaryIndicator: "信息架构清晰度",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 111,
//           name: "/",
//           interpretation:
//             "系统在呈现多层内容或功能入口时，能够以清晰的结构组织信息，帮助用户迅速识别所需路径与操作区域。",
//         },
//       ],
//     },
//     {
//       id: 7,
//       primaryIndicator: "操作流程合理性",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 112,
//           name: "/",
//           interpretation:
//             "在支持用户完成多步骤任务的过程中，系统能够提供直观的流程引导与操作反馈，确保任务推进顺畅、认知成本可控。",
//         },
//       ],
//     },
//     {
//       id: 8,
//       primaryIndicator: "界面反馈明确性",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 113,
//           name: "/",
//           interpretation:
//             "系统在接收或处理用户操作后，应及时明确地反馈结果状态，帮助用户确认操作有效与否。",
//         },
//       ],
//     },
//     {
//       id: 9,
//       primaryIndicator: "视觉一致性",
//       pid: "p2",
//       secondaryIndicators: [
//         {
//           id: 114,
//           name: "/",
//           interpretation:
//             "在界面多模块设计中，系统应维持统一的视觉风格与界面元素，避免因风格割裂而影响用户判断与信任。",
//         },
//       ],
//     },
//     {
//       id: 10,
//       primaryIndicator: "用户价值感",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 115,
//           name: "/",
//           interpretation:
//             "产品在满足使用需求的同时，应通过内容质量、效率提升或目标支持，为用户创造明确的功能或情感价值。",
//         },
//       ],
//     },
//     {
//       id: 11,
//       primaryIndicator: "操作效率",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 116,
//           name: "/",
//           interpretation:
//             "系统应减少无效步骤与反复行为，支持用户以更少的交互完成预期任务，提高时间利用率。",
//         },
//       ],
//     },
//     {
//       id: 12,
//       primaryIndicator: "信息可找性",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 117,
//           name: "/",
//           interpretation:
//             "用户在查找目标内容或功能入口时，系统能够通过合理布局、标签命名与视觉强化手段，提升目标的可发现性。",
//         },
//       ],
//     },
//     {
//       id: 13,
//       primaryIndicator: "设计可信度",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 118,
//           name: "/",
//           interpretation:
//             "系统在传递关键信息或执行用户指令时，应保持行为一致，状态明确与数据透明，增强用户对其稳定性与可信度的感知。",
//         },
//       ],
//     },
//     {
//       id: 14,
//       primaryIndicator: "使用门槛友好性",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 119,
//           name: "/",
//           interpretation:
//             "对于不同经验或能力层级的用户，系统应提供低门槛的操作方式与辅助引导，以降低使用障碍。",
//         },
//       ],
//     },
//     {
//       id: 15,
//       primaryIndicator: "情感吸引力",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 120,
//           name: "/",
//           interpretation:
//             "系统应通过语气、风格、互动节奏等手段激发用户情绪认同，使其在使用中获得积极体验。",
//         },
//       ],
//     },
//     {
//       id: 16,
//       primaryIndicator: "整体体验满意度",
//       pid: "p3",
//       secondaryIndicators: [
//         {
//           id: 121,
//           name: "/",
//           interpretation:
//             "用户在完成操作后，能从系统中获得正向的心理回馈，对整个使用过程产生正面认知。",
//         },
//       ],
//     },
//     {
//       id: 17,
//       primaryIndicator: "系统稳定性",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 122,
//           name: "/",
//           interpretation:
//             "系统在多次交互或跨状态操作过程中，应保持功能一致性和响应稳定性，避免逻辑中断或状态失真。",
//         },
//       ],
//     },
//     {
//       id: 18,
//       primaryIndicator: "任务成功率",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 123,
//           name: "/",
//           interpretation:
//             "在执行关键任务过程中，系统应确保路径合理、结果可预期，减少任务失败或用户误判的可能。",
//         },
//       ],
//     },
//     {
//       id: 19,
//       primaryIndicator: "用户掌控感",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 124,
//           name: "/",
//           interpretation:
//             "在多次使用后，系统应支持用户通过熟悉控件与路径实现快速操作，形成良好的操作习惯与熟练度。",
//         },
//       ],
//     },
//     {
//       id: 20,
//       primaryIndicator: "视觉风格统一性",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 125,
//           name: "/",
//           interpretation:
//             "系统在视觉细节、界面层次与排版布局上保持设计一致性，营造专业可信的整体观感。",
//         },
//       ],
//     },
//     {
//       id: 21,
//       primaryIndicator: "品牌识别度",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 126,
//           name: "/",
//           interpretation:
//             "系统在视觉呈现上应体现品牌调性，通过色彩、排版与图形规范一致传达企业形象，增强识别度。",
//         },
//       ],
//     },
//     {
//       id: 22,
//       primaryIndicator: "信息组织合理性",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 127,
//           name: "/",
//           interpretation:
//             "系统内容组织应基于用户心智模型，逻辑清晰、分类合理，确保用户能以最短路径抵达目标信息。",
//         },
//       ],
//     },
//     {
//       id: 23,
//       primaryIndicator: "用户补偿能力",
//       pid: "p4",
//       secondaryIndicators: [
//         {
//           id: 128,
//           name: "/",
//           interpretation:
//             "系统在应对操作失败或生成结果不佳时，能够提供合理机制或备选方案，引导用户通过二次操作以输出更好的结果。",
//         },
//       ],
//     },
//     {
//       id: 24,
//       primaryIndicator: "系统状态可见性",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 129,
//           name: "/",
//           interpretation:
//             "系统应在合理时间内通过界面元素、提示或加载动画等方式告知用户当前状态或处理进度。",
//         },
//       ],
//     },
//     {
//       id: 25,
//       primaryIndicator: "语言与认知契合度",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 130,
//           name: "/",
//           interpretation:
//             "系统使用的术语、图标和交互逻辑应贴近日常用语和经验，避免技术性或系统内部语言。",
//         },
//       ],
//     },
//     {
//       id: 26,
//       primaryIndicator: "可撤销性与操作自由度",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 131,
//           name: "/",
//           interpretation:
//             "系统应支持返回、撤销、退出等路径，避免用户陷入无法恢复的状态。",
//         },
//       ],
//     },
//     {
//       id: 27,
//       primaryIndicator: "界面一致性",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 132,
//           name: "/",
//           interpretation:
//             "系统中相似功能应保持操作一致，术语使用统一，符合用户习惯与平台规范。",
//         },
//       ],
//     },
//     {
//       id: 28,
//       primaryIndicator: "操作防护助力",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 133,
//           name: "/",
//           interpretation:
//             "通过限制输入、提供建议或提前确认等方式减少误操作的发生，而非仅依赖错误提示。",
//         },
//       ],
//     },
//     {
//       id: 29,
//       primaryIndicator: "信息可识别性",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 134,
//           name: "/",
//           interpretation:
//             "界面应通过标签、图标或默认内容提示等手段，减少用户必须记住的信息量。",
//         },
//       ],
//     },
//     {
//       id: 30,
//       primaryIndicator: "使用灵活与效率",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 135,
//           name: "/",
//           interpretation:
//             "系统应同时支持初学者与专家用户，例如通过快捷方式、自定义功能提升使用效率。",
//         },
//       ],
//     },
//     {
//       id: 31,
//       primaryIndicator: "视觉简洁性",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 136,
//           name: "/",
//           interpretation:
//             "界面应只展示与任务相关的信息，避免视觉杂乱和信息干扰。",
//         },
//       ],
//     },
//     {
//       id: 32,
//       primaryIndicator: "错误提示与恢复引导",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 137,
//           name: "/",
//           interpretation:
//             "系统应清楚描述错误发生原因，并提供具体解决建议帮助用户恢复操作。",
//         },
//       ],
//     },
//     {
//       id: 33,
//       primaryIndicator: "辅助信息支持度",
//       pid: "p5",
//       secondaryIndicators: [
//         {
//           id: 138,
//           name: "/",
//           interpretation:
//             "虽然理想系统应无需帮助，但仍应提供易于查找、聚焦于用户任务的帮助内容。",
//         },
//       ],
//     },
//   ];
