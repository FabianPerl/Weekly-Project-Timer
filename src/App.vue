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
      <List/>
    </v-content>
  </v-app>
</template>

<script>
import Timer from './components/Timer.vue'
import List from './components/List.vue'

export default {
  name: 'App',

  components: {
    Timer,
    List
  },

  data: () => ({
    //
  }),
};
</script>
