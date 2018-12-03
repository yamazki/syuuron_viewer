<template>
  <div>
    <el-aside width="200px">
      
    </el-aside>
    <el-main>
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
      functionList: [],
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
      const functionInformationList = []; 
      for(let key in filePaths) {
          await util.promisify(fs.readFile)(filePaths[key], {encoding : 'utf8'})
                    .then(xmlFileData => functionInformationList.push(parser.xml2json(xmlFileData)))
                    .catch(err => console.log(err));
      }
      this.functionList = functionInformationList;
      console.table(this.functionList);
      return functionInformationList;
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
