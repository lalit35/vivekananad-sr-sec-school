// Initialization of global variables for various UI elements
const cameraStream = document.getElementById('cameraStream'); // The video stream element
const photoCanvas = document.getElementById('photoCanvas'); // Canvas where the captured image will be drawn
const captureButton = document.getElementById('captureButton'); // Button to capture the photo
const cameraButton = document.getElementById('cameraButton'); // Button to start the camera
const successMessage = document.getElementById('successMessage'); // Element to display success or error messages
const capturedPhoto = document.getElementById('capturedPhoto'); // Hidden input to store captured photo data (Base64)
const signatureCanvas = document.getElementById('signatureCanvas'); // Canvas for drawing signature
const signatureCtx = signatureCanvas.getContext('2d'); // Canvas context for signature
let drawing = false; // Boolean to track whether the user is drawing on the canvas

// Function to start the camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            // If camera is successfully accessed, display the camera feed in the video element
            cameraStream.style.display = "block"; // Show video stream
            cameraStream.srcObject = stream; // Set video stream source
            captureButton.style.display = "inline-block"; // Show capture button
            cameraButton.style.display = "none"; // Hide start camera button
        })
        .catch(function (error) {
            // If camera access is denied or fails, log the error
            console.error("Camera access denied:", error);
        });
}

// Function to capture the photo from the video stream
function capturePhoto() {
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height); // Draw the video frame onto the canvas
    const photoDataUrl = photoCanvas.toDataURL("image/png"); // Convert canvas to Base64 image string
    capturedPhoto.value = photoDataUrl; // Store captured photo data in hidden input field
    successMessage.style.display = "block"; // Display success message
    cameraStream.style.display = "none"; // Hide video stream
    captureButton.style.display = "none"; // Hide capture button after photo is taken

    // Optionally stop the video tracks after capturing the photo
    let tracks = cameraStream.srcObject.getTracks();
    tracks.forEach(track => track.stop()); // Stop all video tracks to free up the camera
}

// Function to start drawing the signature on the canvas
function startDrawing(event) {
    event.preventDefault(); // Prevent default behavior such as scrolling
    drawing = true; // Set drawing state to true

    // Get the position of the mouse or touch event
    let x = event.type === 'touchstart' ? event.touches[0].clientX : event.offsetX;
    let y = event.type === 'touchstart' ? event.touches[0].clientY : event.offsetY;

    signatureCtx.beginPath(); // Start a new path for drawing
    signatureCtx.moveTo(x, y); // Move the pen to the initial position
}

// Function to draw the signature on the canvas
function draw(event) {
    if (!drawing) return; // Only draw if the user is actively drawing

    event.preventDefault(); // Prevent default behavior like page scrolling

    // Get the current position of the mouse or touch event
    let x = event.type === 'touchmove' ? event.touches[0].clientX : event.offsetX;
    let y = event.type === 'touchmove' ? event.touches[0].clientY : event.offsetY;

    signatureCtx.lineTo(x, y); // Draw a line to the new position
    signatureCtx.stroke(); // Render the line on the canvas
}

// Function to stop drawing the signature
function stopDrawing() {
    drawing = false; // Set drawing state to false
    document.getElementById('signatureImage').value = signatureCanvas.toDataURL('image/png'); // Store signature image data in hidden input
}

// Function to clear the signature canvas
document.getElementById('clearSignatureButton').addEventListener('click', function () {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height); // Clear the canvas
    document.getElementById('signatureImage').value = ''; // Clear the hidden signature input
});

// Event listeners for mouse and touch events to handle signature drawing
signatureCanvas.addEventListener('mousedown', startDrawing);
signatureCanvas.addEventListener('mousemove', draw);
signatureCanvas.addEventListener('mouseup', stopDrawing);

signatureCanvas.addEventListener('touchstart', startDrawing);
signatureCanvas.addEventListener('touchmove', draw);
signatureCanvas.addEventListener('touchend', stopDrawing);
signatureCanvas.addEventListener('touchcancel', stopDrawing);

// Function to handle the form submission via AJAX
function handleSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    console.log('Starting form submission via AJAX...');

    // Prepare the FormData object to hold form data, including the photo and signature
    let formData = new FormData(document.getElementById('registrationForm'));

    // Send the form data to the Google Apps Script using AJAX
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbw_zjwBPvwl-y6oigcXmqfFu2srgpDj-XCJPWgK2fp86mXaSyvSEJFpE1WygJ8OXrFI/exec', // Your Google Apps Script URL
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log('Form submitted successfully:', response);

            // Display success message upon successful form submission
            successMessage.textContent = "Your form has been submitted successfully!";
            successMessage.style.color = "green";
            successMessage.style.display = "block";

            // After 2 seconds, redirect the user to the payment page with URL parameters
            setTimeout(function () {
                const email = encodeURIComponent($('#email').val()); // Get email input
                const firstName = encodeURIComponent($('#firstName').val()); // Get first name input
                const mobileNumber = encodeURIComponent($('#mobileNumber').val()); // Get mobile number input

                const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}&firstName=${firstName}&mobile=${mobileNumber}`;
                window.location.href = paymentUrl; // Redirect to payment page with parameters
            }, 2000); // Delay for 2 seconds before redirecting
        },
        error: function (xhr, status, error) {
            console.error('Error in form submission:', error);
            successMessage.textContent = "There was an error with the form submission. Please try again.";
            successMessage.style.color = "red";
            successMessage.style.display = "block"; // Display error message

            // Redirect to payment page even in case of error (optional)
            const email = encodeURIComponent($('#email').val());
            const firstName = encodeURIComponent($('#firstName').val());
            const mobileNumber = encodeURIComponent($('#mobileNumber').val());

            const paymentUrl = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?email=${email}&firstName=${firstName}&mobile=${mobileNumber}`;
            setTimeout(function () {
                window.location.href = paymentUrl;
            }, 2000); // Redirect after 2 seconds
        }
    });
}

// Event listeners for camera and capture buttons
cameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', capturePhoto);

// Event listener for the form submission
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
