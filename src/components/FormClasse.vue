<template>
  <div class="md-app-content">
    <TableForm
      class="margin"
      :dadosForm="classes"
      nome-form="classe"
      @enviarDados="receberDados"
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
            <md-field :class="getValidationClass('nome')">
              <label>Nome</label>
              <md-input v-model="form.nome" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.nome.required"
                >O campo Nome é obrigatorio!</span
              >
              <span class="md-error" v-else-if="!$v.form.nome.minlength"
                >campo Nome com carcteres insuficientes!</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('valor')">
              <label>Valor</label>
              <md-input v-model="form.valor" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.valor.required">
                O campo Valor é obrigatorio!
              </span>
              <span class="md-error" v-else-if="!$v.form.valor.minlength">
                campo Valor com carcteres insuficientes!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('prazo_devolucao')">
              <label>Dias para devolução</label>
              <md-input v-model="form.prazo_devolucao" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.prazo_devolucao.required">
                O campo Dias para devolução é obrigatorio!
              </span>
              <span
                class="md-error"
                v-else-if="!$v.form.prazo_devolucao.minlength"
              >
                campo Dias para devolução com carcteres insuficientes!
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
        {{ url }} {{ form.nome }} foi salvo com sucesso!
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
  name: "FormClasse",
  components: { TableForm },
  mixins: [validationMixin],
  data: () => ({
    url: "classe",
    classes: [],
    showDialog: false,
    form: {
      id: null,
      nome: null,
      valor: null,
      prazo_devolucao: null
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
      nome: {
        minLength: minLength(3),
        required
      },
      valor: {
        minLength: minLength(1),
        required
      },
      prazo_devolucao: {
        minLength: minLength(1),
        required
      }
    }
  },
  methods: {
    receberDados(dados) {
      this.form = dados;
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
      await api[metodo](urlRequest, this.form)
        .then(({ data }) => {
          this.form.id = data.id;
          this.formSaved = true;
          api.get(this.url).then(({ data }) => (this.classes = data));
          this.sending = false;
        })
        .catch(error => {
          this.errorResponse(error.response.data.errors[0]);
        });
    },
    async deleteForm() {
      this.sending = true;
      await api
        .delete(`/${this.url}/${this.form.id}`)
        .then(() => {
          this.userDeleted = true;
          this.sending = false;
          this.clearForm();
          this.showDialog = false;
        })
        .catch(error => {
          this.showDialog = false;
          this.errorResponse(error.response.data.errors[0]);
        });
    },
    async getForm() {
      await api
        .get(`/${this.url}/${this.form.id}`)
        .then(({ data }) => {
          this.form = Object.assign(this.form, data);
          this.sending = false;
        })
        .catch(error => {
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
    api.get(this.url).then(({ data }) => (this.classes = data));
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
