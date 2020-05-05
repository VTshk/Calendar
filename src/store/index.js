import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { getTime } from 'date-fns'
import mockNotes from '../mockData.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: mockNotes
  },
  mutations: {
    setNotes (state, newNotes) {
      state.notes = newNotes
    }
  },
  actions: {
    changeNotes ({ commit, state }, { modifiedNote, drag }) {
      const newNotes = JSON.parse(JSON.stringify(state.notes))
      const idx = newNotes.findIndex(d => d.startDate === drag.note.startDate)
      newNotes[idx] = modifiedNote
      commit('setNotes', newNotes)
    }
  },
  getters: {
    getNotes: s => () => _.groupBy(s.notes, (item) => getTime(item.startDate))
  }
})
