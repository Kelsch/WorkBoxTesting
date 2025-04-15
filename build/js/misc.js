function getInstallerRating() {
    let token = localStorage.getItem('token');
    fetch(`${apiURL}/api/installerAppData/getInstallerRating?businessId=${cred.name}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status);
            }

            return response.json();
        })
        .then(data => {
            const installerRating = document.getElementById("installer_rating");
            
            installerRating.innerHTML = `Rating: ${data}`;
        })
        .catch(err => {
            if (parseInt(err.message) === 401) {
                login();
            }
            else {
                // logout();
            }
        });
}