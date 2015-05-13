/**
 * The JS for the implementing the UI.
 */
(function(oApi, DEBUG) {
  var WINDOW_HTML = '<div class="GoogleGamesApi-mask"></div>'
      + '<div class="GoogleGamesApi">'
      + '<div class="GoogleGamesApi-title"></div>'
      + '<div class="GoogleGamesApi-subtitle"></div>'
      + '<div class="GoogleGamesApi-content"></div>'
      + '</div>',

      ZINDEX_START = 100,

      aWindowStack = [];

  //
  // Event Helper functions.
  //

  function fnAddEventListener(el, sEvent, fn) {
    if(window.addEventListener){ // modern browsers including IE9+
      el.addEventListener(sEvent, fn, false);
    } else if(window.attachEvent) { // IE8 and below
      el.attachEvent('on' + sEvent, fn);
    } else {
      el['on' + sEvent] = fn;
    }
  }

  function fnRemoveEventListener(el, sEvent, fn) {
    if(window.removeEventListener){
      el.removeEventListener(sEvent, fn, false);
    } else if(window.detachEvent) {
      el.detachEvent('on' + sEvent, fn);
    } else {
      el['on' + sEvent] = null;
    }
  }

  function fnHaltEvent(oEvent) {
    oEvent = oEvent || window.event;
    oEvent.cancelBubble = true;
    if (oEvent.stopPropagation) {
      oEvent.stopPropagation();
    }
  }

  //
  // DOM helper functions.
  //

  function fnGetViewport() {
    return [
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      Math.max(document.documentElement.clientHeight, window.innerHeight ||0)
    ];
  }

  function fnInsertAfter(el, elAfter) {
    if (elAfter.nextSibling) {
      return elAfter.parentElement.insertBefore(el, elAfter.nextSibling);
    } else {
      return elAfter.parentElement.appendChild(el);
    }
  }

  function fnPrependChild(el, elParent) {
    if (elParent.firstChild) {
      return elParent.insertBefore(el, elParent.firstChild);
    } else {
      return elParent.appendChild(el);
    }
  }

  //
  // Business Logic.
  //

  // Remove elements and events related to the window.
  function fnMaskClick() {
    var elContainer = aWindowStack.pop(),
        elMask = aWindowStack.pop();
    fnRemoveEventListener(elMask, 'click', fnMaskClick);
    elMask.parentElement.removeChild(elMask);
    elContainer.parentElement.removeChild(elContainer);
    elMask = null;
    elContainer = null;
  }

  function fnGetWindow(fnRender, aRendererData) {
    var iZIndex,
        elHolder = document.createElement('div'),
        aViewport = fnGetViewport(),
        aBodyPadding = [
          document.body.paddingLeft || 0,
          document.body.paddingTop || 0
        ],
        elContainer,
        elMask;

    if (aWindowStack.length) {
      iZIndex = _.last(aWindowStack).style.zIndex + 1;
    } else {
      iZIndex = ZINDEX_START;
    }

    elHolder.innerHTML = WINDOW_HTML;

    // TODO: Handle rotation
    // TODO: Handle resize

    // Build the mask overlay and insert into document.
    elMask = elHolder.firstChild;
    elMask.style.height = aViewport[1] + 'px';
    elMask.style.left = -aBodyPadding[0] + 'px';
    elMask.style.width = aViewport[0] + 'px';
    elMask.style.top = -aBodyPadding[1] + 'px';
    elMask.style.zIndex = iZIndex++;
    elMask = fnPrependChild(elMask, document.body);
    aWindowStack.push(elMask);

    // Build the container and insert into document.
    elContainer = elHolder.lastChild;
    // todo(msnider): Calculate height/width from viewport and content size.
    elContainer.style.height = '600px';
    elContainer.style.left = (aViewport[0] - 800) / 2 - aBodyPadding[0] + 'px';
    elContainer.style.width = '800px';
    elContainer.style.top = (aViewport[1] - 600) / 2 - aBodyPadding[1] + 'px';
    elContainer.style.zIndex = iZIndex;
    elContainer = fnInsertAfter(elContainer, elMask);
    aWindowStack.push(elContainer);

    // Clean up the shadow DOM reference.
    elHolder = null;

    // Attach listeners.
    fnAddEventListener(elMask, 'click', fnMaskClick);
    fnRender(elContainer, aRendererData);
  }

  function fnRenderAchievements(elContainer, aData) {
    var aDefinitions = aData[0],
        aInstances = aData[1],
        oAchievementInstanceMap = {},
        iTotal = aDefinitions.length,
        iUnlocked = 0,
        iPercent;

    _.each(aDefinitions, function(oAchievementDefinition) {
      oAchievementInstanceMap[oAchievementDefinition.id] =
          oAchievementDefinition;
    });

    _.each(aInstances, function(oAchievementInstance) {
      if (oAchievementInstance.achievementState === 'UNLOCKED') {
        iUnlocked++;
      }

    });

    iPercent = Math.ceil(iUnlocked * 100 / iTotal);

    elContainer.firstChild.innerHTML = 'Achievements ' + iUnlocked + "/"
        + iTotal + " unlocked";
    elContainer.childNodes[1].innerHTML = '<div class="GoogleGamesApi-bar">'
        + '<div class="GoogleGamesApi-bar-color"></div>'
        + '<div class="GoogleGamesApi-bar-text">' + iPercent + '%</div>'
        + '</div>';
    elContainer.childNodes[1].firstChild.firstChild.style.width =
        iPercent + '%';
  }

  oApi.ui = {
    showAchievements: function(aDefinitions, aInstances) {
      fnGetWindow(fnRenderAchievements, [
        aDefinitions,
        aInstances
      ]);
    }
  };
}(GoogleGamesApi, true));