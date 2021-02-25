<template>
  <div class="md-app-content">
    <form novalidate class="md-layout" @submit.prevent="saveForm">
      <md-card class="md-layout-item">
        <md-card-content>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('numSerie')">
              <label>Número de Série</label>
              <md-input v-model="form.numSerie" :disabled="sending" />
              <md-button class="md-primary md-raised" @click="getItem">
                Buscar
              </md-button>
            </md-field>
          </div>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
      <md-snackbar :md-active.sync="formSaved">
        Item devolvido com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="notFound">
        {{ url }} não encontrada!
      </md-snackbar>
    </form>
    <md-card class="md-layout-item" v-if="dadosLocacao">
      <div class="card-cliente">
        <span>Cliente: </span>
        <p>{{ dadosLocacao.cliente.nome }}</p>
      </div>
      <div class="card-cliente">
        <span>Valor: </span>
        <p>{{ dadosLocacao.valor }}R$</p>
      </div>
      <div class="card-cliente">
        <span>Data de Devolução: </span>
        <p>
          {{ dataDevolucao }}
        </p>
      </div>
      <md-card-actions>
        <md-button
          type="submit"
          class="md-primary md-raised"
          :disabled="sending"
          v-if="dadosLocacao"
        >
          Devolver
        </md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength } from "vuelidate/lib/validators";
import { api } from "@/api";

export default {
  name: "FormDevolucao",
  mixins: [validationMixin],
  data: () => ({
    url: "locacao",
    showDialog: false,
    dadosLocacao: null,
    form: {
      numSerie: null
    },
    formSaved: false,
    notFound: false,
    userDeleted: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      numSerie: {
        minLength: minLength(1)
      }
    }
  },
  computed: {
    dataDevolucao() {
      return new Date(this.dadosLocacao.data_devolucao_prevista).toLocaleString(
        "pt-br"
      );
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      for (let formKey in this.form) {
        this.form[formKey] = null;
      }
    },
    async saveForm() {
      this.sending = true;
      await api.post("devolucao", { id: this.dadosLocacao.id });
      this.dadosLocacao = null;
      this.sending = false;
      this.formSaved = true;
    },
    async deleteForm() {
      this.sending = true;
      await api.delete(`/${this.url}/${this.form.id}`);
      this.userDeleted = true;
      this.sending = false;
      this.clearForm();
      this.showDialog = false;
    },
    async getItem() {
      this.sending = true;
      const { data } = await api.get(
        `/item/${this.form.numSerie}?numSerie=true`
      );

      if (data.locacao_id) {
        await api
          .get(`/${this.url}/${data.locacao_id}`)
          .then(({ data }) => (this.dadosLocacao = data));
      } else {
        this.notFound = true;
        this.clearForm();
      }
      this.sending = false;
    },
    async getForm() {
      this.sending = true;
      const { data } = await api.get(`/${this.url}/${this.form.id}`);

      if (data.id) {
        this.form = Object.assign(this.form, data);
        this.form.data_aquisicao = new Date(this.form.data_aquisicao);
      } else {
        this.notFound = true;
        this.clearForm();
      }
      this.sending = false;
    }
  },
  created() {
    api.get("titulo").then(({ data }) => (this.titulos = data));
  }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.card-cliente {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  padding: 5px;
  span {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
