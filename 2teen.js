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
    //fetch 20 object tạo hình từ fragment cập nhập DOM từng fragment
    for (let i = 0; i < 20; i++) {
        fetch(requestUrl)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                try {
                    console.log(data);
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