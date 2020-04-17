const apiURL = 'https://pdwebapi.longformgibberish.com';
// const apiURL = 'https://pdwebapi-mf5.conveyor.cloud';

function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}

function handleConnection() {
  if (navigator.onLine) {
    isReachable("https://google.com/").then(function(online) {
      if (online) {
        // handle online status
        console.log('online');
        document.body.classList.remove("app-offline");
      } else {
        console.log('no connectivity');
      }
    });
  } else {
    // handle offline status
    console.log('offline');
    document.body.classList.add("app-offline");
  }
}

function isReachable(url) {
  /**
   * Note: fetch() still "succeeds" for 404s on subdirectories,
   * which is ok when only testing for domain reachability.
   *
   * Example:
   *   https://google.com/noexist does not throw
   *   https://noexist.com/noexist does throw
   */
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then(function(resp) {
      return resp && (resp.ok || resp.type === 'opaque');
    })
    .catch(function(err) {
      console.warn('[conn test failure]:', err);
    });
}