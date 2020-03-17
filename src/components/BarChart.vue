<script>
import { Bar } from 'vue-chartjs'

export default {
    data: () => ({
        chartdata: {
            labels: ['Spent','Available'],
            datasets: [
                {
                label: 'Week 1',
                backgroundColor: ['#f87979', 'green'],
                data: [35, 6],
                barThickness: 50,
                }
            ]
        },
        options: {
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
    mounted () {
        this.renderChart(this.chartdata, this.options)
    }
}
</script>

<style>

</style>