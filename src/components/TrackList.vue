<template>
  <div class="track-list">
    <div>
      <a
        v-for="(track, index) in trackList"
        :key="track.link"
        @click="switchToTrack(index)"
        class="panel-block is-size-7"
      >
        <div
          v-if="isPlaying && track.link === currentTrackLink"
          class="playing-icon"
        >
          <font-awesome-icon icon="play" />
        </div>
        <span :style="track.link === currentTrackLink && 'font-weight: bold'">
          {{ track.title }}
        </span>
        <span class="has-text-grey-light artists">
          {{ track.artists.join(', ') }}
        </span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrackList",
  props: {
    trackList: { type: Array, default: () => [] },
    currentTrackLink: { type: String, default: undefined },
    isPlaying: { type: Boolean, default: false }
  },

  methods: {
    switchToTrack(index) {
      this.$emit('switch-to-track', { command: 'switch-to-track', params: { index }});
    }
  }
};
</script>

<style scoped>
.track-list {
  max-height: 300px;
  overflow: auto;
}
.artists {
  margin-left: 5px;
}
.playing-icon {
  margin-right: 5px;
}
</style>