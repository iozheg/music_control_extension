<template>
  <div class="columns is-mobile is-vcentered is-centered">
    <div class="column is-2 has-text-centered">
      <font-awesome-icon
        :class="[
          'icon-button',
          !previousTrackAvaliable ? 'icon-button_disabled' : ''
        ]"
        icon="fast-backward"
        @click="playPrevious"
        size="2x"
      />
    </div>
    <div class="column is-2 has-text-centered">
      <font-awesome-icon
        class="icon-button"
        :icon="state.isPlaying ? 'pause' : 'play'"
        @click="togglePlay"
        size="3x"
      />
    </div>
    <div class="column is-2 has-text-centered">
      <font-awesome-icon class="icon-button" icon="fast-forward" @click="playNext" size="2x" />
    </div>
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
      this.$emit('send-message', 'play');
      // this.sendMessage('play');
    },
    playNext() {
      this.loading = true;
      this.$emit('send-message', 'play-next');
      // this.sendMessage('play-next');
    },
    playPrevious() {
      this.loading = true;
      if (this.previousTrackAvaliable) {
      this.$emit('send-message', 'play-previous');
        // this.sendMessage('play-previous');
      }
    },
  },
};
</script>