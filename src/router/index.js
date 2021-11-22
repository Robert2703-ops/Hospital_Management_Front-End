import Vue from 'vue'
import Router from 'vue-router'

// Routes componetns 
import MainContent from '@/components/Patients'
import changePatient from '@/components/ChangePatient'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainContent
    },
    {
      path: '/changePatient/:id',
      name: 'change-patient-info',
      component: changePatient
    }
  ]
})
