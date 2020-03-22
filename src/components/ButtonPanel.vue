<template>
  <div class="field is-grouped">
    <button
      :class="['button', 'is-white', showTrackList && 'is-active']"
      :disabled="isEmptyTrackList"
      @click="$emit('toggle-track-list')"
    >
      <font-awesome-icon
        icon="list"
      />
    </button>
    <button
      :class="['button', 'is-white']"
      @click="$emit('toggle-shuffle')"
    >
      <font-awesome-icon
        :class="shuffle && 'icon-button_pressed'"
        icon="random"
      />
    </button>
    <button
      :class="[
        'button',
        'is-white',
        repeatOneTrack && 'repeate-one',
      ]"
      @click="$emit('toggle-repeat')"
    >
      <font-awesome-icon
        :class="repeatOn && 'icon-button_pressed'"
        icon="redo"
      />
    </button>
  </div>
</template>

<script>
import { REPEAT_ONE, REPEAT_ALL } from '../constants';

export default {
  name: 'ButtonPanel',
  props: {
    showTrackList: { type: Boolean, default: false },
    isEmptyTrackList: { type: Boolean, default: false },
    shuffle: { type: Boolean, default: false },
    repeat: { type: Boolean|Number, default: false },
  },
  data() {
    return {
      REPEAT_ONE,
    };
  },
  computed: {
    repeatOneTrack() {
      return this.repeat === REPEAT_ONE;
    },
    repeatOn() {
      return this.repeatOneTrack || this.repeat === REPEAT_ALL;
    },
  },
};
</script>

<style scoped>
.repeate-one::after {
  position: absolute;
  left: 30px;
  top: 15px;
  content: '1';
  font-size: 10px;
}
</style>
<style src="../styles/icon-button.css"></style>
