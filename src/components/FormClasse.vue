<template>
  <div>
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
        {{ url }} {{ form.nome }} foi salvo com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="userDeleted">
        {{ url }} {{ form.nome }} foi deletado com sucesso!
      </md-snackbar>
      <md-snackbar :md-active.sync="notFound">
        {{ url }} não encontrado!
      </md-snackbar>
    </form>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Preferences</md-dialog-title>
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
  name: "FormClasse",
  mixins: [validationMixin],
  data: () => ({
    url: "classe",
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
    lastUser: null
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