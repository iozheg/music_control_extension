<template>
  <div
    :class="{ 'disabled-control': disabled }"
    class="columns is-mobile is-vcentered is-centered"
  >
    <div class="column is-1 has-text-centered">
      <font-awesome-icon
        :class="['icon-button', disliked && 'icon-button_pressed']"
        :title="i18n('dislikeButton')"
        icon="ban"
        @click="emitEvent('toggle-dislike')"
      />
    </div>
    <div class="column is-4 is-offset-2 has-text-centered">
      <play-control
        :isPlaying="state.isPlaying"
        :controls="state.controls"
        @toggle-play="emitEvent('toggle-play')"
        @play-next="emitEvent('play-next')"
        @play-previous="emitEvent('play-previous')"
      />
    </div>
    <div class="column is-1 is-offset-2 has-text-centered">
      <font-awesome-icon
        :class="['icon-button', liked && 'icon-button_pressed']"
        :title="i18n('likeButton')"
        icon="heart"
        @click="emitEvent('toggle-like')"
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
    disabled: { type: Boolean, default: false },
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

  methods: {
    emitEvent(event) {
      !this.disabled && this.$emit(event);
    },
  },
};
</script>
