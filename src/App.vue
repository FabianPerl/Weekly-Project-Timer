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
      <Timer/>
        <v-container>
            <v-row>
                <v-col cols="7">
                  <v-row>
                    <v-col cols="2">
                    <v-combobox
                      v-model="select"
                      :items="items"
                      outlined
                      dense
                    ></v-combobox>
                    </v-col>
                  </v-row>
                  <list/>
                </v-col>
                <v-col class="small" cols="5">
                  <doughnut :chartdata="chartdata" :options="chartoptions"></doughnut>
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
    select: 'Week 1',
    items: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
    ],
    chartoptions: {},
    chartdata: {
      labels: [ 'Project A', 'Project B', 'Project C' ],
      datasets: [
        {
          data: [20.20, 10.30, 15],
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)']
        }
      ],
    }
  }),
};
</script>

<style scoped>
  .small {
      max-width: 400px;
      margin:  150px auto;
  }
</style>
