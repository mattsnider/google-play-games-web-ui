/**
 * The JS for the testing index page. No JS for the UI modules should be put here.
 */

// Make the global "google-signin-callback" available.
GooglePlayGamesHandleAuth = GoogleGamesApi.authCallback;

GoogleGamesApi.runWhenAuthenticated(function(oApi) {
  oApi.leaderboards.list(function(oResponse) {
    // Do something with the response.
  });
  oApi.quests.list(function(oResponse) {
    // Do something with the response.
  }, {playerId: 'me'});

  var aDefinitions,
      oPlayer;
  oApi.players.get(function(oResponse) {
    oPlayer = oResponse;
  }, {playerId: 'me'})
      .achievements.definitions(function(oResponse) {
        aDefinitions = oResponse.items;
      }).achievements.instances(function(oResponse) {
        GoogleGamesApi.ui.showAchievements(aDefinitions, oResponse.items);
      }, {playerId: 'me'});
});