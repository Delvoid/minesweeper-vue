<template>
  <span @click="start" @click.right.prevent="stop">
    {{ displayHours }}:{{ displayMinutes }}:{{ displaySeconds }}
  </span>
</template>

<script>
  export default {
    props: {
      isRunning: {
        type: Boolean,
        default: false,
      },
      gameOver: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        timer: 0,
        displaySeconds: 0,
        displayMinutes: 0,
        displayHours: 0,
        interval: null,
      }
    },
    watch: {
      isRunning(newValue, oldValue) {
        if (newValue) {
          this.start()
          this.displaySeconds =
            this.displayMinutes =
            this.displayHours =
              this.getZeroPad(0)
        } else {
          this.timer = 0
          this.stop()
        }
      },
      gameOver(newValue, oldValue) {
        if (newValue) {
          this.timer = 0
        }
      },
    },
    mounted() {
      this.displaySeconds = this.getZeroPad(this.displaySeconds)
      this.displayMinutes = this.getZeroPad(this.displayMinutes)
      this.displayHours = this.getZeroPad(this.displayHours)
    },
    methods: {
      start() {
        this.interval = setInterval(() => {
          if (this.displaySeconds == 10) {
            this.displaySeconds = 0
          }
          this.incrementTime()
          const hours = Math.floor(this.timer / this._hours)
          let time = this.timer - hours * this._hours
          const minutes = Math.floor(time / this._minutes)
          time = this.timer - hours * this._hours
          const seconds = time - minutes * 60
          this.displaySeconds = this.getZeroPad(seconds)
          this.displayMinutes = this.getZeroPad(minutes)
          this.displayHours = this.getZeroPad(hours)
        }, 1000)
      },
      stop() {
        clearInterval(this.interval)
      },
      incrementTime() {
        this.timer = parseInt(this.timer) + 1
      },
      getZeroPad(n) {
        return (parseInt(n, 10) >= 10 ? '' : '0') + n
      },
    },
    computed: {
      _seconds() {
        return 1
      },
      _minutes() {
        return this._seconds * 60
      },
      _hours() {
        return this._minutes * 60
      },
    },
  }
</script>
