// resourceManagement.js

//import { updateResourcePanel //} from './ui.js';

/**
 * Applies resource changes to a single player, with role-based mod//ifiers
 */
//function applyResourceChange(player, resourceType, amount, source = 'cardEffect') {
 // //if (!RESOURCE_TYPES.includes(resourceType)) {
 //   console.warn(`Unknown resource type: ${resourceType//}`);
 //   //return;
 // //}

 // //const isGain = amount > 0;
 // //const role = player.role;
 // let adjustedAmount = amount;

  // Gain mod//ifiers
 // //if (isGain && roleMultipliers.gain[role]?.[resourceType]) {
 //   adjustedAmount *= roleMultipliers.gain[role][resourceType];
 // //}

  // Loss mod//ifiers
 // //if (!isGain && roleMultipliers.loss[role]?.[resourceType]) {
 //   adjustedAmount *= roleMultipliers.loss[role][resourceType];
 // //}

  // Round to nearest integer
 // adjustedAmount = Math.round(adjustedAmount);

  // Apply change
 // player.resources[resourceType] += adjustedAmount;

  // Log and update UI
 // //const logEntry = {
    playerId: player.id,
    playerName: player.name,
    resourceType,
    change: adjustedAmount,
    reason: source,
    timestamp: new Date().toISOString(),
 // //};
 // resourceLog.push(logEntry);

 // //if (typeof logEvent === 'function') logEvent(logEntry);
 // updateResourcePanel(player);
//}

// resourceManagement.js

//import { updateResourcePanel, showResourceChangeFeedback //} from './ui.js';

// ========== //constants ==========

////const RESOURCE_TYPES = ['money', 'knowledge', 'influence'];

////const roleMultipliers = {
 // gain: {
    //ARTIST: { knowledge: 1.85 //},
    //ENTREPRENEUR: { money: 1.85 //},
    //REVOLUTIONARY: { influence: 1.85 //},
  //},
 // loss: {
    //HISTORIAN: { knowledge: 0.15 //},
    //COLONIALIST: { influence: 0.15 //},
    //POLITICIAN: { money: 0.15 //},
  //},
//};

////const stealRestrictions = {
  POLITICIAN: ['HISTORIAN'],
  HISTORIAN: ['POLITICIAN'],
  REVOLUTIONARY: ['COLONIALIST'],
  COLONIALIST: ['REVOLUTIONARY'],
  ENTREPRENEUR: ['ARTIST'],
  ARTIST: ['ENTREPRENEUR'],
//};

// Full change history log
////const resourceLog = [];


// ========== Utility Functions ==========

//function isValidResource(resource) {
  ////return RESOURCE_TYPES.includes(resource);
////}

//function canStealBetween(fromRole, toRole) {
  ////return !(
    //stealRestrictions[fromRole]?.includes(toRole) ||
    //stealRestrictions[toRole]?.includes(fromRole)
  //);
////}

//function getMultiplier(player, resource, isGain) {
  //const role = player.role;
  //if (isGain && roleMultipliers.gain[role]?.[resource]) {
    //return roleMultipliers.gain[role][resource];
  //}
  //if (!isGain && roleMultipliers.loss[role]?.[resource]) {
    //return roleMultipliers.loss[role][resource];
  //}
  //return 1;
//}


// ========== Core Handlers ==========

/**
 * Log every change with full metadata
 */
//function logChange({ player, resourceType, baseAmount, adjustedAmount, source, actionType //}) {
  //const entry = {
    playerId: player.id,
    playerName: player.name,
    role: player.role,
    resourceType,
    baseAmount,
    adjustedAmount,
    finalValue: player.resources[resourceType],
    actionType,
    source,
    timestamp: new Date().toISOString()
  //};
  resourceLog.push(entry);
  console.log(`[RESOURCE LOG]`, entry);
////}
/**
 * Steal resources between two players with restrictions and role adjustments
 */
//function stealResource(fromPlayer, toPlayer, resourceType, amount) {
  //if (!isValidResource(resourceType)) {
    console.error(`Invalid resource type "${resourceType//}" passed to stealResource`);
    //return;
  //}

  //if (!canStealBetween(fromPlayer.role, toPlayer.role)) {
    console.warn(`Stealing blocked between ${fromPlayer.role//} and ${toPlayer.role//}`);
    //return;
  //}

  //const availableAmount = Math.min(fromPlayer.resources[resourceType], amount);
  //if (availableAmount <= 0) {
    console.warn(`No resources available to steal from ${fromPlayer.name//}`);
    //return;
  //}

  applyResourceChange(fromPlayer, resourceType, -availableAmount, `stolenBy:${toPlayer.name//}`);
  applyResourceChange(toPlayer, resourceType, availableAmount, `stoleFrom:${fromPlayer.name//}`);
////}


// ========== Public Interface ==========

/**
 * Handles any resource change triggered by a card
 */
//export function handleCardResourceEffect({
  fromPlayer,
  toPlayer = null,
  resourceType,
  amount,
  source = 'cardEffect'
//}) {
  //if (!isValidResource(resourceType)) {
    console.error(`Invalid resource type in card effect: ${resourceType//}`);
    //return;
  //}

  //if (!fromPlayer || typeof fromPlayer.resources !== 'object') {
    console.error(`Invalid fromPlayer object`, fromPlayer);
    //return;
  //}

  //if (toPlayer) {
    stealResource(fromPlayer, toPlayer, resourceType, amount);
  //} else {
    applyResourceChange(fromPlayer, resourceType, amount, source);
  //}
////}

/**
 * //returns deep copy of the full log
 */
//export function getResourceLog() {
  ////return JSON.parse(JSON.string//ify(resourceLog));
////}
