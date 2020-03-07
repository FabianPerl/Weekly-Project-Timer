<template>
    <div>
        <v-container>
            <v-row class="text-center">
                <v-col cols="12">
                    <div class="day">
                        {{date}}
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
                    <v-btn color="primary" :disabled="!save" v-on:click="btnSaveClicked">Save</v-btn>
                </v-col>
            </v-row>
            <v-dialog v-model="dialog" persistent max-width="300px">
            <v-card>
                <v-card-title>
                <span class="headline">Save Entry</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <div>{{ getFormatedTime() }}</div>
                        </v-col>
                        <v-divider></v-divider>
                        <v-col cols="12">
                            <v-text-field label="Topic*" v-model="topicTyped" type="text" :rules="rules.ruleOne"></v-text-field>
                            <v-text-field label="Description*" v-model="descriptionTyped" type="text" :rules="rules.ruleOne"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeWithoutSave">Close</v-btn>
                <v-btn color="blue darken-1" text @click="saveAsEntry">Save</v-btn>
                </v-card-actions>
            </v-card> 
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
export default {
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
        descriptionTyped: "",   // variable to buffer description
        topicTyped: "",         // variable to buffer topic
        rules: {
            ruleOne: [val => (val || '').length > 0 || 'This field is required']
        }
    }),
    methods: {
        getFormatedTime: function () {
            return ("0" + this.hours).slice(-2) + ":" + ("0" + this.minutes).slice(-2) + ":" + ("0" + this.seconds).slice(-2)
        },
        closeDialog: function () {
            this.dialog = false
        },
        closeWithoutSave: function () {
            this.topicTyped = "",
            this.descriptionTyped = ""
            this.closeDialog()
        },
        saveAsEntry: function () {
            if (!this.topicTyped || !this.descriptionTyped)
                return

            let time = this.getFormatedTime()
            let topic = this.topicTyped
            let description = this.descriptionTyped

            let newTime = {
                date: this.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: time,
                topic: topic,
                description: description
            }

            this.$emit('newTimeEvent', newTime)
            this.closeWithoutSave()
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
        btnSaveClicked: function () {
            this.dialog = true
            this.stop = false
            this.start = true 
            this.save = false
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