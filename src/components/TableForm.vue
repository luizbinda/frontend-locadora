<template>
  <div>
    <md-progress-bar md-mode="indeterminate" v-if="sending" />
    <md-table md-card class="margin">
      <md-table-toolbar>
        <h1 class="md-title">{{ nomeForm }}</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head v-for="(_, key) in dadosForm[0]" :key="key">
          {{ key }}
        </md-table-head>
        <md-table-head class="apagar">
          Apagar
        </md-table-head>
      </md-table-row>
      <md-table-row
        v-for="dados in dadosForm"
        :key="dados.id"
        @click="enviarEvento(dados)"
      >
        <md-table-cell v-for="(dado, key) in dados" :key="dado.id + key">
          {{ toString(dado) }}
        </md-table-cell>
        <md-table-cell class="apagar">
          <md-button
            class="md-icon-button md-accent"
            @click="deleteForm(dados)"
          >
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-snackbar :md-active.sync="userDeleted">
      {{ nomeForm }} {{ deleted.nome }} foi deletado com sucesso!
    </md-snackbar>
    <md-snackbar :md-active.sync="notFound"> {{ formError }} </md-snackbar>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        Desaja excluir {{ nomeForm }} <strong>{{ deleted.nome }}</strong> ?
      </md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-primary md-raised" @click="showDialog = false">
          fechar
        </md-button>
        <md-button
          class="md-accent md-raised"
          @click="deleteConfirm(deleted.id)"
        >
          excluir
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "TableForm",
  props: {
    dadosForm: Array,
    nomeForm: String
  },
  data() {
    return {
      sending: false,
      userDeleted: false,
      showDialog: false,
      deleted: { nome: null },
      formError: null
    };
  },
  methods: {
    enviarEvento(dados) {
      this.$emit("enviarDados", dados);
    },
    clearForm(id) {
      this.$emit("clearForm", id);
    },
    async deleteForm(dados) {
      this.deleted = dados;
      this.showDialog = true;
    },
    async deleteConfirm(id) {
      this.sending = true;
      await api
        .delete(`/${this.nomeForm}/${id}`)
        .then(() => {
          this.userDeleted = true;
          this.sending = false;
          this.clearForm(id);
          this.showDialog = false;
        })
        .catch(error => {
          this.errorResponse(error.response.data.errors[0]);
        });
    },
    errorResponse(error) {
      this.formError = error;
      this.sending = false;
      this.notFound = true;
      this.showDialog = false;
    },
    toString(dado) {
      if (dado instanceof Array) {
        return dado.map(dado => dado.nome).toString();
      } else if (dado instanceof Object) {
        return dado.nome;
      } else {
        return dado;
      }
    }
  }
};
</script>

<style scoped>
.md-table .md-table-cell {
  cursor: pointer;
}

.apagar {
  text-align: right;
}

h1:first-letter {
  text-transform: capitalize;
}
</style>
