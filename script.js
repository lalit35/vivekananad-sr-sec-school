// Get references to the DOM elements
// Elements
const cameraButton = document.getElementById('cameraButton');
const captureButton = document.getElementById('captureButton');
const cameraStream = document.getElementById('cameraStream');
const captureButton = document.getElementById('captureButton');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhotoInput = document.getElementById('capturedPhoto');

// Variables to store camera stream
let videoStream = null;
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
function startCamera() {
    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // Set the video stream to the video element
            videoStream = stream;
            cameraStream.srcObject = stream;
            cameraStream.style.display = 'block'; // Show video stream
            captureButton.style.display = 'block'; // Show capture button
            cameraButton.style.display = 'none'; // Hide open camera button
        })
        .catch(error => {
            console.error("Error accessing the camera: ", error);
            alert("Camera access is required to capture a photo.");
        });
}

// Function to capture the photo
// Function to capture a photo
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraStream.videoWidth; // Set canvas width
    photoCanvas.height = cameraStream.videoHeight; // Set canvas height
    context.drawImage(cameraStream, 0, 0); // Draw the video frame to the canvas

    // Convert the canvas to a data URL and set it as the value of the hidden input
    const dataURL = photoCanvas.toDataURL('image/png');
    capturedPhotoInput.value = dataURL;
    // Set canvas size equal to the video stream size
    photoCanvas.width = cameraStream.videoWidth;
    photoCanvas.height = cameraStream.videoHeight;
    // Draw the current video frame to the canvas
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
    // Convert canvas image to a data URL (base64 encoded)
    const photoDataUrl = photoCanvas.toDataURL('image/png');
    
    // Display captured photo and store it in the hidden input field
    capturedPhotoInput.value = photoDataUrl; // Store the photo URL in the hidden field

    // Optionally, you can hide the video stream after capturing
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
    // Optionally, you can display the captured photo elsewhere (like an <img> element)
    // Example: displayCapturedPhoto.src = photoDataUrl; 
    // Or show a preview in the form
}

// Event listeners
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
