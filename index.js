const audio = document.querySelector("audio");

var file = document.getElementById("thefile");

file.onchange = function () {
  console.log(file);
  console.log(this);
  var files = this.files;
  audio.src = URL.createObjectURL(files[0]);

  var title = document.querySelector(".track-title");
  title.textContent = this.value;

  audio.load();
  audio.play();
};
// Create an audio context
const ctx = new AudioContext();
ctx.resume();

//create an audio source
const audioSource = ctx.createMediaElementSource(audio);

// Analyser
const analyser = ctx.createAnalyser();

//Connect the source to the analyser and then back to the context destination

audioSource.connect(analyser);
audioSource.connect(ctx.destination);

// Print the analysed frequencies
const frequencyData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(frequencyData);

// GEt the visualizer container
const visualizerContainer = document.querySelector(".visualizer");

//crete a set of pre-defined bars
for (let i = 0; i < frequencyData.length - 980; i++) {
  const bar = document.createElement("div");
  bar.setAttribute("id", "bar" + i);
  bar.setAttribute("class", "visualizer_bar");

  visualizerContainer.appendChild(bar);
}

// this function has the task to adjust the bar height accordinf to the freqency data
function renderFrame() {
  analyser.getByteFrequencyData(frequencyData);

  for (let i = 0; i < frequencyData.length; i++) {
    // fd is the frequency data
    const fd = frequencyData[i];

    // fetch the bar
    const bar = document.querySelector("#bar" + i);
    if (!bar) {
      continue;
    }

    const barHeight = Math.max(4, fd || 0);
    bar.style.height = barHeight + "px";
  }

  window.requestAnimationFrame(renderFrame);
}

renderFrame();

audio.volume = 0.1;
audio.play();
