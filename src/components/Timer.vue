<template>
    <div>
        <v-container>
            <v-row class="text-center">
                <v-col cols="12">
                    <div class="day">
                        {{ getFormattedDate() }}
                    </div>
                    <div class="time placeholdertime">
                        88:88:88
                    </div>
                    <div class="time lighton">
                        {{ getFormatedTime() }}
                    </div>
                </v-col>
                <v-col cols="12">
                    <v-btn color="success" :disabled="!start" v-on:click="btnStartClicked">Start</v-btn>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-btn color="error" :disabled="!stop" v-on:click="btnStopClicked">Stop</v-btn>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-btn color="primary" :disabled="!save" v-on:click="btnOpenDialog">Save</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <entry-dialog title="Save Entry" :projects="projects" :dialog="dialog" :time="getFormatedTime()" v-on:closeDialog="dialog = false" :date="date" v-on:saveEntryEvent="saveEntry"></entry-dialog>
    </div>
</template>

<script>
import EntryDialog from './EntryDialog.vue'

export default {
    components: {
        EntryDialog
    },
    props: ['projects'],
    data: () => ({
        dialog: false,
        start: true,            // flag for disabling start button
        stop: false,            // flag for disabling stop button
        save: false,            // flag for disabling save button
        date: new Date(),   
        hours: 0,               // 0-24
        minutes: 0,             // 0-59
        seconds: 0,             // 0-59
        title: "",              // When time will be saved, you can select which task you did. It will be analyzed
        intervalId: null,       // To stop interval
    }),
    methods: {
        getFormattedDate: function () {
            return this.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        },
        getFormatedTime: function () {
            return ("0" + this.hours).slice(-2) + ":" + ("0" + this.minutes).slice(-2) + ":" + ("0" + this.seconds).slice(-2)
        },
        btnStartClicked: function() {
            this.intervalId = setInterval(this.everySecond, 1000)
            this.stop = true
            this.start = false
            this.save = false
            this.hours = 0
            this.minutes = 0
            this.seconds = 0
        },
        btnStopClicked: function () {
            clearInterval(this.intervalId)
            this.intervalId = null
            this.start = true
            this.save = true
            this.stop = false
        },
        btnOpenDialog: function () {
            this.dialog = true
            this.stop = false
            this.start = true 
            this.save = false
        },
        saveEntry: function (entry) {
            entry.seconds = (this.minutes * 60) + this.seconds + (this.hours * 60 * 60)
            this.$emit('newTimeEvent', entry)
        },
        everySecond: function () {
            if (this.seconds < 59){
                this.seconds++;
            } else {
                this.seconds = 0;
                if (this.minutes < 59) {
                    this.minutes++;
                } else {
                    this.minutes = 0;
                    if (this.hours < 24) {
                        this.hours++;
                    } else {
                        this.hours = 0;
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
@font-face {
    font-family: 'digital-7';
    src: url('../assets/fonts/digital-7.ttf');
}

.day {
      font-family: 'Courier New', Courier, monospace;
      font-size: 15px;
}

.time {
      font-family: 'digital-7', arial;
      font-size: 80px;
}

.placeholdertime {
    color: lightgray;
    z-index: 50;
}

.lighton {
    color: black;
    margin-top: -119px;
    z-index: 100;
}
</style>