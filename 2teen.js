// const apiTag = 'https://api.waifu.im/tags';
// fetch(apiTag)
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Request failed with status code: ' + response.status);
//         }
//     })
//     .then(data => {
//         console.log(data);
//         const container = document.getElementById("category");

//         let button = '';
//         data.versatile.forEach(keyword => {
//             button += `<button class="text-white hover:text-red-600" onclick="ran('${keyword}')" onclick="openPopup()"> ${keyword}</button>`
//         });
//         data.nsfw.forEach(keyword => {
//             button += `<button class="text-white hover:text-red-600" onclick="ran('${keyword}')"> ${keyword}</button>`
//         });
//         container.innerHTML = button;
//     })
//     .catch(error => {
//         console.error(error);
//     })

function openPopup() {

}


function exportIMG(type) {
    let pic = '';

    const apiUrl = 'https://api.waifu.im/search';
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
    const container = document.getElementById("listpic");

    const fetchimage = async () => {
        try {
            //Tạo mảng để nhét các promise api trả về lưu trữ trong mảng
            const fetchPromises = [];
            for (let i = 0; i < 15; i++) {
                //đẩy các promise vào mảng bằng fetch lấy promise
                fetchPromises.push(fetch(requestUrl).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Request failed with status code: ' + response.status);
                    }
                }));
                //chờ tất cả các promise trong mảng hoàn thành
                //Kết quả của từng promise (tức là dữ liệu JSON) được tập hợp lại thành một mảng results
                const results = await Promise.all(fetchPromises);

                // Chạy mảng results để xây dựng chuỗi HTML cho các hình ảnh
                results.forEach(data => {
                    pic += `<div class="w-78 m-2">
                <a href="${data.images[0].url}" target="_blank">
                    <img class="w-full h-full rounded-lg object-cover" src="${data.images[0].url}">
                </a>
            </div>`;
                });

                // Cập nhật DOM một lần
                container.innerHTML = pic;

            }
        } catch (error) {
            console.error(error.message);
        }
    }
    fetchimage();
}