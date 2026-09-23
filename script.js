// ============================================================
// 🦟 MOSQUISCAN - MAIN JAVASCRIPT
// ============================================================


// ============================================================
// AI MODEL
// ============================================================

const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/cKLAix4wn/";


let model = null;

let maxPredictions = 0;

let currentImage = null;

let currentAIResult = "";

let currentConfidence = "";


// ============================================================
// MAP VARIABLES
// ============================================================

let map = null;

let selectedLocationMarker = null;


// ============================================================
// DOM ELEMENTS
// ============================================================

const imageInput =
    document.getElementById("imageInput");

const imagePreview =
    document.getElementById("imagePreview");

const analyzeButton =
    document.getElementById("analyzeButton");

const aiResult =
    document.getElementById("aiResult");


const latitudeInput =
    document.getElementById("latitude");

const longitudeInput =
    document.getElementById("longitude");

const locationButton =
    document.getElementById("locationButton");


const inspectionDate =
    document.getElementById("inspectionDate");

const notesInput =
    document.getElementById("notes");


const saveButton =
    document.getElementById("saveButton");

const saveMessage =
    document.getElementById("saveMessage");


const recordsList =
    document.getElementById("recordsList");


const totalRecords =
    document.getElementById("totalRecords");

const possibleSites =
    document.getElementById("possibleSites");

const notPossibleSites =
    document.getElementById("notPossibleSites");


const clearRecordsButton =
    document.getElementById("clearRecordsButton");


// ============================================================
// DEFAULT DATE
// ============================================================

function setTodayDate() {

    if (!inspectionDate) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    inspectionDate.value =
        `${year}-${month}-${day}`;
}


setTodayDate();


// ============================================================
// MAP INITIALIZATION
// ============================================================

function initializeMap() {

    const mapElement =
        document.getElementById("map");


    if (!mapElement) {
        return;
    }


    /*
        Candijay, Bohol
        Approximate center
    */

    map =
        L.map("map").setView(
            [9.8167, 124.4833],
            12
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // ========================================================
    // MAP CLICK
    // ========================================================

    map.on(
        "click",
        function (event) {

            const lat =
                event.latlng.lat;

            const lng =
                event.latlng.lng;


            if (latitudeInput) {

                latitudeInput.value =
                    lat.toFixed(6);
            }


            if (longitudeInput) {

                longitudeInput.value =
                    lng.toFixed(6);
            }


            // Remove previous temporary marker

            if (selectedLocationMarker) {

                map.removeLayer(
                    selectedLocationMarker
                );
            }


            // Create new marker

            selectedLocationMarker =
                L.marker(
                    [lat, lng]
                )
                .addTo(map);


            selectedLocationMarker
                .bindPopup(
                    `
                    <div class="map-popup">

                        <h3>
                            📍 Selected Location
                        </h3>

                        <p>
                            <strong>Latitude:</strong>
                            ${lat.toFixed(6)}
                        </p>

                        <p>
                            <strong>Longitude:</strong>
                            ${lng.toFixed(6)}
                        </p>

                    </div>
                    `
                )
                .openPopup();

        }
    );

}


// ============================================================
// LOAD AI MODEL
// ============================================================

async function loadAIModel() {

    try {

        if (!window.tmImage) {

            console.error(
                "Teachable Machine library was not loaded."
            );


            if (aiResult) {

                aiResult.textContent =
                    "AI library not loaded.";

            }


            return;
        }


        const modelURL =
            MODEL_URL + "model.json";


        const metadataURL =
            MODEL_URL + "metadata.json";


        console.log(
            "Loading MosquiScan AI..."
        );


        model =
            await tmImage.load(
                modelURL,
                metadataURL
            );


        maxPredictions =
            model.getTotalClasses();


        console.log(
            "MosquiScan AI Model Loaded!"
        );


        console.log(
            "Number of classes:",
            maxPredictions
        );


        if (
            typeof model.getClassLabels ===
            "function"
        ) {

            console.log(
                "Model classes:",
                model.getClassLabels()
            );
        }


        if (analyzeButton) {

            analyzeButton.disabled =
                false;
        }


        if (aiResult) {

            aiResult.textContent =
                "AI model ready. Upload an image.";

            aiResult.className =
                "result-box";
        }


    } catch (error) {

        console.error(
            "AI model loading error:",
            error
        );


        if (aiResult) {

            aiResult.textContent =
                "AI model failed to load.";

            aiResult.className =
                "result-box";
        }


        if (analyzeButton) {

            analyzeButton.disabled =
                true;
        }

    }

}


// ============================================================
// IMAGE UPLOAD
// ============================================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files[0];


            if (!file) {

                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                imageInput.value = "";

                return;
            }


            currentImage =
                file;


            currentAIResult =
                "";

            currentConfidence =
                "";


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    if (imagePreview) {

                        imagePreview.src =
                            event.target.result;

                        imagePreview.style.display =
                            "block";
                    }


                    if (analyzeButton) {

                        analyzeButton.disabled =
                            false;
                    }


                    if (aiResult) {

                        aiResult.textContent =
                            "Image ready for AI analysis.";

                        aiResult.className =
                            "result-box";
                    }

                };


            reader.readAsDataURL(file);

        }
    );

}


