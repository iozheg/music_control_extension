<template>
  <div>
    <a
      v-for="(track, index) in trackList"
      :key="track.title"
      @click="switchToTrack(index)"
      class="panel-block is-size-7"
    >
      {{ track.title }} <span class="has-text-grey-light artists">{{ track.artists.join(', ') }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "TrackList",
  props: {
    trackList: { type: Array, default: () => [] },
  },

  methods: {
    switchToTrack(index) {
      this.$emit('switch-to-track', { command: 'switch-to-track', params: { index }});
    }
  }
};
</script>

<style scoped>
.artists {
  margin-left: 5px;
}
</style>