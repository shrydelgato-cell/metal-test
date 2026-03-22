const QUESTIONS = [
  {
    id: "sleep",
    text: "In the past week, how rested have you felt after sleep?",
  },
  {
    id: "stress",
    text: "How manageable has your stress felt lately?",
  },
  {
    id: "focus",
    text: "How able have you been to focus on what matters to you?",
  },
  {
    id: "connection",
    text: "How connected have you felt to people you care about?",
  },
  {
    id: "mood",
    text: "Overall, how stable has your mood been?",
  },
];

const SCALE = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very good" },
];

function renderQuestions() {
  const list = document.getElementById("questions");
  list.innerHTML = QUESTIONS.map(
    (q, i) => `
    <li class="question">
      <p class="question-text">${i + 1}. ${escapeHtml(q.text)}</p>
      <div class="scale" role="group" aria-labelledby="q-${q.id}-label">
        <span id="q-${q.id}-label" class="visually-hidden">${escapeHtml(q.text)}</span>
        ${SCALE.map(
          (s) => `
          <label>
            <input type="radio" name="${q.id}" value="${s.value}" required />
            ${escapeHtml(s.label)}
          </label>
        `
        ).join("")}
      </div>
    </li>
  `
  ).join("");
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function average(values) {
  if (!values.length) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

function interpret(avg) {
  if (avg <= 2) {
    return "Your answers suggest things may feel heavy right now. Consider talking to someone you trust or a professional—small steps still count.";
  }
  if (avg <= 3.5) {
    return "You’re in a mixed zone: some areas may need attention. Gentle routines, sleep, and connection often help.";
  }
  return "Your answers lean positive overall. Keep nurturing what’s working and notice early when stress creeps up.";
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const values = QUESTIONS.map((q) => {
    const el = form.elements[q.id];
    const checked = el && el.value ? Number(el.value) : NaN;
    return checked;
  });

  if (values.some((v) => Number.isNaN(v))) {
    return;
  }

  const avg = average(values);
  const results = document.getElementById("results");
  results.classList.remove("hidden");
  results.innerHTML = `
    <h2>Summary</h2>
    <p class="score">Average: ${avg.toFixed(1)} / 5</p>
    <p>${escapeHtml(interpret(avg))}</p>
    <p>Use this as a snapshot only—not a label. You can adjust answers and submit again anytime.</p>
  `;
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function handleReset() {
  const form = document.getElementById("checkin");
  form.reset();
  const results = document.getElementById("results");
  results.classList.add("hidden");
  results.innerHTML = "";
}

document.getElementById("checkin").addEventListener("submit", handleSubmit);
document.getElementById("reset").addEventListener("click", handleReset);

renderQuestions();
