// Elements from the DOM
const cameraButton = document.getElementById('cameraButton');
const cameraStream = document.getElementById('cameraStream');
const captureButton = document.getElementById('captureButton');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhotoInput = document.getElementById('capturedPhoto');
const photoPreview = document.getElementById('photoPreview');

// Variable to store the camera stream
let videoStream = null;

// Function to start the camera
function startCamera() {
    // Access the webcam using the getUserMedia API
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // Set the video stream to the video element
            videoStream = stream;
            cameraStream.srcObject = stream;
            cameraStream.style.display = 'block'; // Show the video stream
            captureButton.style.display = 'block'; // Show the Capture button
            cameraButton.style.display = 'none'; // Hide the Open Camera button
        })
        .catch(error => {
            console.error("Error accessing the camera:", error);
            alert("Camera access is required to capture a photo.");
        });
}

// Function to capture the photo from the video stream
function capturePhoto() {
    const context = photoCanvas.getContext('2d');

    // Set the canvas size to match the video dimensions
    photoCanvas.width = cameraStream.videoWidth;
    photoCanvas.height = cameraStream.videoHeight;

    // Draw the current frame of the video onto the canvas
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);

    // Convert the canvas image to a base64-encoded PNG image
    const photoDataUrl = photoCanvas.toDataURL('image/png');
    
    // Store the captured photo data URL in the hidden input field
    capturedPhotoInput.value = photoDataUrl;

    // Show the captured photo in the <img> element
    photoPreview.src = photoDataUrl;
    photoPreview.style.display = 'block'; // Display the preview image
}

// Event listeners for the camera button and capture button
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
