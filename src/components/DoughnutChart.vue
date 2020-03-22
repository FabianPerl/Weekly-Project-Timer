<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    data: () => ({
        options: {
            events: ['click', 'mousemove'],
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        console.log(data)
                        let secondsTotal = data.datasets[0].data[tooltipItem.index]
                        var hours   = Math.floor(secondsTotal / 3600);
                        var minutes = Math.floor((secondsTotal - (hours * 3600)) / 60);
                        var seconds = secondsTotal - (hours * 3600) - (minutes * 60);

                        let projectHeader = data.labels[tooltipItem.index]

                        return projectHeader + ": " + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + " (hh:mm:ss)"
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