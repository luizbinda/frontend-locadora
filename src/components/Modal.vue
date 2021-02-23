<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        <div class="title">
          {{ title }}
          <md-button
            class="md-icon-button md-raised md-accent"
            @click="showDialog = false"
          >
            <md-icon>close</md-icon>
          </md-button>
        </div>
      </md-dialog-title>
      <md-dialog-content class="modal">
        <slot></slot>
      </md-dialog-content>
    </md-dialog>
    <md-button class="md-raised btn-padding" @click="showDialog = true">
      {{ title }}
    </md-button>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ["title"],
  data: () => ({
    showDialog: false
  })
};
</script>

<style lang="scss" scoped>
// Apply theme
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: md-get-palette-color(blue, A200),
    // The primary color of your application
      accent: md-get-palette-color(red, A200),
    // The accent or secondary color
      theme: dark // This can be dark or light
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
.md-dialog /deep/.md-dialog-container {
  max-width: 768px;
}

.modal {
  width: 700px;
  padding: 15px;
}

.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
</style>
