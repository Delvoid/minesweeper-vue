<template>
  <span
    class="flex w-12 h-12 items-center justify-center"
    :class="{
      'bg-blue-100': isRevealed && !cellData.isBomb,
      'bg-red-600': cellData.isBomb && isRevealed,
      'bg-green-300': cellData.isMarked,
    }"
    @click.left="leftClick"
    @click.right.prevent="rightClick"
  >
    <div class="" v-show="isVisable">{{ value }}</div>
  </span>
</template>

<script>
  export default {
    props: {
      cellData: Object,
      bombIcon: {
        type: String,
        default: '💣',
      },
      flagIcon: {
        type: String,
        default: '❗',
      },
    },
    computed: {
      value() {
        if (this.isRevealed) {
          if (this.cellData.isBomb) {
            return this.bombIcon
          } else {
            return this.cellData.proximityCount > 0
              ? this.cellData.proximityCount
              : ''
          }
        }
        return this.cellData.isMarked ? this.flagIcon : ''
      },
      isVisable() {
        return this.isRevealed || this.cellData.isMarked
      },
      isRevealed() {
        return this.cellData.isRevealed
      },
    },

    methods: {
      leftClick(e) {
        this.$emit('onCellLeftClicked', {
          x: this.cellData.x,
          y: this.cellData.y,
        })
      },
      rightClick(e) {
        this.$emit('onCellRightClicked', {
          x: this.cellData.x,
          y: this.cellData.y,
        })
      },
    },
  }
</script>
