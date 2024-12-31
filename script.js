const cameraButton = document.getElementById('cameraButton');
const cameraStream = document.getElementById('cameraStream');
const captureButton = document.getElementById('captureButton');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhoto = document.getElementById('capturedPhoto');

let videoStream;

// Open Camera
cameraButton.addEventListener('click', async () => {
    cameraStream.style.display = 'block';
    captureButton.style.display = 'block';

    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraStream.srcObject = videoStream;
});

// Capture Photo
captureButton.addEventListener('click', () => {
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraStream.videoWidth;
    photoCanvas.height = cameraStream.videoHeight;
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);

    const photoData = photoCanvas.toDataURL('image/png');
    capturedPhoto.value = photoData; // Store captured photo data in hidden input

    alert('Photo captured successfully!');
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
    videoStream.getTracks().forEach(track => track.stop()); // Stop camera
});
