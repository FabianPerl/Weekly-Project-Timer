<script>
import { Doughnut, mixins } from 'vue-chartjs'
import moment from 'moment'
import momentDuration from 'moment-duration-format'
const { reactiveProp } = mixins

export default {
    data: () => ({
        options: {
            events: ['click', 'mousemove'],
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let secondsTotal = data.datasets[0].data[tooltipItem.index]
                        let projectHeader = data.labels[tooltipItem.index]
                        momentDuration(moment)
                        return projectHeader + ": " + moment.duration(secondsTotal, 'seconds').format('hh:mm:ss', { trim: false }) + " (hh:mm:ss)"
                    }
                }
            }
        }
    }),
    extends: Doughnut,
    mixins: [reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options) 
    },
    methods: {
        handleClick () {

        }
        // handleClick: function(point, event) {
        //     const item = event[0]
        //     console.log(item)
        // }
    }
}
</script>

<style scoped>

</style>