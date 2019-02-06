<template>
  <div>
  <el-container>
    <el-main>
      <div v-if="Devices.length > 0">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名前">
          </el-table-column>
          <el-table-column
            prop="recovery"
            label="回復性">
          </el-table-column>
          <el-table-column
            prop="confidentiality"
            label="機密性">
          </el-table-column>
          <el-table-column
            prop="maintainability"
            label="保守性">
          </el-table-column>
          <el-table-column
            prop="modularity"
            label="モジュール性">
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
  </div>
</template>

<script>
import fs from 'fs'
import util from 'util'
import parser from 'xml2json-light'


export default {
  
  data () {
    return {
      loadFiles: true,
      selectedNumber: 0,
      Devices: [],
      tableData: []
    }
  },
  
  methods: {
    
    clearTableLists: function() {
      this.tableData = [];
    },
    
    renderDeviceTable: function() {
      this.Devices.forEach(device => this.tableData.push({name: device.deviceName.replace(">",""),
                                                          recovery: device.recovery,
                                                          confidentiality: device.confidentiality,
                                                          maintainability: device.maintainability,
                                                          modularity: device.modularity}));
    },
    
    makeDevicesTalbe: function() {
      this.renderDeviceTable();
    },

  },
  
  mounted() {
    const directoryPath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/EachQualityEvaluationResult/';
    
    const getFilePaths = async (directroyPath) =>  {
      return await util.promisify(fs.readdir)(directoryPath)
                       .then(Pathlist => Pathlist.map(path => directoryPath + path));
    }
    
    const getQualityList = async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      for(const filePath in filePaths) {
        const fileDataFormOfXml = await util.promisify(fs.readFile)(filePaths[filePath], {encoding : 'utf8'})
        const fileDataFormOfJson = parser.xml2json(fileDataFormOfXml);
        this.Devices.push(fileDataFormOfJson.device);
      }
      this.makeDevicesTalbe();
      console.table(this.Devices);
    };
    
    getQualityList(directoryPath);
    
     // ファイルが変更された場合、現在開いているテーブルの更新を行う
    fs.watch(directoryPath, async() => {
      if(this.loadFiles === true) {
        this.loadFiles = false;
        setTimeout(() => this.loadFiles = true, 1000);
        await getRecommendListFormOfJson(directoryPath);
      }
    });
  },
    
}
</script>
