document.addEventListener("DOMContentLoaded", () => {
  // 1. Get references to the key HTML elements
  const healthDataSection = document.getElementById("enter-health-data");
  const toggleHeader = document.getElementById("toggle-health-data");
  const formContainer = document.getElementById("form-container"); // The element that actually hides/shows

  // Check if all elements exist to prevent errors
  if (!healthDataSection || !toggleHeader || !formContainer) {
    console.error(
      "Health Data Script Error: Missing one or more required IDs (enter-health-data, toggle-health-data, form-container)."
    );
    return;
  }

  // --- Initial State Setup (Ensuring Accessibility) ---
  const isInitiallyExpanded = healthDataSection.classList.contains("active");

  // Set initial collapsed state (Ensures consistency on page load)
  // If the 'active' class is removed by JS, the CSS ensures it is hidden.
  if (!isInitiallyExpanded) {
    healthDataSection.classList.remove("active");
  }

  // Set ARIA attributes for accessibility
  toggleHeader.setAttribute("aria-expanded", isInitiallyExpanded);
  toggleHeader.setAttribute("aria-controls", "form-container"); // Links button to content
  formContainer.setAttribute("aria-hidden", !isInitiallyExpanded); // Hides content from screen readers if collapsed

  // --- Toggle Logic ---
  toggleHeader.addEventListener("click", () => {
    // 1. Toggle the visual state (This class drives the CSS animation)
    healthDataSection.classList.toggle("active");

    // 2. Determine the new state
    const isExpanded = healthDataSection.classList.contains("active");

    // 3. Update ARIA attributes based on the new state for accessibility
    toggleHeader.setAttribute("aria-expanded", isExpanded);
    formContainer.setAttribute("aria-hidden", !isExpanded);
  });

  // --- Form Reset Listener (User Feedback Enhancement) ---
  const healthForm = document.getElementById("health-data-form");
  if (healthForm) {
    healthForm.addEventListener("reset", () => {
      const resetButton = healthForm.querySelector('button[type="reset"]');
      if (resetButton) {
        const originalText = resetButton.textContent;
        resetButton.textContent = "Cleared!";
        setTimeout(() => {
          resetButton.textContent = originalText;
        }, 1500);
      }
    });
  }
});

/* =============================
   FITNESS TRACKING — INTERACTIVE JS
   ============================= */

document.addEventListener("DOMContentLoaded", () => {
  const fitnessForm = document.getElementById("fitnessForm");
  const fitnessProgress = document.getElementById("fitnessProgress");

  // Retrieve existing data or initialize empty array
  let fitnessLogs = JSON.parse(localStorage.getItem("fitnessLogs")) || [];

  // Render logs on load
  renderFitnessLogs();

  // Handle form submission
  fitnessForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("fitnessDate").value;
    const steps = parseInt(document.getElementById("steps").value);
    const duration = parseInt(
      document.getElementById("activityDuration").value
    );
    const goalType = document.getElementById("goalType").value;
    const goalValue = parseInt(document.getElementById("goalValue").value);
    const notes = document.getElementById("fitnessNotes").value.trim();

    if (!date || !steps || !duration || !goalType || !goalValue) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    // Calculate goal progress
    let progressPercent = 0;
    if (goalType === "steps")
      progressPercent = Math.min((steps / goalValue) * 100, 100);
    else if (goalType === "duration")
      progressPercent = Math.min((duration / goalValue) * 100, 100);
    else if (goalType === "calories")
      progressPercent = Math.min(((steps * 0.04) / goalValue) * 100, 100); // approx calories burned per step

    // Create new entry
    const logEntry = {
      id: Date.now(),
      date,
      steps,
      duration,
      goalType,
      goalValue,
      progressPercent,
      notes,
    };

    fitnessLogs.push(logEntry);
    localStorage.setItem("fitnessLogs", JSON.stringify(fitnessLogs));

    // Reset form and re-render
    fitnessForm.reset();
    renderFitnessLogs();

    alert("✅ Fitness log saved successfully!");
  });

  // Render fitness logs dynamically
  function renderFitnessLogs() {
    fitnessProgress.innerHTML = "";

    if (fitnessLogs.length === 0) {
      fitnessProgress.innerHTML = `<p style="text-align:center; color:#777;">No fitness data logged yet. Start tracking your progress!</p>`;
      return;
    }

    fitnessLogs
      .slice()
      .reverse()
      .forEach((log) => {
        const logBox = document.createElement("div");
        logBox.className = "fitness-log-box";
        logBox.innerHTML = `
          <div class="log-header">
            <strong>${new Date(log.date).toDateString()}</strong>
            <span class="progress">${log.progressPercent.toFixed(0)}%</span>
          </div>
          <div class="log-body">
            <p><b>Steps:</b> ${log.steps.toLocaleString()}</p>
            <p><b>Duration:</b> ${log.duration} min</p>
            <p><b>Goal:</b> ${log.goalValue} (${log.goalType})</p>
            ${log.notes ? `<p><b>Notes:</b> ${log.notes}</p>` : ""}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${
              log.progressPercent
            }%;"></div>
          </div>
          <button class="delete-log">🗑️ Delete</button>
        `;

        logBox.querySelector(".delete-log").addEventListener("click", () => {
          fitnessLogs = fitnessLogs.filter((entry) => entry.id !== log.id);
          localStorage.setItem("fitnessLogs", JSON.stringify(fitnessLogs));
          renderFitnessLogs();
        });

        fitnessProgress.appendChild(logBox);
      });
  }
});

