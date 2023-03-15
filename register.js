document.addEventListener('DOMContentLoaded', async function () {
    var button = document.getElementById('register-button');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var password2 = document.getElementById('password2');

    var profession = document.getElementById('profession');
    var first_name = document.getElementById('first_name');
    var last_name = document.getElementById('last_name');

    var beta_code = document.getElementById('beta_code');

    var password_errors = document.getElementById('password-errors');

    var errors = document.getElementById('errors');
    var success = document.getElementById('success');



    button.addEventListener('click', async function () {
        password_errors.classList.add('invisible');

        if (password.value != password2.value) {
            password_errors.innerHTML = "Passwords do not match";
            password_errors.classList.remove('invisible');
            return;
        }
        //make a request to the server
        var formdata = new FormData();
        formdata.append("email", email.value);
        formdata.append("password", password.value);

        formdata.append("profession", profession.value);
        formdata.append("first_name", first_name.value);
        formdata.append("last_name", last_name.value);

        formdata.append("beta_code", beta_code.value);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        //select all the p tags with the class error
        var error_tags = document.querySelectorAll('p.errors');
        errors.classList.add('invisible');
        //loop through the error tags
        for (var i = 0; i < error_tags.length; i++) {
            error_tags[i].classList.add('invisible');
        }

        await fetch("http://www.artificea.com:8001/users/register/", requestOptions)
            .then(async (response) => {
                var status = response.status;
                response.json().catch((err) => {
                    console.log(err);
                }).then((data) => {

                        errors.innerHTML = "Invalid beta code";
                        console.log(response);
                        if (status == 401) {
                            errors.innerHTML = "Invalid beta code";
                            errors.classList.remove('invisible');
                        } else if (status == 201) {
                            success.innerHTML = "You have successfully registered, please check your email to verify your account";
                            success.classList.remove('invisible');
                        } else if (status == 400) {
                            //loop through the errors
                            console.log(data);
                            for (var key in data) {
                                console.log(key);
                                var error_tag = document.querySelector("p#" + key);
                                error_tag.innerHTML = data[key];
                                error_tag.classList.remove('invisible');
                            }
                            errors.classList.remove('invisible');
                        }
                }
                );
            }
            );
    });
});
