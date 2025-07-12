// Board data module for Critocracy - Coordinate-Based System
// Contains board layout constants and path definitions as arrays of space objects.

// Constants for board dimensions
export const ORIGINAL_WIDTH = 1536;
export const ORIGINAL_HEIGHT = 1024;

// Path colors
export const PATH_COLORS = {
    ageOfExpansionPath: "path-purple",    // purple
    ageOfResistancePath: "path-blue",   // blue
    ageOfReckoningPath: "path-cyan",    // cyan
    ageOfLegacyPath: "path-pink"        // pink
};


// Deck regions with their properties
export const fullDeckRegionPathMap = {
    ageOfExpansion: {
      deckType: 'ageOfExpansionDeck',
      regionId: 'ageOfExpansionRegion',
      name: 'Age of Expansion',
      pathColorKey: 'purplePath',
      cssClass: 'path-purple',
      pathName: 'Age of Expansion Path',
      pathKey: 'ageOfExpansionPath',
      pathButtonLabel: 'Age of Expansion',
      positions: [
        {
          topleft: 566, toplefty: 473,
          toprightx: 654, topright: 473,
          bottomrightx: 654, bottomright: 618,
          bottomleftx: 566, bottomleft: 618
        }
      ],
      type: 'age'
    },
  
    ageOfLegacy: {
      deckType: 'ageOfLegacyDeck',
      regionId: 'ageOfLegacyRegion',
      name: 'Age of Legacy',
      pathColorKey: 'pinkPath',
      cssClass: 'path-pink',
      pathName: 'Age of Legacy Path',
      pathKey: 'ageOfLegacyPath',
      pathButtonLabel: 'Age of Legacy',
      positions: [
        {
          topleft: 692, toplefty: 253,
          toprightx: 804, topright: 253,
          bottomrightx: 804, bottomright: 400,
          bottomleftx: 692, bottomleft: 400
        }
      ],
      type: 'age'
    },
  
    ageOfResistance: {
      deckType: 'ageOfResistanceDeck',
      regionId: 'ageOfResistanceRegion',
      name: 'Age of Resistance',
      pathColorKey: 'bluePath',
      cssClass: 'path-blue',
      pathName: 'Age of Resistance Path',
      pathKey: 'ageOfResistancePath',
      pathButtonLabel: 'Age of Resistance',
      positions: [
        {
          topleft: 843, toplefty: 472,
          toprightx: 941, topright: 472,
          bottomrightx:41, bottomright: 619,
          bottomleftx: 843, bottomleft: 619
        }
      ],
      type: 'age'
    },
  
    ageOfReckoning: {
      deckType: 'ageOfReckoningDeck',
      regionId: 'ageOfReckoningRegion',
      name: 'Age of Reckoning',
      pathColorKey: 'cyanPath',
      cssClass: 'path-cyan',
      pathName: 'Age of Reckoning Path',
      pathKey: 'ageOfReckoningPath',
      pathButtonLabel: 'Age of Reckoning',
      positions: [
        {
          topleft: 690, toplefty: 699,
          toprightx: 804, topright: 699,
          bottomrightx: 804, bottomright: 864,
          bottomleftx: 690, bottomleft: 864
        }
      ],
      type: 'age'
    },
  
    endOfTurn: {
      deckType: 'endOfTurnDeck',
      regionId: 'endOfTurnRegion', // Changed to match the key in fullDeckRegionMap
      name: 'End of Turn',
      pathColorKey: 'gold',
      cssClass: null,
      pathName: null,
      pathKey: null,
      pathButtonLabel: null,
      positions: [
        {
          topleft: 302, toplefty: 444,
          toprightx: 386, topright: 444,
          bottomrightx: 386, bottomright: 582,
          bottomleftx: 302, bottomleft: 582
        },
        {
          topleft: 1128, toplefty: 458,
          toprightx: 1210, topright: 458,
          bottomrightx: 1210, bottomright: 596,
          bottomleftx: 1128, bottomleft: 596
        }
      ],
      type: 'endOfTurn'
    }
};

