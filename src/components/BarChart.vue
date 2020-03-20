<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    data: () => ({
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            }
        }
    }),
    extends: Bar,
    mixins: [reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}
</script>

<style>

</style>