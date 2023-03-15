document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('login-button');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var errors = document.getElementById('errors');
    var success = document.getElementById('success');

    button.addEventListener('click', function () {
        //make a request to the server
        var formdata = new FormData();
        formdata.append("email", email.value);
        formdata.append("password", password.value);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch("http://www.artificea.com:8001/users/login/", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const token = data.token;
                if (token === undefined) {
                    errors.classList.remove('invisible');
                    success.classList.add('invisible');
                }else{
                chrome.storage.local.set({ 'auth-token': "Token " + token }).then((value) => {
                    errors.classList.add('invisible');
                    success.classList.remove('invisible');
                })
                    .catch((error) => {c
                        console.log(error);
                        errors.classList.remove('invisible');
                    });}

            });
        }
    );
});

