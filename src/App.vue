<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>Timer</h1>
        <v-divider class="mx-4" inset vertical></v-divider>
        <h5>Project Manager</h5>
        <v-divider class="mx-4" inset vertical></v-divider>
        <h5>Week {{ currentWeek }}</h5>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <timer v-on:newTimeEvent="newTime" :projects="getAllProjects"></timer>
        <v-divider class="mb-12" inset vertical></v-divider>
        <v-container v-if="showObj">
            <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="5" class="pr-10">
                      <v-combobox
                        style="width: 80px"
                        v-model="selectedWeek"
                        :items="getAllWeeks"
                        label="Week"
                        outlined
                        dense
                      ></v-combobox>
                      <list :items="mapToItems" v-on:editEntry="editEntry" v-on:deleteEntry="deleteEntry"></list>
                      </v-col>
                    <v-divider class="ml-9 mr-12" inset vertical></v-divider>
                    <v-col cols="3">
                      <h3>Projects</h3>
                      <v-divider class="mb-5" inset vertical></v-divider>
                      <doughnut :chart-data="chartDataDoughnut"></doughnut>
                    </v-col>
                    <v-col cols="3">
                      <h3>Time Spent</h3>
                      <v-divider class="mb-5" inset vertical></v-divider>
                      <bar :chart-data="chartDataBar"></bar>
                      <v-row align="center">
                        <v-col col="1">
                          <v-text-field v-model="hoursSelect" step="0.5" label="Hours per week" :rules="[rules.val]" :placeholder="(timeSeconds/60/60) + ' Hours'" class="" type="number"></v-text-field>
                        </v-col>
                        <v-col col="1">
                          <v-btn :disabled="hoursSelect < 0 || hoursSelect > 100" small @click="changeHours">Change</v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Timer from './components/Timer.vue'
import List from './components/List.vue'
import Doughnut from './components/DoughnutChart.vue'
import Bar from './components/BarChart.vue'
import moment from 'moment'