/* ==============================
   SLEEP ANALYZER – INTERACTIVE LOGIC
============================== */

document.addEventListener("DOMContentLoaded", () => {
  const sleepForm = document.getElementById("sleepForm");
  const sleepStart = document.getElementById("sleepStart");
  const wakeTime = document.getElementById("wakeTime");
  const sleepDuration = document.getElementById("sleepDuration");
  const sleepQuality = document.getElementById("sleepQuality");
  const sleepResult = document.getElementById("sleepResult");

  // Auto calculate duration when times change
  function calculateDuration() {
    if (!sleepStart.value || !wakeTime.value) return;

    const start = new Date(sleepStart.value);
    const end = new Date(wakeTime.value);

    // Handle next-day sleep (e.g. 11PM to 7AM)
    if (end < start) end.setDate(end.getDate() + 1);

    const diffHours = (end - start) / (1000 * 60 * 60);
    sleepDuration.value = diffHours.toFixed(1);

    // Auto-assign quality
    if (diffHours >= 8) {
      sleepQuality.value = "Excellent 😴";
    } else if (diffHours >= 6) {
      sleepQuality.value = "Good 😊";
    } else if (diffHours >= 4) {
      sleepQuality.value = "Fair 😐";
    } else {
      sleepQuality.value = "Poor 😫";
    }
  }

  sleepStart.addEventListener("change", calculateDuration);
  wakeTime.addEventListener("change", calculateDuration);

  // On form submit → show detailed analysis
  sleepForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!sleepDuration.value) {
      alert("Please enter both times before analyzing!");
      return;
    }

    const duration = parseFloat(sleepDuration.value);
    let message = "";
    let color = "";

    if (duration >= 8) {
      message =
        "🌙 You’re well-rested! Excellent sleep duration and quality. Keep it up!";
      color = "#00a86b";
    } else if (duration >= 6) {
      message =
        "😴 You’re getting decent rest. Try to add a bit more sleep for peak performance.";
      color = "#00a8a8";
    } else if (duration >= 4) {
      message =
        "⚠️ Your sleep duration is below optimal. Consider adjusting your bedtime routine.";
      color = "#ffa726";
    } else {
      message =
        "🚫 Very poor sleep detected. Try to get more consistent rest for better health.";
      color = "#e53935";
    }

    // Display result box
    sleepResult.innerHTML = `
      <div class="sleep-summary" style="border-left: 5px solid ${color}">
        <h3>Sleep Analysis Summary</h3>
        <p><strong>Total Sleep:</strong> ${duration} hours</p>
        <p><strong>Quality:</strong> ${sleepQuality.value}</p>
        <p style="color:${color}">${message}</p>
      </div>
    `;
  });
});
// ===============================
// REAL HEART RATE MONITOR (Web Bluetooth)
// ===============================

const connectBtn = document.getElementById("connectBtn");
const heartRateDisplay = document.getElementById("heartRateDisplay");
const statusText = document.querySelector(".status-text");
const heartRateList = document.getElementById("heartRateList");
const bluetoothIcon = document.getElementById("bluetoothIcon");

// Chart setup
const ctx = document.getElementById("heartRateCanvas").getContext("2d");
let heartData = [];
let labels = [];

const heartChart = new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: heartData,
        borderColor: "#00a8a8",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    scales: { x: { display: false }, y: { min: 40, max: 180 } },
    plugins: { legend: { display: false } },
  },
});

// Connect button event
connectBtn.addEventListener("click", async () => {
  try {
    statusText.textContent = "Requesting Bluetooth device...";
    bluetoothIcon.style.color = "#ff9800";

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ["heart_rate"] }],
      optionalServices: ["battery_service"],
    });

    statusText.textContent = "Connecting to device...";
    const server = await device.gatt.connect();
    bluetoothIcon.classList.add("connected");

    statusText.textContent = "Connected! Reading heart rate...";
    const service = await server.getPrimaryService("heart_rate");
    const characteristic = await service.getCharacteristic(
      "heart_rate_measurement"
    );

    await characteristic.startNotifications();
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handleHeartRate
    );
  } catch (error) {
    console.error(error);
    statusText.textContent =
      "Connection failed or Bluetooth off. Please try again.";
    bluetoothIcon.classList.remove("connected");
    bluetoothIcon.style.color = "#bbb";
  }
});

