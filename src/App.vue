<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import MainContent from './components/Patients'
import changePatient from './components/ChangePatient'

import VueRouter from 'vue-router'

export default {
  name: 'App',
  components: {
    MainContent,
    changePatient
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;

  display: flex;
}
</style>
