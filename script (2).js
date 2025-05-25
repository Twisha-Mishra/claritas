const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });
}

video.addEventListener('play', () => {
  // Use actual video size after it starts playing
  const setCanvasSize = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };
  setCanvasSize();

  function detectFaces() {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .then(detections => {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);

        if (resizedDetections.length > 1) {
          ctx.fillStyle = "red";
          ctx.font = "24px Arial";
          ctx.fillText("ALERT: Multiple faces detected!", 20, 30);
        }
      })
      .catch(console.error);

    requestAnimationFrame(detectFaces);
  }

  detectFaces();
});