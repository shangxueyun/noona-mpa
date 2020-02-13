<template>
  <div class="load-more-container">
    <template v-if="status == 'loading'">
      <i class="load-more-container__icon" />
      <span class="load-more-container__tips">正在加载</span>
    </template>
    <template v-else-if="status == 'done'">
      <span class="load-more-container__tips" />
    </template>
    <template v-else-if="status == 'nodata'">
      <span class="load-more-container__tips">暂无数据</span>
    </template>
    <span v-else class="load-more-container__tips" @click="handleClick">点击加载更多</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingMore',
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  },
  props: {
    status: {
      type: String,
      default: 'loading' // loading done click  nodata
    }
  }
}
</script>

<style lang="scss">
/*! 波波加载更多组件 */
 .load-more-container{
    width: 65%;
    margin:1.5em auto;
    line-height: 1.6em;
    font-size:14px;
    text-align: center;
    &__icon {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      animation: loadingAni 1s steps(12, end) infinite;
      background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
      background-size: 100%;
    }
    &__tips{
      display: inline-block;
      vertical-align: middle;
    }
}
@-webkit-keyframes loadingAni {
    0% {
        transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
        transform: rotate3d(0, 0, 1, 360deg);
    }
}
@keyframes loadingAni {
    0% {
        transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
        transform: rotate3d(0, 0, 1, 360deg);
    }
}
// .loadmore_line{
//     margin-top:2.4em;
//     .weui-loadmore__tips{
//         position: relative;
//         top:-.9em;
//         padding:0 .55em;
//         background-color: #FFFFFF;
//     }
// }
// .loadmore_dot{
//     .loadmore__tips{
//         padding:0 .16em;
//         &:before{
//             content: " ";
//             width:4px;
//             height:4px;
//             border-radius:50%;
//             display: inline-block;
//             position: relative;
//             vertical-align: 0;
//             top:-.16em;
//         }
//     }
// }
</style>
