<template>
    <v-dialog v-model="dialog" persistent max-width="300px">
    <v-card>
        <v-card-title>
            <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div class="text-center">{{ time }}</div>
                </v-col>
                <v-col cols="12">
                    <v-combobox
                        v-model="topicTyped"
                        :items="sortedProjects"
                        label="Topic*"
                        @keyup.enter=saveAsEntry
                        :rules="rules.ruleOne"
                        >
                    </v-combobox>
                    <v-text-field label="Description*" @keyup.enter="saveAsEntry" v-model="descriptionTyped" type="text" :rules="rules.ruleOne"></v-text-field>
                </v-col>
            <v-divider class="mt-4" inset vertical></v-divider>
            </v-row>
            <small><sup>*</sup>required field</small>
        </v-container>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
        <v-btn color="blue darken-1" text @click="saveAsEntry">Save</v-btn>
        </v-card-actions>
    </v-card> 
    </v-dialog>
</template>

<script>
export default {
    props: { 
        projects: {
            type: Array
        },
        dialog: {
            type: Boolean,
            required: true
        }, 
        time: {
            type: String,
            required: true
        }, 
        date: {
            type: Date,
            default: new Date()
        }, 
        description: {
            type: String,
            default: ''
        }, 
        topic: {
            type: String,
            default: ''
        }, 
        title: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            descriptionTyped: this.description,   // variable to buffer description
            topicTyped: this.topic,         // variable to buffer topic
            rules: {
                ruleOne: [val => (val || '').length > 0 || 'This field is required']
            }
        }
    },
    methods: {
        closeDialog: function () {
            this.$emit('closeDialog')
        },
        saveAsEntry: function () {
            if (!this.topicTyped || !this.descriptionTyped)
                return

            let topic = this.topicTyped
            let description = this.descriptionTyped
            let edited = this.description != '' && this.topic != ''

            let newTime = {
                date: this.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: this.time,
                topic: topic,
                description: description,
            }

            if (edited === false) {
                this.descriptionTyped = ""
                this.topicTyped = ""
                this.$emit('saveEntryEvent', newTime)
            } else {
                this.$emit('editEntryEvent', newTime)
            }

            this.closeDialog();
        },
    },
    computed: {
        sortedProjects: function () {
            if (!this.projects) 
                return []

            let arr = this.projects
            return arr.sort();
        }
    }
}
</script>

<style scoped>

</style>