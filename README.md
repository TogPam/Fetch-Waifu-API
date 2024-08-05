# Fetch-Waifu-API 
- Using:
> HTML, JavaScript, Tailwind CSS
- API HERE: [WAIFU API](https://docs.waifu.im).
![image](https://github.com/user-attachments/assets/c64fcb09-d80e-4339-8c4c-57c5b901dd55)
```javascript
const apiUrl = 'https://api.waifu.im/search';
const params = {
  included_tags: ['raiden-shogun', 'maid'],
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

fetch(requestUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed with status code: ' + response.status);
    }
  })
  .then(data => {
    // Process the response data as needed
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });
```
