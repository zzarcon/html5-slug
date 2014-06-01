(function() {
  var scope;
  var lastObserverId = 0;
  var observers = {};
  var BRACKETS_REGEX = /(\{\{[\w\.]*\}\})/g;

  $(document).ready(parseHtml);

  function parseHtml() {
    var html = $('body').html();
    var key;

    html = html.replace(BRACKETS_REGEX, function(match, text, offset, string) {
      key = match.replace(/{{/, '').replace('}}', '');
      lastObserverId++;
      observers[lastObserverId] = key;

      return '<o data-observer-id="' + lastObserverId + '">' + key + "</o>"; //Improve this
    });

    $('body').html(html);

    for (var key in observers) {
      updateValue(key);
    }
  };

  function updateValue(id) {
    var keys = observers[id].split('.');
    var obj = JSON.parse(JSON.stringify(scope)); //Shit
    var text;

    keys.forEach(function(key) {
      if (typeof obj[key] !== 'object') {
        text = obj[key];
      } else {
        obj = obj[key];
      }
    });

    return $('body').find('o[data-observer-id="' + id + '"]').text(text);
  }

  function watch(s) {
    scope = s;
  }

  this.HtmlObserver = {
    observe: watch,
    updateValue: updateValue
  };
}).call(window);