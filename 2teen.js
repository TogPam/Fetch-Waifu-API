function closeWarning() {
    document.getElementById("warning").classList.add("hidden");
}

function Warning(type) {
    document.getElementById("warning").classList.remove("hidden");
    document.getElementById("accept").addEventListener("click", () => {
        document.getElementById("warning").classList.add("hidden");
        exportIMG(type);
    });
}

async function exportIMG(type) {
    //let pic = [];

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
    const fetchimage = async () => {
        try {
            //Tạo mảng để nhét các promise api trả về lưu trữ trong mảng
            const fetchPromises = [];
            for (let i = 0; i < 15; i++) {
                //đẩy các promise vào mảng bằng fetch lấy promise
                fetchPromises.push(
                    fetch(requestUrl).then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Request failed with status code: ' + response.status);
                        }
                    }));
                //chờ tất cả các promise trong mảng hoàn thành
                //Kết quả của từng promise (tức là dữ liệu JSON) được tập hợp lại thành một mảng results
                const results = await Promise.all(fetchPromises);
                //tạo fragment lưu trữ thành phần html để tạo khung ảnh
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

                // Cập nhật DOM một lần
                container.appendChild(fragment);

            }
        } catch (error) {
            console.error(error.message);
        }
    }
    fetchimage();
}