<template>
  <div ref="chartRef" class="radar-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, LegendComponent, RadarChart, CanvasRenderer])

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  indicators: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const option = {
    color: ['#605CE5'],
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let indicator = option.radar[0].indicator
        let values = params.value
        let result = ''
        for (let i = 0; i < indicator.length; i++) {
          result += `${indicator[i].text}: ${values[i].toFixed(1)}<br/>`
        }
        return result
      },
      backgroundColor: '#fff',
      borderColor: '#FFF',
      borderWidth: 1,
      textStyle: {
        fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
        fontSize: 14,
        color: '#666'
      },
      padding: [14, 24],
      extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 6px;'
    },
    legend: {
      textStyle: {
        fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
      }
    },
    radar: [
      {
        indicator: props.indicators.map(item => ({
          text: item,
          max: 5
        })),
        center: ['50%', '50%'],
        radius: '75%',
        axisName: {
          color: '#666',
          backgroundColor: '#FFF',
          borderRadius: 3,
          padding: [3, 5],
          fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
          fontSize: 13
        },
        nameTextStyle: {
          fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
        }
      }
    ],
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.data,
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: 'rgba(194, 151, 254, 0.6)',
                  offset: 0
                },
                {
                  color: 'rgba(103, 93, 237, 0.6)',
                  offset: 1
                }
              ])
            },
            label: {
              show: true,
              formatter: function (params) {
                return params.value
              },
              fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
              fontSize: 12,
              color: '#605CE5',
              backgroundColor: '#FFFF',
              padding: [4, 6],
              borderRadius: 4,
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowBlur: 3
            }
          }
        ]
      }
    ]
  }

  chart.setOption(option)
}

// 监听数据变化
watch(
  () => [props.data, props.indicators],
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听窗口大小变化
const handleResize = () => {
  chart && chart.resize()
}

onMounted(() => {
  // 添加一个小延时，确保 DOM 已经准备好
  setTimeout(() => {
    initChart()
  }, 0)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.radar-chart {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
}
</style> 