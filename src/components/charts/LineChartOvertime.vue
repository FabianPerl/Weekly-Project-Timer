<script>
import { Line, mixins } from 'vue-chartjs'
import moment from 'moment'
import momentDuration from 'moment-duration-format'

const { reactiveProp } = mixins

export default {
    data: () => ({
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 0.5,
                        callback: function(value) {
                            return value + " h";
                        }
                    },
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        let number = tooltipItem.yLabel;

                        momentDuration(moment)
                        return moment.duration(number, 'hours').format('hh:mm:ss', { trim: false }) + " (hh:mm:ss)"
                    }
                }
            }
        }
    }),
    extends: Line,
    mixins: [reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options)
    },
}
</script>

<style>

</style>