// Decode heart rate data
function handleHeartRate(event) {
  const value = event.target.value;
  const bpm = value.getUint8(1); // Standard position for heart rate byte

  updateHeartRate(bpm);
}

function updateHeartRate(bpm) {
  heartRateDisplay.textContent = bpm + " BPM";
  if (bpm < 60) heartRateDisplay.style.color = "#0288d1";
  else if (bpm <= 100) heartRateDisplay.style.color = "#00a8a8";
  else heartRateDisplay.style.color = "#e53935";

  const now = new Date().toLocaleTimeString();
  const li = document.createElement("li");
  li.textContent = `${now} — ${bpm} BPM`;
  heartRateList.prepend(li);

  if (heartRateList.childElementCount > 10)
    heartRateList.removeChild(heartRateList.lastChild);

  if (labels.length > 20) {
    labels.shift();
    heartData.shift();
  }

  labels.push(now);
  heartData.push(bpm);
  heartChart.update();
}

// ===============================
// HYDRATION TRACKER FUNCTIONALITY
// ===============================

const dailyGoalInput = document.getElementById("dailyGoalInput");
const drinkAmountInput = document.getElementById("drinkAmountInput");
const setGoalBtn = document.getElementById("setGoalBtn");

const dailyGoalDisplay = document.getElementById("dailyGoal");
const waterProgress = document.getElementById("waterProgress");
const progressValue = document.getElementById("progressValue");

const waterButtons = document.querySelectorAll(".water-btn");
const customDrinkBtn = document.getElementById("customDrinkBtn");

const reminderInput = document.getElementById("reminderInterval");
const setReminderBtn = document.getElementById("setReminderBtn");

let dailyGoal = 2000; // Default goal (ml)
let currentIntake = 0;
let reminderTimer = null;

// --- Load from localStorage on page load ---
window.addEventListener("DOMContentLoaded", () => {
  const savedGoal = localStorage.getItem("hydrationGoal");
  const savedIntake = localStorage.getItem("hydrationIntake");

  if (savedGoal) dailyGoal = parseInt(savedGoal);
  if (savedIntake) currentIntake = parseInt(savedIntake);

  updateUI();
});

// --- Set Goal ---
setGoalBtn.addEventListener("click", () => {
  const goalValue = parseInt(dailyGoalInput.value);
  if (!goalValue || goalValue < 500 || goalValue > 5000) {
    alert("⚠️ Please enter a valid goal between 500 and 5000 ml.");
    return;
  }

  dailyGoal = goalValue;
  localStorage.setItem("hydrationGoal", dailyGoal);
  waterProgress.max = dailyGoal;
  updateUI();

  alert("✅ Daily hydration goal set successfully!");
});

// --- Add Water ---
waterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "customDrinkBtn") {
      const customAmount = parseInt(prompt("Enter custom drink amount (ml):"));
      if (customAmount && customAmount > 0) addWater(customAmount);
    } else {
      const amount = parseInt(btn.getAttribute("data-amount"));
      addWater(amount);
    }
  });
});

function addWater(amount) {
  currentIntake += amount;

  if (currentIntake > dailyGoal) {
    currentIntake = dailyGoal;
    alert("🎉 Goal achieved! Great job staying hydrated!");
  }

  localStorage.setItem("hydrationIntake", currentIntake);
  updateUI();
}

// --- Reminder Functionality ---
setReminderBtn.addEventListener("click", () => {
  const interval = parseInt(reminderInput.value);

  if (!interval || interval < 15 || interval > 180) {
    alert(
      "⚠️ Please enter a valid reminder interval between 15 and 180 minutes."
    );
    return;
  }

  if (reminderTimer) clearInterval(reminderTimer);

  reminderTimer = setInterval(() => {
    alert("💧 Time to drink some water!");
  }, interval * 60000);

  alert(`🔔 Reminder set every ${interval} minutes.`);
});

// --- Update UI Function ---
function updateUI() {
  dailyGoalDisplay.textContent = dailyGoal;
  waterProgress.max = dailyGoal;
  waterProgress.value = currentIntake;
  progressValue.textContent = `${currentIntake} / ${dailyGoal} ml`;

  if (currentIntake >= dailyGoal) {
    progressValue.style.color = "#00a8a8";
  } else {
    progressValue.style.color = "#555";
  }
}

