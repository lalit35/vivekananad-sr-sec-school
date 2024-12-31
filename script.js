document.addEventListener('DOMContentLoaded', function () {
    // Function to generate random registration number
    function generateRegistrationNumber() {
        const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
        return `VSS${randomNumber}`;
    }

    // Set the generated registration number to the input field
    const registrationNumberField = document.getElementById('registrationNumber');
    registrationNumberField.value = generateRegistrationNumber();

    // Handle the camera button and photo capture functionality
    const cameraButton = document.getElementById('cameraButton');
    const cameraStream = document.getElementById('cameraStream');
    const captureButton = document.getElementById('captureButton');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturedPhotoField = document.getElementById('capturedPhoto');
    const successMessage = document.getElementById('successMessage');

    cameraButton.addEventListener('click', function () {
        // Open the camera stream
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    cameraStream.srcObject = stream;
                    cameraStream.style.display = 'block';
                    captureButton.style.display = 'inline-block';
                })
                .catch(function (error) {
                    alert('Error accessing the camera: ' + error.message);
                });
        }
    });

    captureButton.addEventListener('click', function () {
        // Capture photo from the video stream
        photoCanvas.width = cameraStream.videoWidth;
        photoCanvas.height = cameraStream.videoHeight;
        const context = photoCanvas.getContext('2d');
        context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);

        // Convert canvas to image data and set it in the hidden input
        const dataURL = photoCanvas.toDataURL('image/png');
        capturedPhotoField.value = dataURL;

        // Hide the camera stream and show the success message
        cameraStream.style.display = 'none';
        successMessage.style.display = 'block';
    });

    // Handle the signature canvas and clear button functionality
    const signatureCanvas = document.getElementById('signatureCanvas');
    const clearSignatureButton = document.getElementById('clearSignatureButton');
    const signatureImageField = document.getElementById('signatureImage');

    const signatureContext = signatureCanvas.getContext('2d');
    let drawing = false;

    signatureCanvas.addEventListener('mousedown', function (event) {
        drawing = true;
        signatureContext.beginPath();
        signatureContext.moveTo(event.offsetX, event.offsetY);
    });

    signatureCanvas.addEventListener('mousemove', function (event) {
        if (drawing) {
            signatureContext.lineTo(event.offsetX, event.offsetY);
            signatureContext.stroke();
        }
    });

    signatureCanvas.addEventListener('mouseup', function () {
        drawing = false;
        // Save signature image
        signatureImageField.value = signatureCanvas.toDataURL('image/png');
    });

    clearSignatureButton.addEventListener('click', function () {
        signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        signatureImageField.value = ''; // Clear hidden input
    });
});
