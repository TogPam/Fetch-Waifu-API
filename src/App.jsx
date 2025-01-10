import { useState, useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import logo from './assets/favicon-32x32.png'
export default function App() {

  const apiTag = 'https://api.waifu.im/tags';
  const [tags, setTags] = useState([]);
  const picsUrl = useRef([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingPics, setLoadingPics] = useState(false);
  const [renderPics, setRenderPics] = useState([]);
  //tạo các thẻ tags từ api cho vào useState() tags


  //sử dụng useEffect() fetch tags khi mount website
  useEffect(() => {

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
          const allTags = [...(data.versatile || []), ...(data.nsfw || [])];
          setTags(allTags);
          setLoadingTags(false)
        })
        .catch(err => {
          console.error(err)
          setLoadingTags(false)
        })
    }
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
    for (let i = 0; i < count; i++) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const picUrl = data.images[0].url;
        picsUrl.current = [...picsUrl.current, picUrl]; // Thêm vào danh sách
        setRenderPics([...picsUrl.current]); // Cập nhật UI
      } catch (err) {
        console.error('Error fetching image:', err);
      }
    }
  }

  async function handler(type) {
    setLoadingPics(true);
    const url = getUrlType(type);
    await fetchPics(url, 30); // Tải và cập nhật ảnh từng bước
    //picsUrl = [];
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
      {loadingPics && renderPics.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="pics">
          {renderPics.map((pic, index) => (
            <a href={pic} key={index} target="_blank" rel="noopener noreferrer">
              <LazyLoadImage
                effect="blur"
                src={pic}
                placeholderSrc={logo}
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
