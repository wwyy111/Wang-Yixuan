<template>
  <div class="excalidraw-editor-container">
    <div id="excalidraw" style="height: 100%"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as ExcalidrawLib from "@excalidraw/excalidraw"
import React from "react"
import ReactDOM from "react-dom/client"

defineOptions({
  name: 'ExcalidrawEditor'
})

const props = defineProps({
  initialElements: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const excalidrawElementsData = ref(props.initialElements)

onMounted(() => {
  const App = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          style: { height: "100%" },
        },
        React.createElement(ExcalidrawLib.Excalidraw, {
          initialData: excalidrawElementsData.value,
          onChange: (elements) => {
            if (props.readOnly) {
              return
            }
            excalidrawElementsData.value = elements
          },
          langCode: "zh-CN",
          theme: "light",
          name: "Excalidraw"
        }),
      ),
    )
  }

  const excalidrawWrapper = document.getElementById("excalidraw")
  if (excalidrawWrapper) {
    const root = ReactDOM.createRoot(excalidrawWrapper)
    root.render(React.createElement(App))
  }
})
</script>

<style scoped>
.excalidraw-editor-container {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}
</style> 