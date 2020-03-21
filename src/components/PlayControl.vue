<template>
  <div class="play-control">
    <font-awesome-icon
      :class="[
        'icon-button',
        !previousTrackAvaliable ? 'icon-button_disabled' : ''
      ]"
      icon="fast-backward"
      @click="playPrevious"
      size="2x"
    />
    <font-awesome-icon
      class="icon-button"
      :icon="state.isPlaying ? 'pause' : 'play'"
      @click="togglePlay"
      size="3x"
    />
    <font-awesome-icon
      class="icon-button"
      icon="fast-forward"
      @click="playNext"
      size="2x"
    />
  </div>
</template>

<script>
export default {
  name: 'PlayControl',
  props: {
    state: { type: Object, default: () =>({})},
  },
  computed: {
    previousTrackAvaliable() {
      return this.state.controls ? this.state.controls.prev !== null : true;
    },
  },

  methods: {
    togglePlay() {
      this.$emit('send-message', { command: 'play' });
    },
    playNext() {
      this.$emit('send-message', { command: 'play-next' });
    },
    playPrevious() {
      if (this.previousTrackAvaliable) {
        this.$emit('send-message', { command: 'play-previous' });
      }
    },
  },
};
</script>

<style scoped>
.play-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<style src="../styles/icon-button.css"></style>
