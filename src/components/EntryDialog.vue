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
                    <div>{{ time }}</div>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12">
                    <!-- TODO: https://vuetifyjs.com/en/components/combobox/ -->
                    <v-combobox
                        v-model="topicTyped"
                        :items="projects || []"
                        full-width
                        hide-details
                        @keyup.enter=saveAsEntry
                        hide-no-data
                        hide-selected
                        deletable-chips
                        single-line
                        label="Topic*"
                        :rules="rules.ruleOne"
                    ></v-combobox>
                    <!-- <v-text-field label="Topic*" v-model="topicTyped" type="text" :rules="rules.ruleOne"></v-text-field> -->
                    <v-text-field label="Description*" @keyup.enter="saveAsEntry" v-model="descriptionTyped" type="text" :rules="rules.ruleOne"></v-text-field>
                </v-col>
            </v-row>
        </v-container>
        <small>*indicates required field</small>
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
    }
}
</script>

<style scoped>

</style>