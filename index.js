const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
(async function () {
  'use strict';
    await sleep(5000)

  // Remove any previous instance
  const existing = document.getElementById('sparx-widget');
  if (existing) existing.remove();

  // Root container
  const widget = document.createElement('div');
  widget.id = 'sparx-widget';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #sparx-widget {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      width: 280px;
      border-radius: 16px;
      border: 2px solid #3b9eff;
      overflow: hidden;
      font-family: sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      background: #f5f5f5;
    }

    /* ── Header ── */
    #sparx-header {
      background: #3b9eff;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
    }
    #sparx-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #sparx-header img {
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }
    #sparx-header span {
      color: white;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.01em;
    }
    #sparx-header-chevron {
      color: white;
      font-size: 18px;
      line-height: 1;
      transition: transform 0.3s ease;
    }

    /* ── Body (main collapsible) ── */
    #sparx-body {
      overflow: hidden;
      max-height: 600px;
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s ease,
                  padding 0.3s ease;
      padding: 12px;
      opacity: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: #f0f4ff;
    }
    #sparx-body.collapsed {
      max-height: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
    }

    /* ── Section buttons (Auto Solver / Solve / Bookwork) ── */
    .sparx-section {
      border-radius: 12px;
      overflow: hidden;
    }

    .sparx-section-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 16px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 0.01em;
      transition: filter 0.15s;
    }
    .sparx-section-header:hover { filter: brightness(0.93); }
    .sparx-section-header:active { filter: brightness(0.85); }

    .sparx-section-chevron {
      font-size: 16px;
      transition: transform 0.3s ease;
      color: rgba(0,0,0,0.55);
    }
    .sparx-section-chevron.open {
      transform: rotate(180deg);
    }

    /* ── Section content (expandable) ── */
    .sparx-section-content {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s ease;
      background: white;
      border-radius: 0 0 12px 12px;
      margin-top: -4px;
    }
    .sparx-section-content.open {
      max-height: 400px;
      opacity: 1;
    }
    .sparx-section-content-inner {
      padding: 12px 14px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Slider rows ── */
    .sparx-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sparx-row-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #333;
      font-weight: 600;
    }
    .sparx-row-label span.sparx-value {
      background: #3b9eff;
      color: white;
      border-radius: 6px;
      padding: 1px 8px;
      font-size: 12px;
      font-weight: 700;
      min-width: 32px;
      text-align: center;
    }
    .sparx-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 5px;
      border-radius: 3px;
      background: #d0e6ff;
      outline: none;
      cursor: pointer;
    }
    .sparx-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3b9eff;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }

    /* ── Toggle ── */
    .sparx-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sparx-toggle-label {
      font-size: 13px;
      color: #333;
      font-weight: 600;
    }
    .sparx-toggle {
      position: relative;
      width: 42px;
      height: 24px;
    }
    .sparx-toggle input { opacity: 0; width: 0; height: 0; }
    .sparx-toggle-track {
      position: absolute;
      inset: 0;
      background: #ccc;
      border-radius: 24px;
      cursor: pointer;
      transition: background 0.25s ease;
    }
    .sparx-toggle input:checked + .sparx-toggle-track { background: #3b9eff; }
    .sparx-toggle-track::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: white;
      border-radius: 50%;
      transition: transform 0.25s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .sparx-toggle input:checked + .sparx-toggle-track::after {
      transform: translateX(18px);
    }

    /* ── Divider ── */
    .sparx-divider {
      border: none;
      border-top: 1px solid #eee;
      margin: 0;
    }

    /* ── Solve (action) button ── */
    #sparx-solve-btn {
      border-radius: 12px;
    }

    /* ── Bookwork button ── */
    #sparx-bookwork-btn {
      border-radius: 12px;
    }
  `;
  document.head.appendChild(style);

  // Header
  const header = document.createElement('div');
  header.id = 'sparx-header';

  const headerLeft = document.createElement('div');
  headerLeft.id = 'sparx-header-left';

  const logo = document.createElement('img');
  logo.src = 'https://www.google.com/s2/favicons?sz=64&domain=sparx-learning.com';
  logo.alt = 'Sparx';

  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'Sparx Maths AI Solver';

  headerLeft.appendChild(logo);
  headerLeft.appendChild(titleSpan);

  const headerChevron = document.createElement('div');
  headerChevron.id = 'sparx-header-chevron';
  headerChevron.textContent = '⌄';

  header.appendChild(headerLeft);
  header.appendChild(headerChevron);

  // Main body (collapsible)
  const body = document.createElement('div');
  body.id = 'sparx-body';

  // Collapse / expand main body on header click
  let mainCollapsed = false;
  header.addEventListener('click', () => {
    mainCollapsed = !mainCollapsed;
    body.classList.toggle('collapsed', mainCollapsed);
    headerChevron.style.transform = mainCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  // Helper: create a collapsible section
  function makeSection({ label, color, expandable, contentBuilder }) {
    const section = document.createElement('div');
    section.className = 'sparx-section';

    const btn = document.createElement('button');
    btn.className = 'sparx-section-header';
    btn.style.background = color;
    btn.textContent = label;

    if (expandable) {
      const chev = document.createElement('span');
      chev.className = 'sparx-section-chevron';
      chev.textContent = '⌄';
      btn.appendChild(chev);

      const content = document.createElement('div');
      content.className = 'sparx-section-content';
      content.style.border = `1.5px solid ${color}`;
      content.style.borderTop = 'none';

      const inner = document.createElement('div');
      inner.className = 'sparx-section-content-inner';
      contentBuilder(inner);
      content.appendChild(inner);

      let open = false;
      btn.addEventListener('click', () => {
        open = !open;
        content.classList.toggle('open', open);
        chev.classList.toggle('open', open);
      });

      section.appendChild(btn);
      section.appendChild(content);
    } else {
      section.appendChild(btn);
    }

    return section;
  }

  // Helper: slider row
  function makeSliderRow({ label, min, max, defaultVal, unit }) {
    const row = document.createElement('div');
    row.className = 'sparx-row';

    const labelRow = document.createElement('div');
    labelRow.className = 'sparx-row-label';

    const labelText = document.createElement('span');
    labelText.textContent = label;

    const valueTag = document.createElement('span');
    valueTag.className = 'sparx-value';
    valueTag.textContent = `${defaultVal}${unit}`;

    labelRow.appendChild(labelText);
    labelRow.appendChild(valueTag);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'sparx-slider';
    slider.min = min;
    slider.max = max;
    slider.step = 1;
    slider.value = defaultVal;

    slider.addEventListener('input', () => {
      valueTag.textContent = `${slider.value}${unit}`;
    });

    row.appendChild(labelRow);
    row.appendChild(slider);

    return { row, slider };
  }

  // Auto Solver section
  let _delayBeforeSolve = 1;
  let _delayBeforeInput = 1;
  let _autoBookmark = false;

  const autoSolverSection = makeSection({
    label: 'Auto Solver',
    color: '#3b9eff',
    expandable: true,
    contentBuilder: (inner) => {
      // Delay before solving slider
      const { row: solveRow, slider: solveSlider } = makeSliderRow({
        label: 'Delay before solving',
        min: 1, max: 30, defaultVal: 1, unit: 's'
      });
      solveSlider.addEventListener('input', () => {
        _delayBeforeSolve = Number(solveSlider.value);
      });
      inner.appendChild(solveRow);

      // Divider
      const div1 = document.createElement('hr');
      div1.className = 'sparx-divider';
      inner.appendChild(div1);

      // Delay before input slider
      const { row: inputRow, slider: inputSlider } = makeSliderRow({
        label: 'Delay before input',
        min: 1, max: 30, defaultVal: 1, unit: 's'
      });
      inputSlider.addEventListener('input', () => {
        _delayBeforeInput = Number(inputSlider.value);
      });
      inner.appendChild(inputRow);

      // Divider
      const div2 = document.createElement('hr');
      div2.className = 'sparx-divider';
      inner.appendChild(div2);

      // Auto Bookmark toggle
      const toggleRow = document.createElement('div');
      toggleRow.className = 'sparx-toggle-row';

      const toggleLabel = document.createElement('span');
      toggleLabel.className = 'sparx-toggle-label';
      toggleLabel.textContent = 'Auto Bookmark';

      const toggleWrap = document.createElement('label');
      toggleWrap.className = 'sparx-toggle';

      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.checked = false;
      toggleInput.addEventListener('change', () => {
        _autoBookmark = toggleInput.checked;
      });

      const toggleTrack = document.createElement('span');
      toggleTrack.className = 'sparx-toggle-track';

      toggleWrap.appendChild(toggleInput);
      toggleWrap.appendChild(toggleTrack);
      toggleRow.appendChild(toggleLabel);
      toggleRow.appendChild(toggleWrap);
      inner.appendChild(toggleRow);
    }
  });

  body.appendChild(autoSolverSection);

  // ─── Solve section (non-expandable, acts as action button) ───────────────────
  const solveSection = makeSection({
    label: 'Solve',
    color: '#4caf50',
    expandable: false,
    contentBuilder: () => {}
  });
  const solveSectionBtn = solveSection.querySelector('.sparx-section-header');
  solveSectionBtn.id = 'sparx-solve-btn';

  solveSectionBtn.addEventListener('click', async () => {
    // ── 1. Gather your question + image variables here ────────────────────────
    //    Replace these with your real scraping / detection logic:
    const anyQuestionvariable = 'What is 2 + 2?';  //  // ← replace with image URL string (or null)← replace with scraped question text
    const anyimagelinkvariable = null;             

const question = document.querySelector("span._TextElement_kz9c2_81").innerText;
const imgEl = document.querySelector("img._Image_kz9c2_72");
const img = imgEl?.src;

// --- Filtering Logic ---
const lines = question.split("\n").map(l => l.trim()).filter(l => l !== "");
const unique = [...new Set(lines)];
const filtered = unique.filter(line => 
    !unique.some(other => other !== line && other.includes(line))
);

// Join the filtered text into one string
const finalQuestionText = filtered.join(" ");
const hasMidpoint = finalQuestionText.toLowerCase().includes("midpoint");

if (img && hasMidpoint) {
    // SCENARIO 1: Image AND Midpoint
    console.log("Both present: Image found and word 'midpoint' found.");

} else if (img && !hasMidpoint) {
    // SCENARIO 2: Image present, but NO Midpoint
    console.log("Image found, but the word 'midpoint' is missing.");

} else if (!img && hasMidpoint) {
    // SCENARIO 3: NO Image, but has Midpoint
    console.log("No image found, but the word 'midpoint' is present.");

} else {
    // SCENARIO 4: NO Image AND NO Midpoint
    console.log("Empty handed: No image and no 'midpoint' word.");
}
}


    // e.g. autoTypeAnswer(answer);

    // ════════════════════════════════════════════════════════════════════════════
    // END OF EDITABLE SECTION
    // ════════════════════════════════════════════════════════════════════════════

  body.appendChild(solveSection);

  // ─── Bookwork section (non-expandable) ──────────────────────────────────────
  const bookworkSection = makeSection({
    label: 'Bookwork',
    color: '#f5a623',
    expandable: false,
    contentBuilder: () => {}
  });
  bookworkSection.querySelector('.sparx-section-header').id = 'sparx-bookwork-btn';
  body.appendChild(bookworkSection);

  // ─── Assemble & mount ────────────────────────────────────────────────────────
  widget.appendChild(header);
  widget.appendChild(body);
  document.body.appendChild(widget);

  // ─── Public API ──────────────────────────────────────────────────────────────

  /**
   * Returns the user-selected "Delay before solving" in seconds (1–30).
   */
  window.getDelayBeforeSolve = () => _delayBeforeSolve;

  /**
   * Returns the user-selected "Delay before input" in seconds (1–30).
   */
  window.getDelayBeforeInput = () => _delayBeforeInput;

  /**
   * Returns true if Auto Bookmark is toggled on, false otherwise.
   */
  window.getBookmarkToggle = () => _autoBookmark;

  console.log('[Sparx Widget] Loaded. API: getDelayBeforeSolve(), getDelayBeforeInput(), getBookmarkToggle()');













  const API_KEY = 'll'; // paste your key here

  async function askGemini(prompt) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
        onload: (res) => {
          const json = JSON.parse(res.responseText);
          resolve(json.candidates[0].content.parts[0].text);
        },
        onerror: reject
      });
    });
  }

  // Example usage:
  const reply = await askGemini("Answer this question: " + question, img);
  console.log('Gemini says:', reply);
})();
