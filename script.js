const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeButton = document.getElementById("analyzeButton");
const resultText = document.getElementById("resultText");

let selectedImage = null;

// Preview uploaded image
imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    selectedImage = file;

    const imageURL = URL.createObjectURL(file);
    imagePreview.src = imageURL;
    imagePreview.style.display = "block";

    resultText.textContent = "Image uploaded. Ready for analysis.";
});

// Temporary analysis function
analyzeButton.addEventListener("click", function () {
    if (!selectedImage) {
        resultText.textContent = "Please upload an image first.";
        return;
    }

    resultText.textContent =
        "Demo result: AI analysis will be connected here.";
});
