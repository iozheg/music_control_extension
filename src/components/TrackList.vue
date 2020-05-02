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
        <span
          :style="track.link === currentTrackLink && 'font-weight: bold'"
          class="no-wrap"
        >
          {{ track.title }}
        </span>
        <span class="has-text-grey-light artists no-wrap">
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
  flex-grow: 1;
  flex-basis: 33%;
}
.playing-icon {
  margin-right: 5px;
}
.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>