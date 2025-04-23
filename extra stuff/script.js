// ===== Constants =====
const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;
const DICE_SIDES = 6;
const ROLES = ['Historian', 'Revolutionary', 'Politician', 'Colonialist', 'Entrepreneur', 'Artist'];
const STARTING_RESOURCES = { money: 0, knowledge: 0, influence: 0 };

// ===== State =====
let players = [];
let currentPlayerIndex = 0;

// ===== Main Setup =====
function startPlayerSetup(humanCount, computerCount) {
  players = [];
  const roleContainer = document.createElement('div');
  roleContainer.id = 'role-selection';

  // Human player setup
  for (let i = 0; i < humanCount; i++) {
    const name = prompt(`Enter name for Human Player ${i + 1}:`) || `Human ${i + 1}`;
    const player = {
      name,
      type: 'human',
      resources: { ...STARTING_RESOURCES },
      role: null,
      roll: null
    };
    players.push(player);

    const wrapper = document.createElement('div');
    wrapper.className = 'player-role-select';

    const label = document.createElement('label');
    label.textContent = `${name}, choose a role: `;

    const select = document.createElement('select');
    ROLES.forEach(role => {
      const option = document.createElement('option');
      option.value = role;
      option.textContent = role;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      player.role = select.value;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    roleContainer.appendChild(wrapper);
  }

  // CPU player setup
  for (let i = 0; i < computerCount; i++) {
    players.push({
      name: `CPU ${i + 1}`,
      type: 'computer',
      resources: { ...STARTING_RESOURCES },
      role: null,
      roll: null
    });
  }

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirm Roles & Start Game';
  confirmButton.addEventListener('click', () => {
    const selectedRoles = new Set(players.filter(p => p.type === 'human').map(p => p.role));
    if (selectedRoles.size < humanCount) {
      alert('Each human must pick a unique role!');
      return;
    }

    // Assign random roles to CPU players
    const remainingRoles = ROLES.filter(role => !selectedRoles.has(role));
    let rIndex = 0;
    players.forEach(p => {
      if (p.type === 'computer') {
        p.role = remainingRoles[rIndex++] || 'Randomly Assigned';
      }
    });

    roleContainer.remove();
    rollForTurnOrder();
  });

  roleContainer.appendChild(confirmButton);
  document.body.appendChild(roleContainer);
}

function rollForTurnOrder() {
  players.forEach(p => {
    p.roll = Math.floor(Math.random() * DICE_SIDES) + 1;
  });

  players.sort((a, b) => b.roll - a.roll);
  currentPlayerIndex = 0;

  console.log('🎲 Turn order determined:');
  players.forEach((p, i) => {
    console.log(`${i + 1}: ${p.name} (${p.role}) - Roll: ${p.roll}`);
  });

  startGame();
}

function startGame() {
  console.log('✅ Game setup complete. Starting game...');
  console.log('🧑‍🤝‍🧑 Players:', players);
}

}

// ===== Player Spaces =====
const purplePath = [
  {
    pathColor: "purple",
    coordinates: [
      [8, 472], [188, 472], [188, 562], [8, 562]
    ],
    next: [
      [164, 465], [203, 492], [205, 546], [168, 579]
    ],
    type: "start"
  },
  {
    pathColor: "purple",
    coordinates: [[164, 465]],
    next: [[179, 440]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[179, 440]],
    next: [[187, 407]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[187, 407]],
    next: [[205, 377]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[205, 377]],
    next: [[216, 350]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[216, 350]],
    next: [[257, 304]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[257, 304]],
    next: [[280, 286]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[280, 286]],
    next: [[311, 277]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[311, 277]],
    next: [[350, 270]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[350, 270]],
    next: [[383, 272]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[383, 272]],
    next: [[417, 268]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[417, 268]],
    next: [[454, 275]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[454, 275]],
    next: [[483, 285]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[483, 285]],
    next: [[505, 291]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[505, 291]],
    next: [[569, 328]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[569, 328]],
    next: [[611, 371]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[611, 371]],
    next: [[633, 401]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[633, 401]],
    next: [[644, 431]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[644, 431]],
    next: [[664, 463]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[664, 463]],
    next: [[703, 518]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[703, 518]],
    next: [[720, 542]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[720, 542]],
    next: [[774, 602]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[774, 602]],
    next: [[794, 631]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[794, 631]],
    next: [[835, 686]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[835, 686]],
    next: [[854, 714]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[854, 714]],
    next: [[884, 729]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[884, 729]],
    next: [[911, 750]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[911, 750]],
    next: [[929, 758]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[929, 758]],
    next: [[994, 784]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[994, 784]],
    next: [[1049, 793]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1049, 793]],
    next: [[1080, 797]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[1080, 797]],
    next: [[1111, 796]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1111, 796]],
    next: [[1174, 785]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1174, 785]],
    next: [[1207, 777]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1207, 777]],
    next: [[1236, 763]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1236, 763]],
    next: [[1281, 724]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [[1281, 724]],
    next: [[1300, 696]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1300, 696]],
    next: [[1319, 666]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1319, 666]],
    next: [[1328, 636]],
    type: "regular"
  },
  {
    pathColor: "purple",
    coordinates: [[1328, 636]],
    next: [[1340, 576]],
    type: "draw"
  },
  {
    pathColor: "purple",
    coordinates: [
      [1331, 471], [1331, 559], [1511, 559], [1511, 471]
    ],
    type: "finish"
  },
  // Choicepoint: shared polygon, appears in purple & one other
  {
    pathColor: "purple",
    coordinates: [
      [524, 276], [505, 321], [547, 339], [568, 300], [524, 276]
    ],
    next: [[566, 273], [569, 328]],
    type: "choicepoint"
  },
  {
    pathColor: "purple",
    coordinates: [
      [750, 535], [777, 566], [746, 604], [716, 569], [752, 532]
    ],
    next: [[776, 536], [774, 602]],
    type: "choicepoint"
  },
  {
    pathColor: "purple",
    coordinates: [
      [951, 742], [991, 758], [978, 805], [932, 786], [948, 742]
    ],
    next: [[979, 739], [994, 784]],
    type: "choicepoint"
  }
];
const bluePath = [
  {
    pathColor: "blue",
    coordinates: [
      [8, 472], [188, 472], [188, 562], [8, 562]
    ],
    next: [
      [164, 465], [203, 492], [205, 546], [168, 579]
    ],
    type: "start"
  },
  {
    pathColor: "blue",
    coordinates: [[203, 492]],
    next: [[231, 468]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[231, 468]],
    next: [[287, 416]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[287, 416]],
    next: [[313, 383]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[313, 383]],
    next: [[344, 356]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[344, 356]],
    next: [[382, 340]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[382, 340]],
    next: [[416, 337]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[416, 337]],
    next: [[443, 367]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[443, 367]],
    next: [[458, 402]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[458, 402]],
    next: [[502, 529]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[502, 529]],
    next: [[515, 565]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[515, 565]],
    next: [[534, 636]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[534, 636]],
    next: [[541, 676]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[541, 676]],
    next: [[548, 705]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[548, 705]],
    next: [[559, 743]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[559, 743]],
    next: [[587, 837]],
    type: "choicepoint"
  },
  {
    pathColor: "blue",
    coordinates: [[587, 837]],
    next: [[606, 871]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[606, 871]],
    next: [[644, 896]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[644, 896]],
    next: [[676, 908]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[676, 908]],
    next: [[717, 919]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[717, 919]],
    next: [[753, 916]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[753, 916]],
    next: [[792, 916]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[792, 916]],
    next: [[836, 909]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[836, 909]],
    next: [[910, 868]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[910, 868]],
    next: [[934, 843]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[934, 843]],
    next: [[950, 811]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[950, 811]],
    next: [[985, 711]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[985, 711]],
    next: [[997, 679]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[997, 679]],
    next: [[999, 647]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[999, 647]],
    next: [[984, 579]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[984, 579]],
    next: [[984, 543]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[984, 543]],
    next: [[1078, 531]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[1078, 531]],
    next: [[1090, 501]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1090, 501]],
    next: [[1080, 470]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[1080, 470]],
    next: [[1069, 409]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1069, 409]],
    next: [[1080, 384]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [[1080, 384]],
    next: [[1107, 359]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1107, 359]],
    next: [[1141, 357]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1141, 357]],
    next: [[1167, 370]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1167, 370]],
    next: [[1194, 394]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1194, 394]],
    next: [[1216, 414]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1216, 414]],
    next: [[1263, 454]],
    type: "regular"
  },
  {
    pathColor: "blue",
    coordinates: [[1263, 454]],
    next: [[1288, 475]],
    type: "draw"
  },
  {
    pathColor: "blue",
    coordinates: [
      [1331, 471], [1331, 559], [1511, 559], [1511, 471]
    ],
    type: "finish"
  },
  // Choicepoints
  {
    pathColor: "blue",
    coordinates: [
      [460, 476], [504, 458], [522, 506], [477, 518], [460, 476]
    ],
    next: [[523, 476], [502, 529]],
    type: "choicepoint"
  },
  {
    pathColor: "blue",
    coordinates: [
      [533, 759], [540, 805], [590, 788], [578, 745], [532, 758]
    ],
    next: [[587, 758], [574, 808]],
    type: "choicepoint"
  },
  {
    pathColor: "blue",
    coordinates: [
      [980, 514], [1029, 513], [1044, 557], [996, 556], [978, 517]
    ],
    next: [[1036, 573], [1051, 533]],
    type: "choicepoint"
  },
  {
    pathColor: "blue",
    coordinates: [
      [951, 742], [991, 758], [978, 805], [932, 786], [948, 742]
    ],
    next: [[979, 739], [994, 784]],
    type: "choicepoint"
  }
];

