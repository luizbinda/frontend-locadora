<template>
  <div class="md-app-content">
    <TableForm
      class="margin"
      :dadosForm="item"
      nome-form="item"
      @enviarDados="receberDados"
      @clearForm="clearForm"
    />
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item">
        <md-card-content>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('id')">
              <label>Id</label>
              <md-input v-model="form.id" :disabled="sending" />
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('numSerie')">
              <label>Número de Série</label>
              <md-input v-model="form.numSerie" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.numSerie.required">
                O campo Número de Série é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('titulo')">
              <label>Titulo</label>
              <md-select v-model="form.titulo.id">
                <md-option
                  v-for="titulo in titulos"
                  :key="titulo.id"
                  :value="titulo.id"
                  >{{ titulo.nome }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.titulo.required">
                O campo Titulo é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-datepicker
              md-immediately
              v-model="form.data_aquisicao"
              :class="getValidationClass('data_aquisicao')"
            >
              <label>Data de aquisição</label>
              <span class="md-error" v-if="!$v.form.data_aquisicao.required">
                A campo Data de aquisição é obrigatorio!
              </span>
            </md-datepicker>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('tipo')">
              <label>Tipo</label>
              <md-input v-model="form.tipo" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.tipo.required">
                O campo Tipo é obrigatorio!
              </span>
            </md-field>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button
            type="submit"
            class="md-primary md-raised"
            :disabled="sending"
          >
            salvar
          </md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-active.sync="formSaved">
        {{ url }} salvo com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="notFound"> {{ formError }} </md-snackbar>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { api } from "@/api";
import TableForm from "@/components/TableForm";

export default {
  name: "FormItem",
  components: { TableForm },
  mixins: [validationMixin],
  data: () => ({
    url: "item",
    item: [],
    titulos: [],
    showDialog: false,
    form: {
      id: null,
      numSerie: null,
      titulo: {
        id: null
      },
      tipo: null,
      data_aquisicao: null
    },
    formSaved: false,
    notFound: false,
    userDeleted: false,
    sending: false,
    formError: null
  }),
  validations: {
    form: {
      id: {
        minLength: minLength(1)
      },
      numSerie: {
        required
      },
      titulo: {
        id: { required }
      },
      tipo: {
        required
      },
      data_aquisicao: {
        required
      }
    }
  },
  methods: {
    receberDados(dados) {
      this.form = Object.assign({}, dados);
      this.form.data_aquisicao = new Date(dados.data_aquisicao);
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm(id) {
      this.$v.$reset();
      for (let formKey in this.form) {
        this.form[formKey] = null;
      }
      this.form.titulo = { id: null };
      const index = this[this.url].findIndex(elemnt => elemnt.id === id);
      this[this.url].splice(index, 1);
    },
    async saveForm() {
      this.sending = true;
      const metodo = this.form.id ? "put" : "post";

      let urlRequest = this.url;
      if (this.form.id) {
        urlRequest += `/${this.form.id}`;
      }

      const resquestData = {
        ...this.form
      };
      await api[metodo](urlRequest, resquestData)
        .then(({ data }) => {
          this.form.id = data.id;
          this.formSaved = true;
          api.get(this.url).then(({ data }) => (this[this.url] = data));
          this.sending = false;
        })
        .catch(error => {
          this.sending = false;
          this.errorResponse(error.response.data.errors[0]);
        });
    },
    errorResponse(error) {
      this.formError = error;
      this.sending = false;
      this.notFound = true;
      this.clearForm();
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveForm();
      }
    }
  },
  created() {
    Promise.all([
      api.get("titulo").then(({ data }) => (this.titulos = data)),
      api.get(this.url).then(({ data }) => (this[this.url] = data))
    ]);
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
</style>
