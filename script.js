const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeButton = document.getElementById("analyzeButton");
const resultText = document.getElementById("resultText");
const saveButton = document.getElementById("saveButton");
const logMessage = document.getElementById("logMessage");

let selectedImage = null;
let currentResult = "Not analyzed";
let currentImageData = "";

// Load saved records
let records = JSON.parse(localStorage.getItem("mosquiscanRecords")) || [];

// Preview uploaded image
imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function (event) {
        currentImageData = event.target.result;
        imagePreview.src = currentImageData;
        imagePreview.style.display = "block";
    };

    reader.readAsDataURL(file);

    resultText.textContent = "Image uploaded. Ready for analysis.";
    currentResult = "Not analyzed";
});

// Temporary analysis function
analyzeButton.addEventListener("click", function () {
    if (!selectedImage) {
        resultText.textContent = "Please upload an image first.";
        return;
    }

    currentResult = "Demo result: Possible Breeding Site";
    resultText.textContent = currentResult;
});

// Save record
saveButton.addEventListener("click", function () {
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value;

    if (!selectedImage) {
        alert("Please upload an image first.");
        return;
    }

    if (currentResult === "Not analyzed") {
        alert("Please analyze the image first.");
        return;
    }

    if (!latitude || !longitude || !date) {
        alert("Please complete the latitude, longitude, and date fields.");
        return;
    }

    const record = {
        image: currentImageData,
        result: currentResult,
        latitude: latitude,
        longitude: longitude,
        date: date,
        notes: notes
    };

    records.push(record);

    localStorage.setItem(
        "mosquiscanRecords",
        JSON.stringify(records)
    );

    alert("Record saved successfully!");

    displayRecords();
});

// Display records in activity log
function displayRecords() {
    if (records.length === 0) {
        logMessage.innerHTML = "No records yet.";
        return;
    }

    logMessage.innerHTML = "";

    records.forEach(function (record, index) {
        const recordDiv = document.createElement("div");

        recordDiv.className = "log-record";

        recordDiv.innerHTML = `
            <hr>
            <p><strong>Record ${index + 1}</strong></p>
            <img src="${record.image}" 
                 alt="Inspected site image"
                 style="max-width: 200px; border-radius: 8px;">

            <p><strong>AI Result:</strong> ${record.result}</p>
            <p><strong>Latitude:</strong> ${record.latitude}</p>
            <p><strong>Longitude:</strong> ${record.longitude}</p>
            <p><strong>Date:</strong> ${record.date}</p>
            <p><strong>Notes:</strong> ${record.notes || "None"}</p>

            <button onclick="deleteRecord(${index})">
                Delete Record
            </button>
        `;

        logMessage.appendChild(recordDiv);
    });
}

// Delete a record
function deleteRecord(index) {
    records.splice(index, 1);

    localStorage.setItem(
        "mosquiscanRecords",
        JSON.stringify(records)
    );

    displayRecords();
}

// Display records when page loads
displayRecords();
