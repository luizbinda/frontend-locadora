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
            <md-field :class="getValidationClass('cliente_id')">
              <label>Cliente</label>
              <md-select v-model="form.cliente_id">
                <md-option
                  v-for="cliente in clientes"
                  :key="cliente.id"
                  :value="cliente.id"
                  >{{ cliente.nome }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.cliente_id.required">
                O campo Cliente é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('item_id')">
              <label>Item</label>
              <md-select v-model="form.item_id">
                <md-option
                  v-for="item in itens"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.numSerie }}</md-option
                >
              </md-select>
              <span class="md-error" v-if="!$v.form.item_id.required">
                O campo Item é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('valor')">
              <label>Valor</label>
              <md-input v-model="form.valor" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.valor.required">
                O campo Valor é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('multa')">
              <label>Multa</label>
              <md-input v-model="form.multa" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.multa.required">
                O campo Multa é obrigatorio!
              </span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-datepicker
              md-immediately
              v-model="form.data_devolucao_prevista"
              :class="getValidationClass('data_devolucao_prevista')"
            >
              <label>Data de Devolução</label>
              <span
                class="md-error"
                v-if="!$v.form.data_devolucao_prevista.required"
              >
                A campo Data de Devolução é obrigatorio!
              </span>
            </md-datepicker>
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
        Desaja excluir locação ?
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
  name: "FormLocacao",
  mixins: [validationMixin],
  data: () => ({
    url: "locacao",
    clientes: [],
    itens: [],
    showDialog: false,
    form: {
      cliente_id: null,
      data_devolucao_prevista: null,
      id: null,
      item_id: null,
      multa: null,
      valor: null
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
      cliente_id: {
        required
      },
      data_devolucao_prevista: {
        required
      },
      item_id: {
        required
      },
      multa: {
        required
      },
      valor: {
        required
      }
    }
  },
  computed: {
    data_devolucao_prevista() {
      const newDate = new Date(this.form.data_devolucao_prevista);
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
        data_devolucao_prevista: this.data_devolucao_prevista
      };
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
        this.form.data_devolucao_prevista = new Date(
          this.form.data_devolucao_prevista
        );
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
    api.get("cliente").then(({ data }) => (this.clientes = data));
    api.get("item").then(({ data }) => (this.itens = data));
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
