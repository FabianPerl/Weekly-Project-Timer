<script>
import { Doughnut } from 'vue-chartjs'

export default {
    extends: Doughnut,
    props: {
        chartdata: {
            default: null
        },
        options: {
            default: null
        },
    },
    mounted () {
        this.renderChart(this.chartdata, this.options)
    },
    watch: {
        chartdata () {
            this.$data._chart.destroy()
            this.renderChart(this.chartdata, this.options)
        }
    }
}
</script>

<style scoped>

</style>