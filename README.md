Introduction
============

The goal of this project is to provide a web UI for the Google Play Games API
loosely based on the Android UI.

Getting started
===============

Follow the client only setup [instructions](https://developers.google.com/games/services/web/clientsetup).

Include the following at the end of your body element:

```html
<script src="{PATH_TO_JS}/underscore.js"></script>
<script src="{PATH_TO_JS}/api.js"></script>
<script src="https://apis.google.com/js/client:platform.js"></script>
```

Start using the API.

Fetch a list of leaderboards for the game.
```javascript
GoogleGamesApi.leaderboards.list(function(oResponse) {
  // Do something with the response.
});
```

Load achievement definitions and instances in sequence.
```javascript
var oAchievementInstanceMap = {};
GoogleGamesApi.achievements.definitions(function(oResponse) {
    _.each(oResponse.items, function(oAchievementDefinition) {
      oAchievementInstanceMap[oAchievementDefinition.id] = oAchievementDefinition;
    });
}).achievements.instances(function(oResponse) {
    _.each(oResponse.items, function(oAchievementInstance) {
      var oAchievementDefinition = oAchievementInstanceMap[oAchievementInstance.id];
      console.log('You have ' + oAchievementInstance.achievementState
          + ' the achievement ' + oAchievementDefinition.name);
    });
}, {playerId: 'me'});
```

Dependencies
============

UnderscoreJs is currently the only required third party library, but as the
code base grows, I will probably use RequireJs as well to modularize
dependencies.

API
===

The existing Google Play Games API requires unnecessary boilerplate and lots of
nested callback functions to order operations. Instead I wanted to wrap the
authentication boilerplate and create chainable methods so dependent data can
be loaded in sequence (ex. definitions & instances).

All methods have been namespaced on the GoogleGamesApi object and the returned
object from any method will have the same namespaces. Only chained calls will
wait on each other, calling GoogleGamesApi directly will execute all methods
asynchronously.

All methods will assert that the Google Play Games Services are available or
will raise an exception.

The signature for all API calls is a callback function followed by an object
that should contain any required or optional keys. The required/optional keys
can be found on the [Google Play Games developer website](https://developers.google.com/games/services/web/api/index).

Here is a list of the available API endpoints linked to their documentation:

[GoogleGamesApi.achievements.definitions](https://developers.google.com/games/services/web/api/achievementDefinitions/list)

[GoogleGamesApi.achievements.increment](https://developers.google.com/games/services/web/api/achievements/increment)
[GoogleGamesApi.achievements.instances](https://developers.google.com/games/services/web/api/achievements/list)
[GoogleGamesApi.achievements.reveal](https://developers.google.com/games/services/web/api/achievements/reveal)
[GoogleGamesApi.achievements.setStepsAtLeast](https://developers.google.com/games/services/web/api/achievements/setStepsAtLeast)
[GoogleGamesApi.achievements.unlock](https://developers.google.com/games/services/web/api/achievements/unlock)
[GoogleGamesApi.achievements.updateMultiple](https://developers.google.com/games/services/web/api/achievements/updateMultiple)

[GoogleGamesApi.applications.get](https://developers.google.com/games/services/web/api/applications/get)
[GoogleGamesApi.applications.played](https://developers.google.com/games/services/web/api/applications/played)

[GoogleGamesApi.events.definitions](https://developers.google.com/games/services/web/api/events/listDefinitions)
[GoogleGamesApi.events.instances](https://developers.google.com/games/services/web/api/events/listByPlayer)
[GoogleGamesApi.events.record](https://developers.google.com/games/services/web/api/events/record)

[GoogleGamesApi.leaderboards.get](https://developers.google.com/games/services/web/api/leaderboards/get)
[GoogleGamesApi.leaderboards.list](https://developers.google.com/games/services/web/api/leaderboards/list)

[GoogleGamesApi.metagame.config](https://developers.google.com/games/services/web/api/metagame/getMetagameConfig)
[GoogleGamesApi.metagame.playerCategories](https://developers.google.com/games/services/web/api/metagame/listCategoriesByPlayer)

[GoogleGamesApi.players.get](https://developers.google.com/games/services/web/api/players/get)
[GoogleGamesApi.players.list](https://developers.google.com/games/services/web/api/players/list)

[GoogleGamesApi.pushtokens.remove](https://developers.google.com/games/services/web/api/pushtokens/remove)
[GoogleGamesApi.pushtokens.update](https://developers.google.com/games/services/web/api/pushtokens/update)

[GoogleGamesApi.quest.milestone.claim](https://developers.google.com/games/services/web/api/questMilestones/claim)
[GoogleGamesApi.quest.accept](https://developers.google.com/games/services/web/api/quests/accept)
[GoogleGamesApi.quest.list](https://developers.google.com/games/services/web/api/quests/list)

[GoogleGamesApi.rooms.create](https://developers.google.com/games/services/web/api/rooms/create)
[GoogleGamesApi.rooms.decline](https://developers.google.com/games/services/web/api/rooms/decline)
[GoogleGamesApi.rooms.dismiss](https://developers.google.com/games/services/web/api/rooms/dismiss)
[GoogleGamesApi.rooms.get](https://developers.google.com/games/services/web/api/rooms/get)
[GoogleGamesApi.rooms.join](https://developers.google.com/games/services/web/api/rooms/join)
[GoogleGamesApi.rooms.leave](https://developers.google.com/games/services/web/api/rooms/leave)
[GoogleGamesApi.rooms.list](https://developers.google.com/games/services/web/api/rooms/list)
[GoogleGamesApi.rooms.reportStatus](https://developers.google.com/games/services/web/api/rooms/reportStatus)

[GoogleGamesApi.scores.get](https://developers.google.com/games/services/web/api/scores/get)
[GoogleGamesApi.scores.list](https://developers.google.com/games/services/web/api/scores/list)
[GoogleGamesApi.scores.listWindow](https://developers.google.com/games/services/web/api/scores/listWindow)
[GoogleGamesApi.scores.submit](https://developers.google.com/games/services/web/api/scores/submit)
[GoogleGamesApi.scores.submitMultiple](https://developers.google.com/games/services/web/api/scores/submitMultiple)

[GoogleGamesApi.snapshots.get](https://developers.google.com/games/services/web/api/snapshots/get)
[GoogleGamesApi.snapshots.list](https://developers.google.com/games/services/web/api/snapshots/list)

TBMP = Turn-based Multiplayer
[GoogleGamesApi.tbmp.cancel](https://developers.google.com/games/services/web/api/turnBasedMatches/cancel)
[GoogleGamesApi.tbmp.create](https://developers.google.com/games/services/web/api/turnBasedMatches/create)
[GoogleGamesApi.tbmp.decline](https://developers.google.com/games/services/web/api/turnBasedMatches/decline)
[GoogleGamesApi.tbmp.dismiss](https://developers.google.com/games/services/web/api/turnBasedMatches/dismiss)
[GoogleGamesApi.tbmp.finish](https://developers.google.com/games/services/web/api/turnBasedMatches/finish)
[GoogleGamesApi.tbmp.get](https://developers.google.com/games/services/web/api/turnBasedMatches/get)
[GoogleGamesApi.tbmp.join](https://developers.google.com/games/services/web/api/turnBasedMatches/join)
[GoogleGamesApi.tbmp.leave](https://developers.google.com/games/services/web/api/turnBasedMatches/leave)
[GoogleGamesApi.tbmp.leaveTurn](https://developers.google.com/games/services/web/api/turnBasedMatches/leaveTurn)
[GoogleGamesApi.tbmp.list](https://developers.google.com/games/services/web/api/turnBasedMatches/list)
[GoogleGamesApi.tbmp.rematch](https://developers.google.com/games/services/web/api/turnBasedMatches/rematch)
[GoogleGamesApi.tbmp.sync](https://developers.google.com/games/services/web/api/turnBasedMatches/sync)
[GoogleGamesApi.tbmp.takeTurn](https://developers.google.com/games/services/web/api/turnBasedMatches/takeTurn)

Roadmap
- [x] 0.1 - API wrapper written
- [ ] 0.2 - UI for achievements
- [ ] 0.3 - UI for leaderboards
- [ ] 0.4 - UI for players
- [ ] 0.5 - UI for quests
- [ ] 0.6 - modularize UI
- [ ] 1.0 - usable product