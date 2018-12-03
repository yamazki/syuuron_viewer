<template>
  <div id="app">
  <el-menu :router="true"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
    <el-menu-item index="1" :route="{name:'processingtimegraph-page'}">処理時間評価機能</el-menu-item>
    <el-menu-item index="2" :route="{name:'recommend-page'}">推薦機能</el-menu-item>
  </el-menu>       
  <router-view> </router-view>
  </div>
</template>

<script>
  export default {
    name: 'viewer'
  }
</script>

<style>

</style>
