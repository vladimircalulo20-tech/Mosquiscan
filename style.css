// ======================================
// MOSQUISCAN JAVASCRIPT
// ======================================

// ======================================
// HTML ELEMENTS
// ======================================

const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeButton = document.getElementById("analyzeButton");
const saveButton = document.getElementById("saveButton");
const clearRecordsButton = document.getElementById("clearRecordsButton");

const resultText = document.getElementById("resultText");
const confidenceText = document.getElementById("confidenceText");

const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const dateInput = document.getElementById("date");
const notesInput = document.getElementById("notes");

const totalRecordsText = document.getElementById("totalRecords");
const possibleSitesText = document.getElementById("possibleSites");
const nonSitesText = document.getElementById("nonSites");

const activityLog = document.getElementById("activityLog");

// ======================================
// SETTINGS
// ======================================

const MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/cKLAix4wn/";

const STORAGE_KEY = "mosquiscanRecords";

let model;
let modelLoaded = false;
let selectedImageData = null;

// ======================================
// SET DEFAULT DATE
// ======================================

const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

// ======================================
// INITIALIZE LEAFLET MAP
// ======================================

// Default map center: Candijay, Bohol
const map = L.map("map").setView([9.8169, 124.4726], 13);

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19
}).addTo(map);

// Store markers
let markers = [];

// ======================================
// LOAD SAVED RECORDS
// ======================================

let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ======================================
// LOAD TEACHABLE MACHINE MODEL
// ======================================

async function loadAIModel() {
  try {
    resultText.textContent = "Loading AI model...";
    confidenceText.textContent =
      "Please wait while the trained model loads.";

    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    modelLoaded = true;

    resultText.textContent = "AI model ready";
    confidenceText.textContent =
      "Upload an image and click Analyze Image.";
  } catch (error) {
    console.error("Model loading error:", error);

    resultText.textContent = "AI model failed to load";
    confidenceText.textContent =
      "Please check the model link and your internet connection.";
  }
}

// ======================================
// IMAGE PREVIEW
// ======================================

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];

  if (!file) {
    imagePreview.style.display = "none";
    selectedImageData = null;
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    selectedImageData = event.target.result;

    imagePreview.src = selectedImageData;
    imagePreview.style.display = "block";

    resultText.textContent = "Image ready for analysis";
    confidenceText.textContent =
      "Click Analyze Image to use the trained AI model.";
  };

  reader.readAsDataURL(file);
});

// ======================================
// ANALYZE IMAGE USING AI MODEL
// ======================================

analyzeButton.addEventListener("click", async function () {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  if (!modelLoaded) {
    alert("The AI model is not ready yet. Please wait.");
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.textContent = "Analyzing...";

  resultText.textContent = "Analyzing image...";
  confidenceText.textContent =
    "The AI is examining the uploaded image.";

  try {
    const predictions = await model.predict(imagePreview);

    let highestPrediction = predictions[0];

    for (let i = 1; i < predictions.length; i++) {
      if (
        predictions[i].probability >
        highestPrediction.probability
      ) {
        highestPrediction = predictions[i];
      }
    }

    const className = highestPrediction.className;
    const confidence = (
      highestPrediction.probability * 100
    ).toFixed(2);

    resultText.textContent = className;
    confidenceText.textContent =
      "AI Confidence: " + confidence + "%";
  } catch (error) {
    console.error("Prediction error:", error);

    resultText.textContent = "Analysis failed";
    confidenceText.textContent =
      "Please try uploading another image.";
  }

  analyzeButton.disabled = false;
  analyzeButton.textContent = "Analyze Image";
});

// ======================================
// CHECK IF RESULT IS A POSSIBLE SITE
// ======================================

function isPossibleBreedingSite(result) {
  const text = result.toLowerCase();

  const negativeWords = [
    "not",
    "no",
    "non",
    "negative",
    "absent",
    "none"
  ];

  const positiveWords = [
    "possible",
    "breeding",
    "site",
    "yes",
    "positive"
  ];

  const hasNegativeWord = negativeWords.some(function (word) {
    return text.includes(word);
  });

  const hasPositiveWord = positiveWords.some(function (word) {
    return text.includes(word);
  });

  return hasPositiveWord && !hasNegativeWord;
}

// ======================================
// SAVE RECORD
// ======================================

saveButton.addEventListener("click", function () {
  const file = imageInput.files[0];
  const result = resultText.textContent;

  const latitude = latitudeInput.value.trim();
  const longitude = longitudeInput.value.trim();
  const date = dateInput.value;
  const notes = notesInput.value.trim();

  if (!file || !selectedImageData) {
    alert("Please upload an image first.");
    return;
  }

  if (
    result === "Analyzing image..." ||
    result === "No analysis yet" ||
    result === "AI model ready" ||
    result === "Image ready for analysis" ||
    result === "Analysis failed" ||
    result === ""
  ) {
    alert("Please analyze the image first.");
    return;
  }

  if (!latitude || !longitude) {
    alert("Please enter the latitude and longitude.");
    return;
  }

  if (!date) {
    alert("Please select the inspection date.");
    return;
  }

  const latitudeNumber = Number(latitude);
  const longitudeNumber = Number(longitude);

  if (
    isNaN(latitudeNumber) ||
    isNaN(longitudeNumber) ||
    latitudeNumber < -90 ||
    latitudeNumber > 90 ||
    longitudeNumber < -180 ||
    longitudeNumber > 180
  ) {
    alert("Please enter valid coordinates.");
    return;
  }

  const newRecord = {
    id: Date.now(),
    image: selectedImageData,
    result: result,
    confidence: confidenceText.textContent,
    latitude: latitudeNumber,
    longitude: longitudeNumber,
    date: date,
    notes: notes,
    createdAt: new Date().toLocaleString()
  };

  records.push(newRecord);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );

  alert("Record saved successfully!");

  updateDashboard();
  displayRecordsOnMap();
  displayActivityLog();
  clearForm();
});

