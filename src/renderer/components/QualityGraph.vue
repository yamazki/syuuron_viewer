<template>
  <div>
    <radar ref="radar" :chartData="datacollection" :options="options" :height="250" />
  </div>
</template>

<script>
import fs from 'fs'
import util from 'util'
import parser from 'xml2json-light'
import Radar from '@/components/Radar'
export default {
  
  components: {
    Radar,
  },
  
  data () {
    return {
      quality: [],
      datacollection: {
        labels: ['回復性', '機密性', '保守性', 'モジュール性'],
        datasets: [
          {
            label: "あなたのシステム",
            data: []
          },
         // {
         //   label: "レーダーチャート",
         //   data: []
         // }
        ],
      },
      
      options: {
        //スケールの設定
        scale: {
          pointLabels: {
            fontSize: 15,
          },
          ticks: {
            // 目盛り値のカスタマイズ
            stepSize: 1,
            // 最小値の値を0指定
            beginAtZero:true,
            min: 0,
            // 最大値を指定
            max: 5,
          }
        }
      },
    };
  },
  
  methods: {
    drawChart: function() {
      this.datacollection.datasets[0].data.push(this.quality.recovery *1);
      this.datacollection.datasets[0].data.push(this.quality.confidentiality.replace(">","") *1); 
      this.datacollection.datasets[0].data.push(this.quality.maintainability *1); 
      this.datacollection.datasets[0].data.push(this.quality.modularity *1);
      
      this.$refs.radar.renderChart(this.datacollection, this.options);
    },
  },
  
  mounted() {
    const filePath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/ComprehensiveQualityEvaluationResult/quality.xml';
    
    const loadQualityInfo = async (filepath) => {
        const qualityXml = await util.promisify(fs.readFile)(filePath, {encoding : 'utf8'});
        const qualityJson = await parser.xml2json(qualityXml);
        this.quality = qualityJson.quality;
    } 
    
    fs.watch(filePath, async() => {
      await loadQuality(filePath);
      this.drawChart();
    });
    
    (async () => {
      await loadQualityInfo(filePath).catch(err => console.log(err));
      this.drawChart();
    })();
    
  }
}
</script>