// ===============================
// CALORIE COUNTER — FUNCTIONAL JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const calorieForm = document.getElementById("calorieForm");
  const foodNameInput = document.getElementById("foodName");
  const calPerServingInput = document.getElementById("calPerServing");
  const servingsInput = document.getElementById("servings");
  const addFoodBtn = document.getElementById("addFoodBtn");
  const clearFoodsBtn = document.getElementById("clearFoodsBtn");
  const calorieList = document.getElementById("calorieList");
  const calorieTotal = document.getElementById("calorieTotal");
  const calorieProgress = document.getElementById("calorieProgress");
  const progressValue = document.getElementById("progressValue");
  const exportCalorieBtn = document.getElementById("exportCalorieBtn");
  const downloadReportBtn = document.getElementById("downloadReportBtn");

  const presetBtns = document.querySelectorAll(".preset-btn");
  const MAX_CALORIES = 2000; // default daily goal

  // Load saved data
  let foods = JSON.parse(localStorage.getItem("calorieData")) || [];
  updateUI();

  // ===========================
  // ADD FOOD ITEM
  // ===========================
  calorieForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const foodName = foodNameInput.value.trim();
    const calPerServing = parseFloat(calPerServingInput.value);
    const servings = parseFloat(servingsInput.value);

    if (!foodName || calPerServing <= 0 || servings <= 0) {
      alert("Please enter valid food details.");
      return;
    }

    const item = {
      id: Date.now(),
      name: foodName,
      calPerServing,
      servings,
      total: calPerServing * servings,
    };

    foods.push(item);
    saveAndRender();
    calorieForm.reset();
  });

  // ===========================
  // QUICK PRESETS
  // ===========================
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const cal = parseFloat(btn.dataset.cal);
      const serv = parseFloat(btn.dataset.serv);
      const item = {
        id: Date.now(),
        name,
        calPerServing: cal,
        servings: serv,
        total: cal * serv,
      };
      foods.push(item);
      saveAndRender();
    });
  });

  // ===========================
  // REMOVE SINGLE ITEM
  // ===========================
  calorieList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const li = e.target.closest("li");
      const id = parseInt(li.dataset.id);
      foods = foods.filter((item) => item.id !== id);
      saveAndRender();
    }
  });

  // ===========================
  // CLEAR ALL ITEMS
  // ===========================
  clearFoodsBtn.addEventListener("click", () => {
    if (confirm("Clear all food entries?")) {
      foods = [];
      saveAndRender();
    }
  });

  // ===========================
  // EXPORT JSON
  // ===========================
  exportCalorieBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(foods, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calorie_data.json";
    link.click();
  });

  // ===========================
  // DOWNLOAD CSV REPORT
  // ===========================
  downloadReportBtn.addEventListener("click", () => {
    if (foods.length === 0) return alert("No data to download.");

    const csvHeader = "Food,Calories per Serving,Servings,Total Calories\n";
    const csvRows = foods
      .map(
        (f) =>
          `${f.name},${f.calPerServing},${f.servings},${f.total.toFixed(1)}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calorie_report.csv";
    link.click();
  });

  // ===========================
  // SAVE + UPDATE UI
  // ===========================
  function saveAndRender() {
    localStorage.setItem("calorieData", JSON.stringify(foods));
    updateUI();
  }

  function updateUI() {
    calorieList.innerHTML = "";

    let totalCalories = 0;
    foods.forEach((f) => {
      totalCalories += f.total;

      const li = document.createElement("li");
      li.dataset.id = f.id;
      li.innerHTML = `
        <div class="item-left">
          ${f.name} • ${f.calPerServing} kcal/serv • ${f.servings} serving(s)
        </div>
        <div class="item-right">
          ${f.total.toFixed(1)} kcal 
          <button class="remove-item">Remove</button>
        </div>
      `;
      calorieList.appendChild(li);
    });

    calorieTotal.textContent = `${totalCalories.toFixed(1)} kcal`;
    calorieProgress.value = totalCalories;
    calorieProgress.max = MAX_CALORIES;
    progressValue.textContent = `${totalCalories.toFixed(
      1
    )} / ${MAX_CALORIES} kcal`;

    if (totalCalories > MAX_CALORIES) {
      calorieProgress.classList.add("over-limit");
    } else {
      calorieProgress.classList.remove("over-limit");
    }
  }
});

// ===============================
// STRESS & MOOD TRACKER — FUNCTIONAL JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("moodTrackerForm");
  const moodSelect = document.getElementById("moodSelect");
  const moodEmoji = document.getElementById("moodEmoji");
  const stressScale = document.getElementById("stressScale");
  const notesInput = document.getElementById("moodNotes");

  // Load saved entries
  let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];

  // Mood emoji reactions
  const moodEmojis = {
    Happy: "😊",
    Neutral: "😐",
    Stressed: "😰",
    Sad: "😢",
    Angry: "😡",
  };

  // Update emoji when user selects mood
  moodSelect.addEventListener("change", (e) => {
    const mood = e.target.value;
    moodEmoji.textContent = moodEmojis[mood] || "🙂";
  });

  // Save form data
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mood = moodSelect.value;
    const stress = parseInt(stressScale.value);
    const notes = notesInput.value.trim();

    // Get checked relaxation activities
    const activities = Array.from(
      document.querySelectorAll("input[name='relaxationChoice']:checked")
    ).map((a) => a.value);

    if (!mood || stress < 1 || stress > 10) {
      alert("Please select a valid mood and stress level (1–10).");
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      mood,
      emoji: moodEmojis[mood],
      stress,
      activities,
      notes,
    };

    moodLogs.push(entry);
    localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
    form.reset();
    moodEmoji.textContent = "😊";
    alert("Mood entry saved successfully!");
    console.log("Mood log added:", entry);
  });

  // Optional: Add a shortcut to view logs (console)
  console.log("Mood Logs Loaded:", moodLogs);
});

// ===============================
// HEALTH REPORT DOWNLOAD — FUNCTIONAL JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("healthReportForm");
  const btnDownloadSelected = document.getElementById("btnDownloadSelected");
  const btnDownloadAll = document.getElementById("btnDownloadAll");
  const btnShareDoctor = document.getElementById("btnShareDoctor");
  const btnReset = document.getElementById("btnReset");
  const statusBox = document.getElementById("reportStatus");

  // Helper: show temporary status messages
  const showStatus = (message, duration = 2500) => {
    statusBox.textContent = message;
    statusBox.hidden = false;
    statusBox.style.color = "#008c8c";
    statusBox.style.fontWeight = "600";

    setTimeout(() => {
      statusBox.hidden = true;
    }, duration);
  };

  // Collect selected trackers
  const getSelectedTrackers = () => {
    const selected = Array.from(
      form.querySelectorAll(
        "fieldset:nth-of-type(3) input[type='checkbox']:checked"
      )
    ).map((el) => el.value);
    return selected;
  };

  // Collect additional options
  const getAdditionalOptions = () => {
    return Array.from(
      form.querySelectorAll(
        "fieldset:nth-of-type(4) input[type='checkbox']:checked"
      )
    ).map((el) => el.value);
  };

  // Simulate report creation (PDF/CSV)
  const generateReport = (format, trackers, options, dateRange) => {
    console.log("Generating report...");
    console.table({ format, trackers, options, dateRange });

    showStatus(`Generating ${format.toUpperCase()} report...`);

    return new Promise((resolve) => {
      setTimeout(() => {
        const reportData = {
          format,
          trackers,
          options,
          dateRange,
          createdAt: new Date().toLocaleString(),
        };
        resolve(reportData);
      }, 2000);
    });
  };

  // Trigger file download (simulated)
  const downloadFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type:
        data.format === "pdf" ? "application/pdf" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Health_Report_${Date.now()}.${data.format}`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus(
      `✅ ${data.format.toUpperCase()} report downloaded successfully!`
    );
  };

  // Simulate sharing via email
  const shareWithDoctor = (email, data) => {
    if (!email) {
      alert("Please enter a valid doctor's email to share the report.");
      return;
    }

    showStatus(`📤 Sending report to ${email}...`);
    setTimeout(() => {
      showStatus(`✅ Report sent successfully to ${email}`);
      console.log(`Shared report data with ${email}`, data);
    }, 2000);
  };

  // ========== EVENT LISTENERS ==========

  // Download Selected
  btnDownloadSelected.addEventListener("click", async (e) => {
    e.preventDefault();

    const from = form.reportFrom.value;
    const to = form.reportTo.value;
    if (!from || !to) {
      alert("Please select a valid date range.");
      return;
    }

    const format = form.querySelector("input[name='format']:checked").value;
    const trackers = getSelectedTrackers();
    const options = getAdditionalOptions();

    if (trackers.length === 0) {
      alert("Please select at least one tracker to include.");
      return;
    }

    const reportData = await generateReport(format, trackers, options, {
      from,
      to,
    });
    downloadFile(reportData);
  });

  // Download All Data
  btnDownloadAll.addEventListener("click", async () => {
    const format = form.querySelector("input[name='format']:checked").value;
    const allTrackers = Array.from(
      form.querySelectorAll("fieldset:nth-of-type(3) input[type='checkbox']")
    ).map((el) => el.value);

    const options = getAdditionalOptions();
    const reportData = await generateReport(format, allTrackers, options, {
      from: "All",
      to: "All",
    });
    downloadFile(reportData);
  });

  // Share with Doctor
  btnShareDoctor.addEventListener("click", async () => {
    const email = form.doctorEmail.value.trim();
    const format = form.querySelector("input[name='format']:checked").value;
    const trackers = getSelectedTrackers();
    const options = getAdditionalOptions();

    const reportData = await generateReport(format, trackers, options, {
      from: "All",
      to: "All",
    });
    shareWithDoctor(email, reportData);
  });

  // Reset Form
  btnReset.addEventListener("click", () => {
    form.reset();
    showStatus("Form reset successfully.");
  });
});

