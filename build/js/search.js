async function performSearch() {
    const searchInputElement = document.getElementById('search_input');
    const searchTerm = searchInputElement.value;
    
    if (searchTerm.length > 1) {
        const cacheAvailable = 'caches' in self;
        if (!cacheAvailable && selectedInstallDate != null) {
            return;
        }
        const cacheName = 'job-list';
        const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`);

        caches.open(cacheName).then(cache => {
            cache.match(request).then((response) => {
                if (response == undefined) {
                    return;
                }
                
                response.json().then(jobs => {
                    const filteredJobs = jobs.filter(job => {
                        // console.log(job.orderId.toLowerCase(), searchTerm.toLowerCase(), job.orderId.toLowerCase().includes(searchTerm.toLowerCase()), job.name.toLowerCase().includes(searchTerm))
                        return (job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || job.name.toLowerCase().includes(searchTerm.toLowerCase()));
                    });

                    const ul = document.getElementById('search_jobs_list').querySelector('ul');
                    ul.innerHTML = "";

                    filteredJobs.forEach(job => {
                        let listItem = document.createElement("li");
                        listItem.classList.add("mdc-list-item");
                        listItem.setAttribute('data-mdc-dialog-action', 'accept');

                        let jobRipple = document.createElement('span');
                        jobRipple.classList.add('mdc-list-item__ripple');

                        let jobInfoContainer = document.createElement('span');
                        jobInfoContainer.classList.add('mdc-list-item__text');

                        let jobInfoOrderId = document.createElement('span');
                        jobInfoOrderId.classList.add('mdc-list-item__primary-text');
                        jobInfoOrderId.textContent = job.orderId;

                        let jobInfoName = document.createElement('span');
                        jobInfoName.classList.add('mdc-list-item__secondary-text');
                        jobInfoName.textContent = job.name;

                        listItem.appendChild(jobRipple);
                        jobInfoContainer.appendChild(jobInfoOrderId);
                        jobInfoContainer.appendChild(jobInfoName);

                        listItem.setAttribute('tabindex', 0);
                        listItem.setAttribute('jobid', job.jobId);
                        listItem.setAttribute('installdate', job.installDate);
                        listItem.appendChild(jobInfoContainer);
                        listItem.onclick = searchJobClicked;
                        ul.appendChild(listItem);

                    });
                }).finally(() => {
                    const element = document.getElementById('search_jobs_list');
                    ListAnimation(element);
                });
            });
        }).catch(err => {
            console.error(err)
        });
    }
}

async function searchJobClicked(event) {
    const jobInstallDate = new Date(this.getAttribute('installdate'));
    // console.log(event, jobInstallDate, jobInstallDate.toLocaleDateString().replaceAll("/", "-"))
    showCalendar(jobInstallDate.getMonth(), jobInstallDate.getFullYear());
    // const installDate = this.querySelector(".secondary-text").innerHTML.replaceAll("/", "-");
    // console.log(dialogSearchJobs)
    // dialogSearchJobs.close();
    dateSelected(document.getElementById(jobInstallDate.toLocaleDateString().replaceAll("/", "-")));
    jobClicked(this.getAttribute('jobid'));
}