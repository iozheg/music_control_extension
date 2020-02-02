<template>
  <div>
    <a
      v-for="track in trackList"
      :key="track.title"
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
  }
};
</script>

<style scoped>
.artists {
  margin-left: 5px;
}
</style>