const cyanPath = [
  {
    pathColor: "cyan",
    coordinates: [
      [8, 472], [188, 472], [188, 562], [8, 562]
    ],
    next: [
      [164, 465], [203, 492], [205, 546], [168, 579]
    ],
    type: "start"
  },
  {
    pathColor: "cyan",
    coordinates: [[205, 546]],
    next: [[224, 573]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[224, 573]],
    next: [[243, 596]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[243, 596]],
    next: [[266, 619]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[266, 619]],
    next: [[324, 656]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[324, 656]],
    next: [[351, 672]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[351, 672]],
    next: [[387, 675]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[387, 675]],
    next: [[412, 669]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[412, 669]],
    next: [[434, 659]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[434, 659]],
    next: [[458, 646]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[458, 646]],
    next: [[456, 611]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[456, 611]],
    next: [[450, 582]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[450, 582]],
    next: [[435, 550]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[435, 550]],
    next: [[453, 503]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[453, 503]],
    next: [[523, 476]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[523, 476]],
    next: [[532, 443]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[532, 443]],
    next: [[523, 417]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[523, 417]],
    next: [[512, 386]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[512, 386]],
    next: [[516, 351]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[516, 351]],
    next: [[566, 273]],
    type: "choicepoint"
  },
  {
    pathColor: "cyan",
    coordinates: [[566, 273]],
    next: [[585, 248]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[585, 248]],
    next: [[638, 210]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[638, 210]],
    next: [[672, 205]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[672, 205]],
    next: [[705, 197]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[705, 197]],
    next: [[739, 196]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[739, 196]],
    next: [[803, 200]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[803, 200]],
    next: [[833, 205]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[833, 205]],
    next: [[864, 218]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[864, 218]],
    next: [[919, 254]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[919, 254]],
    next: [[941, 276]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[941, 276]],
    next: [[980, 347]],
    type: "choicepoint"
  },
  {
    pathColor: "cyan",
    coordinates: [[980, 347]],
    next: [[989, 414]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[989, 414]],
    next: [[996, 453]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[996, 453]],
    next: [[999, 479]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[999, 479]],
    next: [[1050, 594]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1050, 594]],
    next: [[1065, 620]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[1065, 620]],
    next: [[1093, 645]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1093, 645]],
    next: [[1124, 655]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1124, 655]],
    next: [[1193, 658]],
    type: "draw"
  },
  {
    pathColor: "cyan",
    coordinates: [[1193, 658]],
    next: [[1231, 639]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1231, 639]],
    next: [[1247, 613]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1247, 613]],
    next: [[1273, 594]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [[1273, 594]],
    next: [[1310, 544]],
    type: "regular"
  },
  {
    pathColor: "cyan",
    coordinates: [
      [1331, 471], [1331, 559], [1511, 559], [1511, 471]
    ],
    type: "finish"
  },
  // Choicepoints
  {
    pathColor: "cyan",
    coordinates: [
      [460, 476], [504, 458], [522, 506], [477, 518], [460, 476]
    ],
    next: [[523, 476], [502, 529]],
    type: "choicepoint"
  },
  {
    pathColor: "cyan",
    coordinates: [
      [524, 276], [505, 321], [547, 339], [568, 300], [524, 276]
    ],
    next: [[566, 273], [569, 328]],
    type: "choicepoint"
  },
  {
    pathColor: "cyan",
    coordinates: [
      [962, 272], [925, 295], [952, 334], [990, 314], [970, 277]
    ],
    next: [[988, 289], [980, 347]],
    type: "choicepoint"
  },
  {
    pathColor: "cyan",
    coordinates: [
      [980, 514], [1029, 513], [1044, 557], [996, 556], [978, 517]
    ],
    next: [[1036, 573], [1051, 533]],
    type: "choicepoint"
  }
];

const pinkPath = [
  {
    pathColor: "pink",
    coordinates: [
      [8, 472], [188, 472], [188, 562], [8, 562]
    ],
    next: [
      [164, 465], [203, 492], [205, 546], [168, 579]
    ],
    type: "start"
  },
  {
    pathColor: "pink",
    coordinates: [[168, 579]],
    next: [[179, 604]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[179, 604]],
    next: [[194, 640]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[194, 640]],
    next: [[204, 672]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[204, 672]],
    next: [[237, 724]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[237, 724]],
    next: [[255, 745]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[255, 745]],
    next: [[286, 764]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[286, 764]],
    next: [[315, 777]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[315, 777]],
    next: [[347, 786]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[347, 786]],
    next: [[382, 793]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[382, 793]],
    next: [[417, 794]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[417, 794]],
    next: [[450, 794]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[450, 794]],
    next: [[529, 780]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[529, 780]],
    next: [[587, 758]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[587, 758]],
    next: [[615, 744]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[615, 744]],
    next: [[640, 716]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[640, 716]],
    next: [[683, 667]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[683, 667]],
    next: [[704, 635]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[704, 635]],
    next: [[720, 608]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[720, 608]],
    next: [[776, 536]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[776, 536]],
    next: [[795, 513]],
    type: "choicepoint"
  },
  {
    pathColor: "pink",
    coordinates: [[795, 513]],
    next: [[816, 488]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[816, 488]],
    next: [[834, 454]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[834, 454]],
    next: [[852, 424]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[852, 424]],
    next: [[887, 370]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[887, 370]],
    next: [[902, 350]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[902, 350]],
    next: [[925, 330]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[925, 330]],
    next: [[988, 289]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[988, 289]],
    next: [[1050, 274]],
    type: "choicepoint"
  },
  {
    pathColor: "pink",
    coordinates: [[1050, 274]],
    next: [[1082, 263]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[1082, 263]],
    next: [[1118, 270]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1118, 270]],
    next: [[1149, 271]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1149, 271]],
    next: [[1181, 277]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1181, 277]],
    next: [[1238, 302]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[1238, 302]],
    next: [[1258, 322]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1258, 322]],
    next: [[1279, 351]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1279, 351]],
    next: [[1308, 405]],
    type: "draw"
  },
  {
    pathColor: "pink",
    coordinates: [[1308, 405]],
    next: [[1319, 438]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [[1319, 438]],
    next: [[1334, 459]],
    type: "regular"
  },
  {
    pathColor: "pink",
    coordinates: [
      [1331, 471], [1331, 559], [1511, 559], [1511, 471]
    ],
    type: "finish"
  },
  // Multi-directional Zones Duplicates
  {
    pathColor: "pink",
    coordinates: [
      [533, 759], [540, 805], [590, 788], [578, 745], [532, 758]
    ],
    next: [[587, 758], [574, 808]],
    type: "choicepoint"
  },
  {
    pathColor: "pink",
    coordinates: [
      [750, 535], [777, 566], [746, 604], [716, 569], [752, 532]
    ],
    next: [[776, 536], [774, 602]],
    type: "choicepoint"
  },
  {
    pathColor: "pink",
    coordinates: [
      [962, 272], [925, 295], [952, 334], [990, 314], [970, 277]
    ],
    next: [[988, 289], [980, 347]],
    type: "choicepoint"
  }
];

// ===== End Of Turn Cards =====

// Function to create an end-of-turn card with Monopoly-style layout
function createEndOfTurnCard(card) {
    return {
        name: card.name,
        description: card.description,
        layout: {
            width: "3.125 inches",
            height: "5 inches",
            borderColor: "gold",
            backgroundColor: "gold",
            textColor: "black",
            fontStyle: "bold",
            alignment: "center",
            padding: "10px",
            fontSize: "16px"
        },
        effects: card.effects
    };
}

// Example of applying the layout to a card
const exampleCard = {
    name: "The Globalization of Resistance",
    description: "Global movements for justice and decolonization intersect

CARDS
// End-of-Turn Card: "The Scramble for Africa Intensifies"
const scrambleForAfrica = {
    name: "The Scramble for Africa Intensifies",
    description: "Aimé Césaire critiques the brutal logic of colonialism that dehumanizes native populations and justifies exploitation through a colonial gaze. The conquest of Africa is an example of how imperial powers rationalized violence to accumulate wealth and control.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 6; // Secures more land and resources for the Empire
                break;
            case "Revolutionary":
                player.knowledge -= 5; // Movement is stifled under colonial power
                break;
            case "Historian":
                player.knowledge += 5; // New historical sources emerge
                break;
            case "Entrepreneur":
                player.knowledge -= 5; // Ethical backlash affects the market
                break;
            case "Politician":
                player.influence -= 5; // Imperial expansion policy is challenged
                break;
            case "Artist":
                player.influence -= 5; // Critique of colonialism faces censorship
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Historian",
    money: 10,
    knowledge: 15,
    influence: 8
};

// Apply the card effect
applyCardEffect(player, scrambleForAfrica);

// End-of-Turn Card: "Indigenous Displacement"
const indigenousDisplacement = {
    name: "Indigenous Displacement",
    description: "Césaire discusses the colonial system's systematic displacement of indigenous people for the expansion of European colonies. The forced migration and land appropriation leave a legacy of social and cultural devastation.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Resistance causes economic instability
                break;
            case "Revolutionary":
                player.influence += 6; // Gains support as a voice of liberation
                break;
            case "Historian":
                player.knowledge -= 5; // Historical records are destroyed or altered
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from new land and resources
                break;
            case "Politician":
                player.influence += 5; // Justifies the displacement as necessary
                break;
            case "Artist":
                player.influence -= 6; // Work is targeted as subversive and repressed
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Politician",
    money: 12,
    knowledge: 10,
    influence: 7
};

// Apply the card effect
applyCardEffect(player, indigenousDisplacement);

// End-of-Turn Card: "Slave Trade Profits Soar"
const slaveTradeProfitsSoar = {
    name: "Slave Trade Profits Soar",
    description: "Césaire highlights the economic roots of colonialism, showing that the colonial system relies on the dehumanization of enslaved peoples to build wealth for the colonizers. The transatlantic slave trade is a key example of this system in action.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 7; // Profits fuel empire's expansion
                break;
            case "Revolutionary":
                player.knowledge -= 5; // Calls for liberation are undermined
                break;
            case "Historian":
                player.knowledge -= 5; // Historical narratives are suppressed
                break;
            case "Entrepreneur":
                player.money += 5; // Capitalizes on the slave trade economy
                break;
            case "Politician":
                player.influence += 5; // Support for the trade strengthens power
                break;
            case "Artist":
                player.influence -= 5; // Works are criticized for challenging status quo
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Entrepreneur",
    money: 15,
    knowledge: 10,
    influence: 6
};

// Apply the card effect
applyCardEffect(player, slaveTradeProfitsSoar);

// End-of-Turn Card: "Colonial Narratives Reshaped"
const colonialNarrativesReshaped = {
    name: "Colonial Narratives Reshaped",
    description: "Césaire critiques the ideological justification for colonialism, often framed as a 'civilizing mission' for native peoples. This false narrative seeks to mask the exploitation and violence inherent in colonization.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Empire's narrative is increasingly discredited
                break;
            case "Revolutionary":
                player.knowledge += 6; // Anti-colonial theories emerge
                break;
            case "Historian":
                player.knowledge += 5; // Contributions to new historiography
                break;
            case "Entrepreneur":
                player.money -= 5; // Backlash against industries
                break;
            case "Politician":
                player.influence -= 5; // Civilizing myth loses power in public discourse
                break;
            case "Artist":
                player.influence += 5; // Critique of colonialism resonates
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Artist",
    money: 12,
    knowledge: 8,
    influence: 6
};

// Apply the card effect
applyCardEffect(player, colonialNarrativesReshaped);

// End-of-Turn Card: "Colonial Resistance Grows"
const colonialResistanceGrows = {
    name: "Colonial Resistance Grows",
    description: "As colonial power structures become more oppressive, resistance movements grow. This tension leads to revolts, uprisings, and efforts to disrupt the colonial machine. Césaire emphasizes the importance of this resistance in dismantling colonial domination.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Economic instability due to uprisings
                break;
            case "Revolutionary":
                player.influence += 7; // Resistance movement gains strength
                break;
            case "Historian":
                player.knowledge -= 5; // Struggles to fully document resistance
                break;
            case "Entrepreneur":
                player.knowledge -= 5; // Loss of imperial support
                break;
            case "Politician":
                player.influence -= 5; // Policies questioned in wake of revolt
                break;
            case "Artist":
                player.influence += 6; // Art becomes symbol of rebellion
                break;
        }
    }
};

