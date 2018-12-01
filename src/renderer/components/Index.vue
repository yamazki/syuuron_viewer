<template>
  <div>
    <div class="sideBar">
      <ul>
        <li v-for="func in functionList">{{ func.function.functionName.replace(">","") }}</li>
      </ul>
    </div>
    <div class="graph">
      <bar ref="bar" :chartData="datacollection" :options="options" :height="100" />
    </div>
    <button v-on:click="pu"> test</button>
  </div>
</template>

<script>
import fs from 'fs'
import util from 'util'
import parser from 'xml2json-light'
import Bar from '@/components/Bar'


export default {
  
  components: {
    Bar,
  },
  
  
  methods: {
    pu: function() {
      this.datacollection.labels.push("test");
      console.table(this.datacollection.labels);
      this.$refs.bar.renderChart(this.datacollection, this.options);
    }
  },
  
  data () {
    return {
      functionList: [],
      datacollection: {
        labels: ['赤', '青', '黄色', '緑', '紫', '橙'],
        datasets: [
          {
            label: '得票数',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    }
  },
  
  mounted() {
    const directoryPath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/EvaluationResult/';
    
    const getFunctionInformationListFormOfJson = async (DirectoryPath) => {
      const filePathList = await util.promisify(fs.readdir)(directoryPath)
                                     .then(Pathlist => Pathlist.map(path => directoryPath + path));
      const functionInformationList = []; 
      for(let key in filePathList) {
          await util.promisify(fs.readFile)(filePathList[key], {encoding : 'utf8'})
                    .then(xmlFileData => functionInformationList.push(parser.xml2json(xmlFileData)))
                    .catch(err => console.log(err));
      }
      this.functionList = functionInformationList;
      console.table(this.functionList);
      return functionInformationList;
    };
    
    getFunctionInformationListFormOfJson(directoryPath);
    
  },
}

</script>

<style>
html, body, sideBar {
  height: 100%;
}
sideBar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
