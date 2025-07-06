import { createRouter, createWebHistory } from "vue-router";
import useAuth from '../composables/useAuth';

const routes = [
 {
  path: "/saveTheCard",
  name: "home",
  component: () => import("../views/CardsView.vue"),
 },
 {
  path: "/cards",
  name: "cards",
  component: () => import("../views/CardsView.vue"),
 },
 {
  path: "/cards/new",
  name: "new-card",
  component: () => import("../views/NewCardView.vue"),
 },
 {
  path: "/cards/:id",
  name: "card-detail",
  component: () => import("../views/CardDetailView.vue"),
 },
 {
  path: "/cards/:id/edit",
  name: "edit-card",
  component: () => import("../views/EditCardView.vue"),
 },
];

const router = createRouter({
 history: createWebHistory(),
 routes,
});

// Protezione: richiede login Google su tutte le pagine
router.beforeEach((to, from, next) => {
  const { token } = useAuth();
  next();
});

export default router;
