<template>
  <div class="home">
    <div class="colun">
      <Modal title="Ator">
        <FormAtor />
      </Modal>
      <Modal title="Classe">
        <FormClasse />
      </Modal>
      <Modal title="Diretor">
        <FormDiretor />
      </Modal>
      <Modal title="Item">
        <FormItem />
      </Modal>
      <Modal title="Titulo">
        <FormTitulo />
      </Modal>
    </div>
    <div class="colun">
      <Modal title="Sócio">
        <FormSocio />
      </Modal>
      <Modal title="Dependente">
        <FormDependente />
      </Modal>
      <Modal title="Locação">
        <FormLocacao />
      </Modal>
      <Modal title="Devolução">
        <FormDevolucao />
      </Modal>
      <Modal title="Consultas">
        <Consultas />
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import FormAtor from "@/components/FormAtor";
import FormClasse from "@/components/FormClasse";
import FormDiretor from "@/components/FormDiretor";
import FormItem from "@/components/FormItem";
import FormTitulo from "@/components/FormTitulo";
import FormSocio from "@/components/FormSocio";
import FormDependente from "@/components/FormDependente";
import FormLocacao from "@/components/FormLocacao";
import FormDevolucao from "@/components/FormDevolucao";
import Consultas from "@/components/Consultas";
export default {
  name: "Home",
  components: {
    Consultas,
    FormDevolucao,
    FormLocacao,
    FormDependente,
    FormSocio,
    FormTitulo,
    FormItem,
    FormDiretor,
    FormClasse,
    FormAtor,
    Modal
  }
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.colun {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>
