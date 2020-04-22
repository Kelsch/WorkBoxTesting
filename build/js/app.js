// const apiURL = 'https://pdwebapi.longformgibberish.com';
const apiURL = 'https://pdwebapi-mf5.conveyor.cloud';
let loginButtonPressed = false;
let cred;

checkLogin();

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
              localStorage.removeItem('token')
              login();
            }
          })
          .catch((err) => {
            console.error('Error reading credentials: ' + err);
            localStorage.removeItem('token');
            login();
          });
      })
      .catch(result => {
        // console.log(result);
        login();
      });
  }
  handleConnection();
}

async function login() {
  const loginForm = document.getElementById('app_loginForm');
  
  let user = {
    userName: loginForm.querySelector('#username').value,
    password: loginForm.querySelector('#password').value
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
        return false;
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

        localStorage.setItem('token', data.token);

        userAuthenticated();
      }
    })
    // .catch(error => {
    //   console.error(error);
    // });
}

function userAuthenticated() {
  const loginForm = document.getElementById('app_loginForm');
  if (token === null) {
    token = localStorage.getItem('token');
  }

  loginForm.classList.remove('loginForm-show');
  showCalendar(currentMonth, currentYear);
  setupSwipeListener(calendarElement);
}

function logout() {
  token = null;
  localStorage.removeItem('token');

  const loginForm = document.getElementById('app_loginForm');
  const calendarContainer = document.getElementById('create_calendar');
  const dateSelectedContainer = document.getElementById('date_selected');
  const jobContainer = document.getElementById('jobs');

  calendarContainer.innerHTML = "";
  dateSelectedContainer.innerHTML = "";
  jobContainer.innerHTML = "";

  loginForm.classList.add('loginForm-show');
}