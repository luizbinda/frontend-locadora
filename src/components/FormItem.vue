<template>
  <div class="md-app-content">
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
            <md-field :class="getValidationClass('titulo_id')">
              <label>Titulo</label>
              <md-select v-model="form.titulo_id">
                <md-option
                  v-for="titulo in titulos"
                  :key="titulo.id"
                  :value="titulo.id"
                  >{{ titulo.nome }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.titulo_id.required">
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
            type="button"
            @click="showDialog = true"
            class="md-accent md-raised"
            :disabled="sending"
            v-if="form.id"
          >
            deletar
          </md-button>
          <md-button
            type="button"
            @click="getForm"
            class="md-primary md-raised"
            :disabled="sending"
            v-if="form.id"
          >
            buscar
          </md-button>
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
      <md-snackbar :md-active.sync="userDeleted">
        {{ url }} deletado com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="notFound">
        {{ url }} não encontrado!
      </md-snackbar>
    </form>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        Desaja excluir item ?
      </md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-primary md-raised" @click="showDialog = false">
          Close
        </md-button>
        <md-button class="md-accent md-raised" @click="deleteForm">
          Delete
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { api } from "@/api";

export default {
  name: "FormItem",
  mixins: [validationMixin],
  data: () => ({
    url: "item",
    titulos: [],
    showDialog: false,
    form: {
      id: null,
      numSerie: null,
      titulo_id: null,
      tipo: null,
      data_aquisicao: null
    },
    formSaved: false,
    notFound: false,
    userDeleted: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      id: {
        minLength: minLength(1)
      },
      numSerie: {
        required
      },
      titulo_id: {
        required
      },
      tipo: {
        required
      },
      data_aquisicao: {
        required
      }
    }
  },
  computed: {
    dataAquisicao() {
      const newDate = new Date(this.form.data_aquisicao);
      return `${newDate.getUTCFullYear()}-${newDate.getUTCMonth() +
        1}-${newDate.getUTCDate()}`;
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
      const metodo = this.form.id ? "put" : "post";

      const resquestData = {
        ...this.form,
        data_aquisicao: this.dataAquisicao
      };
      console.log(resquestData);
      const { data } = await api[metodo](`${this.url}`, resquestData);
      this.form = Object.assign(this.form, data);
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
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveForm();
      }
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
</style>