// ============================================================
// AI ANALYSIS
// ============================================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        async function () {

            if (!model) {

                alert(
                    "The AI model is still loading. Please wait."
                );

                return;
            }


            if (
                !imagePreview ||
                !imagePreview.src ||
                imagePreview.style.display === "none"
            ) {

                alert(
                    "Please upload an image first."
                );

                return;
            }


            try {

                analyzeButton.disabled =
                    true;


                analyzeButton.textContent =
                    "🤖 Analyzing...";


                if (aiResult) {

                    aiResult.textContent =
                        "AI is analyzing the image...";

                    aiResult.className =
                        "result-box";
                }


                // =================================================
                // RUN TEACHABLE MACHINE
                // =================================================

                const predictions =
                    await model.predict(
                        imagePreview
                    );


                console.log(
                    "===== MOSQUISCAN AI ====="
                );


                predictions.forEach(
                    function (prediction) {

                        console.log(
                            prediction.className +
                            ": " +
                            (
                                prediction.probability *
                                100
                            ).toFixed(2) +
                            "%"
                        );

                    }
                );


                // =================================================
                // FIND HIGHEST PROBABILITY
                // =================================================

                let highestPrediction =
                    predictions[0];


                for (
                    let i = 1;
                    i < predictions.length;
                    i++
                ) {

                    if (
                        predictions[i].probability >
                        highestPrediction.probability
                    ) {

                        highestPrediction =
                            predictions[i];

                    }

                }


                const className =
                    highestPrediction.className.trim();


                const confidence =
                    (
                        highestPrediction.probability *
                        100
                    ).toFixed(2);


                currentConfidence =
                    confidence;


                console.log(
                    "Final prediction:",
                    className
                );


                console.log(
                    "Confidence:",
                    confidence + "%"
                );


                // =================================================
                // EXACT CLASS MATCHING
                // =================================================

                if (
                    className ===
                    "Possible Breeding Site"
                ) {

                    currentAIResult =
                        "Possible Breeding Site";


                    if (aiResult) {

                        aiResult.innerHTML =
                            `
                            ⚠️
                            <strong>
                                Possible Breeding Site
                            </strong>
                            <br>
                            Confidence:
                            ${confidence}%
                            `;

                        aiResult.className =
                            "result-box result-possible";
                    }

                }


                else if (
                    className ===
                    "Not a Possible Breeding Site"
                ) {

                    currentAIResult =
                        "Not a Possible Breeding Site";


                    if (aiResult) {

                        aiResult.innerHTML =
                            `
                            ✅
                            <strong>
                                Not a Possible Breeding Site
                            </strong>
                            <br>
                            Confidence:
                            ${confidence}%
                            `;

                        aiResult.className =
                            "result-box result-not-possible";
                    }

                }


                else {

                    currentAIResult =
                        className;


                    if (aiResult) {

                        aiResult.textContent =
                            `${className} (${confidence}%)`;

                        aiResult.className =
                            "result-box";
                    }

                }


            } catch (error) {

                console.error(
                    "AI analysis error:",
                    error
                );


                currentAIResult =
                    "";


                if (aiResult) {

                    aiResult.textContent =
                        "AI analysis failed.";

                    aiResult.className =
                        "result-box";
                }

            }


            analyzeButton.disabled =
                false;


            analyzeButton.textContent =
                "🤖 Analyze Image";

        }
    );

}


