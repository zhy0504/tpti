import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Quiz from '@/views/Quiz.vue'
import Result from '@/views/Result.vue'
import Knowledge from '@/views/Knowledge.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: Knowledge
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
