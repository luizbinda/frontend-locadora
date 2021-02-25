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
            <md-field :class="getValidationClass('sexo_id')">
              <label>Sexo</label>
              <md-select v-model="form.sexo_id">
                <md-option value="Masculino">Masculino</md-option>
                <md-option value="Feminino">Feminino</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.form.sexo_id.required">
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
            <md-field :class="getValidationClass('cliente_id')">
              <label>Titulo</label>
              <md-select v-model="form.cliente_id">
                <md-option
                  v-for="socio in socios"
                  :key="socio.id"
                  :value="socio.id"
                  >{{ socio.nome }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.cliente_id.required">
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
      <md-snackbar :md-active.sync="notFound">
        {{ url }} não encontrado!
      </md-snackbar>
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
      sexo_id: null,
      telefone: null,
      cliente_id: null
    },
    formSaved: false,
    notFound: false,
    userDeleted: false,
    sending: false
  }),
  validations: {
    form: {
      id: {
        minLength: minLength(1)
      },
      nome: {
        required
      },
      cliente_id: {
        required
      },
      data_nascimento: {
        required
      },
      sexo_id: {
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
    },
    async saveForm() {
      this.sending = true;
      const metodo = this.form.id ? "put" : "post";
      const resquestData = {
        ...this.form,
        data_aquisicao: this.dataAquisicao
      };
      if (metodo === "put") {
        resquestData.sexo = this.form.sexo_id;
      } else {
        resquestData.socio_id = this.form.cliente_id;
      }

      await api[metodo](`${this.url}`, resquestData)
        .then(({ data }) => {
          this.form = Object.assign(this.form, data);
          this.form.id = data.id;
          this.formSaved = true;
        })
        .catch(() => {});

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
      const { data } = await api.get(
        `/${this.url}/${this.form.id}?dependente=true`
      );

      if (data.id) {
        this.form = Object.assign(this.form, data);
        this.form.data_nascimento = new Date(this.form.data_nascimento);
        this.form.sexo_id = data.sexo;
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
