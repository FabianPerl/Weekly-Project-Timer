<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    mounted () {
        this.renderChart(this.chartData, {events: ['click', 'mousemove'], responsive: true, onClick: this.handleClick})
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