<script>
import { Bar, mixins } from 'vue-chartjs'
export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ['charData', 'options'],

  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  
  watch: {
    chartData: function() {
      this.renderChart(this.chartData, this.options)
    },
    options: function() {
      this.renderChart(this.chartData, this.options)
    },
    deep: true
  },
  
}
</script>
