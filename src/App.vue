<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>Timer</h1>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-content>
      <timer v-on:newTimeEvent="newTime"></timer>
        <v-container>
            <v-row>
                <v-col cols="5">
                  <v-row>
                    <v-col cols="3">
                    <v-combobox
                      v-model="select"
                      :items="items"
                      outlined
                      dense
                    ></v-combobox>
                    </v-col>
                  </v-row>
                  <list :items="mapToItems"></list>
                </v-col>
                <v-col class="small" cols="5">
                  <doughnut :chartdata="chartdata" :options="chartoptions"></doughnut>
                  <div v-if="chartdata">
                    <v-divider inset vertical></v-divider>
                    <v-divider inset vertical></v-divider>
                    <v-divider inset vertical></v-divider>
                    <small>(time measured in minutes)</small>
                  </div>
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
import Doughnut from './components/Chart.vue'

export default {
  name: 'App',

  components: {
    Timer,
    List,
    Doughnut
  },

  data: () => ({
    timeEntries: 0,
    listmap: null,
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
  created: function() {
    this.listmap = new Map();
    let date = (new Date()).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    // if todays date isn't set, create it and push it to the map
    if (!this.listmap.has(date))
      this.listmap.set(date, [])
  },
  methods: {
    newTime: function (newObj) {
      if (!newObj || typeof newObj === 'undefined')
        return

      let {description, time, topic, minutes} = newObj;
      let newEntry = {
        description,
        time,
        topic,
        minutes
      }

      let date = (new Date()).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

      let list = this.listmap.get(date);
      list.push(newEntry)
      this.listmap.set(date, list)
      this.timeEntries += 1
    },
    randomNumber: function() {
      return 'rgba(' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',' + Math.floor((Math.random() * 255) + 1) + ',1)'
    },
  },
  computed: {
    chartdata: function() {

      if (this.listmap.size == 0)
        return null;

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

      return this.timeEntries && chartdata1
    },
    mapToItems: function () {
      let map = this.listmap
      let list = []

      if (map.size == 0)
        return list


      for (let [key, value] of map.entries()) {
        let date = key
        let values = value

        list.push({ header: date })
        list.push({ divider: true })

        for (let timeEntry of values) {
          list.push({subtitle: timeEntry})
        }
      }

      return this.timeEntries && list; // Hack for reactivity
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
