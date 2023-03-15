document.addEventListener('DOMContentLoaded', async function () {

    // check the local storage for auth-token
    let auth_token;
    await chrome.storage.local.get(['auth-token']).then((result) => {
        auth_token = result['auth-token'];
        if (auth_token === undefined) {
            // redirect to login page
            chrome.tabs.create({ url: chrome.runtime.getURL("login.html") });
        }
    });
    var button = document.getElementById('find-button');
    var answer = document.getElementById('answer');
    var question = document.getElementById('question');
    var loading_bar = document.getElementById('loading-bar');
    var model_engine = document.getElementById('model-engine');

    await chrome.storage.local.get(['model-engine']).then((result) => {
        if (result['model-engine'] !== undefined){
            model_engine.value = result['model-engine'];
        }
    });

    model_engine.addEventListener('change', async function () {
        await chrome.storage.local.set({ 'model-engine': model_engine.value });
    });

    await chrome.storage.local.get(['last-question']).then((result) => {
        if (result['last-question'] !== undefined){
            question.value = result['last-question'];
        }
    });

    await chrome.storage.local.get(['last-answer']).then((result) => {
        if (result['last-answer'] !== undefined){
            console.log(result['last-answer'])
            answer.innerHTML = result['last-answer'];
            answer.classList.remove('invisible');
        }
    });


    button.addEventListener('click', function () {
        //remove invisible class
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    return document.body.innerText;
                }
            }).then(async (results) => {
                loading_bar.classList.remove('invisible');
                answer.classList.add('invisible');
                var myHeaders = new Headers();
                myHeaders.append("Authorization", auth_token);

                console.log(auth_token);

                var formdata = new FormData();
                formdata.append("text", results[0].result);
                formdata.append("question", question.value);
                formdata.append("Authorization", auth_token);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };
                //make a post request to the server
                let response = await fetch('http://www.artificea.com:8001/inquisitio/'+model_engine.value, requestOptions
                ).then((response) => { return response.json(); })
                    .then(async (data) => {
                        answer.innerHTML = data['message'];
                        loading_bar.classList.add('invisible');
                        answer.classList.remove('invisible');
                        await chrome.storage.local.set({ 'last-answer': data['message'] });
                        await chrome.storage.local.set({ 'last-question': question.value });
                    }
                    );
            }).catch((err) => {
                console.error(err);
            });


        });
        //add invisible class

    });
})  ;

