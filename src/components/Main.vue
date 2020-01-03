<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <select
          class="form-control form-control-sm"
          v-if="tabs.length > 0"
          :value="selectedTabId"
          @change="selectTab($event.target.value)"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{
            tab.id
            }}
          </option>
        </select>
        <span v-else>No music tabs!</span>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <button class="btn btn-primary" @click="togglePlay">{{ state.isPlaying ? "Pause" : "Play" }}</button>
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
 * @property {Boolean} repeat
 * @property {Boolean} like
 * @property {Boolean} dislike
 */
/**
 * @typedef {Object} STATE_TYPE
 * @property {Boolean} isPlaying
 * @property {CONTROLS_TYPE} controls
 */
/**
 * @typedef {Object} STATE
 * @property {STATE_TYPE} state
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';

export default {
  name: 'Main',
  data() {
    return {
      tabs: [],
      url: 'music.yandex',
      selectedTabId: null,
      /** @type {STATE} */
      state: {}
    };
  },

  created() {
    browser.runtime.onMessage.addListener(this.tabEventHandler);
  },

  async mounted() {
    const storedTabId = await this.getStoredId();

    browser.tabs.query({ currentWindow: true }).then(async tabs => {
      this.tabs = tabs.filter(tab => tab.url.includes(this.url));

      let tabId = null;
      if (storedTabId > 0) {
        const preselectedTab = this.tabs.find(tab => tab.id === storedTabId);
        tabId = preselectedTab ? storedTabId : null;
      }

      tabId = tabId === null && this.tabs[0] ? this.tabs[0].id : tabId;

      if (tabId) {
        this.selectTab(tabId);
      }
    });
  },

  methods: {
    async getStoredId() {
      const storedTabId = await browser.storage.local.get('selectedTabId');
      return storedTabId ? storedTabId.selectedTabId : null;
    },

    async selectTab(value) {
      this.selectedTabId = Number(value);
      if (!isNaN(this.selectedTabId)) {
        await browser.tabs.executeScript(this.selectedTabId, {
          file: '/content_script.js'
        });
        await browser.storage.local.set({ selectedTabId: this.selectedTabId });
      }
    },
    togglePlay() {
      this.sendMessage('play');
    },

    sendMessage(message) {
      browser.tabs.sendMessage(this.selectedTabId, message);
    },
    tabEventHandler(message) {
      if (message.state) {
        this.state = message.state;
      }
    }
  }
};
</script>
