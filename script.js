// Camera capture functionality
const cameraStream = document.getElementById('cameraStream');
const captureButton = document.getElementById('captureButton');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhotoInput = document.getElementById('capturedPhoto');
const cameraButton = document.getElementById('cameraButton');
const successMessage = document.getElementById('successMessage');

// Open the camera when the user clicks the "Open Camera" button
cameraButton.addEventListener('click', function () {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            cameraStream.style.display = 'block';
            cameraStream.srcObject = stream;
            captureButton.style.display = 'inline-block';
        })
        .catch(function (err) {
            console.log("Error accessing camera: ", err);
        });
});

// Capture the photo from the camera stream when the user clicks the "Capture Photo" button
captureButton.addEventListener('click', function () {
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
    const photoDataUrl = photoCanvas.toDataURL(); // Convert to base64

    // Store the photo data in the hidden input field
    capturedPhotoInput.value = photoDataUrl;

    // Hide the camera stream and display a success message
    cameraStream.style.display = 'none';
    captureButton.style.display = 'none';
    successMessage.style.display = 'block';
});

// Signature drawing functionality
const signatureCanvas = document.getElementById('signatureCanvas');
const signatureCtx = signatureCanvas.getContext('2d');
let isDrawing = false;

// Start drawing on the signature canvas
signatureCanvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    signatureCtx.beginPath();
    signatureCtx.moveTo(e.offsetX, e.offsetY);
});

// Draw on the signature canvas as the user moves the mouse
signatureCanvas.addEventListener('mousemove', function (e) {
    if (isDrawing) {
        signatureCtx.lineTo(e.offsetX, e.offsetY);
        signatureCtx.stroke();
    }
});

// Stop drawing when the user releases the mouse button
signatureCanvas.addEventListener('mouseup', function () {
    isDrawing = false;
});

// Clear the signature canvas when the "Clear Signature" button is clicked
document.getElementById('clearSignatureButton').addEventListener('click', function () {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
});

// Before the form is submitted, convert the signature to base64 and set it in the hidden input
document.getElementById('registrationForm').addEventListener('submit', function (event) {
    // Convert the signature canvas to a base64 image (PNG)
    const signatureDataURL = signatureCanvas.toDataURL();

    // Set the base64 signature in the hidden input field
    document.getElementById('signatureImage').value = signatureDataURL;
});
