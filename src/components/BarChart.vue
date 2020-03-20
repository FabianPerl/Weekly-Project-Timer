<script>
import { Bar, mixins } from 'vue-chartjs'
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
                        stepSize: 0.5 
                    },
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        let number = tooltipItem.yLabel;
                        var decimalTime = number
                        decimalTime = decimalTime * 60 * 60;
                        var hours = Math.floor((decimalTime / (60 * 60)));
                        decimalTime = decimalTime - (hours * 60 * 60);
                        var minutes = Math.floor((decimalTime / 60));
                        return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + " (hh:mm)"
                    }
                }
            }
        }
    }),
    extends: Bar,
    mixins: [reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options)
    },
}
</script>

<style>

</style>