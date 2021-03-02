import Vue from "vue";
import VueRouter from "vue-router";
import FormAtor from "@/components/FormAtor.vue";
import FormDiretor from "@/components/FormDiretor.vue";
import Consultas from "@/components/Consultas";
import FormDevolucao from "@/components/FormDevolucao";
import FormLocacao from "@/components/FormLocacao";
import FormDependente from "@/components/FormDependente";
import FormSocio from "@/components/FormSocio";
import FormTitulo from "@/components/FormTitulo";
import FormItem from "@/components/FormItem";
import FormClasse from "@/components/FormClasse";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/ator"
  },
  {
    path: "/ator",
    name: "Ator",
    component: FormAtor
  },
  {
    path: "/classe",
    name: "Classe",
    component: FormClasse
  },
  {
    path: "/diretor",
    name: "Diretor",
    component: FormDiretor
  },
  {
    path: "/item",
    name: "Item",
    component: FormItem
  },
  {
    path: "/titulo",
    name: "Titulo",
    component: FormTitulo
  },
  {
    path: "/socio",
    name: "Socio",
    component: FormSocio
  },
  {
    path: "/dependente",
    name: "Dependente",
    component: FormDependente
  },
  {
    path: "/locacao",
    name: "Locacao",
    component: FormLocacao
  },
  {
    path: "/devolucao",
    name: "Devolucao",
    component: FormDevolucao
  },
  {
    path: "/consultas",
    name: "Consultas",
    component: Consultas
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