// ============================================================
// CURRENT LOCATION
// ============================================================

if (locationButton) {

    locationButton.addEventListener(
        "click",
        function () {

            if (!navigator.geolocation) {

                alert(
                    "Geolocation is not supported by this browser."
                );

                return;
            }


            locationButton.disabled =
                true;


            locationButton.textContent =
                "📍 Getting location...";


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const lat =
                        position.coords.latitude;


                    const lng =
                        position.coords.longitude;


                    if (latitudeInput) {

                        latitudeInput.value =
                            lat.toFixed(6);
                    }


                    if (longitudeInput) {

                        longitudeInput.value =
                            lng.toFixed(6);
                    }


                    if (map) {

                        map.setView(
                            [lat, lng],
                            17
                        );


                        if (selectedLocationMarker) {

                            map.removeLayer(
                                selectedLocationMarker
                            );
                        }


                        selectedLocationMarker =
                            L.marker(
                                [lat, lng]
                            )
                            .addTo(map);


                        selectedLocationMarker
                            .bindPopup(
                                `
                                <div class="map-popup">

                                    <h3>
                                        📍 Current Location
                                    </h3>

                                    <p>
                                        <strong>
                                            Latitude:
                                        </strong>
                                        ${lat.toFixed(6)}
                                    </p>

                                    <p>
                                        <strong>
                                            Longitude:
                                        </strong>
                                        ${lng.toFixed(6)}
                                    </p>

                                </div>
                                `
                            )
                            .openPopup();

                    }


                    locationButton.disabled =
                        false;


                    locationButton.textContent =
                        "📍 Use Current Location";

                },


                function (error) {

                    console.error(
                        "Geolocation error:",
                        error
                    );


                    alert(
                        "Unable to get your location. Enter the coordinates manually or click the map."
                    );


                    locationButton.disabled =
                        false;


                    locationButton.textContent =
                        "📍 Use Current Location";

                },

                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0
                }

            );

        }
    );

}


// ============================================================
// COMPRESS IMAGE
// ============================================================

function compressImage(
    file,
    maxWidth = 800,
    quality = 0.60
) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            let width =
                                img.width;


                            let height =
                                img.height;


                            // Resize only if needed

                            if (
                                width >
                                maxWidth
                            ) {

                                const ratio =
                                    maxWidth /
                                    width;


                                width =
                                    maxWidth;


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.imageSmoothingEnabled =
                                true;


                            ctx.imageSmoothingQuality =
                                "medium";


                            ctx.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            const compressedImage =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    quality
                                );


                            resolve(
                                compressedImage
                            );

                        };


                    img.onerror =
                        reject;


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


// ============================================================
// SAVE INSPECTION
// ============================================================

