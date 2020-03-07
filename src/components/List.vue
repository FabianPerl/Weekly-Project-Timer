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
                            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
         //TODO: Subtitles have to be on the same point at the beginning
         //TODO: Left: List, Right: Chart? Picking each weeks chart via dropdown box? Not just weekly clearing instead let it in
         items: [
          {
            header: 'Friday, 06.03.2020',
          },
          { divider: true },
          {
            subtitle:
              "<span width='200' class='font-weight-bold'>07:45:13</span> &mdash; Project A &mdash; Implementing Backend",
          },
          {
            subtitle:
              "<span class='test font-weight-bold'>02:13:20</span> &mdash; Project B &mdash; Changing Frontend",
          },
          {
            subtitle:
              "<span class='font-weight-bold'>01:05:56</span> &mdash; Project C &mdash; Editing Docu",
          },
          {
            header: 'Thursday, 05.03.2020',
          },
          { divider: true },
          {
            subtitle:
              "<span width='200' class='font-weight-bold'>07:45:13</span> &mdash; Project A &mdash; Implementing Backend",
          },
          {
            subtitle:
              "<span class='test font-weight-bold'>02:13:20</span> &mdash; Project B &mdash; Changing Frontend",
          },
          {
            subtitle:
              "<span class='font-weight-bold'>01:05:56</span> &mdash; Project C &mdash; Editing Docu",
          },
          {
            header: 'Wednesday, 04.03.2020',
          },
          { divider: true },
          {
            subtitle:
              "<span width='200' class='font-weight-bold'>07:45:13</span> &mdash; Project A &mdash; Implementing Backend",
          },
          {
            header: 'Tuesday, 03.03.2020',
          },
          { divider: true },
          {
            subtitle:
              "<span width='200' class='font-weight-bold'>07:45:13</span> &mdash; Project A &mdash; Implementing Backend",
          },
          {
            subtitle:
              "<span class='test font-weight-bold'>02:13:20</span> &mdash; Project B &mdash; Changing Frontend",
          },
          {
            subtitle:
              "<span class='font-weight-bold'>01:05:56</span> &mdash; Project C &mdash; Editing Docu",
          },
          {
            header: 'Monday, 02.03.2020',
          },
          { divider: true },
          {
            subtitle:
              "<span width='200' class='font-weight-bold'>07:45:13</span> &mdash; Project A &mdash; Implementing Backend",
          },
          {
            subtitle:
              "<span class='test font-weight-bold'>02:13:20</span> &mdash; Project B &mdash; Changing Frontend",
          },
        ],
    }),
    methods: {
        created() {
            // if its monday and running app first time, save it in the database and clean the list
        },
    }
}
</script>

<style>
</style>