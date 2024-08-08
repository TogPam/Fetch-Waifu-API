async function exportIMG(type) {
    const apiUrl = 'https://api.waifu.im/search';
    const params = {
        included_tags: [type],
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


    const container = document.getElementById("listpic");
    container.innerHTML = '';
    //tạo container
    for (let j = 0; j < 4; j++) {
        const promiseArray = [];
        //mỗi container 10 ảnh
        for (let i = 0; i < 10; i++) {
            promiseArray.push(fetch(requestUrl)
                .then(response => {
                    if (response.ok) return response.json();
                })
                .catch(e => console.error(e)));
        }
        try {
            const results = await Promise.all(promiseArray);
            const fragment = makePic(results);
            //update DOM
            container.appendChild(fragment);
        } catch (e) {
            console.error(e);
        }
    }
}

function makePic(results) {
    const fragment = document.createDocumentFragment();
    // Chạy mảng results để xây dựng chuỗi HTML cho các hình ảnh
    results.forEach(data => {
        const div = document.createElement('div');
        div.className = 'w-78 m-2';

        const a = document.createElement('a');
        a.href = `${data.images[0].url}`;
        a.target = '_blank';

        const img = document.createElement('img');
        img.className = 'w-full h-full rounded-lg object-cover';
        img.src = `${data.images[0].url}`;
        img.loading = 'lazy';

        a.appendChild(img);
        div.appendChild(a);
        fragment.appendChild(div);
    });
    return fragment;
}

function closeWarning() {
    document.getElementById("warning").classList.add("hidden");
}

function Warning(type) {
    document.getElementById("warning").classList.remove("hidden");
    document.getElementById("accept").addEventListener("click", () => {
        closeWarning();
        exportIMG(type);
    });
}