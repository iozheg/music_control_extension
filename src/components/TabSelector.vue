<template>
  <div>
    <select
      class="form-control form-control-sm"
      v-if="tabs.length > 0"
      :value="selectedTabId"
      @change="selectTab($event.target.value)"
    >
      <option v-for="tab in tabs" :key="tab.id" :value="tab.id">{{ tab.id }} - {{ tab.title }}</option>
    </select>
    <span v-else>No music tabs!</span>
  </div>
</template>

<script>
export default {
  name: 'TabSelector',

  data() {
    return {
      tabs: [],
      url: 'music.yandex',
      selectedTabId: undefined
    };
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

        this.$emit('tab-selected', this.selectedTabId);
      }
    }
  }
};
</script>

<style scoped>
select {
  max-width: 300px;
}
select option {
  max-width: 300px;
}
</style>