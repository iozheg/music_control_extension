(function() {
  browser.runtime.sendMessage({ state: getState() });

  if (window.injected) {
    return;
  }

  window.injected = true;

  function commandHandler(message) {
    const externalAPI = window.wrappedJSObject.externalAPI;
    if (message === 'play') {
      externalAPI.togglePause();
    }
  }

  function getState() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    return {
      isPlaying: externalAPI.isPlaying(),
      controls: externalAPI.getControls()
    };
  }

  browser.runtime.onMessage.addListener(commandHandler);
})();