// End-of-Turn Card: "The Haitian Revolution Inspires"
const haitianRevolutionInspires = {
    name: "The Haitian Revolution Inspires",
    description: "Walter Benjamin’s Angel of History reflects on how historical moments of resistance—like the Haitian Revolution—challenge the narrative of progress and force a reevaluation of colonial power structures.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Control threatened by revolutionary movements
                break;
            case "Revolutionary":
                player.knowledge += 7; // Revolution fuels ideological growth
                break;
            case "Historian":
                player.knowledge += 5; // Documents upheaval, reshaping history
                break;
            case "Entrepreneur":
                player.money -= 5; // Trade routes disrupted by revolt
                break;
            case "Politician":
                player.influence -= 6; // Political landscape shifts
                break;
            case "Artist":
                player.influence += 5; // Art resonates with revolutionary spirit
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 8,
    influence: 5
};

// Apply the card effect
applyCardEffect(player, colonialResistanceGrows);
applyCardEffect(player, haitianRevolutionInspires);

// End-of-Turn Card: "The Printing Press Revolutionizes Knowledge" (Version 1)
const printingPressKnowledge1 = {
    name: "The Printing Press Revolutionizes Knowledge",
    description: "The invention of the printing press plays a key role in spreading revolutionary ideas and intellectual movements. Walter Benjamin examines how mass-produced texts reshape our relationship to knowledge and politics.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Control over information weakens
                break;
            case "Revolutionary":
                player.knowledge += 6; // Access to radical ideas increases
                break;
            case "Historian":
                player.knowledge += 5; // Gains new materials for documenting history
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from demand for printed works
                break;
            case "Politician":
                player.influence -= 5; // Unable to control flow of new ideas
                break;
            case "Artist":
                player.influence += 5; // Ideas spread through print media
                break;
        }
    }
};

// End-of-Turn Card: "The Printing Press Revolutionizes Knowledge" (Version 2)
const printingPressKnowledge2 = {
    name: "The Printing Press Revolutionizes Knowledge",
    description: "The invention of the printing press spreads revolutionary ideas. Benjamin reflects on how the mass production of texts reshapes knowledge, empowering movements while threatening traditional power structures.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Monopoly over information weakens
                break;
            case "Revolutionary":
                player.knowledge += 6; // Access to radical, unfiltered texts
                break;
            case "Historian":
                player.knowledge += 5; // Gains a new source of historical evidence
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from publication of revolutionary ideas
                break;
            case "Politician":
                player.influence -= 5; // Control over discourse is under siege
                break;
            case "Artist":
                player.influence += 5; // Work gains visibility through new media
                break;
        }
    }
};

// End-of-Turn Card: "Gandhi’s Salt March Inspires"
const gandhisSaltMarchInspires = {
    name: "Gandhi’s Salt March Inspires",
    description: "Benjamin discusses the importance of nonviolent resistance in re-imagining historical narratives. Gandhi’s Salt March is an example of how symbolic acts of defiance challenge oppressive systems and create new historical moments.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Imperial policies are questioned
                break;
            case "Revolutionary":
                player.influence += 7; // Activism inspired by Gandhi’s methods
                break;
            case "Historian":
                player.knowledge += 5; // Documents pivotal act of resistance
                break;
            case "Entrepreneur":
                player.money -= 5; // Colonial enterprises disrupted by resistance
                break;
            case "Politician":
                player.influence -= 5; // Governing tactics challenged
                break;
            case "Artist":
                player.influence += 6; // Art becomes emblem of peaceful resistance
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Historian",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, printingPressKnowledge1);
applyCardEffect(player, printingPressKnowledge2);
applyCardEffect(player, gandhisSaltMarchInspires);

// End-of-Turn Card: "The Haitian Revolution Resurfaces"
const haitianRevolutionResurfaces = {
    name: "The Haitian Revolution Resurfaces",
    description: "The Haitian Revolution is a powerful reminder that historical change often comes through violent upheavals. Benjamin’s Angel of History represents the constant struggle between progress and destruction.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Empire shaken by revolt’s legacy
                break;
            case "Revolutionary":
                player.knowledge += 7; // Studies successful revolt as a model
                break;
            case "Historian":
                player.knowledge += 6; // Documents significance of slave revolts
                break;
            case "Entrepreneur":
                player.money -= 5; // Trade networks disrupted
                break;
            case "Politician":
                player.influence -= 6; // Revolutionary movements cannot be ignored
                break;
            case "Artist":
                player.influence += 5; // Art reflects triumph of oppressed peoples
                break;
        }
    }
};

// End-of-Turn Card: "The Haitian Revolution Resurfaces"
const haitianRevolutionResurfaces = {
    name: "The Haitian Revolution Resurfaces",
    description: "The Haitian Revolution is a powerful reminder that historical change often comes through violent upheavals. Benjamin’s Angel of History represents the constant struggle between progress and destruction.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Empire shaken by revolt’s legacy
                break;
            case "Revolutionary":
                player.knowledge += 7; // Studies successful revolt as a model
                break;
            case "Historian":
                player.knowledge += 6; // Documents significance of slave revolts
                break;
            case "Entrepreneur":
                player.money -= 5; // Trade networks disrupted
                break;
            case "Politician":
                player.influence -= 6; // Revolutionary movements cannot be ignored
                break;
            case "Artist":
                player.influence += 5; // Art reflects triumph of oppressed peoples
                break;
        }
    }
};

// End-of-Turn Card: "The Battle for Historical Narrative Begins"
const battleForNarrativeBegins = {
    name: "The Battle for Historical Narrative Begins",
    description: "Barthes' theory asserts that the identity of the creator should not limit the interpretation of the work. This challenge to authorship mirrors the fight over who controls historical narratives and how they’re remembered.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Control over narratives weakens
                break;
            case "Revolutionary":
                player.knowledge += 6; // New interpretations fuel revolutionary cause
                break;
            case "Historian":
                player.knowledge += 5; // Questions established historical narratives
                break;
            case "Entrepreneur":
                player.money -= 5; // Market shifts weaken product control
                break;
            case "Politician":
                player.influence -= 5; // Public begins questioning historical claims
                break;
            case "Artist":
                player.influence += 5; // Art challenges accepted histories
                break;
        }
    }
};

// End-of-Turn Card: "Revolt Against the Empire Spreads"
const revoltAgainstEmpireSpreads = {
    name: "Revolt Against the Empire Spreads",
    description: "Benjamin discusses the cyclical nature of revolutions and the way historical progress is often stalled by ruling powers. Revolts spread, and the global struggle continues, with no clear end in sight.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Revolt undermines economic hold
                break;
            case "Revolutionary":
                player.influence += 7; // Global traction for the cause
                break;
            case "Historian":
                player.knowledge += 5; // Documents resistance spreading worldwide
                break;
            case "Entrepreneur":
                player.money -= 5; // Trade disruptions from revolts
                break;
            case "Politician":
                player.influence -= 6; // Increasingly viewed as part of old regime
                break;
            case "Artist":
                player.influence += 6; // Work reflects worldwide revolution
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, haitianRevolutionResurfaces);
applyCardEffect(player, battleForNarrativeBegins);
applyCardEffect(player, revoltAgainstEmpireSpreads);

// End-of-Turn Card: "The Battle for Representation in the Press"
const battleForRepresentationPress = {
    name: "The Battle for Representation in the Press",
    description: "The rise of mass media alters the way social movements are represented. The press becomes an ideological battleground where the meaning of events is shaped and contested.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Media exposure erodes control
                break;
            case "Revolutionary":
                player.knowledge += 5; // Media manipulation strengthens cause
                break;
            case "Historian":
                player.knowledge += 6; // Studies evolving role of media
                break;
            case "Entrepreneur":
                player.money += 6; // Profits from new media formats
                break;
            case "Politician":
                player.influence -= 5; // Political decisions scrutinized in press
                break;
            case "Artist":
                player.influence += 5; // Work becomes part of media discourse
                break;
        }
    }
};

// End-of-Turn Card: "The Rise of Anti-Colonial Literature"
const riseOfAntiColonialLit = {
    name: "The Rise of Anti-Colonial Literature",
    description: "Postcolonial literature rises as an antidote to colonial oppression, reclaiming voices once silenced by the colonial system. This literary movement forces a re-examination of both history and identity.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Anti-colonial narratives undermine power
                break;
            case "Revolutionary":
                player.knowledge += 6; // Inspired by literary resistance
                break;
            case "Historian":
                player.knowledge += 5; // Documents rise of anti-colonial literature
                break;
            case "Entrepreneur":
                player.money -= 5; // Investments in colonial narratives suffer
                break;
            case "Politician":
                player.influence -= 6; // Public opinion shifts against colonialism
                break;
            case "Artist":
                player.influence += 6; // Work aligns with anti-colonial movement
                break;
        }
    }
};

// End-of-Turn Card: "Cultural Appropriation Fuels Global Discontent"
const culturalAppropriationDiscontent = {
    name: "Cultural Appropriation Fuels Global Discontent",
    description: "The global rise of cultural appropriation sparks outrage. Césaire criticizes the colonial theft of cultural identities, while Barthes suggests that cultural meanings are produced by readers, not authors. The struggle for authenticity and control over culture escalates.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Cultural exploitation faces backlash
                break;
            case "Revolutionary":
                player.knowledge += 5; // Uncovers new theories of cultural resistance
                break;
            case "Historian":
                player.knowledge += 5; // Documents global impact of cultural theft
                break;
            case "Entrepreneur":
                player.money -= 5; // Cultural appropriation becomes financial liability
                break;
            case "Politician":
                player.influence -= 6; // Pressured to address cultural issues
                break;
            case "Artist":
                player.influence += 5; // Challenges politics of cultural representation
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Historian",
    money: 12,
    knowledge: 10,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, battleForRepresentationPress);
