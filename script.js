document.addEventListener("DOMContentLoaded", function() {
    const openCameraButton = document.getElementById("openCameraButton");
    const cameraStream = document.getElementById("cameraStream");
    const captureButton = document.getElementById("captureButton");
    const photoCanvas = document.getElementById("photoCanvas");
    const photoPreview = document.getElementById("photoPreview");
    const capturedPhotoInput = document.getElementById("capturedPhoto");

    let stream;

    // Open Camera Button Event
    openCameraButton.addEventListener("click", function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(mediaStream) {
                    stream = mediaStream;
                    cameraStream.srcObject = mediaStream;
                    cameraStream.style.display = "block";
                    captureButton.style.display = "inline-block";
                })
                .catch(function(err) {
                    alert("Unable to access the camera: " + err.message);
                });
        } else {
            alert("Your browser does not support camera access.");
        }
    });

    // Capture Photo Button Event
    captureButton.addEventListener("click", function() {
        const context = photoCanvas.getContext("2d");
        const videoWidth = cameraStream.videoWidth;
        const videoHeight = cameraStream.videoHeight;

        // Set canvas dimensions
        photoCanvas.width = videoWidth;
        photoCanvas.height = videoHeight;

        // Draw video frame to canvas
        context.drawImage(cameraStream, 0, 0, videoWidth, videoHeight);

        // Get base64 image data URL
        const photoDataUrl = photoCanvas.toDataURL("image/png");

        // Display the photo preview
        photoPreview.src = photoDataUrl;
        photoPreview.style.display = "block";
        capturedPhotoInput.value = photoDataUrl; // Store the captured photo URL in the hidden input field

        // Stop the camera stream
        stream.getTracks().forEach(track => track.stop());
        cameraStream.style.display = "none";
        captureButton.style.display = "none";
    });
});
