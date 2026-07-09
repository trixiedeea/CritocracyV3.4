 
 


 const imageMap = {
  "Artist": "../Images/A.png",
  "Politician": "../Images/P.png",
  "Historian": "../Images/H.png",
  "Entrepreneur": "../Images/E.png",
  "Revolutionary": "../Images/R.png",
  "Colonialist": "../Images/C.png"
  };

  /* Start Of AI Contribution */

 const ROLES = {
  ARTIST: {
    name: "Salvidor Dali, the Brilliant Artist",
    tag: "An eccentric nutjob and entertaining loose cannon.",
    token: imageMap.Artist,
    ability: "Gains Knowledge faster",
    opposition: "ENTREPRENEUR",
    verdict: "You process the world through feeling first and consequences never. You'll torch a good opportunity and call it performance art. People forgive you because you're rarely boring."
  },
  HISTORIAN: {
    name: "Suetonius, the Ancient Historian",
    tag: "Rome's greatest gossip... err, historian.",
    token: imageMap.Historian,
    ability: "Immune to knowledge theft",
    opposition: "POLITICIAN",
    verdict: "You watch everything and everyone and forget nothing. You'd rather be quietly right than loudly popular, and you're insufferably smug when the record proves you were."
  },
  COLONIALIST: {
    name: "Jacques Cartier, the Colonialist",
    tag: "For the glory of the empire!...but to the detriment of everyone else.",
    token: imageMap.Colonialist,
    ability: "Immune to influence theft",
    opposition: "REVOLUTIONARY",
    verdict: "You want only to help your land by expanding it and your people by enriching them. That you build empires on the lands of others is not a problem you understand. Bold. Aventerous. Exhausting. Effective."
  },
  ENTREPRENEUR: {
    name: "Regina Basilier, the Entrepreneur",
    tag: "Making bank before it was even legal — legit.",
    token: imageMap.Entrepreneur,
    ability: "Gains Money faster",
    opposition: "ARTIST",
    verdict: "Everything is a market to you, including this quiz. You'll monetize a crisis by lunchtime and feel great about it. Ethics are more of a light suggestion then a deterrent. After all it's just business right?"
  },
  POLITICIAN: {
    name: "Winston Churchill, the Politician",
    tag: "The politician with a plan — unless you're Irish.",
    token: imageMap.Politician,
    ability: "Immune to money theft",
    opposition: "HISTORIAN",
    verdict: "You say what the room wants to hear seventy percent of the time and mean about thirty percent of it. You'll take credit for the outcome regardless if you intended or even had a hand in it. Unless the outcome was somehow Irish."
  },
  REVOLUTIONARY: {
    name: "Audre Lorde, the Revolutionary",
    tag: "The quietest revolutionary that ever there was.",
    token: imageMap.Revolutionary,
    ability: "Gains Influence faster",
    opposition: "COLONIALIST",
    verdict: "You don't need the room's approval, but you'll get its attention, eventually. You're patient about the long game and merciless about who gets left out of it."
  }
};

