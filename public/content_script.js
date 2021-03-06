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

      case 'toggle-dislike':
        await externalAPI.toggleDislike();
        response = { state: getState() };
        break;
      case 'toggle-like':
        await externalAPI.toggleLike();
        response = { state: getState() };
        break;
    }

    browser.runtime.sendMessage(response);
  }

  function getState(reTry = true) {
    try {
      const externalAPI = window.wrappedJSObject.externalAPI;
      const currentTrack = externalAPI.getCurrentTrack();
      const sourceInfo = externalAPI.getSourceInfo();

      return {
        isPlaying: externalAPI.isPlaying(),
        controls: externalAPI.getControls(),
        currentTrack: {
          title: currentTrack.title,
          artists: [...currentTrack.artists].map(artist => artist.title),
          link: currentTrack.link,
          liked: currentTrack.liked,
          disliked: currentTrack.disliked,
        },
        sourceType: sourceInfo.type
      };
    } catch(e) {
      if (!reTry) {
        setTimeout(getState, 2000, false);
      }
    }
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
  function notifyAdvert(advertData) {
    browser.runtime.sendMessage({ advertStatus: advertData });
  }
  function turnOnEvents() {
    const externalAPI = window.wrappedJSObject.externalAPI;

    // common events
    exportFunction(updateState, window, { defineAs: 'updateStateExtension'});
    stateEvents.forEach(event => {
      externalAPI.on(externalAPI[event], window.wrappedJSObject.updateStateExtension);
    });

    // volume change
    exportFunction(updateVolume, window, { defineAs: 'updateVolumeExtension'});
    externalAPI.on(externalAPI.EVENT_VOLUME, window.wrappedJSObject.updateVolumeExtension);

    // advert event
    exportFunction(notifyAdvert, window, { defineAs: 'updateAdvertStatusExtension'});
    externalAPI.on(externalAPI.EVENT_ADVERT, window.wrappedJSObject.updateAdvertStatusExtension);
  }
  turnOnEvents();
})();