/* ===============================
   INVITE CAREGIVER FUNCTIONALITY
=============================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inviteCaregiverForm");
  const status = document.getElementById("inviteStatus");
  const btnSend = document.getElementById("btnSendInvite");
  const btnView = document.getElementById("btnViewInvites");
  const btnRevoke = document.getElementById("btnRevokeAccess");

  // Load existing invites from localStorage
  let caregiverInvites =
    JSON.parse(localStorage.getItem("caregiverInvites")) || [];

  // Helper: show status messages
  function showStatus(message, success = false) {
    status.textContent = message;
    status.hidden = false;
    status.style.color = success ? "#00897b" : "#d32f2f";
    setTimeout(() => (status.hidden = true), 4000);
  }

  // Handle form submission (Send Invite)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.caregiverName.value.trim();
    const email = form.caregiverEmail.value.trim();
    const relation = form.relation.value;
    const accessDuration = form.accessDuration.value;
    const message = form.inviteMessage.value.trim();

    // Collect selected trackers
    const selectedTrackers = Array.from(
      form.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => cb.value);

    if (!name || !email || !relation) {
      showStatus("Please fill in all required fields.", false);
      return;
    }

    const newInvite = {
      id: Date.now(),
      name,
      email,
      relation,
      selectedTrackers,
      accessDuration,
      message,
      date: new Date().toLocaleString(),
    };

    caregiverInvites.push(newInvite);
    localStorage.setItem("caregiverInvites", JSON.stringify(caregiverInvites));

    showStatus(`Invitation sent to ${name} (${email}) successfully!`, true);
    form.reset();
  });

  // Handle View Shared Access
  btnView.addEventListener("click", () => {
    if (caregiverInvites.length === 0) {
      showStatus("No caregiver access found.", false);
      return;
    }

    let details = caregiverInvites
      .map(
        (invite) =>
          `👤 ${invite.name} (${invite.relation}) - ${invite.email}\n` +
          `📆 Duration: ${invite.accessDuration}\n` +
          `🩺 Shared: ${invite.selectedTrackers.join(", ")}\n` +
          `📨 Sent: ${invite.date}\n`
      )
      .join("\n---------------------\n");

    alert("📋 Current Shared Access:\n\n" + details);
  });

  // Handle Revoke Access
  btnRevoke.addEventListener("click", () => {
    if (caregiverInvites.length === 0) {
      showStatus("No caregiver access to revoke.", false);
      return;
    }

    const emailToRevoke = prompt(
      "Enter the caregiver's email to revoke access:"
    );
    if (!emailToRevoke) return;

    const beforeCount = caregiverInvites.length;
    caregiverInvites = caregiverInvites.filter(
      (invite) => invite.email !== emailToRevoke.trim()
    );

    if (caregiverInvites.length < beforeCount) {
      localStorage.setItem(
        "caregiverInvites",
        JSON.stringify(caregiverInvites)
      );
      showStatus(`Access revoked for ${emailToRevoke}`, true);
    } else {
      showStatus("No caregiver found with that email.", false);
    }
  });
});

// Get the form and the result area elements
const exerciseForm = document.getElementById("exerciseForm");
const exerciseResult = document.getElementById("exerciseResult");

// Add an event listener for form submission
exerciseForm.addEventListener("submit", function (event) {
  // 1. Prevent the default form submission behavior (which causes a page reload)
  event.preventDefault();

  // 2. Collect form data
  const date = document.getElementById("exerciseDate").value;
  const duration = document.getElementById("duration").value;
  const calories = document.getElementById("calories").value;
  const notes = document.getElementById("notes").value;

  // Get selected exercise types (it's a multiple select box)
  const exerciseSelect = document.getElementById("exerciseType");
  const selectedOptions = Array.from(exerciseSelect.selectedOptions);
  const exercises = selectedOptions
    .map((option) => option.textContent)
    .join(", ");

  // Basic validation (optional, but good practice)
  if (!date || !exercises || !duration || !calories) {
    alert("Please fill out all required fields.");
    return;
  }

  // 3. Create a log entry (an HTML string for the new entry)
  const newLogEntry = document.createElement("div");
  newLogEntry.classList.add("log-entry");
  // Using a class for potential future styling

  // Format the date for better readability
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  newLogEntry.innerHTML = `
        <div class="log-header">
            <span class="log-date" style="color: #007b7b;">📅 ${formattedDate}</span>
            <span class="log-duration" style="background-color: #a8f0d1; padding: 3px 8px; border-radius: 4px;">⏱️ ${duration} mins</span>
        </div>
        <p class="log-exercises">**Exercises:** **${exercises}**</p>
        <p class="log-details">🔥 **Calories Burned:** ${calories}</p>
        ${notes ? `<p class="log-notes">📝 **Notes:** ${notes}</p>` : ""}
        <hr style="border-top: 1px dashed #e6f9f9;">
    `;

  // 4. Append the new entry to the top of the log results area
  exerciseResult.prepend(newLogEntry);

  // 5. Clear the form (resetting it to its initial state)
  exerciseForm.reset();

  // Optional: Scroll to the top of the log area to show the new entry
  exerciseResult.scrollIntoView({ behavior: "smooth" });
});

// Initial message for the output area
exerciseResult.innerHTML =
  '<p class="initial-message" style="color: #00a8a8;">Your exercise logs will appear here after you save your first workout!</p>';

document.addEventListener("DOMContentLoaded", () => {
  // BMI ELEMENTS
  const bmiForm = document.getElementById("bmiForm");
  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const bmiValueSpan = document.getElementById("bmiValue");
  const bmiStatusSpan = document.getElementById("bmiStatus");
  const calculateBtn = document.getElementById("calculateBtn");

  // DIET PLAN ELEMENTS
  const dietForm = document.getElementById("dietForm");
  const dietGoal = document.getElementById("dietGoal");
  const dietType = document.getElementById("dietType");
  const activityLevel = document.getElementById("activityLevel");
  const dietHeightInput = document.getElementById("dietHeight");
  const dietWeightInput = document.getElementById("dietWeight");
  const dietResultDiv = document.getElementById("dietResult");
  const generateDietBtn = document.getElementById("generateDiet");

  // Global variable to store BMI data for diet plan use
  let latestBmiData = null;

  // --- BMI CALCULATION LOGIC ---

  /**
   * Determines the BMI category and returns the corresponding status text.
   * @param {number} bmi - The calculated BMI value.
   * @returns {{status: string, className: string}} The status text and CSS class.
   */
  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) {
      return { status: "Underweight", className: "status-underweight" };
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return { status: "Normal weight", className: "status-normal" };
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return { status: "Overweight", className: "status-overweight" };
    } else {
      return { status: "Obesity", className: "status-obese" };
    }
  };

  /**
   * Handles the form submission and initiates the BMI calculation.
   * @param {Event} event - The form submission event.
   */
  const handleCalculateBmi = (event) => {
    event.preventDefault(); // Stop the form from submitting normally

    const heightCm = parseFloat(heightInput.value);
    const weightKg = parseFloat(weightInput.value);

    // Basic Input Validation
    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      bmiValueSpan.textContent = "Error";
      bmiStatusSpan.textContent = "Please enter valid height and weight.";
      bmiStatusSpan.className = "status-obese"; // Use error color
      latestBmiData = null;
      generateDietBtn.disabled = true;
      return;
    }

    // 1. Convert height from cm to meters
    const heightMeters = heightCm / 100;

    // 2. Calculate BMI: weight / (height * height)
    const bmi = weightKg / (heightMeters * heightMeters);

    // 3. Round BMI for display (e.g., 1 decimal place)
    const roundedBmi = bmi.toFixed(1);

    // 4. Get status and appropriate CSS class
    const { status, className } = getBmiStatus(bmi);

    // 5. Store data globally and enable diet plan generation
    latestBmiData = { heightCm, weightKg, bmi: roundedBmi, status: status };
    generateDietBtn.disabled = false;

    // 6. Update the BMI UI
    bmiValueSpan.textContent = roundedBmi;

    // Reset classes before setting the new one to ensure only one status class is active
    bmiStatusSpan.className = "";
    bmiStatusSpan.classList.add(className);
    bmiStatusSpan.textContent = status;

    // 7. Update Diet Plan inputs (Data Transfer)
    dietHeightInput.value = `${heightCm} cm`;
    dietWeightInput.value = `${weightKg} kg`;

    // 8. Provide a momentary click feedback on the button
    calculateBtn.textContent = "Calculated!";
    setTimeout(() => {
      calculateBtn.textContent = "Calculate BMI";
    }, 1000);
  };

  // Attach the event listener to the BMI form
  bmiForm.addEventListener("submit", handleCalculateBmi);

  // --- DIET PLAN GENERATION LOGIC ---

  /**
   * Generates a mock personalized diet plan based on all inputs.
   * @param {Event} event - The form submission event.
   */
  const handleGenerateDietPlan = (event) => {
    event.preventDefault();

    if (!latestBmiData) {
      dietResultDiv.innerHTML =
        "<p style='color: var(--coral);'>Please calculate your BMI first.</p>";
      return;
    }

    const goal = dietGoal.value;
    const diet = dietType.value;
    const activity = activityLevel.value;
    const { heightCm, weightKg, bmi, status } = latestBmiData;

    // Check if all select fields are filled
    if (!goal || !diet || !activity) {
      dietResultDiv.innerHTML =
        "<p style='color: var(--coral);'>Please select a valid option for all diet plan fields.</p>";
      return;
    }

    // Show Loading State (Simulate API call)
    generateDietBtn.disabled = true;
    generateDietBtn.innerHTML =
      '<span class="loading-spinner"></span> Generating...';
    dietResultDiv.innerHTML =
      '<p style="text-align: center; color: #5a6b6b;">Analyzing your metrics and goals...</p>';

    setTimeout(() => {
      // MOCK Diet Plan generation based on inputs
      let caloricAdjustment = "";
      let focusMacro = "";
      let mealExamples = "";
      let goalText = "";

      // 1. Adjust calories based on goal and activity
      switch (goal) {
        case "weightLoss":
          caloricAdjustment =
            "Focus on a 500-750 kcal daily deficit to promote healthy fat loss.";
          focusMacro =
            "Prioritize **high-fiber vegetables** and **lean protein** (2.0g/kg body weight).";
          goalText = "Weight Loss";
          break;
        case "muscleGain":
          caloricAdjustment =
            "Aim for a 300-500 kcal daily surplus, especially post-workout.";
          focusMacro =
            "High protein intake is essential (2.2g/kg body weight), combined with **complex carbohydrates** to fuel training.";
          goalText = "Muscle Gain";
          break;
        case "maintain":
          caloricAdjustment =
            "Maintain your current caloric intake, focusing on nutrient-dense foods.";
          focusMacro =
            "Balance your intake: 30% Protein, 40% Carbs, 30% Healthy Fats.";
          goalText = "Maintenance";
          break;
      }

      // 2. Select meal examples based on dietary preference
      switch (diet) {
        case "vegetarian":
          mealExamples =
            "Breakfast: Oatmeal with nuts and berries. Lunch: Lentil soup and whole-wheat bread. Dinner: Paneer and vegetable curry.";
          break;
        case "nonVegetarian":
          mealExamples =
            "Breakfast: Scrambled eggs and spinach. Lunch: Grilled chicken salad. Dinner: Salmon with quinoa and steamed broccoli.";
          break;
        case "vegan":
          mealExamples =
            "Breakfast: Tofu scramble with nutritional yeast. Lunch: Chickpea and avocado sandwich. Dinner: Black bean burgers on a whole-wheat bun.";
          break;
      }

      const resultHTML = `
                        <strong>Your Personalized Plan:</strong>
                        ---
                        🎯 **Goal:** ${goalText} | ⚖️ **BMI Status:** ${status}
                        🥦 **Preference:** ${
                          diet.charAt(0).toUpperCase() + diet.slice(1)
                        } | 🏃 **Activity:** ${
        activity.charAt(0).toUpperCase() + activity.slice(1)
      }
                        
                        ---
                        
                        **Daily Caloric Strategy:**
                        ${caloricAdjustment}
                        
                        **Macronutrient Focus:**
                        ${focusMacro}
                        
                        **Sample Meal Suggestions:**
                        ${mealExamples}
                        
                        **Key Takeaway:**
                        Stay hydrated and aim for consistency. Given your BMI of ${bmi}, this plan is tailored to support your ${goalText} while focusing on nutrient quality.
                    `;

      dietResultDiv.textContent = resultHTML;

      // Reset Button State
      generateDietBtn.disabled = false;
      generateDietBtn.textContent = "Generate Diet Plan";
    }, 1500); // Simulate 1.5 second loading time
  };

  // Attach the event listener to the Diet Plan form
  dietForm.addEventListener("submit", handleGenerateDietPlan);
});

// =============================
// MOOD TRACKER — EMOJI REACTION
// =============================
const moodSelect = document.getElementById("moodSelect"); // your <select> for mood
const moodEmoji = document.getElementById("moodEmoji");

if (moodSelect && moodEmoji) {
  moodSelect.addEventListener("change", () => {
    const mood = moodSelect.value.toLowerCase();
    let emoji = "😊";

    switch (mood) {
      case "happy":
        emoji = "😄";
        break;
      case "neutral":
        emoji = "😐";
        break;
      case "stressed":
        emoji = "😟";
        break;
      case "sad":
        emoji = "😢";
        break;
      case "angry":
        emoji = "😠";
        break;
      default:
        emoji = "🙂";
    }

    // Update emoji and trigger pulse animation
    moodEmoji.textContent = emoji;
    moodEmoji.classList.remove("pulse");
    void moodEmoji.offsetWidth; // restart animation
    moodEmoji.classList.add("pulse");
  });
}
