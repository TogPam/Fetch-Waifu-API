function ran(type) {
    let pic = '';

    const apiUrl = 'https://api.waifu.im/search';  // Replace with the actual API endpoint URL
    const params = {
        included_tags: [type.toString()],
        height: '>=2000'
    };

    const queryParams = new URLSearchParams();

    for (const key in params) {
        if (Array.isArray(params[key])) {
            params[key].forEach(value => {
                queryParams.append(key, value);
            });
        } else {
            queryParams.set(key, params[key]);
        }
    }
    const requestUrl = `${apiUrl}?${queryParams.toString()}`;
    for (let i = 0; i < 50; i++) {
        fetch(requestUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed with status code: ' + response.status);
                }
            })
            .then(data => {
                const container = document.getElementById("listpic");
                pic += `<div class="w-78 m-2">
                    <a href="${data.images[0].url}" target="_blank">
                    <img class="w-full h-full rounded-lg object-cover" src="${data.images[0].url}">
                    </a>
                </div>`;
                //document.getElementById("pic").src = data.images[0].url;
                container.innerHTML = pic;
            })
            .catch(error => {
                console.error('An error occurred:', error.message);
            });
    }
}

const apiUrl = 'https://api.waifu.im/tags';
fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Request failed with status code: ' + response.status);
        }
    })
    .then(data => {
        console.log(data);
        const container = document.getElementById("category");

        let button = '';
        data.versatile.forEach(keyword => {
            button += `<button class="text-white hover:text-red-600" onclick="ran('${keyword}')"> ${keyword}</button>`
        });
        data.nsfw.forEach(keyword => {
            button += `<button class="text-white hover:text-red-600" onclick="ran('${keyword}')"> ${keyword}</button>`
        });
        container.innerHTML = button;
    })
    .catch(error => {
        console.error('An error occurred:', error.message);
    });
