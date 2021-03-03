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
            <md-field :class="getValidationClass('nome')">
              <label>Nome</label>
              <md-input v-model="form.nome" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.nome.required">
                O campo Nome é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('sexo')">
              <label>Sexo</label>
              <md-select v-model="form.sexo">
                <md-option value="Masculino">Masculino</md-option>
                <md-option value="Feminino">Feminino</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.sexo.required">
                O campo Sexo é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-datepicker
              :class="getValidationClass('data_nascimento')"
              md-immediately
              v-model="form.data_nascimento"
            >
              <label>Data de nascimento</label>
              <span class="md-error" v-if="!$v.form.data_nascimento.required">
                A campo Data de nascimento é obrigatorio!
              </span>
            </md-datepicker>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('cliente')">
              <label>Sócio</label>
              <md-select v-model="form.cliente.id">
                <md-option
                  v-for="socio in socios"
                  :key="socio.id"
                  :value="socio.id"
                  >{{ socio.nome }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.cliente.required">
                O campo Titulo é obrigatorio!
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
      <md-snackbar :md-active.sync="notFound"> {{ formError }} </md-snackbar>
    </form>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        Desaja excluir dependente <strong>{{ form.nome }}</strong> ?
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
  name: "FormDependente",
  mixins: [validationMixin],
  data: () => ({
    url: "cliente",
    showDialog: false,
    socios: [],
    form: {
      data_nascimento: null,
      id: null,
      nome: null,
      sexo: null,
      telefone: null,
      cliente: { id: null }
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
        required
      },
      cliente: {
        id: { required }
      },
      data_nascimento: {
        required
      },
      sexo: {
        required
      }
    }
  },
  computed: {
    data_nascimento() {
      const newDate = new Date(this.form.data_nascimento);
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
      this.form.cliente = { id: null };
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
      this.sending = true;
      await api
        .get(`/${this.url}/${this.form.id}`)
        .then(({ data }) => {
          this.form = Object.assign(this.form, data);
          this.form.data_nascimento = new Date(data.data_nascimento);
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
    api
      .get(`${this.url}?dependente=true`)
      .then(({ data }) => (this.socios = data));
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
