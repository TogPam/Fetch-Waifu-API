import { useState, useEffect, lazy } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function App() {

  const apiTag = 'https://api.waifu.im/tags';
  const [tags, setTags] = useState([]);
  const [picsUrl, setPicsUrl] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingPics, setLoadingPics] = useState(false);

  //tạo các thẻ tags từ api cho vào useState() tags
  function getTag() {
    fetch(apiTag)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        //console.log(data)
        const allTags = [...(data.versatile || []), ...(data.nsfw || [])];
        setTags(allTags);
        setLoadingTags(false)
      })
      .catch(err => {
        console.error(err)
        setLoadingTags(false)
      })
  }

  //sử dụng useEffect() chạy hàm khi vào website
  useEffect(() => {
    getTag()
  }, [])

  if (loadingTags) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }


  //tạo url api từ thể loại(type)
  function getUrlType(type) {
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
    return `${apiUrl}?${queryParams.toString()}`;
  }

  //fetch url api sử dụng Promise.all, trả về hàm pics gồm các url src ảnh
  async function fetchPics(url, count) {
    const requests = Array.from({ length: count }, () => fetch(url).then(res => res.json()));
    try {
      const responses = await Promise.all(requests);
      const pics = responses.map(data => data.images[0].url);
      return pics;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function handler(type) {
    setLoadingPics(true);
    setPicsUrl([]);
    const url = getUrlType(type);
    const picsFetch = await fetchPics(url, 30);
    const picsUrlUnique = [...new Set(picsFetch)];
    setPicsUrl(picsUrlUnique);
    setLoadingPics(false);
  }

  return (
    <>
      <div className="header">
        <h1>ANIME PÍC</h1>
        <h3>togpam</h3>
      </div>
      <div className="list">
        {tags.map((tag, index) => (
          <button key={index} onClick={() => handler(tag)}>{tag}</button>
        ))}
      </div>
      {loadingPics ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="pics">
          {picsUrl.map((pic, index) => (
            <a href={pic} key={index} target="_blank" rel="noopener noreferrer">
              <LazyLoadImage
                effect="blur"
                src={pic}
                placeholderSrc="/favicon-32x32.png"
                threshold={100}
                width="100%"
                height="100%"
              />
            </a>
          ))}
        </div>
      )}
    </>
  )
}