const QUESTIONS = [
  {
    text: "The office group chat is imploding over something dumb. You:",
    options: [
      { role: "ARTIST", label: "Post something unrelated and unhinged that somehow ends the argument" },
      { role: "HISTORIAN", label: "Screenshot everything for later, say nothing" },
      { role: "COLONIALIST", label: "Declare the thread yours now and set new rules" },
      { role: "ENTREPRENEUR", label: "Suggest whoever's most upset buy everyone lunch, problem solved" },
      { role: "POLITICIAN", label: "Post a statement that satisfies no one but ends the discourse" },
      { role: "REVOLUTIONARY", label: "Wait, then say the one true thing nobody else would say" }
    ]
  },
  {
    text: "You found a locked door in a building you don't own. You:",
    options: [
      { role: "ARTIST", label: "Paint a fake door next to it, more interesting anyway" },
      { role: "HISTORIAN", label: "Go find out who locked it and why, first" },
      { role: "COLONIALIST", label: "Assume it's yours to open. It's basically yours already" },
      { role: "ENTREPRENEUR", label: "Charge people to guess what's behind it" },
      { role: "POLITICIAN", label: "Promise to open it during your next campaign" },
      { role: "REVOLUTIONARY", label: "Pick the lock quietly and tell no one until it matters" }
    ]
  },
  {
    text: "Your money philosophy, roughly:",
    options: [
      { role: "ARTIST", label: "It comes when it comes, mostly it doesn't" },
      { role: "HISTORIAN", label: "Keep enough to fund the research, ignore the rest" },
      { role: "COLONIALIST", label: "More is the whole point of everything" },
      { role: "ENTREPRENEUR", label: "Every conversation is a potential revenue stream" },
      { role: "POLITICIAN", label: "Other people's money is more interesting than mine" },
      { role: "REVOLUTIONARY", label: "It's a tool for leverage, not a goal in itself" }
    ]
  },
  {
    text: "A rival just succeeded at something you wanted. Your first move:",
    options: [
      { role: "ARTIST", label: "Make something about your feelings on it, publicly" },
      { role: "HISTORIAN", label: "File it away. You'll bring it up in year four" },
      { role: "COLONIALIST", label: "Figure out how to absorb whatever they built" },
      { role: "ENTREPRENEUR", label: "Pivot immediately and undercut them by Friday" },
      { role: "POLITICIAN", label: "Congratulate them warmly while quietly working the room" },
      { role: "REVOLUTIONARY", label: "Ask who got hurt on the way to that success" }
    ]
  },
  {
    text: "Your browser currently has 47 tabs open. Most of them are:",
    options: [
      { role: "ARTIST", label: "Reference images for something only you understand yet" },
      { role: "HISTORIAN", label: "Primary sources, three of which contradict each other" },
      { role: "COLONIALIST", label: "Real estate, or things adjacent to owning real estate" },
      { role: "ENTREPRENEUR", label: "Competitor pricing pages" },
      { role: "POLITICIAN", label: "News coverage of yourself" },
      { role: "REVOLUTIONARY", label: "Threads other people were told to stop reading" }
    ]
  },
  {
    text: "Someone owes you a favor. You:",
    options: [
      { role: "ARTIST", label: "Forget, then remember at the worst possible time" },
      { role: "HISTORIAN", label: "Have it documented with a timestamp" },
      { role: "COLONIALIST", label: "Consider it interest-bearing" },
      { role: "ENTREPRENEUR", label: "Convert it into a formal partnership" },
      { role: "POLITICIAN", label: "Cash it in publicly, for maximum credit" },
      { role: "REVOLUTIONARY", label: "Call it in only when it actually matters" }
    ]
  },
  {
    text: "Pick a snack for a meeting that could've been an email:",
    options: [
      { role: "ARTIST", label: "Something visually striking, taste is secondary" },
      { role: "HISTORIAN", label: "Whatever the last three meetings also had" },
      { role: "COLONIALIST", label: "The whole tray, and you sat closest to it first" },
      { role: "ENTREPRENEUR", label: "Something you're already negotiating a bulk deal on" },
      { role: "POLITICIAN", label: "Whatever plays best on camera" },
      { role: "REVOLUTIONARY", label: "Nothing. You brought your own, deliberately" }
    ]
  },
  {
    text: "When someone criticizes your work, you:",
    options: [
      { role: "ARTIST", label: "Feel it for three days, then make something better out of spite" },
      { role: "HISTORIAN", label: "Ask for their sources" },
      { role: "COLONIALIST", label: "Assume they're jealous of the empire you're building" },
      { role: "ENTREPRENEUR", label: "Run the numbers to see if they're actually right" },
      { role: "POLITICIAN", label: "Thank them graciously and change nothing" },
      { role: "REVOLUTIONARY", label: "Check if the criticism protects a system you're trying to break" }
    ]
  },
  {
    text: "Your ideal way to spend a free evening:",
    options: [
      { role: "ARTIST", label: "Making something nobody asked for" },
      { role: "HISTORIAN", label: "Falling down an archive rabbit hole for six hours" },
      { role: "COLONIALIST", label: "Planning the next acquisition" },
      { role: "ENTREPRENEUR", label: "Sketching a business model on a napkin" },
      { role: "POLITICIAN", label: "Working a room full of people who matter" },
      { role: "REVOLUTIONARY", label: "Organizing something quietly with people who trust you" }
    ]
  },
  {
    text: "Someone asks what you actually want, deep down. You say:",
    options: [
      { role: "ARTIST", label: "To be understood, eventually, by someone" },
      { role: "HISTORIAN", label: "To be proven right, on the record" },
      { role: "COLONIALIST", label: "To be the one who decides what happens next" },
      { role: "ENTREPRENEUR", label: "To build something that outlasts the people who doubted it" },
      { role: "POLITICIAN", label: "To be needed by everyone, indispensable" },
      { role: "REVOLUTIONARY", label: "To make sure it can't go back to how it was" }
    ]
  }
];

