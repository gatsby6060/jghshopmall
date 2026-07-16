import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import MainLayout from '../components/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: ProductDetailView,
        },
        {
          path: 'categories/:id',
          name: 'category-view',
          component: () => import('../views/CategoryView.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('../views/CartView.vue')
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/CheckoutView.vue')
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('../views/OrderDetailView.vue')
        },
        {
          path: 'orders',
          name: 'order-list',
          component: () => import('../views/OrderListView.vue')
        },
        {
          path: 'mypage',
          name: 'mypage',
          component: () => import('../views/MyPageView.vue')
        },
        {
          path: 'mypage/addresses',
          name: 'address-book',
          component: () => import('../views/AddressBookView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    }
  ],
})

export default router