export function getPathOptionsFromStart() {
    return Object.entries(START_SPACE.nextCoordOptions).map(([pathKey, coordsArray]) => {
        const pathInfo = fullDeckRegionPathMap[pathKey];
        if (!pathInfo) {
            console.warn(`No path info found for key: ${pathKey}`);
            return null;
        }
        return {
            text: pathInfo.pathName,
            coords: { x: coordsArray[0], y: coordsArray[1] },
            color: pathInfo.color,
            pathName: pathKey
        };
    }).filter(Boolean);
}

// Space types
export const SPACE_TYPE = {
    Regular: "Regular",
    Draw: "Draw",
    Choicepoint: "Choicepoint",
    Start: "Start",
    Finish: "Finish"
};

// Start and Finish spaces
export const START_SPACE = {
    coordinates: [104, 512],
    type: SPACE_TYPE.Start,
    nextCoordOptions: {
        ageOfExpansion: [169, 466],
        ageOfResistance: [201, 498],
        ageOfReckoning: [205, 548],
        ageOfLegacy: [167, 579]
    }
};

export const FINISH_SPACE = {
    coordinates: [1384, 512],
    type: SPACE_TYPE.Finish
};

// Path Definitions
export const ageOfExpansionPath = {
    color: 'purple',
    name: 'Age of Expansion',
    startCoord: [104, 512],
    endCoord: FINISH_SPACE.coordinates,
    segments: [
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[104, 512]], Next: [[169, 466]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[169, 466]], Next: [[178, 440]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[178, 440]], Next: [[189, 408]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[189, 408]], Next: [[206, 379]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[206, 379]], Next: [[217, 350]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[217, 350]], Next: [[236, 325]], Type: "Regular" }, // Assuming Type: Draw was manual, keeping Regular for now
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[236, 325]], Next: [[260, 302]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[260, 302]], Next: [[288, 290]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[288, 290]], Next: [[312, 278]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[312, 278]], Next: [[349, 277]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[349, 277]], Next: [[380, 273]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[380, 273]], Next: [[414, 271]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[414, 271]], Next: [[446, 273]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[446, 273]], Next: [[477, 283]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[477, 283]], Next: [[500, 289]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[500, 289]], Next: [[537, 302]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[537, 302]], Next: [[566, 273], [568,329]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[568, 329]], Next: [[590, 345]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[590, 345]], Next: [[610, 371]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[610, 371]], Next: [[633, 400]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[633, 400]], Next: [[648, 430]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[648, 430]], Next: [[667, 464]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[667, 464]], Next: [[681, 492]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[681, 492]], Next: [[701, 518]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[701, 518]], Next: [[724, 541]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[724, 541]], Next: [[744,558]], Type: "Regular" }, // Leads to next Choicepoint
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[744, 558]], Next: [[750, 574], [773,602]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[773, 602]], Next: [[793, 632]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[793, 632]], Next: [[816, 658]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[816, 658]], Next: [[833, 685]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[833, 685]], Next: [[859, 708]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[859, 708]], Next: [[881, 729]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[881, 729]], Next: [[915, 747]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[915, 747]], Next: [[931, 756]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[931, 756]], Next: [[962, 766]], Type: "Regular" }, // Leads to next Choicepoint
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[962, 766]], Next: [[992, 785], [972,738]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[992, 785]], Next: [[1016, 789]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1016, 789]], Next: [[1050, 795]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1050, 795]], Next: [[1078, 795]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1078, 795]], Next: [[1114, 792]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1114, 792]], Next: [[1142, 793]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1142, 793]], Next: [[1175, 781]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1175, 781]], Next: [[1202, 775]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1202, 775]], Next: [[1229, 762]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1229, 762]], Next: [[1258, 746]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1258, 746]], Next: [[1284, 719]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1284, 719]], Next: [[1296, 698]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1296, 698]], Next: [[1314, 667]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1314, 667]], Next: [[1330, 635]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1330, 635]], Next: [[1332, 602]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1332, 602]], Next: [[1346, 573]], Type: "Draw" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1346, 573]], Next: [[1384, 512]], Type: "Regular" },
{ pathColor: "purple", pathName: "ageOfExpansionPath", coordinates: [[1384, 512]], Type: "Finish"},
// NOTE: Last space should implicitly lead to FINISH based on coordinates
]
};

