<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <template v-for="(item, index) in items">
                        <v-subheader
                        v-if="item.header"
                        :key="item.header"
                        >
                        {{ item.header }}
                        </v-subheader>

                        <v-divider
                        v-else-if="item.divider"
                        :key="index"
                        ></v-divider>

                        <time-entry v-else :key="item.title" :topic="item.subtitle.topic" :color="item.subtitle.color" :description="item.subtitle.description" :time="item.subtitle.time" :seconds="item.subtitle.seconds" v-on:editEntry="editEntry" :id="item.subtitle.id" v-on:deleteEntry="deleteEntry(item.subtitle.date, item.subtitle.id)"></time-entry>
                    </template>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import TimeEntry from './TimeEntry.vue'

export default {
    components: {
      TimeEntry
    },
    props: ['items'],
    methods: {
        editEntry (entry) {
            this.$emit('editEntry', entry);
        },
        deleteEntry (date,id) {
            this.$emit('deleteEntry', {date:date, id: id})
        }
    }
}
</script>

<style scoped>
</style>