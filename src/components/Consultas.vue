<template>
  <div class="md-app-content">
    <div class="md-layout-item md-small-size-100 pad">
      <md-card class="md-layout-item">
        <div class="categoria">
          <h3>Tipo de consulta</h3>
          <md-button
            @click="getNome"
            type="button"
            class="md-primary md-raised"
            :disabled="sending"
          >
            Nome
          </md-button>
          <md-button
            @click="isCategoria = true"
            type="button"
            class="md-primary md-raised"
            :disabled="sending"
          >
            Categoria
          </md-button>
          <md-button
            @click="isAtor = true"
            type="button"
            class="md-primary md-raised"
            :disabled="sending"
          >
            Ator
          </md-button>
        </div>
      </md-card>
    </div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item">
        <md-card-content>
          <div class="md-layout-item md-small-size-100" v-if="isAtor">
            <md-field :class="getValidationClass('ator_id')">
              <label>Ator</label>
              <md-select v-model="form.ator_id">
                <md-option
                  v-for="ator in atores"
                  :key="ator.id"
                  :value="ator.id"
                >
                  {{ ator.nome }}
                </md-option>
              </md-select>
              <md-button class="md-primary md-raised" @click="getTitulos">
                Buscar
              </md-button>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100" v-if="isCategoria">
            <md-field :class="getValidationClass('categoria')">
              <label>Categoria</label>
              <md-input v-model="form.categoria" :disabled="sending" />
              <md-button class="md-primary md-raised" @click="getTitulos">
                Buscar
              </md-button>
              <span class="md-error" v-if="!$v.form.categoria.minlength">
                campo Categoria com carcteres insuficientes!
              </span>
            </md-field>
          </div>
          <md-field :class="getValidationClass('id')">
            <label>Titulo</label>
            <md-select v-model="form.id">
              <md-option
                v-for="titulo in titulos"
                :key="titulo.id"
                :value="titulo.id"
              >
                {{ titulo.nome }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.id.required">
              O campo Titulo é obrigatorio!
            </span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button
            type="button"
            @click="getForm"
            class="md-primary md-raised"
            :disabled="sending"
            v-if="form.id"
          >
            buscar
          </md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-active.sync="formSaved">
        Ator {{ form.nome }} foi salvo com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="userDeleted">
        Ator {{ form.nome }} foi deletado com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="notFound">
        Ator não encontrado!
      </md-snackbar>
    </form>
    <div v-if="titulo">
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Titulo</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head>Nome</md-table-head>
          <md-table-head>Sinopse</md-table-head>
          <md-table-head>Categoria</md-table-head>
          <md-table-head>Ano</md-table-head>
          <md-table-head>Diretor</md-table-head>
          <md-table-head>Classe</md-table-head>
        </md-table-row>
        <md-table-row>
          <md-table-cell>{{ titulo.nome }}</md-table-cell>
          <md-table-cell>{{ titulo.sinopse }}</md-table-cell>
          <md-table-cell>{{ titulo.categoria }}</md-table-cell>
          <md-table-cell>{{ ano }}</md-table-cell>
          <md-table-cell>{{ titulo.diretor.nome }}</md-table-cell>
          <md-table-cell>{{ titulo.classe.nome }}</md-table-cell>
        </md-table-row>
      </md-table>
      <md-table md-card>
        <md-table-toolbar>Atores Titulo</md-table-toolbar>
        <md-table-row>
          <md-table-head>Nome</md-table-head>
        </md-table-row>
        <md-table-row v-for="ator in titulo.atores" :key="ator.id">
          <md-table-cell>{{ ator.nome }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength } from "vuelidate/lib/validators";
import { api } from "@/api";

export default {
  name: "Consultas",
  mixins: [validationMixin],
  data: () => ({
    url: "titulo",
    titulo: null,
    isCategoria: false,
    isNome: false,
    isAtor: false,
    titulos: [],
    atores: [],
    form: {
      id: null,
      categoria: null,
      ator_id: null
    },
    formSaved: false,
    notFound: false,
    userDeleted: false,
    sending: false,
    lastUser: null
  }),
  computed: {
    ano() {
      return new Date(this.titulo.ano).toLocaleString("pt-br");
    }
  },
  validations: {
    form: {
      id: {
        minLength: minLength(1)
      },
      categoria: {
        minLength: minLength(1)
      }
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
      const { data } = await api[metodo](`${this.url}`, this.form);
      this.form = Object.assign(this.form, data);
      this.formSaved = true;
      this.sending = false;
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
        this.titulo = data;
      } else {
        this.notFound = true;
        this.clearForm();
      }
      this.sending = false;
    },
    getNome() {
      this.isNome = true;
      this.getTitulos();
    },
    async getTitulos() {
      this.sending = true;
      if (this.isCategoria) {
        await api
          .get(`/${this.url}/categoria/${this.form.categoria}`)
          .then(({ data }) => (this.titulos = data));
      } else if (this.isAtor) {
        await api
          .get(`/${this.url}/ator/${this.form.ator_id}`)
          .then(({ data }) => (this.titulos = data));
      } else {
        await api.get(this.url).then(({ data }) => (this.titulos = data));
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
    Promise.all([
      api.get(`/atores`).then(({ data }) => (this.atores = data)),
      api.get(this.url).then(({ data }) => (this.titulos = data))
    ]);
  },
  watch: {
    isCategoria() {
      if (this.isCategoria) {
        this.isNome = false;
        this.isAtor = false;
      }
    },
    isNome() {
      if (this.isNome) {
        this.isCategoria = false;
        this.isAtor = false;
      }
    },
    isAtor() {
      if (this.isAtor) {
        this.isNome = false;
        this.isCategoria = false;
      }
    }
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
.categoria {
  padding: 15px;
}
.pad {
  margin-bottom: 10px;
}

form {
  margin-bottom: 10px;
}

.md-table .md-table-head {
  text-align: left;
}
.md-table .md-table-cell {
  text-align: left;
}
</style>
