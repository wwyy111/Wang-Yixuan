<template>
  <div class="add-is">
    <div class="upload-in-box">
      <IndicaUpload />
    </div>

    <div class="upload-tips">
      <div class="title-box">
        <div class="line"></div>
        <div class="title">温馨提示</div>
        <div class="line"></div>
      </div>
      <div class="tip-box">
        <div class="tip-t">
          系统会默认将上传文件的首行作为标题行，第二行开始作为要上传的数据
        </div>
        <div class="tip-t">
          最多支持5个Sheet的解析和上传，若您需要上传超过5个Sheet的内容，请拆分为多个Excel文件上传
        </div>
        <div class="tip-t">
          请上传结构化数据，以便于我们更好的识别。有合并单元格的，请处理后再上传
        </div>
      </div>
    </div>

    <div class="fake-table">
      <div class="item item-header">
        <div>指标名称</div>
        <div>指标解读</div>
      </div>
      <div class="item">
        <div>环境贴切</div>
        <div>使用贴近用户日常语言和习惯的表达方式，符合其心理模型</div>
      </div>
      <div class="item">
        <div>用户可控</div>
        <div>用户在操作时应有撤销、重做、退出等灵活控制选项</div>
      </div>
      <div class="item">
        <div>一致性&nbsp;&nbsp;&nbsp;</div>
        <div>遵守平台、行业的标准设计规范，保持内外一致性。</div>
      </div>
    </div>

    <div class="text2">上传示例</div>

    <div class="btn">
      <MyBtn
        :showIcon="false"
        type="primary"
        @click="handleConfirmIS"
        text="下一步"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["next-step"]);

const handleConfirmIS = () => {
  emit("next-step");
};
</script>

<style lang="scss" scoped>
.add-is {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .upload-in-box {
    margin-top: 19px;
    margin-bottom: 44px;
  }
  .upload-tips {
    margin-bottom: 12px;
    margin-top: 6px;
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .line {
        width: 200px;
        height: 1px;
        background-color: #f3f2fd;
      }
      .title {
        color: var(--text3, #72728b);

        /* 正文标题 */
        font-family: "PingFang SC";
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px; /* 161.538% */
      }
    }
    .tip-box {
      display: flex;
      flex-direction: column;
      // gap: 12px;
      .tip-t {
        color: var(--text4, rgba(43, 43, 43, 0.4));
        text-align: left;

        /* 正文文字 */
        font-family: "PingFang SC";
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px; /* 161.538% */
        margin-top: 12px;
        position: relative;
        padding-left: 16px;
      }
      .tip-t::before {
        content: "";
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #605ce5;
        position: absolute;
        left: 0;
        top: 8px;
      }
    }
  }

  .fake-table {
    display: flex;
    width: 742px;
    height: 195px;
    padding: 4px;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px solid var(--border3, #e6e5eb);
    margin-bottom: 12px;

    .item {
      display: flex;
      display: flex;
      height: 45px;
      padding: 0px 16px;
      align-items: center;
      gap: 125px;
      flex-shrink: 0;
      align-self: stretch;
      border-bottom: 1px solid var(--border4, #f2f2f5);
      background: var(--bg1, #fff);
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-header {
      display: flex;
      height: 45px;
      padding: 0px 16px;
      align-items: center;
      gap: 125px;
      flex-shrink: 0;
      align-self: stretch;
      border-radius: 2px;
      background: var(--border4, #f2f2f5);
    }
  }
  .text2 {
    color: var(--text3, #72728b);

    /* 13/CN-Medium */
    font-family: "PingFang SC";
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 169.231% */
    padding-bottom: 10px;
  }
  .btn {
    width: 80px;
    position: fixed;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