applyCardEffect(player, riseOfAntiColonialLit);
applyCardEffect(player, culturalAppropriationDiscontent);

// End-of-Turn Card: "End of Apartheid in South Africa"
const endOfApartheid = {
    name: "End of Apartheid in South Africa",
    description: "The fall of apartheid represents the rejection of colonial logic, with the nation's struggle to reconcile its history and create new narratives of identity. Barthes' notion of the death of the author parallels the idea of rejecting official histories imposed by the state.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Imperial dominance crumbles
                break;
            case "Revolutionary":
                player.knowledge += 7; // Studies successful decolonization strategies
                break;
            case "Historian":
                player.knowledge += 5; // New challenges for historical interpretation
                break;
            case "Entrepreneur":
                player.money -= 5; // Business affected by end of apartheid regime
                break;
            case "Politician":
                player.influence += 6; // Adapts to post-apartheid political landscape
                break;
            case "Artist":
                player.influence += 5; // Art serves as vehicle for post-apartheid discourse
                break;
        }
    }
};

// End-of-Turn Card: "Museum Artifacts Repatriated to Indigenous Peoples"
const repatriationOfArtifacts = {
    name: "Museum Artifacts Repatriated to Indigenous Peoples",
    description: "The return of looted cultural artifacts to Indigenous peoples challenges the colonial narrative of cultural dominance. Césaire and Barthes emphasize the need to reclaim cultural heritage and rewrite the stories imposed by colonial powers.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Stolen treasures are returned
                break;
            case "Revolutionary":
                player.knowledge += 7; // Access to historically significant objects
                break;
            case "Historian":
                player.knowledge += 6; // Reshapes historical record
                break;
            case "Entrepreneur":
                player.money -= 5; // Artifact business faces condemnation
                break;
            case "Politician":
                player.influence += 5; // Leads initiative to return artifacts
                break;
            case "Artist":
                player.influence += 5; // Integral to cultural restitution movement
                break;
        }
    }
};

// End-of-Turn Card: "Decolonization Efforts Face Backlash"
const decolonizationBacklash = {
    name: "Decolonization Efforts Face Backlash",
    description: "As countries attempt to decolonize, they face intense resistance from former colonial powers. Benjamin argues that true liberation requires battling the historical weight of the colonial past, which manifests in ongoing struggles.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 5; // Manipulates global backlash to maintain influence
                break;
            case "Revolutionary":
                player.influence -= 6; // Efforts stifled by counter-revolutionary forces
                break;
            case "Historian":
                player.knowledge += 5; // Records complex narrative of resistance
                break;
            case "Entrepreneur":
                player.money -= 5; // Market strategies falter due to unrest
                break;
            case "Politician":
                player.influence -= 5; // Policies seen as ineffective
                break;
            case "Artist":
                player.influence += 6; // Captures struggle for freedom in art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 10,
    influence: 8
};

// Apply the card effects
applyCardEffect(player, endOfApartheid);
applyCardEffect(player, repatriationOfArtifacts);
applyCardEffect(player, decolonizationBacklash);

// End-of-Turn Card: "The Rejection of the Colonial Past"
const rejectionOfColonialPast = {
    name: "The Rejection of the Colonial Past",
    description: "Césaire highlights the psychological and social trauma left by colonial rule. This rejection signifies a collective turning point as societies reclaim their identities and question imposed systems of power.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 7; // Legacy erodes wealth
                break;
            case "Revolutionary":
                player.influence += 6; // Call for liberation gains support
                break;
            case "Historian":
                player.knowledge += 6; // Records collective resistance
                break;
            case "Entrepreneur":
                player.money -= 6; // Ventures are devalued
                break;
            case "Politician":
                player.influence -= 5; // Power challenged by colonial rejection
                break;
            case "Artist":
                player.influence += 7; // Art symbolizes postcolonial identity
                break;
        }
    }
};

// End-of-Turn Card: "The Rise of Postcolonial Literature"
const riseOfPostcolonialLit = {
    name: "The Rise of Postcolonial Literature",
    description: "As writers from formerly colonized countries gain prominence, their works become vehicles for reinterpreting history and identity. Barthes' idea of the death of the author challenges established literary canons.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Narratives increasingly disregarded
                break;
            case "Revolutionary":
                player.knowledge += 7; // Studies and propagates postcolonial works
                break;
            case "Historian":
                player.knowledge += 5; // Accesses rich body of postcolonial literature
                break;
            case "Entrepreneur":
                player.money += 6; // Profits from growing interest in literature
                break;
            case "Politician":
                player.influence -= 5; // Struggles to silence postcolonial voices
                break;
            case "Artist":
                player.influence += 6; // Inspired by postcolonial literary movements
                break;
        }
    }
};

// End-of-Turn Card: "The Struggle Over Education Systems"
const struggleOverEducation = {
    name: "The Struggle Over Education Systems",
    description: "Césaire critiques the colonial education system for perpetuating inferiority among colonized people. The struggle over education becomes central to decolonization as people demand a return to indigenous knowledge.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Control over institutions diminishes
                break;
            case "Revolutionary":
                player.influence += 6; // Inspires movement for educational reform
                break;
            case "Historian":
                player.knowledge += 5; // Examines perpetuation of colonial control
                break;
            case "Entrepreneur":
                player.money -= 5; // Business model is challenged
                break;
            case "Politician":
                player.influence -= 5; // Reforms render policies obsolete
                break;
            case "Artist":
                player.influence += 5; // Art critiques colonial education
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);// End-of-Turn Card: "The Rise of Globalization"
const riseOfGlobalization = {
    name: "The Rise of Globalization",
    description: "As the world becomes more interconnected, globalization spreads capitalist ideologies. Benjamin’s critiques of capitalism in history suggest that true liberation requires challenging both past and contemporary economic systems.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 6; // Thrives in global capitalist system
                break;
            case "Revolutionary":
                player.knowledge -= 6; // Message diluted by spread of ideologies
                break;
            case "Historian":
                player.knowledge += 5; // Analyzes rise of global capitalism
                break;
            case "Entrepreneur":
                player.money += 7; // Capitalizes on interconnected market
                break;
            case "Politician":
                player.influence += 6; // Gains popularity through pro-globalization stance
                break;
            case "Artist":
                player.influence -= 5; // Anti-globalization art is marginalized
                break;
        }
    }
};

// End-of-Turn Card: "The Fight Over Historical Memory"
const fightOverHistoricalMemory = {
    name: "The Fight Over Historical Memory",
    description: "Benjamin’s concept of historical materialism touches on how history is constructed. The fight over what is remembered and forgotten is central to decolonization, as former imperial powers attempt to suppress the truth.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Historical version being questioned
                break;
            case "Revolutionary":
                player.knowledge += 6; // Exposes injustices and revisionism
                break;
            case "Historian":
                player.knowledge += 6; // Contributes to battle over memory
                break;
            case "Entrepreneur":
                player.money -= 5; // Competing narratives hurt customer base
                break;
            case "Politician":
                player.influence -= 6; // Public distrusts version of history
                break;
            case "Artist":
                player.influence += 5; // Reclaims suppressed histories through art
                break;
        }
    }
};

// End-of-Turn Card: "The Question of Reparations"
const questionOfReparations = {
    name: "The Question of Reparations",
    description: "Césaire discusses reparations as a form of moral restitution for the atrocities committed during colonial rule. The fight for reparations is part of the decolonization process, with increasing calls for financial and cultural reparation.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 7; // Forced to pay reparations for harm
                break;
            case "Revolutionary":
                player.influence += 7; // Advocacy gains widespread support
                break;
            case "Historian":
                player.knowledge += 5; // Examines legal and moral implications
                break;
            case "Entrepreneur":
                player.money -= 6; // Assets redirected to reparations
                break;
            case "Politician":
                player.influence -= 5; // Public demands action
                break;
            case "Artist":
                player.influence += 6; // Work highlights need for reparations
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Politician",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, riseOfGlobalization);
applyCardEffect(player, fightOverHistoricalMemory);
applyCardEffect(player, questionOfReparations);

// End-of-Turn Card: "The Emergence of Transnational Movements"
const emergenceOfTransnationalMovements = {
    name: "The Emergence of Transnational Movements",
    description: "Transnational movements rise in response to global struggles for justice. Tuck and Yang emphasize that decolonization isn’t just a metaphor but a process rooted in global solidarity. Benjamin highlights the importance of the collective struggle against oppressive historical structures.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Solidarity weakens imperial hold
                break;
            case "Revolutionary":
                player.influence += 7; // Gains recognition in global movement
                break;
            case "Historian":
                player.knowledge += 5; // Documents growing transnational solidarity
                break;
            case "Entrepreneur":
                player.money -= 5; // Forced to reconsider trade practices
                break;
            case "Politician":
                player.influence += 6; // Policies seen as part of global movement
                break;
            case "Artist":
                player.influence += 6; // Becomes voice within solidarity movement
                break;
        }
    }
};

// End-of-Turn Card: "Neoliberalism's Global Ascendancy"
const neoliberalismGlobalAscendancy = {
    name: "Neoliberalism's Global Ascendancy",
    description: "The rise of neoliberal policies shapes a new imperialism, where market-driven agendas replace colonial governance. Césaire and Benjamin critique the continuation of exploitation under the guise of market freedom.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 6; // Thrives under neoliberal system
                break;
            case "Revolutionary":
                player.knowledge -= 6; // Revolutionary ideas suppressed
                break;
            case "Historian":
                player.knowledge += 5; // Chronicles growing influence of neoliberalism
                break;
            case "Entrepreneur":
                player.money += 7; // Capitalizes on expanding market
                break;
            case "Politician":
                player.influence += 6; // Gains power by aligning with policies
                break;
            case "Artist":
                player.influence -= 5; // Art overshadowed by agendas
                break;
        }
    }
};