if (saveButton) {

    saveButton.addEventListener(
        "click",
        async function () {

            if (!currentImage) {

                alert(
                    "Please upload an image first."
                );

                return;
            }


            if (!currentAIResult) {

                alert(
                    "Please analyze the image first."
                );

                return;
            }


            if (
                !latitudeInput ||
                !latitudeInput.value.trim()
            ) {

                alert(
                    "Please enter or select a latitude."
                );

                return;
            }


            if (
                !longitudeInput ||
                !longitudeInput.value.trim()
            ) {

                alert(
                    "Please enter or select a longitude."
                );

                return;
            }


            try {

                saveButton.disabled =
                    true;


                saveButton.textContent =
                    "⏳ Compressing & Saving...";


                // =================================================
                // COMPRESS IMAGE
                // =================================================

                const compressedImage =
                    await compressImage(
                        currentImage,
                        800,
                        0.60
                    );


                const record = {

                    id:
                        Date.now(),

                    image:
                        compressedImage,

                    result:
                        currentAIResult,

                    confidence:
                        currentConfidence,

                    latitude:
                        latitudeInput.value.trim(),

                    longitude:
                        longitudeInput.value.trim(),

                    date:
                        inspectionDate
                            ? inspectionDate.value
                            : "",

                    timestamp:
                        new Date().toISOString(),

                    notes:
                        notesInput
                            ? notesInput.value.trim()
                            : ""

                };


                let records =
                    getSavedRecords();


                records.push(record);


                localStorage.setItem(
                    "mosquiscanRecords",
                    JSON.stringify(records)
                );


                // =================================================
                // SUCCESS
                // =================================================

                if (saveMessage) {

                    saveMessage.textContent =
                        "✓ Inspection saved successfully!";

                    saveMessage.style.color =
                        "#16a34a";
                }


                // Update interface

                updateDashboard();

                displayRecords();

                displayMapMarkers();


                // =================================================
                // RESET FORM
                // =================================================

                currentImage =
                    null;

                currentAIResult =
                    "";

                currentConfidence =
                    "";


                if (imageInput) {

                    imageInput.value =
                        "";
                }


                if (imagePreview) {

                    imagePreview.src =
                        "";

                    imagePreview.style.display =
                        "none";
                }


                if (aiResult) {

                    aiResult.textContent =
                        "No analysis yet.";

                    aiResult.className =
                        "result-box";
                }


                if (notesInput) {

                    notesInput.value =
                        "";
                }


                setTimeout(
                    function () {

                        if (saveMessage) {

                            saveMessage.textContent =
                                "";
                        }

                    },
                    4000
                );


            } catch (error) {

                console.error(
                    "SAVE ERROR:",
                    error
                );


                if (
                    error.name ===
                    "QuotaExceededError"
                ) {

                    alert(
                        "Storage is full. Delete some old records and try again."
                    );

                }

                else {

                    alert(
                        "The inspection could not be saved."
                    );

                }

            }


            saveButton.disabled =
                false;


            saveButton.textContent =
                "💾 Save Inspection";

        }
    );

}


// ============================================================
// GET SAVED RECORDS
// ============================================================

