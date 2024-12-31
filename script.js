// JavaScript for camera functionality
document.getElementById('cameraButton').addEventListener('click',
// Get references to the DOM elements
const cameraButton = document.getElementById('cameraButton');
const captureButton = document.getElementById('captureButton');
const cameraStream = document.getElementById('cameraStream');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhotoInput = document.getElementById('capturedPhoto');
// Function to start the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUser Media({ video: true });
        cameraStream.srcObject = stream;
        cameraStream.style.display = 'block'; // Show the video stream
        captureButton.style.display = 'block'; // Show the capture button
    } catch (error) {
        console.error('Error accessing the camera: ', error);
    }
}
// Function to capture the photo
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraStream.videoWidth; // Set canvas width
    photoCanvas.height = cameraStream.videoHeight; // Set canvas height
    context.drawImage(cameraStream, 0, 0); // Draw the video frame to the canvas
    // Convert the canvas to a data URL and set it as the value of the hidden input
    const dataURL = photoCanvas.toDataURL('image/png');
    capturedPhotoInput.value = dataURL;
    // Optionally, you can hide the video stream after capturing
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
}
// Event listeners
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
