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
      datacollection: {
        labels: ['Running', 'Swimming', 'Eating', 'Cycling', ''],
        datasets: [
          {
            label: "レーダーチャート",
            data: [6, 12, 10, 18, 2]
          },
          {
            label: "レーダーチャート",
            data: [6, 12, 10, 18, 12]
          }
        ],
      },
      options: {
        pointLabelFontSize : 12,
        scaleOverride : true,
        scaleSteps : 8,
        scaleStepWidth : 2,
        scaleStartValue : 0
      },
    };
  }
}
</script>
