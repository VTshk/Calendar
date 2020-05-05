<template>
    <div class="calendarHeader">
      <div v-for="(day, i) in table" :key="i" :class="['day',{'today': today == day.startDate}]">
        <h3>{{day.title}}</h3>
        <h1>{{day.dayOfMonth}}</h1>
      </div>
    </div>
</template>

<script>
import { startOfToday } from 'date-fns'
export default {
  props: {
    table: {
      type: Array
    }
  },
  computed: {
    today () {
      return startOfToday().getTime()
    }
  }
}
</script>

<style lang="sass" scoped>
.calendarHeader
  color: #656565
  overflow-x: hidden
  display: flex
  padding-left: 60px
  padding-right: 16px
  margin-bottom: 10px
  .day
    text-align: center
    width: 100%
    min-width: 100px
  .today
    background: #d6d6ff
    border-radius: 10px
h3
  margin: 0
h1
  margin: 10px 0
</style>
