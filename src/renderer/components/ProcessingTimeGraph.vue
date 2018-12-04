<template>
  <div>
    <el-container>
      <el-aside width="250px">
      <h2>Functions</h2>
        <li v-for="(func, key) in functionList">
          <el-button  style="width: 100%" v-on:click="drawChart(key)">{{ func.function.functionName.replace(">","") }}</el-button>
        </li>
      </el-aside>
      <el-main>
        <bar ref="bar" :chartData="datacollection" :options="options" :height="250" />
      </el-main>
    </el-container>
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
      this.datacollection.labels = this.functionList[key].function.processList.process.map(process => process.name); 
      this.datacollection.datasets = 
        [{
        label: ["処理時間", "通信時間"] ,
        data: this.functionList[key].function.processList.process.map(process => process.processingTime),
        backgroundColor: this.functionList[key].function.processList.process.map(process => process.communication === "true"  ?  "red" : "blue")
        }];
      this.$refs.bar.renderChart(this.datacollection, this.options);
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
        legend: {
          display: false,
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
      for(const filePath in filePaths) {
          await util.promisify(fs.readFile)(filePaths[filePath], {encoding : 'utf8'})
                    .then(fileDataOfXml => this.functionList.push(parser.xml2json(fileDataOfXml)))
                    .catch(err => console.log(err));
      }
      console.table(this.functionList);
    };
    
    getFunctionInformationListFormOfJson(directoryPath);
    
    
    // ファイルが変更された場合、現在開いているグラフのみを更新するイベントの登録
    (async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      filePaths.forEach((filePath, key) => {
        const self = this;
        fs.watch(filePath, async() => {
          await getFunctionInformationListFormOfJson(directoryPath);
          if(key == self.currentFunctionNumber) {
            self.drawChart(self.currentFunctionNumber);
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


li {
 list-style: none;
}
</style>