// End-of-Turn Card: "Rejection of Western Cultural Hegemony"
const rejectionOfWesternCulturalHegemony = {
    name: "Rejection of Western Cultural Hegemony",
    description: "The rejection of Western cultural hegemony signals a return to indigenous knowledge and practices. Césaire’s call for liberation and Barthes’ emphasis on the collective over the individual creator align with this rejection.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Cultural dominance contested
                break;
            case "Revolutionary":
                player.influence += 6; // Ideas about cultural liberation gain momentum
                break;
            case "Historian":
                player.knowledge += 5; // Explores roots of cultural resistance
                break;
            case "Entrepreneur":
                player.money -= 5; // Market disrupted by cultural wave
                break;
            case "Politician":
                player.influence -= 5; // Control over cultural tide diminishes
                break;
            case "Artist":
                player.influence += 7; // Art becomes part of indigenous reclamation
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, emergenceOfTransnationalMovements);
applyCardEffect(player, neoliberalismGlobalAscendancy);
applyCardEffect(player, rejectionOfWesternCulturalHegemony);


}

// Example Player Object
let player = {
    role: "Artist",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, rejectionOfColonialPast);
applyCardEffect(player, riseOfPostcolonialLit);
applyCardEffect(player, struggleOverEducation);

// End-of-Turn Card: "The Rise of Postcolonial Criticism"
const riseOfPostcolonialCriticism = {
    name: "The Rise of Postcolonial Criticism",
    description: "Postcolonial criticism emerges to question the authority of Western literary canons. Barthes and Césaire argue that history and literature should be rewritten by those who have been marginalized.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Historical dominance challenged
                break;
            case "Revolutionary":
                player.knowledge += 7; // Strengthens cause through study
                break;
            case "Historian":
                player.knowledge += 6; // Delves into postcolonial literature
                break;
            case "Entrepreneur":
                player.money -= 5; // Business threatened by new perspectives
                break;
            case "Politician":
                player.influence -= 6; // Movements diminish power
                break;
            case "Artist":
                player.influence += 6; // Embodies postcolonial critique
                break;
        }
    }
};

// End-of-Turn Card: "The Role of Technology in Postcolonial Movements"
const roleOfTechInPostcolonialMovements = {
    name: "The Role of Technology in Postcolonial Movements",
    description: "The role of mass media and technology in the dissemination of postcolonial ideas is critical. Benjamin’s notion of technology reshaping art’s aura becomes a tool for activism.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Control over information diminishes
                break;
            case "Revolutionary":
                player.influence += 7; // Leverages tech to spread message
                break;
            case "Historian":
                player.knowledge += 6; // Analyzes impact of tech on narratives
                break;
            case "Entrepreneur":
                player.money += 6; // Profits from postcolonial tech investments
                break;
            case "Politician":
                player.influence -= 5; // Struggles to control technology’s power
                break;
            case "Artist":
                player.influence += 5; // Art widely circulated via technology
                break;
        }
    }
};

// End-of-Turn Card: "Global Networks of Resistance"
const globalNetworksOfResistance = {
    name: "Global Networks of Resistance",
    description: "Decolonization is not just a local or national effort but a global struggle. Tuck and Yang highlight the importance of international solidarity in dismantling colonial structures.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Resources drained by global resistance
                break;
            case "Revolutionary":
                player.influence += 7; // Unites global movements under common cause
                break;
            case "Historian":
                player.knowledge += 5; // Studies networks and strategies
                break;
            case "Entrepreneur":
                player.money -= 6; // Boycotts impact business
                break;
            case "Politician":
                player.influence += 5; // Stabilizes situation with diplomacy
                break;
            case "Artist":
                player.influence += 6; // Art spreads message of resistance
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Artist",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, riseOfPostcolonialCriticism);
applyCardEffect(player, roleOfTechInPostcolonialMovements);
applyCardEffect(player, globalNetworksOfResistance);

// End-of-Turn Card: "History is Written by the Victors"
const historyWrittenByVictors = {
    name: "History is Written by the Victors",
    description: "The narrative of history is shaped by those who hold power. Barthes and Benjamin challenge the idea that history is impartial or fixed, proposing that it is always a product of power dynamics.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 5; // Benefits from dominant historical narrative
                break;
            case "Revolutionary":
                player.knowledge -= 6; // Narrative suppresses revolutionary efforts
                break;
            case "Historian":
                player.knowledge += 7; // Uncovers hidden histories of the oppressed
                break;
            case "Entrepreneur":
                player.money -= 5; // Profits from morally questionable history
                break;
            case "Politician":
                player.influence -= 6; // Public questions role in shaping narratives
                break;
            case "Artist":
                player.influence += 5; // Challenges dominant historical perspective
                break;
        }
    }
};

// End-of-Turn Card: "The Reclamation of Historical Spaces"
const reclamationOfHistoricalSpaces = {
    name: "The Reclamation of Historical Spaces",
    description: "Césaire urges a reexamination of the spaces that uphold colonial memory, calling for the reclamation of monuments and land. The battle for who controls these spaces remains central to decolonization.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Monuments defaced or removed
                break;
            case "Revolutionary":
                player.influence += 6; // Leads movement to reclaim spaces
                break;
            case "Historian":
                player.knowledge += 5; // Documents transformation of spaces
                break;
            case "Entrepreneur":
                player.money -= 5; // Faces backlash over historical erasure
                break;
            case "Politician":
                player.influence += 5; // Enacts laws protecting cultural monuments
                break;
            case "Artist":
                player.influence += 6; // Supports reclamation of spaces through art
                break;
        }
    }
};

// End-of-Turn Card: "The Rise of Historical Revisionism"
const riseOfHistoricalRevisionism = {
    name: "The Rise of Historical Revisionism",
    description: "Historical revisionism emerges as a dominant force in shaping current ideologies. Barthes suggests that all texts are open to reinterpretation, while Césaire emphasizes the revision of colonial narratives.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 6; // Historical version gains traction
                break;
            case "Revolutionary":
                player.influence -= 5; // Resistance undermined by revised narratives
                break;
            case "Historian":
                player.knowledge += 7; // Chronicles emergence of revisionist histories
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from demand for revised content
                break;
            case "Politician":
                player.influence += 6; // Uses revisionism to consolidate power
                break;
            case "Artist":
                player.influence -= 5; // Dismissed by revisionist forces
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Historian",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, historyWrittenByVictors);
applyCardEffect(player, reclamationOfHistoricalSpaces);
applyCardEffect(player, riseOfHistoricalRevisionism);

// End-of-Turn Card: "Digital Archives and the Battle for History"
const digitalArchivesBattleForHistory = {
    name: "Digital Archives and the Battle for History",
    description: "Digital archives democratize access to history, but also raise questions about who controls these records. Benjamin’s theory on technological reproducibility highlights the impact of mass media in reshaping art and history.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Loses control over narratives
                break;
            case "Revolutionary":
                player.influence += 6; // Leverages digital platforms to spread message
                break;
            case "Historian":
                player.knowledge += 6; // Curates archives to rewrite history
                break;
            case "Entrepreneur":
                player.money -= 5; // Faces competition from free archives
                break;
            case "Politician":
                player.influence -= 5; // Digital records expose questionable policies
                break;
            case "Artist":
                player.influence += 7; // Thrives in digital age
                break;
        }
    }
};

// End-of-Turn Card: "Colonial Monuments and the Battle for Public Memory"
const colonialMonumentsBattleForMemory = {
    name: "Colonial Monuments and the Battle for Public Memory",
    description: "The debate around the removal or preservation of colonial monuments escalates. Césaire calls for the rejection of symbols that perpetuate colonial dominance.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Protects monuments at great expense
                break;
            case "Revolutionary":
                player.influence += 6; // Leads protests for removal
                break;
            case "Historian":
                player.knowledge += 5; // Researches history of monuments
                break;
            case "Entrepreneur":
                player.money -= 5; // Faces fallout from association with symbols
                break;
            case "Politician":
                player.influence += 5; // Passes legislation to protect monuments
                break;
            case "Artist":
                player.influence += 6; // Advocates for removal through art
                break;
        }
    }
};

// End-of-Turn Card: "Social Media Debates on Colonial Legacies"
const socialMediaDebatesColonialLegacies = {
    name: "Social Media Debates on Colonial Legacies",
    description: "Social media becomes a battleground for debates about colonialism and its legacies. Benjamin’s critique of historical narrative and Barthes’ notion of authorship become central to the conversation.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Faces public backlash
                break;
            case "Revolutionary":
                player.influence += 7; // Amplifies voice on digital platforms
                break;
            case "Historian":
                player.knowledge += 6; // Documents debates around colonialism
                break;
            case "Entrepreneur":
                player.money -= 5; // Boycott impacts business
                break;
            case "Politician":
                player.influence += 6; // Promotes policies through social media
                break;
            case "Artist":
                player.influence += 5; // Art provokes thought on colonial legacies
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 12,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, digitalArchivesBattleForHistory);
applyCardEffect(player, colonialMonumentsBattleForMemory);
applyCardEffect(player, socialMediaDebatesColonialLegacies);

// End-of-Turn Card: "Historians vs. Victims of History"
const historiansVsVictims = {
    name: "Historians vs. Victims of History",
    description: "The historian’s role in interpreting history is contested. Benjamin’s 'Angel of History' is caught in the winds of progress, unable to change the past, while Césaire demands that history be reinterpreted from the perspectives of the oppressed.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Control over narrative diminishes
                break;
            case "Revolutionary":
                player.knowledge += 6; // Arguments resonate in historical contest
                break;
            case "Historian":
                player.knowledge -= 6; // Caught in the crossfire
                break;
            case "Entrepreneur":
                player.money -= 5; // Loses clients favoring reinterpretation
                break;
            case "Politician":
                player.influence += 5; // Shapes narrative in favor through alliance
                break;
            case "Artist":
                player.influence += 5; // Supports voice of oppressed through art
                break;
        }
    }
};

// End-of-Turn Card: "Repatriation of Cultural Artifacts"
const repatriationOfArtifacts = {
    name: "Repatriation of Cultural Artifacts",
    description: "The call for the return of looted cultural artifacts from colonial powers gains traction. Césaire and Tuck & Yang advocate for reparations that include cultural restitution.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Wealth reduced by artifact return
                break;
            case "Revolutionary":
                player.influence += 6; // Activism drives push for reparations
                break;
            case "Historian":
                player.knowledge += 5; // Contributes to academic discourse
                break;
            case "Entrepreneur":
                player.money -= 5; // Profits decline from waning demand
                break;
            case "Politician":
                player.influence += 5; // Gains political capital by overseeing process
                break;
            case "Artist":
                player.influence += 7; // Supports call for repatriation through art
                break;
        }
    }
};

