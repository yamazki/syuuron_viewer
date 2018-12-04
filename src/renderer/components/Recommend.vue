<template>
  <div>
  <el-container>
    <el-aside width="250px">
      <h2>Devices</h2>
      <li v-for="(deviceName, key) in deviceNames">
        <el-button style="width: 100%" v-on:click="showRecommendDevices(key); renderDeviceTable();">{{ deviceName.replace(">","") }}</el-button>
      </li>
      <h2>Communications</h2>
      <li v-for="(communicationName, key) in communicationNames">
        <el-button style="width: 100%" v-on:click="showRecommendCommunications(key); renderCommunicationTable()">{{ communicationName.replace(">","") }}</el-button>
      </li>
    </el-aside>
    <el-main>
      <div v-if="showDevices.length > 0">
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
      <div v-if="showCommunications.length > 0">
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
      deviceNames: [],
      communicationNames: [],
      recommendDevices: [],
      recommendCommunications: [],
      recommendSoftware: [],
      showDevices: [],
      showCommunications: [],
      tableData: []
    }
  },
  
  methods: {
    clearShowLists: function() {
      this.showDevices = [];
      this.showCommunications = [];
      this.tableData = [];
    },
    
    renderDeviceTable: function() {
      this.showDevices.forEach(device => this.tableData.push({name: device.name,
                                                              cpu: device.cpu,
                                                              memory: device.memory}));
    },
    
    renderCommunicationTable: function() {
      this.showCommunications.forEach(communication => this.tableData.push({name: communication.name,
                                                                     distance: communication.distance,
                                                                     speed: communication.speed,
                                                                     powerSaving: communication.powerSaving}));
    },
    
    showRecommendDevices: function(key) {
      this.clearShowLists();
      // 条件を満たすDeviceの数により型が変動,xml2json-lightの仕様
      // 0 -> undefined
      // 1 -> Object
      // 2以上 -> Array
      const Devices = this.recommendDevices[key].recommendList.recommendDeviceList.recommendDevice;
      if(typeof Devices === "undefined") {
        this.showDevices = [];
      }
      else if(Devices instanceof Array) {
        this.showDevices= Devices;
        console.table(this.showDevices);
      }
      else {
        this.showDevices = [Devices];
      }
    },

    showRecommendCommunications: function(key) {
      this.clearShowLists();
      // 条件を満たすDeviceの数により型が変動,xml2json-lightの仕様
      // 0 -> undefined
      // 1 -> Object
      // 2以上 -> Array
      const Communications = this.recommendCommunications[key].recommendList.recommendCommunicationList.recommendCommunication;
      if(typeof Communications === "undefined") {
        this.showCommunications = [];
      }
      else if(Communications instanceof Array) {
        this.showCommunications = Communications
      }
      else {
        this.showCommunications = [Communications];
      }
    }
  },
  
  mounted() {
    const directoryPath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/RecommendationResult/';
    
    const getFilePaths = async (directroyPath) =>  {
      return await util.promisify(fs.readdir)(directoryPath)
                       .then(Pathlist => Pathlist.map(path => directoryPath + path));
    }
    
    const getFunctionInformationListFormOfJson = async (directoryPath) => {
      const filePaths  = await getFilePaths(directoryPath);
      for(const filePath in filePaths) {
          const fileDataOfXml = await util.promisify(fs.readFile)(filePaths[filePath], {encoding : 'utf8'})
          const fileDataOfJson = parser.xml2json(fileDataOfXml, {arrayNotation: true});
          const fileDataType = fileDataOfJson.recommendList.type;
          switch(fileDataType) {
            case "device": 
              this.recommendDevices.push(fileDataOfJson);
              this.deviceNames.push(fileDataOfJson.recommendList.targetDeviceName);
              break;
            case "communication": 
              this.recommendCommunications.push(fileDataOfJson);
              this.communicationNames.push(fileDataOfJson.recommendList.targetCommunicationName);
              break;
            case "node": 
              this.RecommendSoftware.push(fileDataOfJson);
              break;
          }
      }
      console.table(this.recommendDevices);
      console.table(this.recommendCommunications);
    };
    
    getFunctionInformationListFormOfJson(directoryPath);
    
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

<suyle>
</style>
