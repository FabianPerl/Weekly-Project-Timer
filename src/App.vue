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
                  <list/>
                </v-col>
                <v-col class="small" cols="5">
                  <doughnut :chartdata="chartdata" :options="chartoptions"></doughnut>
                </v-col>
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
    chartoptions: {},
    chartdata: {
      labels: [ 'Red', 'Yellow', 'Blue' ],
      datasets: [
        {
          data: [10, 20, 30],
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)']
        }
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
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