// End-of-Turn Card: "Artificial Intelligence and the Question of Identity"
const aiQuestionOfIdentity = {
    name: "Artificial Intelligence and the Question of Identity",
    description: "AI challenges traditional notions of identity, as algorithms start to shape perceptions of gender and race. Butler’s theory of performative identity and Mulvey’s concept of the male gaze are essential for understanding how these technologies might reinforce or subvert social norms.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // AI challenges colonial ideologies
                break;
            case "Revolutionary":
                player.knowledge += 6; // Studies AI’s impact on identity formation
                break;
            case "Historian":
                player.knowledge += 5; // Documents intersection of AI and identity
                break;
            case "Entrepreneur":
                player.money += 7; // Capitalizes on growing AI industry
                break;
            case "Politician":
                player.influence -= 5; // Control over landscape challenged
                break;
            case "Artist":
                player.influence += 6; // Critiques AI’s role in shaping narratives
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, historiansVsVictims);
applyCardEffect(player, repatriationOfArtifacts);
applyCardEffect(player, aiQuestionOfIdentity);

// End-of-Turn Card: "The Globalization of Resistance"
const globalizationOfResistance = {
    name: "The Globalization of Resistance",
    description: "Global movements for justice and decolonization intersect, transcending national borders. Tuck & Yang stress that decolonization is a process, not just a metaphor, and Benjamin's 'Angel of History' observes the international nature of resistance.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Influence weakened by resistance
                break;
            case "Revolutionary":
                player.influence += 7; // Strengthened by international alliances
                break;
            case "Historian":
                player.knowledge += 5; // Documents rise of resistance
                break;
            case "Entrepreneur":
                player.money -= 5; // Business threatened by instability
                break;
            case "Politician":
                player.influence += 6; // Aligns with powers to suppress revolts
                break;
            case "Artist":
                player.influence += 5; // Spreads message of solidarity
                break;
        }
    }
};

// End-of-Turn Card: "Gender and the Performance of Power"
const genderAndPower = {
    name: "Gender and the Performance of Power",
    description: "Gender as a social performance intersects with power dynamics. Butler’s theory of gender performativity is applied to how power is exercised through gendered performances, while Césaire critiques the colonial systems that reinforced gender norms.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Faces backlash against patriarchal systems
                break;
            case "Revolutionary":
                player.knowledge += 6; // Adopts gender as revolutionary tool
                break;
            case "Historian":
                player.knowledge += 5; // Analyzes gendered power dynamics
                break;
            case "Entrepreneur":
                player.money -= 5; // Advertising strategies criticized
                break;
            case "Politician":
                player.influence += 6; // Uses gender politics to gain power
                break;
            case "Artist":
                player.influence += 7; // Critiques gendered power structures
                break;
        }
    }
};

// End-of-Turn Card: "The Spectacle of Colonial Violence"
const spectacleOfColonialViolence = {
    name: "The Spectacle of Colonial Violence",
    description: "The spectacle of colonial violence, captured in media, is revisited. Benjamin’s idea of the historical 'spectacle' forces a reconsideration of colonial violence and its ongoing impact.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Actions exposed and criticized
                break;
            case "Revolutionary":
                player.knowledge += 6; // Exposes violence as tool of resistance
                break;
            case "Historian":
                player.knowledge += 5; // Documents ongoing impact
                break;
            case "Entrepreneur":
                player.money -= 5; // Targeted for profiteering from violence
                break;
            case "Politician":
                player.influence += 5; // Manipulates public opinion
                break;
            case "Artist":
                player.influence += 7; // Sparks public outcry with art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Artist",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, globalizationOfResistance);
applyCardEffect(player, genderAndPower);
applyCardEffect(player, spectacleOfColonialViolence);

// End-of-Turn Card: "The Rise of Neo-Colonialism"
const riseOfNeoColonialism = {
    name: "The Rise of Neo-Colonialism",
    description: "Neo-colonialism rises as multinational corporations and political structures continue to dominate formerly colonized nations. Césaire’s critique of economic exploitation and Tuck & Yang’s ideas about decolonization are at the heart of this phenomenon.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 7; // Benefits from economic domination
                break;
            case "Revolutionary":
                player.influence -= 5; // Resistance hindered by systems
                break;
            case "Historian":
                player.knowledge += 6; // Analyzes rise in modern contexts
                break;
            case "Entrepreneur":
                player.money -= 5; // Faces backlash for practices
                break;
            case "Politician":
                player.influence += 6; // Supports neo-colonial policies
                break;
            case "Artist":
                player.influence -= 5; // Marginalized under neo-colonial power
                break;
        }
    }
};

// End-of-Turn Card: "The Rise of Queer Theories"
const riseOfQueerTheories = {
    name: "The Rise of Queer Theories",
    description: "Queer theory emerges as a powerful critique of normative structures. Sedgwick’s exploration of queer identity and Butler’s theory of gender as performative action challenge conventional ideas about gender and sexuality.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // System challenged by theories
                break;
            case "Revolutionary":
                player.knowledge += 6; // Incorporates theory into movements
                break;
            case "Historian":
                player.knowledge += 5; // Documents influence on struggles
                break;
            case "Entrepreneur":
                player.money += 7; // Profits from queer-inclusive products
                break;
            case "Politician":
                player.influence += 5; // Connects with marginalized groups
                break;
            case "Artist":
                player.influence += 6; // Art critiques normative roles
                break;
        }
    }
};

// End-of-Turn Card: "Revolutionary Movements and the State’s Reaction"
const revolutionaryMovementsAndStateReaction = {
    name: "Revolutionary Movements and the State’s Reaction",
    description: "Revolutionary movements are met with increasing repression. Benjamin’s critique of state violence and Césaire’s call for anti-colonial resistance highlight the tension between revolutionary acts and state control.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Funds counterinsurgency efforts
                break;
            case "Revolutionary":
                player.influence += 6; // Movement grows under repression
                break;
            case "Historian":
                player.knowledge += 5; // Documents state’s response
                break;
            case "Entrepreneur":
                player.money -= 5; // Business targeted by movements
                break;
            case "Politician":
                player.influence += 7; // Suppresses revolutionaries effectively
                break;
            case "Artist":
                player.influence += 6; // Inspires movements with art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Politician",
    money: 12,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, riseOfNeoColonialism);
applyCardEffect(player, riseOfQueerTheories);
applyCardEffect(player, revolutionaryMovementsAndStateReaction);

// End-of-Turn Card: "The Ethics of Representation in Postcolonial Art"
const ethicsOfRepresentation = {
    name: "The Ethics of Representation in Postcolonial Art",
    description: "Postcolonial artists grapple with representing their identities within a Western framework. Césaire calls for a reclamation of representation, while Mulvey critiques the ways in which Western cinema constructs the 'Other.'",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Depictions of the "Other" widely criticized
                break;
            case "Revolutionary":
                player.influence += 7; // Postcolonial art inspires resistance
                break;
            case "Historian":
                player.knowledge += 5; // Analyzes art in postcolonial contexts
                break;
            case "Entrepreneur":
                player.money -= 6; // Alienated clients affect business
                break;
            case "Politician":
                player.influence -= 5; // Propaganda challenged by critical art
                break;
            case "Artist":
                player.influence += 6; // Gains recognition for critique
                break;
        }
    }
};

// End-of-Turn Card: "Neocolonial Media and the Reproduction of Ideology"
const neocolonialMedia = {
    name: "Neocolonial Media and the Reproduction of Ideology",
    description: "Media, particularly film and television, is used to reproduce colonial ideologies. Benjamin’s theory of the technological reproducibility of art and Barthes’ concept of authorship highlight the role of media in shaping public perception.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence += 6; // Media maintains colonial narratives
                break;
            case "Revolutionary":
                player.influence -= 5; // Message overshadowed by dominant ideologies
                break;
            case "Historian":
                player.knowledge += 5; // Studies media’s role in colonial ideologies
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from media supporting narratives
                break;
            case "Politician":
                player.influence += 6; // Manipulates media to gain power
                break;
            case "Artist":
                player.influence -= 6; // Critiques ignored by media representation
                break;
        }
    }
};

// End-of-Turn Card: "The Colonial Gaze in Popular Cinema"
const colonialGazeCinema = {
    name: "The Colonial Gaze in Popular Cinema",
    description: "The colonial gaze persists in contemporary media, objectifying and infantilizing colonized peoples. Mulvey’s concept of the male gaze and Césaire’s critique of colonial objectification intersect in the film industry’s portrayal of the colonized.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence += 5; // Profits from colonial gaze in media
                break;
            case "Revolutionary":
                player.influence -= 6; // Critiques overshadowed by popular media
                break;
            case "Historian":
                player.knowledge += 6; // Analyzes gaze in cinema
                break;
            case "Entrepreneur":
                player.money -= 5; // Backlash from demand for decolonized media
                break;
            case "Politician":
                player.influence += 5; // Exploits media to reinforce gaze
                break;
            case "Artist":
                player.influence += 7; // Critiques colonial representation
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Artist",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, ethicsOfRepresentation);
applyCardEffect(player, neocolonialMedia);
applyCardEffect(player, colonialGazeCinema);

// End-of-Turn Card: "Technology and the Commodification of History"
const technologyCommodificationHistory = {
    name: "Technology and the Commodification of History",
    description: "Technology transforms how history is recorded and remembered. Benjamin critiques the technological reproduction of history, which reduces it to a commodity.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Exposed as false narratives
                break;
            case "Revolutionary":
                player.knowledge += 6; // Spreads alternative histories
                break;
            case "Historian":
                player.knowledge += 5; // Documents commodification of memory
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from digital history demand
                break;
            case "Politician":
                player.influence -= 5; // Manipulation of memory exposed
                break;
            case "Artist":
                player.influence += 6; // Critiques commodification through art
                break;
        }
    }
};

// End-of-Turn Card: "The Politics of Memory in Postcolonial Societies"
const politicsOfMemoryPostcolonial = {
    name: "The Politics of Memory in Postcolonial Societies",
    description: "Memory is a powerful tool in postcolonial societies. Tuck & Yang emphasize the importance of how the past is remembered and reclaimed in decolonization, while Césaire calls for the erasure of colonial memory.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 5; // Resistance against historical narratives
                break;
            case "Revolutionary":
                player.influence += 6; // Thrives by controlling memory
                break;
            case "Historian":
                player.knowledge += 5; // Contributes to memory studies
                break;
            case "Entrepreneur":
                player.money -= 5; // Boycott for colonial memory narratives
                break;
            case "Politician":
                player.influence += 5; // Uses memory politics for power
                break;
            case "Artist":
                player.influence += 7; // Reclaims and reshapes memory
                break;
        }
    }
};

