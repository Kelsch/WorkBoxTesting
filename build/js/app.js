// const apiURL = 'https://pdwebapi.longformgibberish.com';
const apiURL = 'https://pdwebapiazure.azurewebsites.net';
// const apiURL = 'https://pdwebapi.conveyor.cloud';
// const apiURL = 'https://192.168.1.43:45455';
let loginButtonPressed = false;
let cred;

checkLogin();

// After: JSON.stringify keeps date as-is!
Date.prototype.toLocalJSON = function () {
  const hoursDiff = this.getHours() - this.getTimezoneOffset() / 60;
  this.setHours(hoursDiff);
  return this.toISOString();
};

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
    isReachable("https://google.com/").then(function (online) {
      if (online) {
        // handle online status
        console.log('online');
        if (typeof document !== 'undefined') {
          document.getElementById('offline_indicator').classList.remove("offline-show");
        }
      } else {
        console.log('no connectivity');
        document.getElementById('offline_indicator').classList.add("offline-show");
      }
    });
  } else {
    // handle offline status
    console.log('offline');
    document.getElementById('offline_indicator').classList.add("offline-show");
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
    .then(function (resp) {
      return resp && (resp.ok || resp.type === 'opaque');
    })
    .catch(function (err) {
      console.warn('[conn test failure]:', err);
    });
}

function checkLogin() {
  if (typeof event !== 'undefined') {
    event.preventDefault();
    loginButtonPressed = true;
  }
  if ('credentials' in navigator) {
    navigator.credentials.get()
      .then(async () => {
        await navigator.credentials.get({ password: true, mediation: 'optional' })
          .then(credential => {
            cred = credential;
            if (credential && localStorage.hasOwnProperty('token')) {
              userAuthenticated();
            }
            else {
              localStorage.removeItem('token');
              simulateLoginAction();
              // login();
            }
          })
          .catch((err) => {
            console.error('Error reading credentials: ' + err);
            localStorage.removeItem('token');
            simulateLoginAction();
            // login();
          });
      })
      .catch(result => {
        // console.log(result);
        simulateLoginAction();
        // login();
      });
  }
  else {
    login();
  }
  handleConnection();
}

function login() {
  if (typeof document === 'undefined') {
    return;
  }
  const loginForm = document.getElementById('app_loginForm');

  let user = {
    userName: loginForm.querySelector('.mdc-text-field__input[aria-labelledby="loginForm-username-label"]').value,
    password: loginForm.querySelector('.mdc-text-field__input[aria-labelledby="loginForm-password-label"]').value
  };

  if (cred != null && !loginButtonPressed) {
    user.userName = cred.id;
    user.password = cred.password;
  }

  if (user.userName === "") {
    return false;
  }


  fetch(`${apiURL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ UserName: user.userName, Password: user.password })
  })
    .then(response => response.json())
    .then(data => {
      if (data === null) {
        return;
      }

      if (Object.keys(data).length === 0 && data.constructor === Object) {
        alert('User Name or Password not valid');
        return;
      }

      if ('credentials' in navigator) {
        if (cred == null) {
          try {
            const newCred = new PasswordCredential({
              id: data.userName,
              password: data.password,
              name: data.businessId
            });

            navigator.credentials.store(newCred);
            cred = newCred;
          } catch (error) {
            cred = {
              id: data.userName,
              password: data.password,
              name: data.businessId
            };
          }
        }
      }
      else {
        cred = {
          id: data.userName,
          password: data.password,
          name: data.businessId
        };
      }
      localStorage.setItem('token', data.token);
      userAuthenticated();
    })
    .catch(error => {
      console.error(error);
      const serverDownElement = document.getElementById('offline_indicator');
      if (navigator.onLine && cred != null && user != null && error == "TypeError: Failed to fetch") {
        serverDownElement.textContent = "Server Down";
        serverDownElement.classList.add("offline-show");

        const cacheAvailable = 'caches' in self;
        if (!cacheAvailable) {
            return;
        }
        const cacheName = 'job-list';

        caches.has(cacheName).then(() => {
          userAuthenticated();
        });

      }
      // else {
      //   serverDownElement.classList.remove("offline-show");
      // logout();
      // }
    });
}

function userAuthenticated() {
  const topbarMenu = document.getElementById('settings_menu');
  const loginForm = document.getElementById('app_loginForm');
  const fabRequestButton = document.getElementById('fab_PORequest');
  if (token === null) {
    token = localStorage.getItem('token');
  }

  loginForm.classList.remove('loginForm-show');
  topbarMenu.classList.remove('loginForm-none');
  fabRequestButton.classList.remove('loginForm-none');
  showCalendar(currentMonth, currentYear);
  setupSwipeListener(calendarElement);
}

function logout() {
  token = null;
  localStorage.removeItem('token');

  const topbarMenu = document.getElementById('settings_menu');
  const loginForm = document.getElementById('app_loginForm');
  const calendarContainer = document.getElementById('create_calendar');
  const dateSelectedContainer = document.getElementById('date_selected');
  const jobContainer = document.getElementById('jobs');
  const fabRequestButton = document.getElementById('fab_PORequest');

  calendarContainer.innerHTML = "";
  dateSelectedContainer.innerHTML = "";
  jobContainer.innerHTML = "";

  fabRequestButton.classList.add('loginForm-none');

  topbarMenu.classList.add('loginForm-none');

  loginForm.classList.add('loginForm-show');
}