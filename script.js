// Get references to HTML elements
const cameraButton = document.getElementById('cameraButton');
const captureButton = document.getElementById('captureButton');
const cameraStream = document.getElementById('cameraStream');
const photoCanvas = document.getElementById('photoCanvas');
const photoPreview = document.getElementById('photoPreview');
const capturedPhotoInput = document.getElementById('capturedPhoto');

// Function to start the camera stream
async function startCamera() {
    try {
        console.log("Requesting camera access...");

        // Get user media (camera)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Check if the stream is available
        if (stream) {
            console.log("Camera access granted!");

            // Link stream to the video element
            cameraStream.srcObject = stream;
            cameraStream.style.display = 'block'; // Show the video stream
            captureButton.style.display = 'block'; // Show the capture button
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please check permissions and try again.");
    }
}

// Function to capture photo
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    const width = cameraStream.videoWidth;
    const height = cameraStream.videoHeight;
    
    // Set the canvas size to match the video stream size
    photoCanvas.width = width;
    photoCanvas.height = height;
    
    // Draw the current video frame on the canvas
    context.drawImage(cameraStream, 0, 0, width, height);
    
    // Get the captured image data (as a base64 string)
    const photoDataUrl = photoCanvas.toDataURL('image/png');
    
    // Set the captured photo to the hidden input field
    capturedPhotoInput.value = photoDataUrl;
    
    // Show the captured photo preview
    photoPreview.src = photoDataUrl;
    photoPreview.style.display = 'block';
    
    // Stop the video stream after capture
    const stream = cameraStream.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    
    // Hide the camera stream and capture button after photo capture
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
}

// Event listeners
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