// End-of-Turn Card: "Reclaiming Indigenous Spaces"
const reclaimingIndigenousSpaces = {
    name: "Reclaiming Indigenous Spaces",
    description: "Indigenous communities work to reclaim their ancestral lands and territories. Tuck & Yang argue that decolonization requires the return of land, while Césaire critiques the colonial occupation of space and the violence it enacts on Indigenous populations.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Interests undermined by reclamation
                break;
            case "Revolutionary":
                player.knowledge += 7; // Gains insights into movements
                break;
            case "Historian":
                player.knowledge += 5; // Documents impact on colonial power
                break;
            case "Entrepreneur":
                player.money -= 5; // Resources threatened
                break;
            case "Politician":
                player.influence -= 5; // Forced to address disputes
                break;
            case "Artist":
                player.influence += 6; // Advocates through art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, technologyCommodificationHistory);
applyCardEffect(player, politicsOfMemoryPostcolonial);
applyCardEffect(player, reclaimingIndigenousSpaces);

// End-of-Turn Card: "The Capitalist Co-option of Resistance"
const capitalistCoOptionOfResistance = {
    name: "The Capitalist Co-option of Resistance",
    description: "Capitalism co-opts revolutionary movements by incorporating resistance narratives into profitable ventures. Benjamin critiques how systems of power commodify revolutionary discourse, while Césaire emphasizes the need for true resistance beyond profit motives.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money += 6; // Profits from commodification
                break;
            case "Revolutionary":
                player.knowledge -= 6; // Movement co-opted by capitalist forces
                break;
            case "Historian":
                player.knowledge += 5; // Analyzes commodification of narratives
                break;
            case "Entrepreneur":
                player.money += 7; // Capitalizes on resistance-themed products
                break;
            case "Politician":
                player.influence += 6; // Strengthens power through commodified resistance
                break;
            case "Artist":
                player.influence -= 5; // Loses radical impact through commodification
                break;
        }
    }
};

// End-of-Turn Card: "Postcolonial Feminism"
const postcolonialFeminism = {
    name: "Postcolonial Feminism",
    description: "Postcolonial feminism addresses the intersection of gender, race, and colonial histories. Tuck & Yang call for a reimagining of feminist struggles in decolonial contexts, while Sedgwick emphasizes queer theory’s influence on postcolonial feminism.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Patriarchal systems under attack
                break;
            case "Revolutionary":
                player.knowledge += 7; // Incorporates feminist theory into movements
                break;
            case "Historian":
                player.knowledge += 5; // Documents intersection of feminism and postcolonialism
                break;
            case "Entrepreneur":
                player.money -= 5; // Challenged by feminist critiques
                break;
            case "Politician":
                player.influence -= 5; // Faces opposition to policies
                break;
            case "Artist":
                player.influence += 6; // Challenges colonial and patriarchal norms
                break;
        }
    }
};

// End-of-Turn Card: "The Repression of Memory"
const repressionOfMemory = {
    name: "The Repression of Memory",
    description: "Repression of collective memory prevents the healing of colonial trauma. Benjamin critiques selective historical memory, while Césaire calls for confronting colonial brutalities to heal.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence += 5; // Suppresses inconvenient memories
                break;
            case "Revolutionary":
                player.influence -= 5; // Efforts face resistance
                break;
            case "Historian":
                player.knowledge += 6; // Documents suppressed histories
                break;
            case "Entrepreneur":
                player.money -= 5; // Suffers as reparations demand grows
                break;
            case "Politician":
                player.influence -= 6; // Exposed for repressing trauma
                break;
            case "Artist":
                player.influence += 7; // Highlights suppressed memories through art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Artist",
    money: 10,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, capitalistCoOptionOfResistance);
applyCardEffect(player, postcolonialFeminism);
applyCardEffect(player, repressionOfMemory);

// End-of-Turn Card: "The Author’s Death and Revolutionary Speech"
const authorsDeathRevolutionarySpeech = {
    name: "The Author’s Death and Revolutionary Speech",
    description: "The death of the author implies that the revolutionary voice must be collective, no longer defined by a singular figure. Barthes challenges singular authority, while Benjamin emphasizes collective memory and shared histories.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Authorial voice contested
                break;
            case "Revolutionary":
                player.knowledge += 7; // Embraces collective speech
                break;
            case "Historian":
                player.knowledge += 6; // Documents shift from individual to collective voices
                break;
            case "Entrepreneur":
                player.money -= 5; // Marketing failures due to loss of authoritative figures
                break;
            case "Politician":
                player.influence += 6; // Controls narrative in shaping discourse
                break;
            case "Artist":
                player.influence += 6; // Collective art speaks for revolution
                break;
        }
    }
};

// End-of-Turn Card: "The Technology of Memory"
const technologyOfMemory = {
    name: "The Technology of Memory",
    description: "Technology transforms how history is recorded and remembered. Benjamin critiques the technological reproduction of history, suggesting that memory is shaped and distorted by its means of reproduction.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 6; // Exposure of colonial past through technological reproduction
                break;
            case "Revolutionary":
                player.knowledge += 6; // Disseminates alternative histories
                break;
            case "Historian":
                player.knowledge += 5; // Studies technology's role in shaping memory
                break;
            case "Entrepreneur":
                player.money -= 5; // Faces challenges due to historical reinterpretation
                break;
            case "Politician":
                player.influence += 5; // Controls history reproduction for political gain
                break;
            case "Artist":
                player.influence += 7; // Challenges historical distortions through art
                break;
        }
    }
};

// End-of-Turn Card: "The Colonial Economy and Its Dismantling"
const colonialEconomyDismantling = {
    name: "The Colonial Economy and Its Dismantling",
    description: "The colonial economy must be dismantled for true decolonization. Césaire critiques capitalist colonialism, while Tuck & Yang emphasize economic transformation as crucial to decolonization.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.money -= 7; // Wealth stripped as colonial economy collapses
                break;
            case "Revolutionary":
                player.influence += 7; // Pushes for economic justice and decolonization
                break;
            case "Historian":
                player.knowledge += 6; // Documents colonialism’s economic underpinnings
                break;
            case "Entrepreneur":
                player.money -= 6; // Capitalist ventures threatened
                break;
            case "Politician":
                player.influence -= 5; // Struggles to maintain colonial economy
                break;
            case "Artist":
                player.influence += 5; // Advocates dismantling colonial economics through art
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 12,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, authorsDeathRevolutionarySpeech);
applyCardEffect(player, technologyOfMemory);
applyCardEffect(player, colonialEconomyDismantling);

// End-of-Turn Card: "The Failure of Postcolonial States"
const failureOfPostcolonialStates = {
    name: "The Failure of Postcolonial States",
    description: "Many postcolonial states fail to achieve true sovereignty, often falling victim to neocolonialism or internal divisions. Césaire critiques the superficial independence achieved by many nations, while Tuck & Yang stress the need for ongoing decolonial work.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence += 6; // Benefits from continued weakness
                break;
            case "Revolutionary":
                player.knowledge -= 5; // Faces setbacks from state failure
                break;
            case "Historian":
                player.knowledge += 6; // Documents failures and challenges
                break;
            case "Entrepreneur":
                player.money += 5; // Profits from instability
                break;
            case "Politician":
                player.influence -= 6; // Struggles to bring independence
                break;
            case "Artist":
                player.influence += 5; // Critiques failure through art
                break;
        }
    }
};

// End-of-Turn Card: "Decolonial Movements in the Age of Technology"
const decolonialMovementsTechnology = {
    name: "Decolonial Movements in the Age of Technology",
    description: "Decolonial movements are influenced by technology, which both enables and complicates resistance. Tuck & Yang emphasize the digital dimensions of decolonization, while Benjamin critiques technological systems that perpetuate coloniality.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 5; // Technological control threatened
                break;
            case "Revolutionary":
                player.knowledge += 7; // Spreads decolonial ideas digitally
                break;
            case "Historian":
                player.knowledge += 5; // Studies tech’s role in movements
                break;
            case "Entrepreneur":
                player.money -= 6; // Platforms targeted by activists
                break;
            case "Politician":
                player.influence += 6; // Uses technology to suppress resistance
                break;
            case "Artist":
                player.influence += 5; // Digital art spreads movement messages
                break;
        }
    }
};

// End-of-Turn Card: "Revolutions and the Power of Narrative"
const revolutionsPowerOfNarrative = {
    name: "Revolutions and the Power of Narrative",
    description: "Revolutions are not only fought on the ground but also in narratives. Barthes’ critique of authorship and Benjamin’s focus on historical memory show that revolutions also need to control and reframe historical narratives.",
    effect: (player) => {
        switch (player.role) {
            case "Colonialist":
                player.influence -= 6; // Losing control of narrative
                break;
            case "Revolutionary":
                player.influence += 7; // Successfully rewrites history for revolution
                break;
            case "Historian":
                player.knowledge += 5; // Documents narrative's role in revolutions
                break;
            case "Entrepreneur":
                player.money -= 5; // Narrative-based campaigns fail
                break;
            case "Politician":
                player.influence += 6; // Controls dominant historical narrative
                break;
            case "Artist":
                player.influence += 6; // Art influences revolutionary discourse
                break;
        }
    }
};

// Function to apply card effect
function applyCardEffect(player, card) {
    card.effect(player);
    console.log(`${card.name} applied! ${player.role} now has ${player.money} Money, ${player.knowledge} Knowledge, and ${player.influence} Influence.`);
}

// Example Player Object
let player = {
    role: "Revolutionary",
    money: 12,
    knowledge: 8,
    influence: 6
};

// Apply the card effects
applyCardEffect(player, failureOfPostcolonialStates);
applyCardEffect(player, decolonialMovementsTechnology);
applyCardEffect(player, revolutionsPowerOfNarrative);

// Function to create an Age of Expansion card
function createAgeOfExpansionCard(card) {
    return {
        name: card.name,
        description: card.description,
        layout: {
            width: "2.5 inches",
            height: "3.5 inches",
            borderColor: "#9C54DE", // Purple border
            backgroundColor: "#9C54DE", // Purple background
            textColor: "black", // Black font
            fontStyle: "bold",
            alignment: "center",
            padding: "10px",
            fontSize: "14px"
        },
        effects: card.effects
    };
}

