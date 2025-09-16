// src/components/Slider.js
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Slider.module.css";

const Slider = ({ trendingPosts }) => {
const trackRef = useRef(null);
const scrollAmount = 220; // umubare w'ibikoresho bitambutse kuri click
const [loadedImages, setLoadedImages] = useState({});
const router = useRouter();

// Automatic sliding buri segonda 4
useEffect(() => {
const interval = setInterval(() => {
if (trackRef.current) {
const maxScroll = trackRef.current.scrollWidth - trackRef.current.clientWidth;
const currentScroll = trackRef.current.scrollLeft;

if (currentScroll + scrollAmount >= maxScroll) {  
      trackRef.current.scrollTo({ left: 0, behavior: "smooth" });  
    } else {  
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });  
    }  
  }  
}, 4000);  

return () => clearInterval(interval);

}, []);

const scrollLeft = () => {
if (trackRef.current) {
trackRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
}
};

const scrollRight = () => {
if (trackRef.current) {
trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
}
};

const handleImageLoad = (id) => {
setLoadedImages((prev) => ({ ...prev, [id]: true }));
};

const handlePostClick = (id) => {
router.push(/post/${id});
};

// Slider: inkuru 20
const topPosts = trendingPosts.slice(0, 20);

// Text scroller: inkuru 10
const topTextPosts = trendingPosts.slice(0, 6);

return (
<div className={styles.slider}>
<h2>Trending Stories</h2>

{/* Slider container */}  
  <div className={styles.sliderContainer}>  
    <button className={`${styles.navButton} ${styles.prev}`} onClick={scrollLeft}>  
      ‹  
    </button>  

    <div className={styles.sliderWrapper} ref={trackRef}>  
      <div className={styles.sliderTrack}>  
        {topPosts.map((post) => (  
          <div  
            key={post.id}  
            className={styles.post}  
            onClick={() => handlePostClick(post.id)}  
            style={{ cursor: "pointer" }}  
          >  
            {!loadedImages[post.id] && (  
              <div className={styles.imagePlaceholder}>Loading...</div>  
            )}  
            {post.image && (  
              <img  
                src={post.image}  
                alt={post.title}  
                className={styles.postImage}  
                style={{ display: loadedImages[post.id] ? "block" : "none" }}  
                onLoad={() => handleImageLoad(post.id)}  
              />  
            )}  
            <div className={styles.postContent}>
<h4>{post.title}</h4>
<p>{post.summary}</p>
<small>By: {post.author}</small>
</div>  
              </div>  
            ))}  
          </div>  
        </div>  <button className={`${styles.navButton} ${styles.next}`} onClick={scrollRight}>  
      ›  
    </button>  
  </div>  

  {/* Text scroller */}  
  <div className={styles.textScroller}>  
    <div className={styles.scrollingText}>  
      {topTextPosts.map((post) => (  
        <span key={post.id} className={styles.scrollItem}>  
          {post.title} &nbsp; • &nbsp;  
        </span>  
      ))}  
    </div>  
  </div>  
</div>

);
};

export default Slider;

