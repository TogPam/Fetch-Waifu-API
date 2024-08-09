async function exportIMG(type) { //hàm xuất hình
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
    //remove phần tử cũ
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    //5 ảnh đầu sẽ thật nhanh nên sẽ update DOM cho mỗi response
    for (let i = 0; i < 5; i++) {
        fetch(requestUrl)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                try {
                    const fragment = document.createDocumentFragment();
                    makePic(data, fragment);
                    // //update DOM
                    container.appendChild(fragment);
                } catch (e) {
                    console.error(e);
                }
            })
            .catch(e => console.error(e));
    }

    //load từ từ theo cụm từ response đẩy vào promise
    for (let j = 0; j < 3; j++) {
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
            const results = await Promise.all(promiseArray);;
            //update DOM trong hàm là trả về fragment, đưa vào container
            container.appendChild(crePic_From_PromiseArray(results));
        } catch (e) {
            console.error(e);
        }
    }
}

function makePic(data, fragment) {//hàm tạo hình return fragment cũ
    const div = document.createElement('div');
    div.className = 'w-78 m-2';

    const a = document.createElement('a');
    a.href = `${data.images[0].url}`;
    a.target = '_blank';

    const img = document.createElement('img');
    img.className = 'w-full h-full rounded-lg object-cover';
    img.src = `${data.images[0].url}`;

    a.appendChild(img);
    div.appendChild(a);
    fragment.appendChild(div);
    return fragment;
}


function crePic_From_PromiseArray(results) {//hàm tạo fragment cho mỗi hình và return fragment mới
    const fragment = document.createDocumentFragment();
    //chạy mảng results để xây dựng chuỗi HTML cho các hình ảnh
    results.forEach(data => {
        makePic(data, fragment);
    });
    return fragment;
}

function closeWarning() {//hàm đóng cảnh báo
    document.getElementById("warning").classList.add("hidden");
}

function Warning(type) {//hàm cảnh báo
    document.getElementById("warning").classList.remove("hidden");
    document.getElementById("accept").addEventListener("click", () => {
        closeWarning();
        exportIMG(type);
    });
}