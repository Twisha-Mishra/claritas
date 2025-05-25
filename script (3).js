let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let model;

async function start() {
  // Load COCO-SSD model
  model = await cocoSsd.load();

  // Prompt for screen capture
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" }
  });

  video.srcObject = stream;

  video.onloadedmetadata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    detectFrame();
  };
}

async function detectFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const predictions = await model.detect(video);

  predictions.forEach(pred => {
    const [x, y, width, height] = pred.bbox;
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.fillText(pred.class, x, y > 10 ? y - 5 : y + 15);
  });

  requestAnimationFrame(detectFrame);
}