export const ageOfResistancePath = {
    color: 'blue',
    name: 'Age of Resistance',
    startCoord: [104, 512],
    endCoord: FINISH_SPACE.coordinates,
    segments: [
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[104, 512]], Next: [[201, 498]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[201, 498]], Next: [[230, 470]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[230, 470]], Next: [[262, 441]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[262, 441]], Next: [[290, 418]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[290, 418]], Next: [[318, 379]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[318, 379]], Next: [[352, 356]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[352, 356]], Next: [[383, 345]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[383, 345]], Next: [[416, 332]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[416, 332]], Next: [[445, 368]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[445, 368]], Next: [[458, 398]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[458, 398]], Next: [[474, 442]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[474, 442]], Next: [[495, 496]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[495, 496]], Next: [[521, 475], [502,534]], Type: "Choicepoint" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[502, 534]], Next: [[512, 563]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[512, 563]], Next: [[523, 606]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[523, 606]], Next: [[541, 641]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[541, 641]], Next: [[542, 679]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[542, 679]], Next: [[550, 709]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[550, 709]], Next: [[559, 746]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[559, 744]], Next: [[568, 773]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[568, 773]], Next: [[590, 758], [572,805]], Type: "Choicepoint" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[572, 805]], Next: [[589, 838]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[589, 838]], Next: [[602, 866]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[602, 866]], Next: [[647, 896]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[647, 896]], Next: [[681, 910]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[681, 910]], Next: [[719, 916]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[719, 916]], Next: [[757, 917]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[757, 917]], Next: [[794, 915]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[794, 915]], Next: [[836, 907]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageofResistancePath", coordinates: [[836, 907]], Next: [[878, 903]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[878, 903]], Next: [[905, 873]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[905, 873]], Next: [[925, 844]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[925, 844]], Next: [[945, 808]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[945, 808]], Next: [[962, 766]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[962, 766]], Next: [[992, 785], [972,738]], Type: "Choicepoint" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[972, 738]], Next: [[986, 707]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[986, 707]], Next: [[994, 678]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[994, 678]], Next: [[997, 646]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[997, 646]], Next: [[994, 611]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[994, 611]], Next: [[986, 580]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[986, 580]], Next: [[983, 544]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[983, 544]], Next: [[1003,522]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1003, 522]], Next: [[1031, 574], [1045,532]], Type: "Choicepoint" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1045, 532]], Next: [[1079, 531]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1079, 531]], Next: [[1091, 503]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1091, 503]], Next: [[1077, 474]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1077, 474]], Next: [[1067, 442]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1067, 442]], Next: [[1070, 406]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1070, 406]], Next: [[1082, 383]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1082, 383]], Next: [[1109, 353]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1109, 353]], Next: [[1138, 358]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1138, 358]], Next: [[1166, 370]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1166, 370]], Next: [[1196, 395]], Type: "Draw" }, 
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1196, 395]], Next: [[1219, 413]], Type: "Regular" }, 
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1219, 413]], Next: [[1240, 435]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1240, 435]], Next: [[1261, 455]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1261, 455]], Next: [[1286, 485]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1286, 485]], Next: [[1307, 492]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1307, 492]], Next: [[1316, 500]], Type: "Draw" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1316, 500]], Next: [[1384, 512]], Type: "Regular" },
{ pathColor: "blue", pathName: "ageOfResistancePath", coordinates: [[1384, 512]], Type: "Finish" },
// NOTE: Last space should implicitly lead to FINISH based on coordinates
]
};

