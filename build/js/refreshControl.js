let _startY;
const appContainer = document.querySelector('#app_container');

appContainer.addEventListener('touchstart', e => {
    _startY = e.touches[0].pageY;
}, {passive: true});

appContainer.addEventListener('touchmove', e => {
    const y = e.touches[0].pageY;
    // Activate custom pull-to-refresh effects when at the top of the container
    // and user is scrolling up.
    if (document.scrollingElement.scrollTop === 0 && y > _startY + 30 && !document.body.classList.contains('refreshing')) {
        // refresh
        simulateRefreshAction();
    }
}, {passive: true});

async function simulateRefreshAction() {
    const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
  
    const transitionEnd = function(propertyName, node) {
      return new Promise(resolve => {
        function callback(e) {
          e.stopPropagation();
          if (e.propertyName === propertyName) {
            node.removeEventListener('transitionend', callback);
            resolve(e);
          }
        }
        node.addEventListener('transitionend', callback);
      });
    }
  
    const refresher = document.querySelector('.refresher');
  
    document.body.classList.add('refreshing');
    refreshData();
    await sleep(500);
  
    refresher.classList.add('shrink');
    await transitionEnd('transform', refresher);
    refresher.classList.add('done');
  
    refresher.classList.remove('shrink');
    document.body.classList.remove('refreshing');
    await sleep(0); // let new styles settle.
    refresher.classList.remove('done');
  }

  function refreshData() {
      const selectedDateElement = document.querySelectorAll('.calendar-monthHeader')[1];
      const selectedDate = new Date(selectedDateElement.textContent);

      showCalendar(selectedDate.getMonth(), selectedDate.getFullYear());
  }