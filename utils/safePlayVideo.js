// utils/safePlayVideo.js
export const safePlayVideo = (playerRef) => {
  if (!playerRef || !playerRef.current) return;

  const internalPlayer = playerRef.current.getInternalPlayer();
  if (!internalPlayer) return;

  // HTML5 play promise
  const playPromise = internalPlayer.play?.();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Video started playing successfully");
      })
      .catch((error) => {
        console.error("Video autoplay was prevented:", error);
      });
  }
};
