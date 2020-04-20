// const apiURL = 'https://pdwebapi.longformgibberish.com';
const apiURL = 'https://pdwebapi-mf5.conveyor.cloud';

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

function login() {
  event.preventDefault();
  handleConnection();

  const loginForm = document.getElementById('app_loginForm');
  
  fetch(`${apiURL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({UserName: loginForm.querySelector('#uname').value, Password: loginForm.querySelector('#upassword').value})
  })
  .then(response => response.json())
  .then(data => {
    if (data === null) {
      return false;
    }

    if ('credentials' in navigator) {
      const cred = new PasswordCredential({
          id: data.userName,
          password: data.password,
          name: data.userName,
          additionalData: data.token
      });

      console.log(cred)
      navigator.credentials.store(cred)
      .then(() => {

      });

      navigator.credentials.get({password: true, mediation: 'silent'})
      .then(credential => {
        if (credential) {
          console.log(credential)
        }
      })
      .catch((err) => console.error('Error reading credentials: ' + err));
  }
  })
  .catch(error => {
    console.error(error);
  });
}