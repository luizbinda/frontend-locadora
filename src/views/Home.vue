<template>
  <div class="home">
    <Modal title="Ator">
      <FormAtor />
    </Modal>
    <Modal title="Classe">
      <FormClasse />
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import FormAtor from "@/components/FormAtor";
import FormClasse from "@/components/FormClasse";
export default {
  name: "Home",
  components: { FormClasse, FormAtor, Modal }
};
</script>

<style>
.home {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>
