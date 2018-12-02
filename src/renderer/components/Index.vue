<template>
  <div>
    <div class="sideBar">
      <li v-for="(func, key) in functionList">
        <el-button v-on:click="drawChart(key)">{{ func.function.functionName.replace(">","") }}</el-button>
        
      </li>
    </div>
    <div class="graph">
      <bar ref="bar" :chartData="datacollection" :options="options" :height="200" />
    </div>
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
    drawChart: function(key) {
      this.currentFunctionNumber = key;
      this.options.title.text = this.functionList[key].function.functionName.replace(">","") 
                               +",  "
                               +"総処理時間"
                               + this.functionList[key].function.totalProcessingTime;
      this.functionList[key].function.processList.process.forEach(process => this.datacollection.labels.push(process.name));
      this.datacollection.datasets = 
        [{
        label: '処理時間',
        data: this.functionList[key].function.processList.process.map(process => process.processingTime)
        }];
      this.$refs.bar.renderChart(this.datacollection, this.options);
      this.datacollection.labels = [];
    },
  },
  
  
  data () {
    return {
      functionList: [],
      currentFunctionNumber: 0,
      datacollection: {
        labels: [],
        datasets: [],
      },
      options: {
        title: {
          display: true,
          text: '' 
        },
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
    
    const getFilePaths = async (directroyPath) =>  {
      return await util.promisify(fs.readdir)(directoryPath)
                       .then(Pathlist => Pathlist.map(path => directoryPath + path));
    }
    
    const getFunctionInformationListFormOfJson = async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      const functionInformationList = []; 
      for(let key in filePaths) {
          await util.promisify(fs.readFile)(filePaths[key], {encoding : 'utf8'})
                    .then(xmlFileData => functionInformationList.push(parser.xml2json(xmlFileData)))
                    .catch(err => console.log(err));
      }
      this.functionList = functionInformationList;
      console.table(this.functionList);
      return functionInformationList;this.currentFunctionNumber
    };
    
    getFunctionInformationListFormOfJson(directoryPath);
    
    
    // ファイルが変更された場合、対応するグラフの要素を更新
    ( async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      filePaths.forEach((filePath, key) => {
        const vue = this;
        fs.watch(filePath, async() => {
          await getFunctionInformationListFormOfJson(directoryPath);
          if(key == vue.currentFunctionNumber) {
            vue.drawChart(vue.currentFunctionNumber);
          }
        });
      });
    })();
    
  },
}

</script>

<style>
html, body {
  height: 100%;
}

.sideBar {
  float: left;
  width: 20%;
}

.graph {
  float: right;
  width: 70%;
}

li {
 list-style: none;
}
</style>
