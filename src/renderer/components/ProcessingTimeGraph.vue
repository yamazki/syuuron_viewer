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
      this.selectedFunctionNumber = key;
      this.options.title.text = this.functionList[key].function.functionName.replace(">","") 
                               +",  "
                               +"総処理時間"
                               + this.functionList[key].function.totalProcessingTime;
      this.datacollection.labels = this.functionList[key].function.processList.process.map(process => process.name); 
      this.datacollection.datasets = 
        [{
        label: ["処理時間", "通信時間"] ,
        data: this.functionList[key].function.processList.process.map(process => process.processingTime),
        backgroundColor: this.functionList[key].function.processList.process.map(process => process.communication === "True" ? "red" : "blue")
        }];
      this.$refs.bar.renderChart(this.datacollection, this.options);
    },
  },
  
  
  data () {
    return {
      functionList: [],
      selectedFunctionNumber: 0,
      loadFiles: true,
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
      const functionInformationList = []; 
      for(let key in filePaths) {
        await util.promisify(fs.readFile)(filePaths[key], {encoding : 'utf8'})
                  .then(xmlFileData => functionInformationList.push(parser.xml2json(xmlFileData)))
                  .catch(err => console.log(err));
      }
      this.functionList = functionInformationList;
      return functionInformationList;
    };
    
    getFunctionInformationListFormOfJson(directoryPath);
    
    // ファイルが変更された場合、現在開いているグラフのみを更新するイベントの登録
    fs.watch(directoryPath, async() => {
      if(this.loadFiles === true) {
        this.loadFiles = false;
        setTimeout(() => this.loadFiles = true, 1000);
        await getFunctionInformationListFormOfJson(directoryPath);
        this.drawChart(this.selectedFunctionNumber);
      }
    });
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
