<template>
  <div>
  <el-container>
    <el-aside width="250px">
      <h2>Devices</h2>
      <li v-for="(deviceName, key) in recommendDeviceNames">
        <el-button style="width: 100%" v-on:click="makeRecommendDevicesTalbe(key); renderDeviceTable();">
          {{ deviceName.replace(">","") }}
        </el-button>
      </li>
      <h2>Communications</h2>
      <li v-for="(communicationName, key) in recommendCommunicationNames">
        <el-button style="width: 100%" v-on:click="makeRecommendCommunicationTable(key); renderCommunicationTable()">
          {{ communicationName.replace(">","") }}
        </el-button>
      </li>
    </el-aside>
    <el-main>
      <div v-if="tableDevices.length > 0">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Name"
            width="180">
          </el-table-column>
          <el-table-column
            prop="cpu"
            label="CPU"
            width="180">
          </el-table-column>
          <el-table-column
            prop="memory"
            label="Memory">
          </el-table-column>
        </el-table>
      </div>
      <div v-if="tableCommunications.length > 0">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Name"
            width="180">
          </el-table-column>
          <el-table-column
            prop="distance"
            label="Distance"
            width="180">
          </el-table-column>
          <el-table-column
            prop="speed"
            label="Speed">
          </el-table-column>
          <el-table-column
            prop="powerSaving"
            label="PowerSaving">
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
      loadFileFlag: true,
      recommendDeviceNames: [],
      recommendCommunicationNames: [],
      recommendDevices: [],
      recommendCommunications: [],
      recommendSoftware: [],
      recommendSoftwareNames: [],
      tableDevices: [],
      tableCommunications: [],
      tableData: []
    }
  },
  
  methods: {
    clearTableLists: function() {
      this.tableDevices = [];
      this.tableCommunications = [];
      this.tableData = [];
    },
    
    renderDeviceTable: function() {
      this.tableDevices.forEach(device => this.tableData.push({name: device.name,
                                                              cpu: device.cpu,
                                                              memory: device.memory}));
    },
    
    renderCommunicationTable: function() {
      this.tableCommunications.forEach(communication => this.tableData.push({name: communication.name,
                                                                     distance: communication.distance,
                                                                     speed: communication.speed,
                                                                     powerSaving: communication.powerSaving}));
    },
    
    makeRecommendDevicesTalbe: function(key) {
      this.clearTableLists();
      // 条件を満たすDeviceの数により型が変動,xml2json-lightの仕様
      // 0 -> undefined
      // 1 -> Object
      // 2以上 -> Array
      const Devices = this.recommendDevices[key].recommendList.recommendDeviceList.recommendDevice;
      if(typeof Devices === "undefined") {
        this.tableDevices = [];
      }
      else if(Devices instanceof Array) {
        this.tableDevices= Devices;
      }
      else {
        this.tableDevices = [Devices];
      }
    },

    makeRecommendCommunicationTable: function(key) {
      this.clearTableLists();
      // 条件を満たすDeviceの数により型が変動,xml2json-lightの仕様
      // 0 -> undefined
      // 1 -> Object
      // 2以上 -> Array
      const Communications = this.recommendCommunications[key].recommendList.recommendCommunicationList.recommendCommunication;
      if(typeof Communications === "undefined") {
        this.tableCommunications = [];
      }
      else if(Communications instanceof Array) {
        this.tableCommunications = Communications
      }
      else {
        this.tableCommunications = [Communications];
      }
    }
  },
  
  mounted() {
    const directoryPath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/RecommendationResult/';
    
    const getFilePaths = async (directroyPath) =>  {
      return await util.promisify(fs.readdir)(directoryPath)
                       .then(Pathlist => Pathlist.map(path => directoryPath + path));
    }
    
    const getRecommendListFormOfJson = async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      const recommendDevices = [];
      const recommendDeviceNames = [];
      const recommendCommunications = [];
      const recommendCommunicationNames = [];
      const recommendSoftware = [];
      const recommendSoftwareNames= [];
      for(const filePath in filePaths) {
          const fileDataFormOfXml = await util.promisify(fs.readFile)(filePaths[filePath], {encoding : 'utf8'})
          const fileDataFormOfJson = parser.xml2json(fileDataFormOfXml);
          const fileDataType = fileDataFormOfJson.recommendList.type;
          switch (fileDataType) {
            case "device": 
              recommendDevices.push(fileDataFormOfJson);
              recommendDeviceNames.push(fileDataFormOfJson.recommendList.targetDeviceName);
              break;
            case "communication": 
              recommendCommunications.push(fileDataFormOfJson);
              recommendCommunicationNames.push(fileDataFormOfJson.recommendList.targetCommunicationName);
              break;
            case "node": 
              RecommendSoftware.push(fileDataFormOfJson);
              break;
          }
      }
      this.recommendDevices = recommendDevices;
      this.recommendDeviceNames = recommendDeviceNames;
      this.recommendCommunications = recommendCommunications;
      this.recommendCommunicationNames = recommendCommunicationNames;
      this.recommendSoftware = recommendSoftware;
      this.recommendSoftwareNames = recommendSoftwareNames;
      console.table(this.recommendDeviceNames);
    };
    
    getRecommendListFormOfJson(directoryPath);
    
    
     // ファイルが変更された場合、現在開いているテーブルの更新を行う
     (async (directoryPath) => {
       const filePaths  = await getFilePaths(directoryPath);
       filePaths.forEach((filePath, key) => {
         const self = this;
         fs.watch(filePath, async() => {
          if(self.loadFileFlag === true) {
            self.loadFileFlag = false;
            setTimeout(() => self.loadFileFlag = true, 1000);
            await getRecommendListFormOfJson(directoryPath);
          }
         });
       });
     })();
    
  },
    
}
</script>

<suyle>
</style>
