// UrbanFlow Prototype - Simple Coordination Logic

document.addEventListener("DOMContentLoaded", () => {
  const runSimBtn = document.getElementById("run-sim-btn");
  const resetSimBtn = document.getElementById("reset-sim-btn");
  const statusBox = document.getElementById("sim-status-box");
  const statusIcon = document.getElementById("sim-status-icon");
  const statusText = document.getElementById("sim-status-text");
  const tableBody = document.getElementById("delivery-table-body");
  
  const truckT1 = document.getElementById("truck-t1");
  const truckT3 = document.getElementById("truck-t3");
  const zoneL2 = document.getElementById("zone-l2");

  // Initial table HTML to restore on reset
  const initialTableHTML = `
    <tr>
      <td><strong>D1</strong></td>
      <td>T1</td>
      <td>L1</td>
      <td>12 min</td>
      <td>0 min</td>
      <td><span class="status-badge badge-completed">Completed</span></td>
    </tr>
    <tr>
      <td><strong>D2</strong></td>
      <td>T2</td>
      <td>L2</td>
      <td>15 min</td>
      <td>2 min</td>
      <td><span class="status-badge badge-optimized">Optimized</span></td>
    </tr>
    <tr>
      <td><strong>D3</strong></td>
      <td>T3</td>
      <td>L1</td>
      <td>10 min</td>
      <td>0 min</td>
      <td><span class="status-badge badge-avoided">Waiting Avoided</span></td>
    </tr>
  `;

  runSimBtn.addEventListener("click", () => {
    // 1. Disable button and update to checking state
    runSimBtn.disabled = true;
    statusBox.className = "sim-status-box checking";
    statusIcon.textContent = "⏳";
    statusText.textContent = "Checking vehicle availability and infrastructure pressure...";

    // 2. Simulate 1.2s pressure check & alternative evaluation
    setTimeout(() => {
      // Update status as requested
      statusBox.className = "sim-status-box success";
      statusIcon.textContent = "✅";
      statusText.textContent = "Best Truck + Zone Assignment Selected";

      // Visually highlight chosen resources (Truck T1 and Zone L2 - avoiding busy Zone L1)
      if (truckT1) truckT1.classList.add("highlight-assignment");
      if (zoneL2) zoneL2.classList.add("highlight-assignment");

      // Add the new coordinated delivery request D4 to the table
      const newRow = document.createElement("tr");
      newRow.className = "new-delivery-row";
      newRow.innerHTML = `
        <td><strong>D4 (New)</strong></td>
        <td>T1</td>
        <td>L2</td>
        <td>14 min</td>
        <td>0 min</td>
        <td><span class="status-badge badge-optimized">Best Truck + Zone Selected</span></td>
      `;
      tableBody.appendChild(newRow);

      // Re-enable run button and show reset button for demo convenience
      runSimBtn.disabled = false;
      runSimBtn.style.display = "none";
      resetSimBtn.style.display = "inline-flex";
    }, 1200);
  });

  resetSimBtn.addEventListener("click", () => {
    // Reset table and visuals
    tableBody.innerHTML = initialTableHTML;
    if (truckT1) truckT1.classList.remove("highlight-assignment");
    if (zoneL2) zoneL2.classList.remove("highlight-assignment");

    // Reset status box
    statusBox.className = "sim-status-box idle";
    statusIcon.textContent = "ℹ️";
    statusText.textContent = 'Click "Run Coordination Simulation" to observe pressure-aware dispatching in real time.';

    // Toggle buttons
    resetSimBtn.style.display = "none";
    runSimBtn.style.display = "inline-flex";
    runSimBtn.disabled = false;
  });
});
