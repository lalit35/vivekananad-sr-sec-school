// Function to handle the form submission and submit to Apps Script
function handleSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const currentSchool = document.getElementById('currentSchool').value;
    const className = document.getElementById('class').value;
    const fatherName = document.getElementById('fatherName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const email = document.getElementById('email').value;
    const photoUrl = document.getElementById('capturedPhoto').value;  // Assuming it's set by camera capture
    const signatureImage = document.getElementById('signatureImage').value; // Assuming it's set by signature canvas

    // Create FormData to submit the data (including photo and signature)
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('dob', dob);
    formData.append('age', age);
    formData.append('currentSchool', currentSchool);
    formData.append('class', className);
    formData.append('fatherName', fatherName);
    formData.append('mobileNumber', mobileNumber);
    formData.append('email', email);
    formData.append('photoUrl', photoUrl); // Image as base64
    formData.append('signatureImage', signatureImage); // Image as base64

    // Submit the form data using Fetch API to Apps Script URL
    fetch('https://script.google.com/macros/s/AKfycbzAFv7jiSdEE-hpjWv0mYvS7Gajkmmzk4_wW8IPm-rxv2-En2xK9H7CxmIljE9Bl6CgiA/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        // On success, redirect to the payment page with the filled-in details
        window.location.href = `https://lalit35.github.io/vivekananad-sr-sec-school/payment.html?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&mobileNumber=${encodeURIComponent(mobileNumber)}&email=${encodeURIComponent(email)}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Capture photo using HTML5 camera
const cameraButton = document.getElementById('cameraButton');
const captureButton = document.getElementById('captureButton');
const photoCanvas = document.getElementById('photoCanvas');
const cameraStream = document.getElementById('cameraStream');

// Open camera on click of the button
cameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            cameraStream.srcObject = stream;
            cameraStream.style.display = 'block';
            captureButton.style.display = 'block';
        })
        .catch(error => {
            console.log('Error accessing camera: ', error);
        });
});

// Capture photo on button click
captureButton.addEventListener('click', () => {
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
    const photoData = photoCanvas.toDataURL('image/png');
    document.getElementById('capturedPhoto').value = photoData; // Set the captured photo data as a hidden field value
    document.getElementById('successMessage').style.display = 'block';
});

// Clear signature canvas
const clearSignatureButton = document.getElementById('clearSignatureButton');
const signatureCanvas = document.getElementById('signatureCanvas');
const signatureContext = signatureCanvas.getContext('2d');
clearSignatureButton.addEventListener('click', () => {
    signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    document.getElementById('signatureImage').value = ''; // Reset hidden signature field
});

// Function to save signature data to base64 (when form is submitted)
signatureCanvas.addEventListener('mouseup', () => {
    const signatureData = signatureCanvas.toDataURL('image/png');
    document.getElementById('signatureImage').value = signatureData;
});
