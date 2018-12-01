<template>
  <div>
    <div class="main">
      <h1>Hello electron-vue. My name is {{ name }}</h1>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import util from 'util'
import parser from 'xml2json-light'

export default {
  data () {
    return {
      name: 'hoge'
    }
  },
  mounted:function () {
    const filePath = 'C:/Users/ma17123/source/repos/syuuron/syuuron/XML/温度データ保存機能.xml';
    util.promisify(fs.readFile)(filePath, {encoding : 'utf8'})
        .then(data => console.table(parser.xml2json(data)))
        .catch(err => console.log(err));
  },
}
</script>

<style>
html, body, main {
  height: 100%;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