export const ageOfReckoningPath = {
    color: 'cyan',
    name: 'Age of Reckoning',
    startCoord: [104, 512],
    endCoord: FINISH_SPACE.coordinates,
    segments: [

{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[104, 512]], Next: [[205, 548]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[205, 548]], Next: [[225, 572]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[225, 572]], Next: [[242, 598]], Type: "Draw"},
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[242, 598]], Next: [[263, 618]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[263, 618]], Next: [[290, 639]], Type: "Regular" }, 
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[290, 639]], Next: [[320, 658]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[320, 658]], Next: [[350, 669]], Type: "Draw"  },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[350, 669]], Next: [[385, 671]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[385, 671]], Next: [[417, 668]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[417, 668]], Next: [[435, 667]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[435, 667]], Next: [[457, 644]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[457, 644]], Next: [[456, 611]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[456, 611]], Next: [[445, 579]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[445, 579]], Next: [[430, 549]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[430, 549]], Next: [[428, 519]], Type: "Draw" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[428, 519]], Next: [[454, 504]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[454, 504]], Next: [[495, 496]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[495, 496]], Next: [[521, 475], [502,534]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[521, 475]], Next: [[528, 442]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[528, 442]], Next: [[517, 418]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[517, 418]], Next: [[509, 380]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[509, 380]], Next: [[517, 352]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[517, 352]], Next: [[537, 302]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[537, 302]], Next: [[566, 273], [568,329]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[566, 273]], Next: [[589, 246]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[589, 246]], Next: [[613, 225]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[613, 225]], Next: [[640, 213]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[640, 213]], Next: [[669, 200]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[669, 200]], Next: [[706, 202]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[706, 202]], Next: [[734, 196]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[734, 196]], Next: [[767, 197]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[767, 197]], Next: [[800, 198]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[800, 198]], Next: [[830, 208]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[830, 208]], Next: [[865, 218]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[865, 218]], Next: [[893, 229]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[893, 229]], Next: [[917, 250]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[917, 250]], Next: [[935, 275]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[935, 275]], Next: [[953,295]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[953, 295]], Next: [[972, 345], [983,288]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[972, 345]], Next: [[980, 378]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[980, 378]], Next: [[985, 415]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[985, 415]], Next: [[989, 446]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[989, 446]], Next: [[994, 477]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[994, 477]], Next: [[1003, 522]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1003,522]], Next: [[1031, 574], [1045,532]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1031, 574]], Next: [[1048, 598]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1048, 598]], Next: [[1064, 621]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1064, 621]], Next: [[1089, 644]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1089, 644]], Next: [[1124, 654]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1124, 654]], Next: [[1156, 664]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1156, 664]], Next: [[1194, 657]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1194, 657]], Next: [[1225, 632]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1225, 632]], Next: [[1251, 613]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1251, 613]], Next: [[1271, 592]], Type: "Draw" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1271, 592]], Next: [[1287, 563]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1287, 563]], Next: [[1310, 544]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1310, 544]], Next: [[1384, 512]], Type: "Regular" },
{ pathColor: "cyan", pathName: "ageOfReckoningPath", coordinates: [[1384, 512]], Type: "Finish" },
// NOTE: Last space should implicitly lead to FINISH based on coordinates
]
};

export const ageOfLegacyPath = {
    color: 'pink',
    name: 'Age of Legacy',
    startCoord: START_SPACE.nextCoordOptions.ageOfLegacyPath,
    endCoord: FINISH_SPACE.coordinates,
    segments: [
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[104, 512]], Next: [[167, 579]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[167, 579]], Next: [[184, 605]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[184, 605]], Next: [[193, 636]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[193, 636]], Next: [[206, 667]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[206, 667]], Next: [[218, 698]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[218, 698]], Next: [[240, 729]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[240, 729]], Next: [[263, 748]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[263, 748]], Next: [[286, 765]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[286, 765]], Next: [[318, 777]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[318, 777]], Next: [[348, 785]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[348, 785]], Next: [[378, 790]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[378, 790]], Next: [[419, 790]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[419, 790]], Next: [[455, 791]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[455, 791]], Next: [[504, 787]], Type: "Draw" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[504, 787]], Next: [[528, 781]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[528, 781]], Next: [[562, 770]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[562, 770]], Next: [[590, 758], [572,805]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[590, 758]], Next: [[613, 740]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[613, 740]], Next: [[641, 720]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[641, 720]], Next: [[658, 692]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[658, 692]], Next: [[677, 670]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[677, 670]], Next: [[700, 639]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[700, 639]], Next: [[719, 608]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[719, 608]], Next: [[744, 558]], Type: "Draw"},// Leads to Choicepoint
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[744, 558]], Next: [[750, 574], [773,602]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[750, 574]], Next: [[775, 538]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[775, 538]], Next: [[800, 516]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[800, 516]], Next: [[819, 486]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[819, 486]], Next: [[834, 456]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[834, 456]], Next: [[847, 428]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[847, 428]], Next: [[864, 397]], Type: "Draw" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[864, 397]], Next: [[890, 367]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[890, 367]], Next: [[903, 344]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[903, 344]], Next: [[925, 328]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[925, 328]], Next: [[953, 295]], Type: "Regular" }, // Leads to Choicepoint
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[953, 295]], Next: [[972, 345], [983,288]], Type: "Choicepoint" }, // Corrected Next syntax
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[983, 288]], Next: [[1011, 281]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1011, 281]], Next: [[1049, 273]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1049, 273]], Next: [[1075, 268]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1075, 268]], Next: [[1117, 270]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1117, 270]], Next: [[1147, 269]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1147, 269]], Next: [[1180, 278]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1180, 278]], Next: [[1209, 290]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1209, 290]], Next: [[1237, 302]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1237, 302]], Next: [[1263, 324]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1263, 324]], Next: [[1276, 351]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1276, 351]], Next: [[1298, 376]], Type: "Regular" }, // Assuming Type: Draw was manual
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1298, 376]], Next: [[1308, 406]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1308, 406]], Next: [[1315, 430]], Type: "Draw" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1315, 430]], Next: [[1337, 459]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1337, 459]], Next: [[1384, 512]], Type: "Regular" },
{ pathColor: "pink", pathName: "ageOfLegacyPath", coordinates: [[1384, 512]], Type: "Finish" },
// NOTE: Last space should implicitly lead to FINISH based on coordinates
]
};

