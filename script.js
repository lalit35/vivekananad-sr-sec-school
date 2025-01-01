// Initialize global variables for camera and canvas
let cameraStream = document.getElementById('cameraStream');
let photoCanvas = document.getElementById('photoCanvas');
let captureButton = document.getElementById('captureButton');
let cameraButton = document.getElementById('cameraButton');
let successMessage = document.getElementById('successMessage');
let capturedPhoto = document.getElementById('capturedPhoto'); // Hidden input to store photo data

// Initialize signature canvas and context
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

// Function to start drawing on the canvas
function startDrawing(event) {
    event.preventDefault(); // Prevent scrolling or default behavior on mobile

    drawing = true;

    // Handle touch or mouse events
    let x = event.type === 'touchstart' ? event.touches[0].clientX : event.offsetX;
    let y = event.type === 'touchstart' ? event.touches[0].clientY : event.offsetY;

    signatureCtx.beginPath();
    signatureCtx.moveTo(x, y);
}

// Function to continue drawing on the canvas
function draw(event) {
    if (!drawing) return;

    event.preventDefault(); // Prevent scrolling or default behavior on mobile

    let x = event.type === 'touchmove' ? event.touches[0].clientX : event.offsetX;
    let y = event.type === 'touchmove' ? event.touches[0].clientY : event.offsetY;

    signatureCtx.lineTo(x, y);
    signatureCtx.stroke();
}

// Function to stop drawing on the canvas
function stopDrawing() {
    drawing = false;
    // Save the signature image in hidden input
    document.getElementById('signatureImage').value = signatureCanvas.toDataURL('image/png');
}

// Clear signature canvas
document.getElementById('clearSignatureButton').addEventListener('click', function() {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    document.getElementById('signatureImage').value = ''; // Clear hidden input
});

// Event listeners for mouse and touch events
signatureCanvas.addEventListener('mousedown', startDrawing);
signatureCanvas.addEventListener('mousemove', draw);
signatureCanvas.addEventListener('mouseup', stopDrawing);

signatureCanvas.addEventListener('touchstart', startDrawing);
signatureCanvas.addEventListener('touchmove', draw);
signatureCanvas.addEventListener('touchend', stopDrawing);
signatureCanvas.addEventListener('touchcancel', stopDrawing);

// Handle the form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Prepare the form data (photo and signature are already captured)
    var formData = new FormData(document.getElementById('registrationForm'));

    // Fetch the photo and signature data from the hidden inputs
    const photoBase64 = capturedPhoto.value;
    const signatureBase64 = document.getElementById('signatureImage').value;

    // Append the photo and signature to the form data
    formData.append('photoUrl', photoBase64);
    formData.append('signatureImage', signatureBase64);

    // Use AJAX to submit the form data to Google Apps Script
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbyGQg3woM61BlLhzCqOJG99M2d8Wy8-Ho3AZp8UrSQ7cHYWn-7dj7mKj2ajc2hKErrQ1g/exec', // Your updated Google Apps Script Web App URL
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

            // After a small delay, redirect to payment page with email, first name, and mobile number
            setTimeout(function() {
                const email = encodeURIComponent($('#email').val()); // Get the email input
                const firstName = encodeURIComponent($('#firstName').val()); // Get the first name input
                const mobileNumber = encodeURIComponent($('#mobileNumber').val()); // Get the mobile number input

                // Construct the payment URL with query parameters (email, first name, mobile)
                const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}&firstName=${firstName}&mobile=${mobileNumber}`;
                console.log('Redirecting to:', paymentUrl);

                // Redirect to payment page with the added parameters
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

            // Still redirect to the payment page with email, first name, and mobile number even in case of error
            const email = encodeURIComponent($('#email').val()); // Get the email input
            const firstName = encodeURIComponent($('#firstName').val()); // Get the first name input
            const mobileNumber = encodeURIComponent($('#mobileNumber').val()); // Get the mobile number input

            const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}&firstName=${firstName}&mobile=${mobileNumber}`;
            console.log('Redirecting to:', paymentUrl);

            // Redirect to payment page with the added parameters after 2 seconds delay
            setTimeout(function() {
                window.location.href = paymentUrl;
            }, 2000); // Delay for 2 seconds before redirecting
        }
    });
}

// Event listeners for camera and capture
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);

// Form submit event listener
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
