// Initialize global variables for camera and canvas
let cameraStream = document.getElementById('cameraStream');
let photoCanvas = document.getElementById('photoCanvas');
let captureButton = document.getElementById('captureButton');
let cameraButton = document.getElementById('cameraButton');
let successMessage = document.getElementById('successMessage');
let capturedPhoto = document.getElementById('capturedPhoto');

// Initialize signature canvas
const signatureCanvas = document.getElementById('signatureCanvas');
const signatureCtx = signatureCanvas.getContext('2d');
let drawing = false;

// Function to start the camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            cameraStream.style.display = "block";
            cameraStream.srcObject = stream;
            captureButton.style.display = "inline-block";
            cameraButton.style.display = "none";
        })
        .catch(function(error) {
            console.log("Camera access denied:", error);
            alert("Camera access is required to capture your photo.");
        });
}

// Function to capture the photo
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
    const photoDataUrl = photoCanvas.toDataURL("image/png");
    capturedPhoto.value = photoDataUrl; // Store the photo data in the hidden input
    successMessage.style.display = "block"; // Show success message
    cameraStream.style.display = "none"; // Hide the camera feed
    captureButton.style.display = "none"; // Hide the capture button
    // Optionally stop the camera after photo capture
    let tracks = cameraStream.srcObject.getTracks();
    tracks.forEach(track => track.stop());
}

// Function to handle the signature drawing on the canvas
signatureCanvas.addEventListener('mousedown', function(event) {
    drawing = true;
    signatureCtx.beginPath();
    signatureCtx.moveTo(event.offsetX, event.offsetY);
});

signatureCanvas.addEventListener('mousemove', function(event) {
    if (drawing) {
        signatureCtx.lineTo(event.offsetX, event.offsetY);
        signatureCtx.stroke();
    }
});

signatureCanvas.addEventListener('mouseup', function() {
    drawing = false;
    // Save the signature canvas as an image
    document.getElementById('signatureImage').value = signatureCanvas.toDataURL('image/png');
});

// Clear signature canvas
document.getElementById('clearSignatureButton').addEventListener('click', function() {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    document.getElementById('signatureImage').value = ''; // Clear hidden input
});

// Handle the form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Prepare form data to send
    let formData = new FormData(document.getElementById('registrationForm'));

    // Debugging: Log form data to verify if it is correct
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Use AJAX to submit the form data to Google Apps Script
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbzAFv7jiSdEE-hpjWv0mYvS7Gajkmmzk4_wW8IPm-rxv2-En2xK9H7CxmIljE9Bl6CgiA/exec', // Google Apps Script URL
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log('Form submitted successfully:', response);

            // After successful submission, redirect to payment page
            const firstName = encodeURIComponent($('#firstName').val());
            const lastName = encodeURIComponent($('#lastName').val());
            const mobileNumber = encodeURIComponent($('#mobileNumber').val());
            const email = encodeURIComponent($('#email').val());

            // Construct the payment URL with query parameters
            const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?firstName=${firstName}&lastName=${lastName}&mobileNumber=${mobileNumber}&email=${email}`;
            console.log('Redirecting to:', paymentUrl);

            // Redirect to payment page
            window.location.href = paymentUrl;
        },
        error: function(xhr, status, error) {
            console.error('Error in form submission:', error);
            console.log('Response:', xhr.responseText);  // Log the response text for more details
            alert('Error in form submission: ' + error);
        }
    });
}

// Event listeners for camera and capture
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);

// Event listener for form submission
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
