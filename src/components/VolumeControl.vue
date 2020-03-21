<template>
  <div class="volume-control">
    <button
      :class="['button', 'is-white']"
      @click="mute"
    >
      <font-awesome-icon
        :icon="muted ? 'volume-mute' : 'volume-up'"
        class="icon-button"
      />
    </button>
    <input
      :value="volumeLevel"
      class="slider is-fullwidth is-small is-circle no-margin"
      step="1"
      min="0"
      max="100"
      type="range"
      @input="changeVolume"
    >
  </div>
</template>

<script>
export default {
  name: 'VolumeControl',
  props: {
    volumeLevel: { type: Number, default: 50 },
  },
  computed: {
    muted() {
      return this.volumeLevel === 0;
    }
  },

  methods: {
    changeVolume(event) {
      this.$emit('change-volume', Number(event.target.value));
    },
    mute() {
      this.$emit('toggle-mute');
    }
  },
};
</script>

<style scoped>
.volume-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.no-margin {
  margin: 0 0 0 3px !important;
}
</style>

<style src="../styles/icon-button.css"></style>
<style src="../../node_modules/bulma-slider/dist/css/bulma-slider.min.css"></style>
