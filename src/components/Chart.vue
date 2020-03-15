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
        console.log('directly in chart mounted')
        console.log(this.chartdata)
        this.renderChart(this.chartdata, this.options)
    },
    watch: {
        chartdata () {
            this.$data._chart.destroy()
            console.log('directly in chart watch')
            console.log(this.chartdata)
            this.renderChart(this.chartdata, this.options)
        }
    }
}
</script>

<style scoped>

</style>