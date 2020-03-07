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

                        <v-list-item
                        v-else
                        :key="item.title"
                        ripple
                        >
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-subtitle>
                              <time-entry :topic="item.subtitle.topic" :description="item.subtitle.description" :time="item.subtitle.time"></time-entry>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
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
}
</script>

<style>
</style>