function getSavedRecords() {

    try {

        const stored =
            localStorage.getItem(
                "mosquiscanRecords"
            );


        if (!stored) {

            return [];
        }


        const records =
            JSON.parse(stored);


        if (!Array.isArray(records)) {

            return [];
        }


        return records;

    }

    catch (error) {

        console.error(
            "Could not read records:",
            error
        );


        return [];

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// DASHBOARD
// ============================================================

function updateDashboard() {

    const records =
        getSavedRecords();


    const possible =
        records.filter(
            function (record) {

                return (
                    record.result ===
                    "Possible Breeding Site"
                );

            }
        ).length;


    const notPossible =
        records.filter(
            function (record) {

                return (
                    record.result ===
                    "Not a Possible Breeding Site"
                );

            }
        ).length;


    if (totalRecords) {

        totalRecords.textContent =
            records.length;
    }


    if (possibleSites) {

        possibleSites.textContent =
            possible;
    }


    if (notPossibleSites) {

        notPossibleSites.textContent =
            notPossible;
    }

}


// ============================================================
// DISPLAY RECORDS
// ============================================================

function displayRecords() {

    if (!recordsList) {

        return;
    }


    const records =
        getSavedRecords();


    recordsList.innerHTML =
        "";


    if (records.length === 0) {

        recordsList.innerHTML =
            `
            <p class="no-records">
                No inspection records yet.
            </p>
            `;

        return;
    }


    const reversedRecords =
        [...records].reverse();


    reversedRecords.forEach(
        function (record) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "record-item";


            const isPossible =
                record.result ===
                "Possible Breeding Site";


            const resultClass =
                isPossible
                    ? "result-possible"
                    : "result-not-possible";


            const resultIcon =
                isPossible
                    ? "⚠️"
                    : "✅";


            item.innerHTML =
                `

                <div class="record-image">

                    <img
                        src="${record.image}"
                        alt="MosquiScan inspection image"
                    >

                </div>


                <div class="record-info">

                    <h3 class="${resultClass}">

                        ${resultIcon}
                        ${escapeHTML(record.result)}

                    </h3>


                    <p>
                        <strong>
                            Confidence:
                        </strong>

                        ${
                            escapeHTML(
                                record.confidence ||
                                "N/A"
                            )
                        }%
                    </p>


                    <p>
                        <strong>
                            Latitude:
                        </strong>

                        ${escapeHTML(
                            record.latitude
                        )}
                    </p>


                    <p>
                        <strong>
                            Longitude:
                        </strong>

                        ${escapeHTML(
                            record.longitude
                        )}
                    </p>


                    <p>
                        <strong>
                            Date:
                        </strong>

                        ${escapeHTML(
                            record.date ||
                            "N/A"
                        )}
                    </p>


                    <p>
                        <strong>
                            Notes:
                        </strong>

                        ${escapeHTML(
                            record.notes ||
                            "None"
                        )}
                    </p>

                </div>

                `;


            recordsList.appendChild(
                item
            );

        }
    );

}


// ============================================================
// MAP MARKERS
// ============================================================

function displayMapMarkers() {

    if (!map) {

        return;
    }


    const records =
        getSavedRecords();


    // Remove old record markers

    map.eachLayer(
        function (layer) {

            if (
                layer instanceof L.CircleMarker &&
                layer !== selectedLocationMarker
            ) {

                map.removeLayer(
                    layer
                );

            }

        }
    );


    // Add record markers

    records.forEach(
        function (record) {

            const lat =
                parseFloat(
                    record.latitude
                );


            const lng =
                parseFloat(
                    record.longitude
                );


            if (
                Number.isNaN(lat) ||
                Number.isNaN(lng)
            ) {

                return;
            }


            const isPossible =
                record.result ===
                "Possible Breeding Site";


            const markerColor =
                isPossible
                    ? "#e53935"
                    : "#16a34a";


            const marker =
                L.circleMarker(
                    [lat, lng],
                    {

                        radius: 9,

                        color:
                            markerColor,

                        fillColor:
                            markerColor,

                        fillOpacity:
                            0.80,

                        weight: 2

                    }
                )
                .addTo(map);


            const popupImage =
                record.image
                    ?
                    `
                    <img
                        src="${record.image}"
                        style="
                            width:160px;
                            height:100px;
                            object-fit:cover;
                            border-radius:8px;
                            display:block;
                            margin:0 auto 10px;
                        "
                        alt="Inspection image"
                    >
                    `
                    :
                    "";


            const icon =
                isPossible
                    ? "⚠️"
                    : "✅";


            marker.bindPopup(
                `

                <div
                    style="
                        width:210px;
                        text-align:center;
                    "
                >

                    ${popupImage}


                    <strong>
                        ${icon}
                        ${escapeHTML(
                            record.result
                        )}
                    </strong>


                    <hr
                        style="
                            margin:10px 0;
                            border:none;
                            border-top:
                                1px solid #ddd;
                        "
                    >


                    <div
                        style="
                            text-align:left;
                            font-size:13px;
                            line-height:1.6;
                        "
                    >

                        <strong>
                            Latitude:
                        </strong>

                        ${escapeHTML(
                            record.latitude
                        )}

                        <br>


                        <strong>
                            Longitude:
                        </strong>

                        ${escapeHTML(
                            record.longitude
                        )}

                        <br>


                        <strong>
                            Confidence:
                        </strong>

                        ${escapeHTML(
                            record.confidence ||
                            "N/A"
                        )}%

                        <br>


                        <strong>
                            Date:
                        </strong>

                        ${escapeHTML(
                            record.date ||
                            "N/A"
                        )}

                    </div>

                </div>

                `
            );

        }
    );

}


// ============================================================
// CLEAR RECORDS
// ============================================================

if (clearRecordsButton) {

    clearRecordsButton.addEventListener(
        "click",
        function () {

            const records =
                getSavedRecords();


            if (records.length === 0) {

                alert(
                    "There are no records to delete."
                );

                return;
            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete all MosquiScan records?"
                );


            if (!confirmed) {

                return;
            }


            localStorage.removeItem(
                "mosquiscanRecords"
            );


            updateDashboard();

            displayRecords();

            displayMapMarkers();


            if (saveMessage) {

                saveMessage.textContent =
                    "";
            }


            alert(
                "All MosquiScan records have been deleted."
            );

        }
    );

}


// ============================================================
// START MOSQUISCAN
// ============================================================

async function initializeMosquiScan() {

    console.log(
        "Starting MosquiScan..."
    );


    initializeMap();


    updateDashboard();


    displayRecords();


    displayMapMarkers();


    await loadAIModel();


    console.log(
        "MosquiScan is ready!"
    );

}


// ============================================================
// RUN SYSTEM
// ============================================================

initializeMosquiScan();
