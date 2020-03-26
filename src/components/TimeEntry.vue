<template>

        <v-list-item
        inactive
        ripple
        >
            <v-list-item-icon></v-list-item-icon>
            <v-list-item-content >
                <v-list-item-subtitle>
                    <span width='200' class='font-weight-bold'>{{ time }}</span> &mdash; {{ topic }} &mdash; {{ description }}
                </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-btn icon text color="gray lighten-2" @click="dialog = true">
                    <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
            </v-list-item-action>
            <v-list-item-action>
                <v-btn icon text color="gray lighten-2" @click="deleteEntry">
                    <v-icon light>mdi-delete</v-icon>
                </v-btn>
            </v-list-item-action>
            <entry-dialog title="Edit Entry" :dialog="dialog" :time="time" v-on:closeDialog="dialog = false" :date="date" :description="description" :topic="topic" v-on:editEntryEvent="editEntry"></entry-dialog>
        </v-list-item>
</template>

<script>
import EntryDialog from './EntryDialog'

export default {
    components: { EntryDialog },
    name: 'TimeEntry',
    props: ['time', 'topic', 'description', 'id', 'seconds', 'color'],
    data: () => ({
        dialog: false,
        date: new Date(),
    }),
    methods: {
        editEntry (entry) {
            entry.id = this.id
            entry.seconds = this.seconds
            entry.color = this.color
            this.$emit('editEntry', entry)
        },
        deleteEntry () {
            this.$emit('deleteEntry')
        }
    }
}
</script>

<style scoped>

</style>