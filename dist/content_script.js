(function() {
  browser.runtime.sendMessage({
    state: getState(),
    trackList: getTrackList(),
    volumeLevel: getVolumeLevel()
  });

  if (window.injected) {
    return;
  }

  window.injected = true;

  async function commandHandler({ command, params }) {
    const externalAPI = window.wrappedJSObject.externalAPI;
    let response;

    switch (command) {
      case 'play':
        await externalAPI.togglePause();
        response = { state: getState() };
        break;
      case 'play-next':
        await externalAPI.next();
        response = {
          state: getState(),
          trackList: getTrackList()
        };
        break;
      case 'play-previous':
        await externalAPI.prev();
        response = {
          state: getState(),
          trackList: getTrackList()
        };
        break;
      case 'get-track-list':
        response = { trackList: getTrackList() };
        break;
      case 'switch-to-track':
        await externalAPI.play(params.index);
        response = {
          state: getState(),
          trackList: getTrackList()
        };
        break;

      case 'change-volume':
        await externalAPI.setVolume(params.level / 100);
        response = {
          volumeLevel: getVolumeLevel()
        };
        break;
      case 'toggle-mute':
        await externalAPI.toggleMute();
        response = {
          volumeLevel: getVolumeLevel()
        };
        break;

      case 'toggle-shuffle':
        await externalAPI.toggleShuffle();
        response = { state: getState() };
        break;
      case 'toggle-repeat':
        await externalAPI.toggleRepeat();
        response = { state: getState() };
        break;
    }

    browser.runtime.sendMessage(response);
  }

  function getState() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    const currentTrack = externalAPI.getCurrentTrack();
    const sourceInfo = externalAPI.getSourceInfo();

    return {
      isPlaying: externalAPI.isPlaying(),
      controls: externalAPI.getControls(),
      currentTrack: {
        title: currentTrack.title,
        artists: [...currentTrack.artists].map(artist => artist.title),
        link: currentTrack.link
      },
      sourceType: sourceInfo.type
    };
  }

  function getTrackList() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    const list = externalAPI.getTracksList();

    return [...list].map(track => ({
      artists: [...track.artists].map(artist => artist.title),
      title: track.title,
      link: track.link
    }));
  }

  function getVolumeLevel() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    return externalAPI.getVolume() * 100;
  }

  browser.runtime.onMessage.addListener(commandHandler);


  const stateEvents = [
    'EVENT_TRACK',
    'EVENT_STATE',
    'EVENT_CONTROLS',
  ];

  function updateState() {
    browser.runtime.sendMessage({ state: getState() });
  }
  function updateVolume() {
    browser.runtime.sendMessage({ volumeLevel: getVolumeLevel() });
  }
  function turnOnEvents() {
    const externalAPI = window.wrappedJSObject.externalAPI;

    exportFunction(updateState, window, { defineAs: 'updateStateExtension'});
    stateEvents.forEach(event => {
      externalAPI.on(externalAPI[event], window.wrappedJSObject.updateStateExtension);
    });

    exportFunction(updateVolume, window, { defineAs: 'updateVolumeExtension'});
    externalAPI.on(externalAPI.EVENT_VOLUME, window.wrappedJSObject.updateVolumeExtension);
  }
  turnOnEvents();
})();