// ======================================
// UPDATE DASHBOARD
// ======================================

function updateDashboard() {
  const totalRecords = records.length;

  const possibleSites = records.filter(function (record) {
    return isPossibleBreedingSite(record.result);
  }).length;

  const nonSites = totalRecords - possibleSites;

  totalRecordsText.textContent = totalRecords;
  possibleSitesText.textContent = possibleSites;
  nonSitesText.textContent = nonSites;
}

// ======================================
// CREATE MAP MARKER
// ======================================

function createMarkerIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

// ======================================
// DISPLAY RECORDS ON MAP
// ======================================

function displayRecordsOnMap() {
  // Remove old markers
  markers.forEach(function (marker) {
    map.removeLayer(marker);
  });

  markers = [];

  records.forEach(function (record) {
    const possibleSite = isPossibleBreedingSite(record.result);

    const markerColor = possibleSite
      ? "#dc2626"
      : "#16a34a";

    const marker = L.marker(
      [record.latitude, record.longitude],
      {
        icon: createMarkerIcon(markerColor)
      }
    ).addTo(map);

    marker.bindPopup(`
      <div>
        <strong>${record.result}</strong><br><br>
        <b>Date:</b> ${record.date}<br>
        <b>Latitude:</b> ${record.latitude}<br>
        <b>Longitude:</b> ${record.longitude}<br>
        <b>Confidence:</b> ${record.confidence}<br>
        <b>Notes:</b> ${record.notes || "No notes"}
      </div>
    `);

    markers.push(marker);
  });
}

// ======================================
// DISPLAY ACTIVITY LOG
// ======================================

function displayActivityLog() {
  if (records.length === 0) {
    activityLog.innerHTML = `
      <p class="empty-log">No records saved yet.</p>
    `;
    return;
  }

  activityLog.innerHTML = "";

  const newestRecords = [...records].reverse();

  newestRecords.forEach(function (record) {
    const logEntry = document.createElement("div");

    logEntry.className = "log-entry";

    logEntry.innerHTML = `
      <strong>${record.result}</strong><br>
      <span>Date: ${record.date}</span><br>
      <span>
        Coordinates: ${record.latitude}, ${record.longitude}
      </span><br>
      <span>
        Confidence: ${record.confidence}
      </span><br>
      <span>
        Notes: ${record.notes || "No notes"}
      </span><br>
      <small>
        Saved: ${record.createdAt}
      </small>
    `;

    activityLog.appendChild(logEntry);
  });
}

// ======================================
// CLEAR FORM
// ======================================

function clearForm() {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.style.display = "none";
  selectedImageData = null;

  resultText.textContent = "No analysis yet";
  confidenceText.textContent =
    "Upload an image and click Analyze Image.";

  latitudeInput.value = "";
  longitudeInput.value = "";
  dateInput.value = today;
  notesInput.value = "";
}

// ======================================
// CLEAR ALL RECORDS
// ======================================

clearRecordsButton.addEventListener("click", function () {
  if (records.length === 0) {
    alert("There are no records to clear.");
    return;
  }

  const confirmation = confirm(
    "Are you sure you want to delete all saved records?"
  );

  if (confirmation) {
    records = [];

    localStorage.removeItem(STORAGE_KEY);

    updateDashboard();
    displayRecordsOnMap();
    displayActivityLog();

    alert("All records have been cleared.");
  }
});

// ======================================
// INITIAL PAGE LOAD
// ======================================

updateDashboard();
displayRecordsOnMap();
displayActivityLog();
loadAIModel();
