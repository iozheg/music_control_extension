<template>
  <div class="play-control">
    <font-awesome-icon
      :class="[
        'icon-button',
        !previousTrackAvaliable ? 'icon-button_disabled' : ''
      ]"
      :title="labelStrings.previous"
      icon="fast-backward"
      @click="playPrevious"
      size="2x"
    />
    <font-awesome-icon
      class="icon-button"
      :title="isPlaying ? labelStrings.pause : labelStrings.play"
      :icon="isPlaying ? 'pause' : 'play'"
      @click="togglePlay"
      size="3x"
    />
    <font-awesome-icon
      :title="labelStrings.next"
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
    isPlaying: { type: Boolean, default: false },
    controls: { type: Object, default: () => ({}) },
  },
  computed: {
    previousTrackAvaliable() {
      return !!this.controls.prev;
    },
  },

  methods: {
    togglePlay() {
      this.$emit('toggle-play');
    },
    playNext() {
      this.$emit('play-next');
    },
    playPrevious() {
      if (this.previousTrackAvaliable) {
        this.$emit('play-previous');
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
