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
            <md-field :class="getValidationClass('diretor')">
              <label>Diretor</label>
              <md-select v-model="form.diretor.id">
                <md-option
                  v-for="diretor in diretores"
                  :key="diretor.id"
                  :value="diretor.id"
                >
                  {{ diretor.nome }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.diretor.required">
                O campo Titulo é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('atores')">
              <label>Atores</label>
              <md-select v-model="form.atores" multiple>
                <md-option
                  v-for="ator in atores"
                  :key="ator.id"
                  :value="ator.id"
                >
                  {{ ator.nome }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.atores.required">
                O campo Atores é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-datepicker
              md-immediately
              v-model="form.ano"
              :class="getValidationClass('ano')"
            >
              <label>Ano</label>
              <span class="md-error" v-if="!$v.form.ano.required">
                O campo Ano é obrigatorio!
              </span>
            </md-datepicker>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('sinopse')">
              <label>Sinopse</label>
              <md-input v-model="form.sinopse" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.sinopse.required">
                O campo Sinopse é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('categoria')">
              <label>Categoria</label>
              <md-input v-model="form.categoria" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.categoria.required">
                A campo Categoria é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('classe')">
              <label>Classes</label>
              <md-select v-model="form.classe.id">
                <md-option
                  v-for="classe in classes"
                  :key="classe.id"
                  :value="classe.id"
                >
                  {{ classe.nome }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.classe.id.required">
                O campo Classe é obrigatorio!
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
        Desaja excluir titulo <strong>{{ form.nome }}</strong> ?
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
  name: "FormTitulo",
  mixins: [validationMixin],
  data: () => ({
    url: "titulo",
    diretores: [],
    atores: [],
    classes: [],
    showDialog: false,
    form: {
      id: null,
      ano: null,
      categoria: null,
      classe: {
        id: null
      },
      diretor: {
        id: null
      },
      atores: [],
      nome: null,
      sinopse: null
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
      ano: {
        required
      },
      categoria: {
        required
      },
      classe: {
        id: { required }
      },
      diretor: {
        id: { required }
      },
      atores: {
        required
      },
      nome: {
        required
      },
      sinopse: {
        required
      }
    }
  },
  computed: {
    ano() {
      const newDate = new Date(this.form.ano);
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
      this.form.classe = {
        id: null
      };
      this.form.diretor = {
        id: null
      };
    },
    async saveForm() {
      this.sending = true;
      const metodo = this.form.id ? "put" : "post";
      let urlRequest = this.url;
      if (this.form.id) {
        urlRequest += `/${this.form.id}`;
      }

      const resquestData = {
        ...this.form,
        atores: this.form.atores.map(ator => ({ id: ator }))
      };
      await api[metodo](urlRequest, resquestData)
        .then(({ data }) => {
          this.form.id = data.id;
          this.formSaved = true;
          this.sending = false;
        })
        .catch(() => {
          this.sending = false;
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
          if (data.id) {
            this.form = Object.assign(this.form, data);
            this.form.ano = new Date(this.form.ano);
            this.form.atores = data.atores.map(ator => ator.id);
          }
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
    Promise.all([
      api.get("diretor").then(({ data }) => (this.diretores = data)),
      api.get("atores").then(({ data }) => (this.atores = data)),
      api.get("classe").then(({ data }) => (this.classes = data))
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
