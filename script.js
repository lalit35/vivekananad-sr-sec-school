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

    // Use AJAX to submit the form data to Google Apps Script
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbwmeN_3VkiMDnDzyzTjb-97TkQsRR3pvTElTzw1jrcSvUaLYmXTJtFncSGUORVEsVCAfg/exec', // Your Google Apps Script Web App URL
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log('Form submitted successfully:', response);

            // After successful submission, show the success message
            successMessage.textContent = "Your form has been submitted successfully!";
            successMessage.style.color = "green"; // Optional styling
            successMessage.style.display = "block"; // Show the success message

            // After a small delay, redirect to payment page with only the email
            setTimeout(function() {
                const email = encodeURIComponent($('#email').val()); // Get the email input

                // Construct the payment URL with query parameters (using only email)
                const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}`;
                console.log('Redirecting to:', paymentUrl);

                // Redirect to payment page without any messages
                window.location.href = paymentUrl;
            }, 2000); // Delay for 2 seconds before redirecting
        },
        error: function(xhr, status, error) {
            console.error('Error in form submission:', error);
            console.log('Response:', xhr.responseText);  // Log the response text for more details
            
            // Show an error message to the user
            successMessage.textContent = "There was an error with the form submission. Please try again.";
            successMessage.style.color = "red"; // Optional styling
            successMessage.style.display = "block"; // Show the error message

            // Still redirect to the payment page with email even in case of error
            const email = encodeURIComponent($('#email').val()); // Get the email input
            const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}`;
            console.log('Redirecting to:', paymentUrl);

            // Redirect to payment page after a small delay
            setTimeout(function() {
                window.location.href = paymentUrl;
            }, 2000); // Delay for 2 seconds before redirecting
        }
    });
}

// Event listeners for camera and capture
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);