/* End Of AI Contribution - except the verdicts. I wrote those*/

let current = 0;
const scores = { ARTIST: 0, HISTORIAN: 0, COLONIALIST: 0, ENTREPRENEUR: 0, POLITICIAN: 0, REVOLUTIONARY: 0 };

function $(id) {
  return document.getElementById(id);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuestion() {
  const q = QUESTIONS[current];
  const questionText = $('questionText');
  const optionsWrap = $('optionsWrap');
  const qCounter = $('qCounter');
  const progressFill = $('progressFill');

  if (questionText) questionText.textContent = q.text;
  if (qCounter) qCounter.textContent = `Question ${current + 1} / ${QUESTIONS.length}`;
  if (progressFill) progressFill.style.width = `${(current / QUESTIONS.length) * 100}%`;

  if (optionsWrap) {
    optionsWrap.innerHTML = '';
    shuffle(q.options).forEach(opt => {
      const button = document.createElement('button');
      button.className = 'option';
      button.textContent = opt.label;
      button.onclick = () => selectOption(opt.role);
      optionsWrap.appendChild(button);
    });
  }
}

function selectOption(role) {
  scores[role] += 1;
  current += 1;
  if (current >= QUESTIONS.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  const quizScreen = $('quizScreen');
  const resultScreen = $('resultScreen');
  if (quizScreen) quizScreen.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'block';

  let top = 'ARTIST';
  let topScore = -1;
  let tied = [];
  for (const r in scores) {
    if (scores[r] > topScore) {
      topScore = scores[r];
      top = r;
      tied = [r];
    } else if (scores[r] === topScore) {
      tied.push(r);
    }
  }
  if (tied.length > 1) {
    top = tied[Math.floor(Math.random() * tied.length)];
  }

  const role = ROLES[top];
  const opp = ROLES[role.opposition];

  const roleToken = $('roleToken');
  const roleName = $('roleName');
  const roleTag = $('roleTag');
  const verdictBox = $('verdictBox');
  const oppLine = $('oppLine');
  const statRow = $('statRow');

  if (roleToken) {
    roleToken.src = role.token;
    roleToken.alt = role.name;
  }
  if (roleName) roleName.textContent = role.name;
  if (roleTag) roleTag.textContent = role.tag;
  if (verdictBox) verdictBox.textContent = role.verdict;
  if (oppLine) oppLine.textContent = `Your direct opposition on the board: ${opp.name.split(',')[0]}. Don't expect an alliance.`;

  if (statRow) {
    while (statRow.firstChild) statRow.removeChild(statRow.firstChild);

    function buildStat(labelText, valueText) {
      const wrap = document.createElement('div');
      wrap.appendChild(document.createTextNode(labelText));
      const span = document.createElement('span');
      span.textContent = valueText;
      wrap.appendChild(span);
      return wrap;
    }

    statRow.appendChild(buildStat('Special Ability', role.ability));
  }
}

function resetQuiz() {
  current = 0;
  for (const r in scores) scores[r] = 0;
  const quizScreen = $('quizScreen');
  const resultScreen = $('resultScreen');
  if (resultScreen) resultScreen.style.display = 'none';
  if (quizScreen) quizScreen.style.display = 'block';
  renderQuestion();
}

const retakeButton = $('retakeButton');
if (retakeButton) retakeButton.onclick = resetQuiz;

renderQuestion();