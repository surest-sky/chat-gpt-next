var axios = require('axios');
var data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
});

var config = {
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
    },
    data : data
};

axios(config)
.then(function (response) {
    console.log(JSON.stringify(response.data));
})
.catch(function (error) {
    console.log(error.message);
});
