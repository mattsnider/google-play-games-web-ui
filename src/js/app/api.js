/**
 * The JS for wrapping the Google Play Games Services in a promise like API.
 */
var GoogleGamesApi = function(DEBUG) {

  var gapi,
      oInstance,
      bAuth = false,
      aOnAuth = [];

  //
  // Create some unique exceptions.
  //

  function ApiUnavailableException(message){
    this.message = message;
  }
  ApiUnavailableException.prototype = new Error();

  function ApiUnauthenticatedException(message){
    this.message = message;
  }
  ApiUnauthenticatedException.prototype = new Error();

  //
  // Internal functions for handling API logic.
  //

  /**
   * Check if the Google API and Google Games API are available.
   *
   * @return The google API surface.
   */
  function fnApiClient() {
    if (!gapi) {
      if (!window.gapi) {
        throw new ApiUnavailableException('Google API unavailable');
      }
      gapi = window.gapi;
    }

    if (!bAuth) {
      throw new ApiUnauthenticatedException('Google API unauthenticated');
    }

    return gapi.client;
  }

  /**
   * Ensures the Games API is loaded.
   */
  function fnCheckGames() {
    if (!fnApiClient().games) {
      initGameApi();
    }
  }

  /**
   * Creates an API endpoint wrapper for the Google Play Games APIs.
   *
   * @param sApiEndpoint The dot path of the API endpoint.
   * @param oContext The execution context for the API.
   * @return A wrapped function.
   */
  function fnCreateApi(sApiEndpoint, oContext) {
    return _.bind(function(fnCallback, oCfg) {
      return fnRunWhenReady(this, sApiEndpoint, fnCallback, oCfg);
    }, oContext);
  }

  function initGameApi(fnCallback) {
    if (fnApiClient().games) {
      oInstance.__bIsReady__ = true;
    } else {
      fnApiClient().load('games', 'v1', function(oResponse) {
        if (fnCallback) {
          fnCallback(oResponse);
        }
        fnMakeReady(oInstance);
      });
    }

    return oInstance;
  }

  /**
   * Call this when the previous async request has finished. This should only
   * be used internally.
   */
  function fnMakeReady(oContext) {
    var a = oContext.__aWhenReady__;
    oContext.__bIsReady__ = true;
    oContext.__aWhenReady__ = [];

    _.each(a, function(fn) {
      fn.call(oContext);
    });
  }

  /**
   *
   *
   * @param oContext Required. The execution context.
   * @param sRemote Required. The Google Play Games API function to execute.
   * @param fnCallback Required. A callback function to execute when the remote
   *     API function returns.
   * @param oCfg Optional. The configuration options.
   * @return New instance of the context.
   */
  function fnRunWhenReady(oContext, sRemote, fnCallback, oCfg) {
    var oNext = new P(),
        aRemote = sRemote.split('.');

    fnCheckGames();

    function fn() {
      fnApiClient().games[aRemote[0]][aRemote[1]](oCfg).execute(
          function(oResponse) {
            fnMakeReady(oNext);

            if (DEBUG) {
              console.log('Callback for ' + sRemote);
              console.log(oResponse);
            }

            if (fnCallback) {
              fnCallback(oResponse);
            }
          });
    }

    if (oContext.__bIsReady__) {
      fn();
    } else {
      oContext.__aWhenReady__.push(fn);
    }

    return oNext;
  }

  // Create the API surface.

  function P() {
    var that = this;

    // Internal variables for managing state ready state of the API.
    that.__aWhenReady__ = [];
    that.__bIsReady__ = false;

    // Setup the API.
    that.achievements = {
      definitions: fnCreateApi('achievementDefinitions.list', that),
      increment: fnCreateApi('achievements.increment', that),
      instances: fnCreateApi('achievements.list', that),
      reveal: fnCreateApi('achievements.reveal', that),
      setStepsAtLeast: fnCreateApi('achievements.setStepsAtLeast', that),
      unlock: fnCreateApi('achievements.unlock', that),
      updateMultiple: fnCreateApi('achievements.updateMultiple', that)
    };

    that.applications = {
      get: fnCreateApi('applications.get', that),
      played: fnCreateApi('applications.played', that)
    };

    that.events = {
      definitions: fnCreateApi('events.listDefinitions', that),
      instances: fnCreateApi('events.listByPlayer', that),
      record: fnCreateApi('events.record', that)
    };

    that.leaderboards = {
      get: fnCreateApi('leaderboards.get', that),
      list: fnCreateApi('leaderboards.list', that)
    };

    that.metagame = {
      config: fnCreateApi('metagame.getMetagameConfig', that),
      playerCategories: fnCreateApi('metagame.listCategoriesByPlayer', that)
    };

    that.players = {
      get: fnCreateApi('players.get', that),
      list: fnCreateApi('players.list', that)
    };

    that.pushtokens = {
      remove: fnCreateApi('pushtokens.remove', that),
      update: fnCreateApi('pushtokens.update', that)
    };

    that.quests = {
      milestone: {
        claim: fnCreateApi('questMilestones.claim', that)
      },
      accept: fnCreateApi('quests.accept', that),
      list: fnCreateApi('quests.list', that)
    };

    that.rooms = {
      create: fnCreateApi('rooms.create', that),
      decline: fnCreateApi('rooms.decline', that),
      dismiss: fnCreateApi('rooms.dismiss', that),
      get: fnCreateApi('rooms.get', that),
      join: fnCreateApi('rooms.join', that),
      leave: fnCreateApi('rooms.leave', that),
      list: fnCreateApi('rooms.list', that),
      reportStatus: fnCreateApi('rooms.reportStatus', that)
    };

    that.scores = {
      get: fnCreateApi('scores.get', that),
      list: fnCreateApi('scores.list', that),
      listWindow: fnCreateApi('scores.listWindow', that),
      submit: fnCreateApi('scores.submit', that),
      submitMultiple: fnCreateApi('scores.submitMultiple', that)
    };

    that.snapshots = {
      get: fnCreateApi('snapshots.get', that),
      list: fnCreateApi('snapshots.list', that)
    };

    that.tbmp = {
      cancel: fnCreateApi('turnBasedMatches.cancel', that),
      create: fnCreateApi('turnBasedMatches.create', that),
      decline: fnCreateApi('turnBasedMatches.decline', that),
      dismiss: fnCreateApi('turnBasedMatches.dismiss', that),
      finish: fnCreateApi('turnBasedMatches.finish', that),
      get: fnCreateApi('turnBasedMatches.get', that),
      join: fnCreateApi('turnBasedMatches.join', that),
      leave: fnCreateApi('turnBasedMatches.leave', that),
      leaveTurn: fnCreateApi('turnBasedMatches.leaveTurn', that),
      list: fnCreateApi('turnBasedMatches.list', that),
      rematch: fnCreateApi('turnBasedMatches.rematch', that),
      sync: fnCreateApi('turnBasedMatches.sync', that),
      takeTurn: fnCreateApi('turnBasedMatches.takeTurn', that)
    };
  }

  P.prototype = {
  };

  // TODO(msnider): All APIs need to check for authentication errors and return
  // a recoverable.

  // Create the root instance object.
  oInstance = new P();

  return {
    // Make exceptions available globally.
    ApiUnavailableException: ApiUnavailableException,
    ApiUnauthenticatedException: ApiUnauthenticatedException,

    /**
     * Google API authentication handler.
     *
     * @param authResult The auth result object provided by Google.
     */
    authCallback: function(authResult) {
      if (authResult && authResult.error == null && authResult.status &&
          authResult.status.signed_in) {
        console.log('succeeded');
        bAuth = true;
        _.each(aOnAuth, function(fn) {
          fn(oInstance);
        });
      } else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult.error);
      }
    },

    /**
     * Check if the API is authenticated yet or not and either execute fn right
     * away or queue it up to execute after authentication.
     *
     * @param fn The function to execute.
     */
    runWhenAuthenticated: function(fn) {
      if (bAuth) {
        fn(oInstance);
      } else {
        aOnAuth.push(fn);
      }
    }
  };
}(true);