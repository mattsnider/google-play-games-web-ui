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

  var oAchievementInstanceMap = {};
  var oPlayer;
  oApi.players.get(function(oResponse) {
    oPlayer = oResponse;
  }, {playerId: 'me'})
      .achievements.definitions(function(oResponse) {
        _.each(oResponse.items, function(oAchievementDefinition) {
          oAchievementInstanceMap[oAchievementDefinition.id] =
              oAchievementDefinition;
        });
      }).achievements.instances(function(oResponse) {
        _.each(oResponse.items, function(oAchievementInstance) {
          var oAchievementDefinition = oAchievementInstanceMap[oAchievementInstance.id];
          console.log('You have ' + oAchievementInstance.achievementState
              + ' the achievement ' + oAchievementDefinition.name);
        });
      }, {playerId: 'me'});
});