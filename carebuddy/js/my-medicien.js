/* =======================================
   SMART DOSE TRACKER - app.js
   Handles medicine management, dose tracker,
   history, reminders, and pharmacy locator.
======================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ========= ELEMENT REFERENCES =========
  const medForm = document.getElementById("add-medicine-form");
  const medTableBody = document.querySelector("#medicine-table tbody");
  const medRowTemplate = document.getElementById("medicine-row-template");

  const upcomingList = document.getElementById("upcoming-list");
  const upcomingTemplate = document.getElementById("upcoming-item-template");

  const historyTableBody = document.querySelector("#dose-history-table tbody");
  const historyTemplate = document.getElementById("history-row-template");

  const pharmacyForm = document.getElementById("pharmacy-form");
  const pharmacyList = document.getElementById("pharmacy-list");

  const adherenceRate = document.getElementById("adherence-rate");
  const adherenceTrend = document.getElementById("adherence-trend");

  const refillList = document.getElementById("refill-list");
  const currentYear = document.getElementById("current-year");

  // ========= DATA STORAGE =========
  let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
  let doseHistory = JSON.parse(localStorage.getItem("doseHistory")) || [];

  currentYear.textContent = new Date().getFullYear();

  // ========= SAVE / LOAD =========
  function saveData() {
    localStorage.setItem("medicines", JSON.stringify(medicines));
    localStorage.setItem("doseHistory", JSON.stringify(doseHistory));
  }

  // ========= RENDER MEDICINES =========
  function renderMedicines() {
    medTableBody.innerHTML = "";
    medicines.forEach((med, i) => {
      const row = medRowTemplate.content.cloneNode(true);
      row.querySelector(".seq").textContent = i + 1;
      row.querySelector(".med-name").textContent = med.name;
      row.querySelector(".med-dosage").textContent = med.dosage;
      row.querySelector(".med-frequency").textContent = med.frequency;
      row.querySelector(".med-times").textContent = med.times.join(", ");
      row.querySelector(".med-supply").textContent = med.supply;
      row.querySelector(".med-notes").textContent = med.notes;

      row.querySelector(".edit-med").addEventListener("click", () => editMedicine(i));
      row.querySelector(".remove-med").addEventListener("click", () => removeMedicine(i));

      medTableBody.appendChild(row);
    });

    renderRefillAlerts();
    generateUpcomingDoses();
  }

  // ========= ADD / EDIT / REMOVE =========
  function addMedicine(e) {
    e.preventDefault();
    const name = medForm["name"].value.trim();
    if (!name) return;

    const newMed = {
      name,
      dosage: medForm["dosage"].value.trim(),
      frequency: medForm["frequency"].value.trim(),
      times: medForm["times"].value.split(",").map(t => t.trim()),
      supply: parseInt(medForm["supply"].value.trim()) || 30,
      notes: medForm["notes"].value.trim(),
    };

    medicines.push(newMed);
    saveData();
    renderMedicines();
    medForm.reset();
  }

  function editMedicine(index) {
    const med = medicines[index];
    Object.entries(med).forEach(([key, val]) => {
      if (medForm[key]) medForm[key].value = Array.isArray(val) ? val.join(",") : val;
    });
    medicines.splice(index, 1);
    saveData();
    renderMedicines();
  }

  function removeMedicine(index) {
    if (!confirm("Remove this medicine?")) return;
    medicines.splice(index, 1);
    saveData();
    renderMedicines();
  }

  medForm.addEventListener("submit", addMedicine);

  // ========= DOSE TRACKER =========
  function generateUpcomingDoses() {
    upcomingList.innerHTML = "";
    const now = new Date();
    medicines.forEach(med => {
      med.times.forEach(time => {
        const [h, m] = time.split(":");
        const doseTime = new Date();
        doseTime.setHours(h, m, 0, 0);
        if (doseTime >= now) {
          const li = upcomingTemplate.content.cloneNode(true);
          li.querySelector(".dose-time").textContent = time;
          li.querySelector(".med-label").textContent = `${med.name} (${med.dosage})`;
          li.querySelector(".mark-taken").addEventListener("click", () => markDose(med, time, "Taken"));
          li.querySelector(".mark-skipped").addEventListener("click", () => markDose(med, time, "Skipped"));
          upcomingList.appendChild(li);
        }
      });
    });
  }

  function markDose(med, time, status) {
    const entry = {
      date: new Date().toISOString().split("T")[0],
      time,
      med: med.name,
      dosage: med.dosage,
      status,
      notes: status === "Taken" ? "On time" : "Skipped dose",
    };
    doseHistory.push(entry);
    saveData();
    renderHistory();
    generateUpcomingDoses();
  }

  // ========= HISTORY =========
  function renderHistory() {
    historyTableBody.innerHTML = "";
    doseHistory.forEach(h => {
      const row = historyTemplate.content.cloneNode(true);
      row.querySelector(".h-date").textContent = h.date;
      row.querySelector(".h-time").textContent = h.time;
      row.querySelector(".h-med").textContent = h.med;
      row.querySelector(".h-dosage").textContent = h.dosage;
      row.querySelector(".h-status").textContent = h.status;
      row.querySelector(".h-notes").textContent = h.notes;
      historyTableBody.appendChild(row);
    });

    updateAdherence();
  }

  // ========= ADHERENCE =========
  function updateAdherence() {
    const taken = doseHistory.filter(h => h.status === "Taken").length;
    const total = doseHistory.length;
    const adherence = total ? ((taken / total) * 100).toFixed(1) : 0;
    adherenceRate.textContent = `Adherence: ${adherence}%`;
    adherenceTrend.textContent = `Weekly trend: ${
      adherence >= 90 ? "Excellent 👍" : adherence >= 70 ? "Moderate ⚠️" : "Low ❌"
    }`;
  }

  // ========= PHARMACY LOCATOR (Mock Data) =========
  pharmacyForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = document.getElementById("pharmacy-query").value.trim();
    pharmacyList.innerHTML = "";

    if (!query) return;

    const mockPharmacies = [
      { name: "City Pharmacy", addr: "123 Main St", hours: "7 AM - 10 PM", stock: "Metformin: In stock" },
      { name: "HealthPlus", addr: "45 Central Ave", hours: "24 hours", stock: "Lisinopril: In stock" },
      { name: "WellCare Drugs", addr: "88 Park Road", hours: "8 AM - 9 PM", stock: "Atorvastatin: Limited" },
    ];

    mockPharmacies.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h4 class="pharm-name">${p.name}</h4>
        <p class="pharm-addr">${p.addr}</p>
        <p class="pharm-hours">${p.hours}</p>
        <p class="pharm-availability">${p.stock}</p>
        <a href="#" class="directions">Directions</a>
        <button class="call-pharm">Call</button>
      `;
      pharmacyList.appendChild(li);
    });
  });

  // ========= REFILL ALERTS =========
  function renderRefillAlerts() {
    refillList.innerHTML = "";
    medicines.forEach(med => {
      if (med.supply <= 7) {
        const li = document.createElement("li");
        li.textContent = `${med.name} — only ${med.supply} days left.`;
        refillList.appendChild(li);
      }
    });
  }

  // ========= INITIAL RENDER =========
  renderMedicines();
  renderHistory();
});
