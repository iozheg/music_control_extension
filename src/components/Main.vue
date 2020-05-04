<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-8 is-offset-1">
        <tab-selector @tab-selected="tabSelected" />
      </div>
      <div
        v-if="isRadio"
        class="column is-2 is-vcentered"
      >
        <span class="tag is-link is-light">{{ i18n("radioLabel") }}</span>
      </div>
    </div>

    <template v-if="hasMusicTab">
      <div class="columns is-mobile track-name-row">
        <div class="column is-10 is-offset-1">
          <template v-if="currentTrack && !isAdvertising">
            <div class="track-name is-size-4">{{ currentTrack.title }}</div>
            <div class="track-artist is-size-7 has-text-grey">
              {{ currentTrack.artists.join(',') }}
            </div>
            <progress
              v-show="loading"
              class="progress is-small process-indication"
              max="100"
            />
            <div v-show="!loading" class="process-indication"></div>
          </template>
          <template v-else-if="isAdvertising">
            <div class="track-name is-size-4">{{ i18n("advertisingLabel") }}</div>
          </template>
        </div>
      </div>

      <main-controls
        :state="state"
        :disabled="isAdvertising"
        @toggle-play="sendMessage({ command: 'play' })"
        @play-next="sendMessage({ command: 'play-next' })"
        @play-previous="sendMessage({ command: 'play-previous' })"
        @toggle-dislike="sendMessage({ command: 'toggle-dislike' })"
        @toggle-like="sendMessage({ command: 'toggle-like' })"
      />

      <div class="columns is-mobile options-control">
        <div class="column is-6 is-offset-1">
          <button-panel
            :show-track-list="showTrackList"
            :is-empty-track-list="isEmptyTrackList"
            :shuffle="controls.shuffle"
            :repeat="controls.repeat"
            @toggle-track-list="toggleTrackList"
            @toggle-shuffle="toggleShuffle"
            @toggle-repeat="toggleRepeat"
          />
        </div>
        <div class="column is-4">
          <volume-control
            :volume-level="volumeLevel"
            @change-volume="changeVolume"
            @toggle-mute="toggleMute"
          />
        </div>
      </div>

      <div
        v-if="showTrackList"
        class="columns is-mobile is-vcentered"
      >
        <div class="column is-10 is-offset-1">
          <track-list
            :track-list="trackList"
            :current-track-link="currentTrack.link"
            :is-playing="state.isPlaying"
            @switch-to-track="sendMessage($event, true)"
          />
        </div>
      </div>
    </template>
    <div v-else class="columns is-mobile">
      <div class="column is-10 is-offset-1 has-text-centered">
        <div>{{ i18n("noTabsLabel") }}</div>
        <button
          :title="i18n('openMusicTabButton')"
          :class="['button', 'is-text']"
          :disabled="selectedTabId === undefined"
          style="margin-left: 3px;"
          @click="openNewMusicTab"
        >
          {{ i18n("openMusicTabButton") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @typedef {Object} CONTROLS_TYPE
 * @property {Boolean} index
 * @property {Boolean} next
 * @property {Boolean} prev
 * @property {Boolean} shuffle
 * @property {Boolean|Number} repeat
 * @property {Boolean} like
 * @property {Boolean} dislike
 */
/**
 * @typedef {Object} STATE_TYPE
 * @property {Boolean} isPlaying
 * @property {CONTROLS_TYPE} controls
 * @property {Object} currentTrack
 * @property {String} sourceType
 */
/**
 * @typedef {Object} STATE
 * @property {STATE_TYPE} state
 */
/**
 * @typedef {Object} TRACK_LIST_ITEM
 * @property {String} list
 * @property {String} title
 * @property {String[]} artists
 */
/**
 * @typedef {Object} ADVERTISING
 * @property {String} image
 * @property {String} link
 * @property {String} title
 */

import 'bulma/css/bulma.css';
import TabSelector from './TabSelector.vue';
import MainControls from './MainControls.vue';
import TrackList from './TrackList.vue';
import VolumeControl from './VolumeControl.vue';
import ButtonPanel from './ButtonPanel.vue';

export default {
  name: 'Main',
  components: { TabSelector, MainControls, TrackList, VolumeControl, ButtonPanel },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {},
      loading: false,
      /** @type {TRACK_LIST_ITEM[]} */
      trackList: [],
      showTrackList: false,
      volumeLevel: 50,
      /** @type {ADVERTISING|false} */
      isAdvertising: false,
    };
  },
  computed: {
    hasMusicTab() {
      return this.selectedTabId !== null;
    },
    isRadio() {
      return this.state.sourceType === 'radio';
    },
    currentTrack() {
      return this.state.currentTrack;
    },
    isEmptyTrackList() {
      return !this.trackList;
    },
    controls() {
      return this.state.controls || {};
    },
  },

  created() {
    browser.runtime.onMessage.addListener(this.tabEventHandler);
  },

  methods: {
    sendMessage({ command, params }, isAsync = false) {
      if (this.selectedTabId > 0) {
        if (isAsync) this.loading = true;
        browser.tabs.sendMessage(this.selectedTabId, { command, params });
      }
    },
    tabEventHandler(message, sender) {
      this.loading = false;
      if (!sender.tab || sender.tab.id !== this.selectedTabId) return;

      if (message.state) {
        this.state = message.state;
      }
      if (message.trackList) {
        this.trackList = message.trackList;
      }
      if (message.volumeLevel >= 0) {
        this.volumeLevel = message.volumeLevel;
      }
      if (message.advertStatus !== undefined) {
        this.isAdvertising = !!message.advertStatus;
      }
    },

    async tabSelected(newTabId) {
      this.selectedTabId = newTabId;
      await browser.tabs.executeScript(this.selectedTabId, {
        file: '/content_script.js'
      });
    },
    toggleTrackList() {
      this.showTrackList = !this.showTrackList;
      this.sendMessage({ command: 'get-track-list' });
    },

    changeVolume(level) {
      this.sendMessage({ command: 'change-volume', params: { level } });
    },
    toggleMute() {
      this.sendMessage({ command: 'toggle-mute' });
    },

    toggleShuffle() {
      this.sendMessage({ command: 'toggle-shuffle' });
    },
    toggleRepeat() {
      this.sendMessage({ command: 'toggle-repeat' });
    },

    async openNewMusicTab() {
      await browser.tabs.create({ url: 'https://music.yandex.ru/' });
      window.close();
    }
  }
};
</script>

<style scoped>
.container {
  width: 500px;
  height: 100%;
  padding: 10px 0;
  overflow: hidden;
  border-radius: 15px;
}

.track-name-row {
  background-color: #f7f7f7;
}
.track-name,
.track-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.process-indication {
  height: 0.1rem;
  margin-bottom: 0;
}

.options-control {
  border-top: 1px solid lightgray;
}
</style>