export default {
  name: 'App',

  components: {
    Timer,
    List,
    Doughnut,
    Bar
  },

  data: () => ({
    showObj: false,
    spentSec: 0,
    availableSec: 0,
    hoursSelect: 0,
    timeSeconds: 40 * 60 * 60,
    rules: {
      val: value => (value >= 0 && value <= 100)  || 'Values between 0 and 100'
    },
    timeEntries: 0,
    currentWeek: moment().week() + '',
    selectedWeek: moment().week() + '',
    buffered: 0,
    listmap: new Map(),
  }),

  created: function() {
    let map = new Map();

    if (localStorage.map) {
      map = this.JSONToMap(localStorage.getItem('map'))
    } 

    this.listmap = map

    let hourInSeconds = 40 * 60 * 60;
    if (localStorage.hour) {
      hourInSeconds = localStorage.getItem('hour');
    }

    this.hoursSelect = hourInSeconds / 60 / 60
    this.timeSeconds = hourInSeconds
    this.calculateTimes()
  },

  methods: {
    changeHours () {
      this.timeSeconds = this.hoursSelect * 60 * 60
      localStorage.setItem('hour', this.timeSeconds);
      this.calculateTimes()
    },
    orderMap (week) {
      // let weekEntries = this.listmap.get(week).entries();
      // // console.log(weekEntries)
      console.log(week)

      // weekEntries[Symbol.iterator] = function* () {
      //   yield* [...this.entries()].sort((a, b) => {
      //     console.log(a[0])
      //     console.log(b[0])
      //     new Date(a[0]).getTime() - new Date(b[0]).getTime()
      //   });
      // }



      // sort the weeks time entries
      // weekEntries.sort((a, b) => { 
      //   console.log({a}, {b})
      //   return new Date(b[0]).getTime() - new Date(a[0]).getTime()
      // })

      // this.listmap.set(week, weekEntries)
    },
    formattedDate: function (date) {
        return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    deleteEntry: function (entry) {
      let newSetMap = new Map(this.listmap)
      let values = newSetMap.get(this.selectedWeek).get(entry.date)
      let pos = values.map(element => { return element.id }).indexOf(entry.id)

      values.pop(pos)

      if (values.length == 0) {
        newSetMap.get(this.selectedWeek).delete(entry.date)

        if (newSetMap.get(this.selectedWeek).size == 0) {
          newSetMap.delete(this.selectedWeek)
        }
      }

      this.listmap = newSetMap
      this.calculateTimes();
      this.saveEntries();
    },
    editEntry: function (entry) {
      let newSetMap = new Map(this.listmap)
      let values = newSetMap.get(this.selectedWeek).get(entry.date)
      let pos = values.map(element => { return element.id }).indexOf(entry.id)
      
      values[pos] = entry

      this.listmap = newSetMap
      this.saveEntries();
    },
    newTime: function (newObj) {
      if (!newObj || typeof newObj === 'undefined')
        return

      let week = this.currentWeek
      let date = this.formattedDate(new Date())
      let {description, time, topic, seconds} = newObj;
      let newEntry = {
        description,
        time,
        date,
        topic,
        seconds,
        id : this.timeEntries
      }

      // if week isn't set, create it and push it to the map
      if (!this.listmap.has(week)) {
        this.listmap.set(week, new Map())
      }

      // if todays date isn't set, create it and push it to the map
      if (!this.listmap.get(week).has(date)) {
        this.listmap.get(week).set(date, [])
        this.orderMap(week)
      }

      this.listmap.get(week).get(date).push(newEntry)
      this.timeEntries++;
      this.calculateTimes();
      this.saveEntries();
    },
    mapToJSON (map) {
      return JSON.stringify(Array.from(map).reduce((obj, [key, value]) => {
        obj[key] = Array.from(value).reduce((obj2, [key2, value2]) => {
          obj2[key2] = value2;
          return obj2}, {});
        return obj;
      }, {}))
    },
    JSONToMap (json) {
        let outerMap = new Map(Object.entries(JSON.parse(json)))

        for (let [key, value] of outerMap.entries()) {
          outerMap.set(key, new Map(Object.entries(value)))
        }

        return outerMap
    },
    saveEntries () {
      this.listmap = this._.cloneDeep(this.listmap)
      let mapstring = this.mapToJSON(this.listmap)
      localStorage.setItem('map', mapstring)
    },
    randomNumber: function() {
      return 'rgba(' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',1)'
    },
    calculateTimes () {
      if (this.listmap.size <= 0) return
      let weekMap = this.listmap.get(this.selectedWeek)
      let timeNeededSec = 0;

      weekMap.forEach(function (k) {
        k.forEach(obj => {
          timeNeededSec+=obj.seconds
        })
      })

      this.availableSec = this.timeSeconds - timeNeededSec;
      this.spentSec = timeNeededSec;
    }
  },

  computed: {
    getAllWeeks: function () {
      return [...this.listmap.keys()]
    },
    getAllProjects: function () {
      let projectSet = new Set()
      let map = this.listmap.get(this.selectedWeek) || new Map()

      for (let value of map.values()) {
        let values = value

        for (let timeEntry of values) {
          projectSet.add(timeEntry.topic)
        }
      }

      return [...projectSet];
    },
    chartDataBar: function () {
      const spent = this.spentSec/60/60
      const avail = this.availableSec/60/60

      return {
            labels: ['Spent','Available'],
            datasets: [
                {
                  backgroundColor: ['#f87979', 'green'],
                  barThickness: 50,
                  data: [(spent).toFixed(3), (avail).toFixed(3)]
                }
            ]
      }
    },
    chartDataDoughnut: function() {
      let projectTimeMap = new Map();
      let map = this.listmap.get(this.selectedWeek) || new Map()

      for (let value of map.values()) {
        let values = value

        for (let timeEntry of values) {
          let oldValue = 0

          if (projectTimeMap.has(timeEntry.topic)) {
            oldValue = projectTimeMap.get(timeEntry.topic) 
          } 

          let newValue = oldValue + timeEntry.seconds
          projectTimeMap.set(timeEntry.topic, +(newValue.toFixed(3)))
        }
      }

      let myLabels = []
      let timeNeeded = []
      let myBackgroundColor = []

      projectTimeMap.forEach((value, key) => { 
        myLabels.push(key)         
        timeNeeded.push(value)
        myBackgroundColor.push(this.randomNumber()) 
      })

      return {
        labels: myLabels,
        datasets: [
          {
            data: timeNeeded,
            backgroundColor: myBackgroundColor
          }
        ]
      }
    },
    mapToItems: function () {
      let mapOfWeek = this.listmap.get(this.selectedWeek) || new Map()
      let list = []

      for (let [key, value] of mapOfWeek.entries()) {
        let date = key
        let values = value

        list.push({ header: date })
        list.push({ divider: true })

        for (let timeEntry of values) {
          list.push({subtitle: timeEntry})
        }
      }

      return list;
    },
  },

  watch: {
    selectedWeek: function () {
      this.calculateTimes();
    },
    listmap: function () {
      this.showObj = this.listmap && this.listmap.size > 0
    }
  }
};
</script>

<style scoped>
  .small {
      max-width: 400px;
      margin:  150px auto;
  }
</style>
