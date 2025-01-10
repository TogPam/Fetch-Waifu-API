import { useState, useEffect, useRef, useMemo } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import logo from './assets/favicon-32x32.png'
export default function App() {

  const apiTag = 'https://api.waifu.im/tags';
  const apiUrl = 'https://api.waifu.im/search';
  const versatileTags = useRef([]);
  const nsfwTags = useRef([]);
  const picsUrl = useRef([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingPics, setLoadingPics] = useState(false);
  const [renderPics, setRenderPics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const currentTag = useRef('');
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
          const versatiletags = [...(data.versatile || [])];
          versatileTags.current = versatiletags;
          const nsfwtags = [...(data.nsfw || [])];
          nsfwTags.current = nsfwtags;
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

  async function handler(type, isNsfw = false) {

    if (isNsfw) {
      setShowModal(true);
      currentTag.current = type;
      return;
    }

    setLoadingPics(true);
    const url = getUrlType(type);
    picsUrl.current = [];
    setRenderPics([...picsUrl.current]); // Cập nhật UI
    await fetchPics(url, 30); // Tải và cập nhật ảnh từng bước
    setLoadingPics(false);
  }

  // Xử lý "Đồng ý" trong modal
  function handleConfirm() {
    setShowModal(false);
    handler(currentTag.current);
  }

  // Xử lý "Hủy" trong modal
  function handleCancel() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">Cảnh báo</div>
            <p>Nội dung này không phù hợp với trẻ em. Bạn có chắc muốn tiếp tục?</p>
            <div className="modal-buttons">
              <button className="cancel" onClick={handleCancel}>Hủy</button>
              <button className="confirm" onClick={handleConfirm}>Đồng ý</button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1>ANIME PÍC</h1>
        <h3>togpam</h3>
      </div>
      <div className="list">
        {versatileTags.current.map((tag, index) => (
          <button key={index} onClick={() => handler(tag, false)}>{tag}</button>
        ))}
        <br />
        {nsfwTags.current.map((tag, index) => (
          <button key={index} onClick={() => handler(tag, true)} className='nsfw'>{tag}</button>
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
