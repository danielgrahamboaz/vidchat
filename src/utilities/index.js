export const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
    document.querySelector(".main__mute_button").innerHTML = html;
};

export const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
    document.querySelector(".main__mute_button").innerHTML = html;
};

export const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
};

export const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
};
