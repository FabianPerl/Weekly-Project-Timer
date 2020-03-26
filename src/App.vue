<template>
  <v-app>
    <v-app-bar
      app
      color="grey darken-3"
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
          <v-row justify="center">
            <v-col :xl="5" :lg="6" :md="7" :sm="12" :xs="12" class="pr-10">
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
            <v-divider v-if="showDivider" class="ml-2 mr-8" inset vertical></v-divider>
            <v-col :xl="6" :lg="5" :md="4" :sm="8" :xs="12">
                <v-row justify="center">
                  <v-col :xl="6" :lg="8" :md="12" :sm="8" :xs="8">
                    <h3>Projects</h3>
                    <v-divider class="mb-5" inset vertical></v-divider>
                    <all-projects-chart :chart-data="chartDataDoughnut"></all-projects-chart>
                  </v-col>
                  <v-col :xl="6" :lg="8" :md="12" :sm="8" :xs="8">
                    <h3>Time Spent</h3>
                    <v-divider class="mb-5" inset vertical></v-divider>
                    <time-spent-chart :chart-data="chartDataBar"></time-spent-chart>
                    <v-container>
                      <v-row align="center">
                        <v-col col="1">
                          <v-text-field v-model="hoursSelect" step="0.5" label="Working time per week" :rules="[rules.val]" :placeholder="(userData.timeSeconds/60/60) + ' Hours'" class="" type="number" suffix="hours"></v-text-field>
                        </v-col>
                        <v-col col="1">
                          <v-btn :disabled="hoursSelect < 0 || hoursSelect > 100" small @click="changeHours">Change</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col :xl="6" :lg="8" :md="12" :sm="8" :xs="8">
                    <h3>Overtime Tracker</h3>
                    <v-divider class="mb-5" inset vertical></v-divider>
                    <line-chart-overtime :chart-data="chartDataOvertime"></line-chart-overtime>
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
import AllProjectsChart from './components/charts/DoughnutChartAllProjects.vue'
import TimeSpentChart from './components/charts/BarChartTimeSpent.vue'
import LineChartOvertime from './components/charts/LineChartOvertime.vue'
import moment from 'moment'

export default {
  name: 'App',

  components: {
    Timer,
    List,
    AllProjectsChart,
    TimeSpentChart,
    LineChartOvertime
  },

  data: () => ({
    showObj: false,
    overtimePerWeek: [],
    userData: null, 
    spentSec: 0,
    availableSec: 0,
    hoursSelect: 0,
    rules: {
      val: value => (value >= 0 && value <= 100)  || 'Values between 0 and 100'
    },
    currentWeek: moment().week() + '',
    selectedWeek: moment().week() + '',
    listmap: new Map(),
  }),

  created: function() {
    let map = new Map();

    if (localStorage['PROJECT_MANAGER:map']) {
      map = this.JSONToMap(localStorage.getItem('PROJECT_MANAGER:map'))
    } 

    this.listmap = map

    if (localStorage['PROJECT_MANAGER:userData']) {
      this.userData = JSON.parse(localStorage.getItem('PROJECT_MANAGER:userData'))
    } else {
      this.userData = Object.assign({}, {}, {
        indexWeek: 0,
        timeEntries: 0,
        timeSeconds: 40 * 60 * 60, // Default Value
      })
    }

    this.hoursSelect = this.userData.timeSeconds / 60 / 60
    this.calculateTimes()
  },

  methods: {
    changeHours () {
      this.userData = Object.assign({}, this.userData, { timeSeconds: this.hoursSelect * 60 * 60 })
      this.calculateTimes()
    },
    orderMap (week) {
      let weekData = this.listmap.get(week)

      let map = new Map([...weekData.entries()].sort((key1, key2) => {
        return new Date(key2[0]).getTime() - new Date(key1[0]).getTime()
      }))

      this.listmap.set(week, map)
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
        color: this.randomNumber(), 
        seconds,
        id : this.userData.timeEntries
      }

      // if week isn't set, create it and push it to the map
      if (!this.listmap.has(week)) {
        this.userData = Object.assign({}, this.userData, { indexWeek: this.userData.indexWeek + 1})
        this.calculateOvertime()
        this.listmap.set(week, new Map())
        // TODO: change the week to the current week
      }

      // if todays date isn't set, create it and push it to the map, sort it after inserting new date
      if (!this.listmap.get(week).has(date)) {
        this.listmap.get(week).set(date, [])
        this.orderMap(this.currentWeek)
      }

      this.listmap.get(week).get(date).push(newEntry)
      this.userData = Object.assign({}, this.userData, { timeEntries: this.userData.timeEntries + 1})
      this.calculateTimes();
      this.saveEntries();
    },
    calculateOvertime () {
        // calculate overtime this week and push it
        let valueToAdd = 0
        if (this.availableSec < 0) {
          valueToAdd = this.availableSec          
        } 

        let value = valueToAdd;
        if (this.userData.indexWeek > 1) // if it exist, add
        {
          value = this.overtimePerWeek[this.userData.indexWeek - 1] + valueToAdd
        }

        this.overtimePerWeek.push(value)
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
      localStorage.setItem('PROJECT_MANAGER:map', mapstring)
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

      this.availableSec = this.userData.timeSeconds - timeNeededSec;
      this.spentSec = timeNeededSec;
    }
  },

  computed: {
    showDivider: function (){
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return false
        case 'sm': return false
        case 'md': return true
        case 'lg': return true
        case 'xl': return true
      }

      return false
    },
    showCol: function (){
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return false
        case 'sm': return false
        case 'md': return true
        case 'lg': return true
        case 'xl': return false
      }

      return false
    },
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
    chartDataOvertime: function () {
      return {
          labels: [...this.listmap.keys()].map(v => "Week " + v),
          datasets: [
            {
              backgroundColor: '#f87979',
              data: this.overtimePerWeek
            }
          ]
        }
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
                  data: [spent, avail]
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
          projectTimeMap.set(timeEntry.topic, { time: +(newValue.toFixed(3)), color: timeEntry.color })
        }
      }

      let myLabels = []
      let timeNeeded = []
      let myBackgroundColor = []

      projectTimeMap.forEach((value, key) => { 
        myLabels.push(key)         
        timeNeeded.push(value.time)
        myBackgroundColor.push(value.color) 
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
    },
    userData () {
      localStorage.setItem('PROJECT_MANAGER:userData', JSON.stringify(this.userData))
    },
  }
};
</script>

<style scoped>
  .small {
      max-width: 400px;
      margin:  150px auto;
  }
</style>
