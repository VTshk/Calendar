<template>
  <div>
    <div class="calendar">

      <CalendarHeader :table="table" />
      <div class="table">
        <div class="timePeriods">
          <div class="period" v-for="(time, i) of 23" :key="i">
            <span>{{i > 8 ? ++i: '0' + ++i}}.00</span>
            <div class="underline"></div>
          </div>
        </div>

        <div class="column" v-for="column in table" :key="column.startDate">
          <drop
            class="cell"
            v-for="cell in column.cells" :key="cell.startDate"
            @drop="handleDrop(cell, ...arguments)">
            <drag
              class="note"
              v-for="note in cell.notes" :key="note.startDate"
              :transfer-data="{note}"
              :style="inlineStyleNote(note)">
              <div class="noteText">
                <strong>{{note.title}}</strong>
                <span :class="{'row': smallHeight(note)}">
                  {{getPeriod(note.startDate, note.endDate)}}
                </span>
              </div>
            </drag>
          </drop>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import CalendarHeader from './CalendarHeader'
import { startOfWeek, format, addDays, getTime, addMinutes } from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

export default {
  name: 'calendar',
  components: {
    CalendarHeader
  },
  computed: {
    table () {
      const columns = []
      let date = startOfWeek(new Date(), { weekStartsOn: 1 })
      for (let i = 0; i < 7; i++) {
        const createСells = () => {
          const cells = []
          for (let j = 0; j < 48; j++) {
            const startOfHour = getTime(addMinutes(date, j * 30))
            const cell = {
              startDate: startOfHour,
              notes: this.notes[startOfHour]
            }
            cells.push(cell)
          }
          return cells
        }
        const column = {
          title: format(date, 'EEEEEE', { locale: ruLocale }),
          dayOfMonth: date.getDate(),
          cells: createСells(),
          startDate: date.getTime()
        }
        columns.push(column)
        date = addDays(date, 1)
      }
      return columns
    },

    notes () {
      return this.$store.getters.getNotes()
    }
  },
  methods: {
    handleDrop (drop, drag) {
      if (!drop.notes && drag) {
        const modifiedNote = {
          title: drag.note.title,
          startDate: drop.startDate,
          endDate: drop.startDate + (drag.note.endDate - drag.note.startDate)
        }
        this.$store.dispatch('changeNotes', {
          modifiedNote: modifiedNote,
          drag: drag
        })
      }
    },
    getPeriod (start, end) {
      return format(start, 'HH:mm') + '-' + format(end, 'HH:mm')
    },
    smallHeight (note) {
      return note.endDate - note.startDate === 1800000
    },
    inlineStyleNote (note) {
      return {
        height: (note.endDate - note.startDate) / 3600000 * 50.4 + 'px'
      }
    }
  }
}
</script>

<style scoped lang="sass">
.calendar
  margin: 0 auto
  width: 90vw
  .table
    display: flex
    height: 80vh
    overflow-x: hidden
    .timePeriods
      margin-top: 1px
      .period
        height: 51px
        display: flex
        align-items: flex-end
      .underline
        border-bottom: 1px solid #DADCE0
        width: 15px
    .column
      text-align: center
      width: 100%
      min-width: 100px
      &:last-child
        .cell
          border-right: 1px solid #DADCE0
      .cell
        height: 25px
        border-left: 1px solid #DADCE0
        &:nth-child(2n+1)
          border-top: 1px solid #DADCE0
        &:last-child
          border-bottom: 1px solid #DADCE0
          overflow: hidden
        .note
          display: flex
          overflow: hidden
          position: relative
          z-index: 2
          background: #EBEDC6
          font-size: 14px
          cursor: pointer
          text-align: left
          .noteText
            padding: 5px
            white-space: pre
            span
              display: flex
              font-size: 11px
.row
  display: inline !important
  margin-left: 3px
</style>
