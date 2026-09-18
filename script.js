// ======================================
// MOSQUISCAN WEBSITE JAVASCRIPT
// ======================================

// STORAGE KEY
const STORAGE_KEY = "mosquiscanRecords";

// GET HTML ELEMENTS
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
// DEFAULT DATE
// ======================================

const today = new Date().toISOString().split("T")[0];

if (dateInput) {
  dateInput.value = today;
}

// ======================================
// INITIALIZE MAP
// ======================================

const map = L.map("map").setView([9.8169, 124.4726], 13);

// OpenStreetMap map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Store map markers
let markers = [];

// ======================================
// LOAD SAVED RECORDS
// ======================================

let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ======================================
// IMAGE PREVIEW
// ======================================

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];

  if (!file) {
    imagePreview.style.display = "none";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    imagePreview.src = event.target.result;
    imagePreview.style.display = "block";
  };

  reader.readAsDataURL(file);
});

// ======================================
// SAMPLE AI ANALYSIS
// ======================================

analyzeButton.addEventListener("click", function () {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.textContent = "Analyzing...";

  resultText.textContent = "Analyzing image...";
  confidenceText.textContent = "Please wait.";

  // Temporary simulated AI analysis
  // This will be replaced by a real AI model later.
  setTimeout(function () {
    const possibleSite = Math.random() >= 0.5;

    if (possibleSite) {
      resultText.textContent = "Possible Mosquito Breeding Site";
      confidenceText.textContent = "AI Confidence: 89%";
    } else {
      resultText.textContent = "Not a Possible Breeding Site";
      confidenceText.textContent = "AI Confidence: 91%";
    }

    analyzeButton.disabled = false;
    analyzeButton.textContent = "Analyze Image";
  }, 1500);
});

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

  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  if (
    result === "Analyzing image..." ||
    result === "No analysis yet" ||
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
    alert("Please select a date.");
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

  const reader = new FileReader();

  reader.onload = function (event) {
    const imageData = event.target.result;

    const newRecord = {
      id: Date.now(),
      image: imageData,
      result: result,
      confidence: confidenceText.textContent,
      latitude: latitudeNumber,
      longitude: longitudeNumber,
      date: date,
      notes: notes,
      createdAt: new Date().toLocaleString()
    };

    records.push(newRecord);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    alert("Record saved successfully!");

    updateDashboard();
    displayRecordsOnMap();
    displayActivityLog();
    clearForm();
  };

  reader.readAsDataURL(file);
});

// ======================================
// UPDATE DASHBOARD
// ======================================

function updateDashboard() {
  const totalRecords = records.length;

  const possibleSites = records.filter(function (record) {
    return record.result === "Possible Mosquito Breeding Site";
  }).length;

  const nonSites = records.filter(function (record) {
    return record.result === "Not a Possible Breeding Site";
  }).length;

  totalRecordsText.textContent = totalRecords;
  possibleSitesText.textContent = possibleSites;
  nonSitesText.textContent = nonSites;
}

// ======================================
// DISPLAY MARKERS ON MAP
// ======================================

function displayRecordsOnMap() {
  // Remove previous markers
  markers.forEach(function (marker) {
    map.removeLayer(marker);
  });

  markers = [];

  records.forEach(function (record) {
    const isPossibleSite =
      record.result === "Possible Mosquito Breeding Site";

    const markerColor = isPossibleSite ? "red" : "green";

    const markerIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${markerColor};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        "></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const marker = L.marker(
      [record.latitude, record.longitude],
      { icon: markerIcon }
    ).addTo(map);

    marker.bindPopup(`
      <strong>${record.result}</strong><br>
      <b>Date:</b> ${record.date}<br>
      <b>Latitude:</b> ${record.latitude}<br>
      <b>Longitude:</b> ${record.longitude}<br>
      <b>Notes:</b> ${record.notes || "No notes"}
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
      <span>Coordinates: ${record.latitude}, ${record.longitude}</span><br>
      <span>Notes: ${record.notes || "No notes"}</span><br>
      <small>Saved: ${record.createdAt}</small>
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

  resultText.textContent = "No analysis yet";
  confidenceText.textContent = "Upload an image and click Analyze Image.";

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
