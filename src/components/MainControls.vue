<template>
  <div class="columns is-mobile is-vcentered is-centered">
    <div class="column is-1 has-text-centered">
      <font-awesome-icon
        :class="['icon-button', disliked && 'icon-button_pressed']"
        icon="ban"
        @click="$emit('toggle-dislike')"
      />
    </div>
    <div class="column is-4 is-offset-2 has-text-centered">
      <play-control
        :isPlaying="state.isPlaying"
        :controls="state.controls"
        @toggle-play="$emit('toggle-play')"
        @play-next="$emit('play-next')"
        @play-previous="$emit('play-previous')"
      />
    </div>
    <div class="column is-1 is-offset-2 has-text-centered">
      <font-awesome-icon
        :class="['icon-button', liked && 'icon-button_pressed']"
        icon="heart"
        @click="$emit('toggle-like')"
      />
    </div>
  </div>
</template>

<script>
import PlayControl from './PlayControl.vue';

export default {
  name: 'MainControls',
  components: { PlayControl },
  props: {
    state: { type: Object, default: () => ({}) },
  },
  computed: {
    liked() {
      const { currentTrack = {} } = this.state;
      return currentTrack.liked;
    },
    disliked() {
      const { currentTrack = {} } = this.state;
      return currentTrack.disliked;
    },
  },
};
</script>
