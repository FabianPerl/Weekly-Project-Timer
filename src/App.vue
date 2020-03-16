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
        <h5>{{ timeEntries }} Entries</h5>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-content>
      <timer v-on:newTimeEvent="newTime" :projects="getAllProjects"></timer>
        <v-container>
            <v-row>
                <v-col cols="5">
                  <v-row>
                    <v-col cols="3">
                    <v-combobox
                      v-model="select"
                      :items="items"
                      disabled
                      outlined
                      dense
                    ></v-combobox>
                    </v-col>
                  </v-row>
                  <list :items="mapToItems" v-on:editEntry="editEntry" v-on:deleteEntry="deleteEntry"></list>
                </v-col>
                <v-col class="small" cols="5">
                  <doughnut :chart-data="chartdata" :options="chartoptions"></doughnut>
                  <div>
                    <v-divider inset vertical></v-divider>
                    <small>(time measured in minutes)</small>
                  </div>
                  <v-divider inset vertical></v-divider>
                  <!-- <bar></bar> -->
                </v-col>
                <!-- TODO: Chart einbauen pro Monat? -->
            </v-row>
        </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Timer from './components/Timer.vue'
import List from './components/List.vue'
import Doughnut from './components/DoughnutChart.vue'
// import Bar from './components/BarChart.vue'

export default {
  name: 'App',

  components: {
    Timer,
    List,
    Doughnut,
    // Bar
  },

  data: () => ({
    timeEntries: 0,
    buffered: 0,
    listmap: new Map(),
    select: 'Week 1',
    items: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
    ],
    chartoptions: {
    },
  }),
  watch: {
    timeEntries () {
    }
  },
  created: function() {
    let map = new Map();
    if (localStorage.entryMap) {
      map = this.parseObjToMap(JSON.parse(localStorage.getItem('entryMap')))
    } 

    let date = this.formattedDate(new Date())
    this.listmap = map;

    // if todays date isn't set, create it and push it to the map
    if (!this.listmap.has(date))
      this.listmap.set(date, [])
  },
  methods: {
    formattedDate: function (date) {
        return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    deleteEntry: function (entry) {
      let newSetMap = new Map(this.listmap)
      let values = newSetMap.get(entry.date)
      let pos = values.map(element => { return element.id }).indexOf(entry.id)

      values.pop(pos)

      this.listmap = newSetMap
      this.saveEntries();
    },
    editEntry: function (entry) {
      let newSetMap = new Map(this.listmap)
      let values = newSetMap.get(entry.date)
      let pos = values.map(element => { return element.id }).indexOf(entry.id)
      
      values[pos] = entry

      this.listmap = newSetMap
      this.saveEntries();
    },
    newTime: function (newObj) {
      if (!newObj || typeof newObj === 'undefined')
        return

      let date = this.formattedDate(new Date())
      let {description, time, topic, minutes} = newObj;
      let newEntry = {
        description,
        time,
        date,
        topic,
        minutes,
        id : this.timeEntries
      }

      let list = this.listmap.get(date);
      list.push(newEntry)
      this.$set(this.listmap, date, list)
      this.saveEntries();
    },
    parseObjToMap (obj) {
      return new Map(Object.entries(obj))
    },
    parseMapToObj (map) {
        return Array.from(map).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
    },
    saveEntries () {
      let myMap = JSON.stringify(this.parseMapToObj(this.listmap))
      this.listmap = this.parseObjToMap(this.parseMapToObj(this.listmap))
      localStorage.setItem('entryMap', myMap)
    },
    randomNumber: function() {
      return 'rgba(' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',1)'
    },
  },
  computed: {
    getAllProjects: function () {
      let projectSet = new Set()
      let map = this.listmap

      for (let value of map.values()) {
        let values = value

        for (let timeEntry of values) {
          projectSet.add(timeEntry.topic)
        }
      }

      return [...projectSet];
    },
    chartdata: function() {
      let myBackgroundColor = []
      let projectTimeMap = new Map();
      let map = this.listmap

      for (let value of map.values()) {
        let values = value

        for (let timeEntry of values) {
          let oldValue = 0

          if (projectTimeMap.has(timeEntry.topic)) {
            oldValue = projectTimeMap.get(timeEntry.topic) 
          } 

          let newValue = oldValue + timeEntry.minutes
          projectTimeMap.set(timeEntry.topic, +(newValue.toFixed(3)))
        }
      }

      let myLabels = []
      let timeNeeded = []

      projectTimeMap.forEach((value, key) => { 
        myLabels.push(key)         
        timeNeeded.push(value)
        myBackgroundColor.push(this.randomNumber()) 
      })

      let chartdata1 = {
        labels: myLabels,
        datasets: [
          {
            data: timeNeeded,
            backgroundColor: myBackgroundColor
          }
        ]
      }

      return chartdata1
    },
    mapToItems: function () {
      let map = this.listmap
      let list = []

      for (let [key, value] of map.entries()) {
        let date = key
        let values = value

        list.push({ header: date })
        list.push({ divider: true })

        for (let timeEntry of values) {
          list.push({subtitle: timeEntry})
        }
      }

      return list; // Hack for reactivity
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
