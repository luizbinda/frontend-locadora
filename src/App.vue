<template>
  <div id="app">
    <md-tabs md-sync-route class="md-primary">
      <md-tab id="tab-ator" md-label="Ator" to="/ator" />
      <md-tab id="tab-classe" md-label="Classe" to="/classe" />
      <md-tab id="tab-diretor" md-label="Diretor" to="/diretor" />
      <md-tab id="tab-item" md-label="Item" to="/item" />
      <md-tab id="tab-titulo" md-label="Titulo" to="/titulo" />
      <md-tab id="tab-socio" md-label="Socio" to="/socio" />
      <md-tab id="tab-dependente" md-label="Dependente" to="/dependente" />
      <md-tab id="tab-locacao" md-label="Locacao" to="/locacao" />
      <md-tab id="tab-devolucao" md-label="Devolucao" to="/devolucao" />
      <md-tab id="tab-consultas" md-label="Consultas" to="/consultas" />
    </md-tabs>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Material+Icons");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100vw - calc(100vw - 100%);
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("https://static.alphacoders.com/thumbs_categories/20.jpg");
}

.margin {
  margin-bottom: 15px;
}

.md-table .md-table-head {
  text-align: left;
}
.md-table .md-table-cell {
  text-align: left;
}
</style>