// Export paths with age names for convenience
// (Assumes these exist globally — if not, add them where paths are defined)
ageOfExpansionPath.pathName = 'ageOfExpansionPath';
ageOfResistancePath.pathName = 'ageOfResistancePath';
ageOfReckoningPath.pathName = 'ageOfReckoningPath';
ageOfLegacyPath.pathName = 'ageOfLegacyPath';

export const choicepoints = [
  {
    id: "choicepoint1",
    coords: {       
      topleft: 461, toplefty: 480,
      toprightx: 490, topright: 458,
      bottomrightx: 522, bottomright: 508,
      bottomleftx: 490, bottomleft: 525
    },
    switchOptions: ['ageOfResistancePath', 'ageOfReckoningPath']
  },

  {
    id: "choicepoint2",
    coords:{
      topleft: 504, toplefty: 310,
      toprightx: 526, topright: 279,
      bottomrightx: 567, bottomright: 303,
      bottomleftx: 542, bottomleft: 339
    },
    switchOptions: ['ageOfExpansionPath', 'ageOfReckoningPath']
  },
  {
    id: "choicepoint3",
    coords:{
      topleft: 533, toplefty: 758,
      toprightx: 577, topright: 742,
      bottomrightx: 589, bottomright: 785,
      bottomleftx: 544, bottomleft: 803
    },
    switchOptions: ['ageOfResistancePath', 'ageOfLegacyPath']
  },
  {
    id: "choicepoint4",
    coords: {
      topleft: 716, toplefty: 568,
      toprightx: 746, topright: 537,
      bottomrightx: 775, bottomright: 571,
      bottomleftx: 748, bottomleft: 607
    },
    switchOptions: ['ageOfExpansionPath', 'ageOfLegacyPath']
  },
  {
    id: "choicepoint5",
    coords: {
      topleft: 924, toplefty: 292,
      toprightx: 993, topright: 292,
      bottomrightx: 993, bottomright: 313,
      bottomleftx: 924, bottomleft: 313
    },
    switchOptions: ['ageOfReckoningPath', 'ageOfLegacyPath']
  },
  {
    id: "choicepoint6",
    coords: {
      topleft: 930, toplefty: 786,
      toprightx: 994, topright: 786,
      bottomrightx: 994, bottomright: 759,
      bottomleftx: 930, bottomleft: 759
    },
    switchOptions: ['ageOfExpansionPath', 'ageOfResistancePath']
  },
  {
    id: "choicepoint7",
    coords: {
      topleft: 979, toplefty: 513,
      toprightx: 1046, topright: 513,
      bottomrightx: 1046, bottomright: 555,
      bottomleftx: 979, bottomleft: 555
    },
    switchOptions: ['ageOfReckoningPath', 'ageOfResistancePath']
  }
];






