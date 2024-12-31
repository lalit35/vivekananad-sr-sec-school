// Get references to the DOM elements
const cameraButton = document.getElementById('cameraButton');
const captureButton = document.getElementById('captureButton');
const cameraStream = document.getElementById('cameraStream');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhotoInput = document.getElementById('capturedPhoto');
const successMessage = document.getElementById('successMessage');

// Function to start the camera
async function startCamera() {
    try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Attach the camera stream to the video element
        cameraStream.srcObject = stream;
        cameraStream.style.display = 'block'; // Show the video stream
        captureButton.style.display = 'block'; // Show the capture button
        cameraButton.style.display = 'none'; // Hide open camera button
    } catch (error) {
        console.error('Error accessing the camera: ', error);
        alert('Camera access is required to capture a photo.');
    }
}

// Function to capture the photo
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    
    // Set the canvas size to match the video stream
    photoCanvas.width = cameraStream.videoWidth;
    photoCanvas.height = cameraStream.videoHeight;
    
    // Draw the current video frame onto the canvas
    context.drawImage(cameraStream, 0, 0);

    // Convert the canvas content to a data URL and store it in the hidden input
    const dataURL = photoCanvas.toDataURL('image/png');
    capturedPhotoInput.value = dataURL; // Save the image URL in the hidden input

    // Hide the video stream and capture button after capturing the photo
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
    cameraButton.style.display = 'none'; // Hide the open camera button

    // Show success message in the form
    successMessage.style.display = 'block';

    // Show an alert message
    alert("Photo captured successfully!");

    // Optionally hide the success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000); // Message disappears after 5 seconds
}

// Event listeners for buttons
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