// Array of The Age of Expansion cards
const ageOfExpansionCards = [
    {
        name: "Scramble for Africa",
        description: "Reflects Discourse on Colonialism by highlighting the violent race for African resources, rewarding Money but costing Influence due to growing resistance.",
        effects: { money: 6, influence: -5 }
    },
    {
        name: "Divide and Conquer",
        description: "Mirrors Césaire’s critique of colonial strategies used to fracture societies, advancing players but diminishing their critical understanding.",
        effects: { moveSpaces: 7, knowledge: -5 }
    },
    {
        name: "Exploitation Justified",
        description: "Embodies Césaire’s analysis of colonial rationalization, increasing wealth at the cost of moral legitimacy.",
        effects: { stealMoneyFromPlayer: 6, influence: -5 }
    },
    {
        name: "Colonial Enterprise",
        description: "Reflects Césaire’s critique of colonial economic ventures that prioritized profit over justice, allowing financial gain but risking alliances.",
        effects: { tradeResource: { money: -6, knowledge: 5 } }
    },
    {
        name: "Missionary Influence",
        description: "Represents Césaire’s view of ideological domination through religion, granting Influence but reinforcing colonial authority.",
        effects: { moveSpaces: 6, influence: 5 }
    },
    {
        name: "Revolt Suppression",
        description: "Demonstrates colonial violence used to crush uprisings, allowing sabotage but increasing instability.",
        effects: { sabotage: { moveOpponentBackSpaces: 6 } }
    },
    {
        name: "Commodification of Labor",
        description: "Reflects Césaire’s analysis of forced labor systems, allowing Money gain at the expense of future opportunities.",
        effects: { money: 7, skipNextTurn: true }
    },
    {
        name: "Indigenous Displacement",
        description: "Reflects Césaire’s warning about the violence of land dispossession, advancing progress but reducing moral standing.",
        effects: { moveToAge: "The Age of Resistance", influence: -6 }
    },
    {
        name: "Control the Narrative",
        description: "Embodies colonial propaganda described by Césaire, increasing Knowledge while reinforcing power.",
        effects: { knowledge: 5, moveSpaces: 5 }
    },
    {
        name: "Mercantile Expansion",
        description: "Highlights colonial capitalism’s expansion, fostering temporary alliances but encouraging unequal trade.",
        effects: { formAlliance: true, resourceExchange: 5 }
    },
    {
        name: "Plantation Economy",
        description: "Reflects Césaire’s critique of exploitative plantation economies, rewarding Money but hindering intellectual growth.",
        effects: { knowledge: -5, money: 6 }
    },
    {
        name: "Imperial Propaganda",
        description: "Reinforces colonial dominance through narrative control, allowing suppression of opposition.",
        effects: { suppressOpposition: true }
    }
];

// Generate and display formatted Age of Expansion cards
const formattedAgeOfExpansionCards = ageOfExpansionCards.map(createAgeOfExpansionCard);
console.log(formattedAgeOfExpansionCards);

const ageOfResistanceCards = [
    {
        name: "Pan-African Congress",
        description: "Inspired by thinkers like Du Bois and Garvey, this card unites resistance movements, boosting Knowledge and Influence.",
        effects: { knowledge: 6, influence: 6 }
    },
    {
        name: "Boycott Colonial Goods",
        description: "Reflects strategies of non-violent resistance such as Gandhi's Salt March, sacrificing Money for long-term power.",
        effects: { money: -4, influence: 5 }
    },
    {
        name: "Anti-Colonial Publication",
        description: "Symbolizes the spread of resistance ideas through radical press; gain Knowledge and build alliances.",
        effects: { knowledge: 5, formAlliance: true }
    },
    {
        name: "Cultural Revival",
        description: "Honors figures like Senghor and the Negritude movement, empowering identity and Influence.",
        effects: { influence: 6, knowledge: 4 }
    },
    {
        name: "Worker Uprising",
        description: "Inspired by Fanon's focus on the labor class, this card disrupts the colonial system but may provoke retaliation.",
        effects: { sabotage: { disruptOpponentTurn: true }, influence: 5 }
    },
    {
        name: "Radio Resistance",
        description: "Broadcasts subversive messages to the masses, gaining Influence and moving forward.",
        effects: { moveSpaces: 4, influence: 3 }
    },
    {
        name: "Student Protest",
        description: "Inspired by 1960s African decolonization movements, this card shakes the system but costs safety.",
        effects: { influence: 6, skipNextTurn: true }
    },
    {
        name: "Colonial Critique",
        description: "Amplifies ideas from Fanon and Cesaire, increasing Knowledge while disrupting power.",
        effects: { knowledge: 7, sabotage: { stealInfluence: 3 } }
    },
    {
        name: "Liberation Literature",
        description: "Fueled by writings of Ngũgĩ wa Thiong’o, builds resistance and educates the masses.",
        effects: { knowledge: 5, influence: 2 }
    },
    {
        name: "Counter-Intelligence",
        description: "Disrupt colonial surveillance using underground networks, protecting resources and progress.",
        effects: { preventNextSabotage: true, moveSpaces: 3 }
    },
    {
        name: "Third World Solidarity",
        description: "Connects with global resistance movements, offering powerful exchange and protection.",
        effects: { formAlliance: true, tradeResource: { knowledge: 3, influence: 3 } }
    },
    {
        name: "Symbolic Protest",
        description: "Harness the power of art and protest; influence hearts and minds.",
        effects: { influence: 4, moveSpaces: 2 }
    }
];

// Generate and display formatted Age of Resistance cards
const formattedAgeOfResistanceCards = ageOfResistanceCards.map(createAgeOfExpansionCard);
console.log(formattedAgeOfResistanceCards);

const ageOfReckoningCards = [
    {
        name: "Truth Commission",
        description: "Reckon with past injustices through national healing and transparency. Sacrifices short-term power for long-term peace.",
        effects: { influence: -3, knowledge: 6, preventNextSabotage: true }
    },
    {
        name: "Cultural Renaissance",
        description: "Celebrate indigenous knowledge, arts, and language in the post-colonial world. A boon to knowledge and identity.",
        effects: { knowledge: 6, influence: 3 }
    },
    {
        name: "Global South Forum",
        description: "Create new alliances for the future. Inspired by movements like the Bandung Conference.",
        effects: { formAlliance: true, knowledge: 4 }
    },
    {
        name: "Restitution of Artifacts",
        description: "Return stolen cultural heritage to its rightful communities, promoting justice and healing.",
        effects: { influence: 4, knowledge: 2 }
    },
    {
        name: "Diaspora Collaboration",
        description: "Reconnect with global diaspora communities to build economic and intellectual strength.",
        effects: { knowledge: 3, tradeResource: { influence: 2, knowledge: 2 } }
    },
    {
        name: "Resistance Museum",
        description: "Institutionalize the memory of anti-colonial struggle. Teaches history and strengthens unity.",
        effects: { knowledge: 7 }
    },
    {
        name: "Educational Reform",
        description: "Decolonize the curriculum and empower future generations with accurate history.",
        effects: { knowledge: 6, influence: 1 }
    },
    {
        name: "Transnational Justice Tribunal",
        description: "Hold colonizers accountable on a global stage. Powerful but risky.",
        effects: { influence: 5, skipNextTurn: true }
    },
    {
        name: "Heirs of Resistance",
        description: "Empower a new generation of leaders. Legacy bonus.",
        effects: { influence: 4, moveSpaces: 3 }
    },
    {
        name: "Ubuntu Diplomacy",
        description: "Lead with community values; gain trust, allies, and ethical progress.",
        effects: { formAlliance: true, influence: 3 }
    },
    {
        name: "Digital Liberation Archive",
        description: "Preserve history online. Spread resistance knowledge globally.",
        effects: { knowledge: 5, moveSpaces: 2 }
    },
    {
        name: "Eco-Sovereignty Movement",
        description: "Fight climate imperialism and reclaim land stewardship rights.",
        effects: { influence: 2, preventNextSabotage: true }
    }
];

// Generate and display formatted Age of Reckoning cards
const formattedAgeOfReckoningCards = ageOfReckoningCards.map(createAgeOfExpansionCard);
console.log(formattedAgeOfReckoningCards);

const ageOfLegacyCards = [
    {
        name: "National Vision Summit",
        description: "Unite former resistance factions to create a shared path forward. Prevent internal conflict.",
        effects: { preventCivilUnrest: true, influence: 3 }
    },
    {
        name: "Founding Constitution",
        description: "Draft a visionary and inclusive constitution. Long-term stability and justice.",
        effects: { knowledge: 4, influence: 2 }
    },
    {
        name: "Rebuilding Infrastructure",
        description: "Construct roads, schools, and hospitals to support the liberated population.",
        effects: { moveSpaces: 2, knowledge: 3 }
    },
    {
        name: "Transitional Government",
        description: "Establish temporary governance to transition from resistance to civil leadership.",
        effects: { influence: 4, skipNextSabotage: true }
    },
    {
        name: "Land Redistribution Act",
        description: "Return ancestral lands to the people. Boosts morale but risks elite backlash.",
        effects: { influence: 5, risk: "civilUnrest" }
    },
    {
        name: "National Heroes Day",
        description: "Honor resistance legends. Strengthens national pride and morale.",
        effects: { influence: 3, knowledge: 2 }
    },
    {
        name: "Diaspora Return Program",
        description: "Invite exiled thinkers and professionals back to help rebuild.",
        effects: { knowledge: 4, formAlliance: true }
    },
    {
        name: "People's Bank",
        description: "Establish sovereign financial systems. Reduces reliance on colonizers’ currency.",
        effects: { influence: 3, tradeResource: { influence: 2, knowledge: 1 } }
    },
    {
        name: "Media Independence Act",
        description: "Create public media free of foreign control. Helps shape narratives.",
        effects: { knowledge: 3, influence: 2 }
    },
    {
        name: "Decolonized Education Policy",
        description: "Rebuild school curricula with indigenous knowledge and languages.",
        effects: { knowledge: 6 }
    },
    {
        name: "Veterans Support Program",
        description: "Support ex-fighters with training and housing, stabilizing society.",
        effects: { influence: 2, preventCivilUnrest: true }
    },
    {
        name: "International Recognition Tour",
        description: "Seek global legitimacy. Boost foreign alliances and influence.",
        effects: { influence: 4, formAlliance: true }
    }
];

// Generate and display formatted Age of Legacy cards
const formattedAgeOfLegacyCards = ageOfLegacyCards.map(createAgeOfExpansionCard);
console.log(formattedAgeOfLegacyCards);

