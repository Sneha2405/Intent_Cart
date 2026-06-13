// Mock database for scenario matches
const emergencyProducts = {
  baby: {
    title: "Pampers Baby Dry Diapers",
    brand: "Size 3 • 32 Count • Recommended by 94% local parents",
    price: "$12.99",
    rawPrice: 12.99,
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
  },
  headache: {
    title: "Advil Liqui-Gels Pain Reliever",
    brand: "200mg Ibuprofen • 20 Capsules • Fast absorption",
    price: "$6.49",
    rawPrice: 6.49,
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"
  },
  charger: {
    title: "Anker PowerLine USB-C Fast Charger",
    brand: "6ft Durable Braided Nylon • Support 60W Delivery",
    price: "$15.99",
    rawPrice: 15.99,
    img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80"
  },
  baking: {
    title: "Nellie's Free-Range Large Brown Eggs",
    brand: "1 Dozen • Grade A Certified Humane • Local Farm",
    price: "$5.29",
    rawPrice: 5.29,
    img: "https://images.unsplash.com/photo-1516448424440-5db526e14dec?auto=format&fit=crop&w=400&q=80"
  }
};

// Application State
let activeFlow = 'emergency';
let cartItems = [{ title: "Artisanal Spaghetti", price: 4.29 }];
let currentTriageAnswers = {};

// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  setupSwipeOrder('swipe-handle', false);
  setupSwipeOrder('swipe-handle-emergency', true);
});

// Flow / Tab Management
function switchFlow(flowName) {
  activeFlow = flowName;
  
  // Update left sidebar buttons
  document.querySelectorAll('.feature-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-flow') === flowName) {
      btn.classList.add('active');
    }
  });

  // Update bottom navigator buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeNav = document.getElementById(`nav-btn-${flowName}`);
  if (activeNav) activeNav.classList.add('active');

  // Show active screen
  document.querySelectorAll('.screen-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  const screenMap = {
    'emergency': 'screen-emergency',
    'smart-cart': 'screen-smart-cart',
    'intent': 'screen-intent',
    'predictions': 'screen-predictions',
    'decision': 'screen-decision'
  };

  const targetScreen = document.getElementById(screenMap[flowName]);
  if (targetScreen) targetScreen.classList.add('active');
}

// Emergency Mode scenario selection
function selectEmergency(type) {
  const prod = emergencyProducts[type];
  if (!prod) return;

  // Populate dynamic elements
  document.getElementById('emergency-selected-title').innerText = `${capitalizeFirst(type)} Crisis Solved`;
  document.getElementById('emergency-prod-img').src = prod.img;
  document.getElementById('emergency-prod-title').innerText = prod.title;
  document.getElementById('emergency-prod-brand').innerText = prod.brand;
  document.getElementById('emergency-prod-price').innerText = prod.price;

  // Transition to matching screen
  document.querySelectorAll('.screen-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById('screen-emergency-match').classList.add('active');
}

// Helper: capitalize string
function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Simulated Emergency Voice Action
function startEmergencyVoice() {
  selectEmergency('charger');
}

// Smart Cart suggestions
function addSuggestedItem() {
  const item = { title: "Rao's Homemade Marinara", price: 6.49 };
  cartItems.push(item);

  // Update total
  let total = 0;
  cartItems.forEach(i => total += i.price);
  document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;

  // Hide the suggestion card with an animation
  const suggestionCard = document.getElementById('sauce-suggestion');
  suggestionCard.style.transition = "all 0.3s";
  suggestionCard.style.opacity = "0.4";
  suggestionCard.style.transform = "scale(0.9)";
  setTimeout(() => {
    suggestionCard.innerHTML = `<div style="padding: 10px; color: var(--success-green); font-weight: 700; width: 100%; text-align: center;"><i data-lucide="check" style="vertical-align: middle;"></i> Added Rao's Marinara</div>`;
    lucide.createIcons();
    suggestionCard.style.opacity = "1";
    suggestionCard.style.transform = "scale(1)";
  }, 300);
}

// Goal-based intent logic
const goalResponses = {
  party: {
    reply: "Awesome! I've pre-built a 5-member hosting kit based on items in stock at your local Hudson St micro-warehouse. Checkout takes 1 tap.",
    items: [
      { name: "Premium Party Plates (10pk)", price: 4.99 },
      { name: "Original Potato Chips (Party Bag)", price: 5.49 },
      { name: "Coca-Cola Zero Sugar 12-pack", price: 8.99 },
      { name: "Artisanal Cheese & Cracker Tray", price: 12.99 }
    ]
  },
  baking: {
    reply: "Perfect for chocolate chip cookies. I've gathered farm-fresh butter, brown sugar, eggs, and Ghirardelli milk chocolate chips.",
    items: [
      { name: "Nellie's Free-Range Eggs (1 doz)", price: 5.29 },
      { name: "Organic Brown Sugar (1 lb)", price: 3.49 },
      { name: "Kerrygold Salted Butter (8 oz)", price: 4.89 },
      { name: "Ghirardelli Chocolate Chips", price: 5.99 }
    ]
  },
  sick: {
    reply: "Oh no! I've put together a cold relief package with throat lozenges, chamomile tea, raw honey, and Kleenex tissues.",
    items: [
      { name: "Halls Honey Lemon Cough Drops", price: 2.99 },
      { name: "Traditional Medicinals Throat Tea", price: 5.79 },
      { name: "Organic Clover Honey (12 oz)", price: 6.99 },
      { name: "Kleenex Anti-Viral Facial Tissues", price: 3.49 }
    ]
  }
};

function applyGoal(type) {
  const history = document.getElementById('chat-history');
  const suggestions = document.getElementById('goal-suggestions');
  suggestions.style.display = "none";

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<div class="msg-content">${type === 'party' ? 'Hosting a 5-member party' : type === 'baking' ? 'Baking chocolate chip cookies' : 'I have a cold and sore throat'}</div>`;
  history.appendChild(userMsg);
  history.scrollTop = history.scrollHeight;

  // Typings indicator simulated
  setTimeout(() => {
    const data = goalResponses[type];
    
    // Calculate total price
    let total = 0;
    let itemsHtml = '';
    data.items.forEach(i => {
      total += i.price;
      itemsHtml += `<div class="mini-cart-item">
        <span>${i.name}</span>
        <span class="mini-price">$${i.price.toFixed(2)}</span>
      </div>`;
    });

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content">
        <p>${data.reply}</p>
        <div class="mini-cart-grid">
          ${itemsHtml}
        </div>
        <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 0.85rem;">Total ($${total.toFixed(2)})</span>
          <button onclick="triggerQuickPurchase(${total})" style="background: var(--amazon-orange); color: #000; border: none; font-weight: 700; font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; cursor: pointer;">Swipe Order</button>
        </div>
      </div>
    `;
    history.appendChild(botMsg);
    history.scrollTop = history.scrollHeight;
  }, 1000);
}

function sendGoalMessage() {
  const val = document.getElementById('chat-user-input').value.trim();
  if (!val) return;
  document.getElementById('chat-user-input').value = '';

  const history = document.getElementById('chat-history');
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<div class="msg-content">${val}</div>`;
  history.appendChild(userMsg);
  history.scrollTop = history.scrollHeight;

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content">
        I understand you want to: "${val}". Let me find the perfect item at your local micro-fulfillment center.
        <div style="margin-top: 8px;">
          <button onclick="triggerQuickPurchase(14.89)" style="background: var(--amazon-orange); color: #000; border: none; font-weight: 700; font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; cursor: pointer;">One-Tap Order Match ($14.89)</button>
        </div>
      </div>
    `;
    history.appendChild(botMsg);
    history.scrollTop = history.scrollHeight;
  }, 1000);
}

function handleChatKey(event) {
  if (event.key === 'Enter') {
    sendGoalMessage();
  }
}

// AI Need prediction order triggers
function reorderBundle() {
  triggerQuickPurchase(21.80);
}

function triggerQuickPurchase(amount) {
  // Directly bypass page, launch live tracking
  startLiveTracking();
}

// Diaper Guided decision Triage wizard
function selectTriageOption(step, optionText) {
  currentTriageAnswers[step] = optionText;
  
  // Transition to next step
  document.getElementById(`triage-step-${step}`).classList.remove('active');
  const nextStep = document.getElementById(`triage-step-${step + 1}`);
  if (nextStep) {
    nextStep.classList.add('active');
  } else {
    // Generate recommendation result
    document.getElementById('triage-result').classList.add('active');
  }
}

function resetTriage() {
  currentTriageAnswers = {};
  document.querySelectorAll('.triage-step').forEach(step => step.classList.remove('active'));
  document.getElementById('triage-step-1').classList.add('active');
}

// Drag & Swipe buy gesture engine
function setupSwipeOrder(handleId, isEmergency) {
  const handle = document.getElementById(handleId);
  if (!handle) return;
  const track = handle.parentElement;

  let startX = 0;
  let isDragging = false;

  function onStart(e) {
    startX = e.clientX || e.touches[0].clientX;
    isDragging = true;
    handle.style.transition = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;
    const maxDelta = track.clientWidth - handle.clientWidth - 8;
    const currentX = e.clientX || e.touches[0].clientX;
    let deltaX = currentX - startX;
    
    if (deltaX < 0) deltaX = 0;
    if (deltaX > maxDelta) deltaX = maxDelta;

    handle.style.transform = `translateX(${deltaX}px)`;

    // Check for success threshold (90% swipe)
    if (deltaX >= maxDelta * 0.9) {
      isDragging = false;
      handle.style.transform = `translateX(${maxDelta}px)`;
      handle.style.transition = 'transform 0.2s';
      triggerOrderSuccess(isEmergency);
    }
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    // Snap back
    handle.style.transition = 'transform 0.2s ease-out';
    handle.style.transform = 'translateX(0px)';
  }

  handle.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  handle.addEventListener('touchstart', onStart);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onEnd);
}

function triggerOrderSuccess(isEmergency) {
  // Visual checkout feedback
  document.querySelectorAll('.checkout-swipe-container').forEach(c => {
    c.style.opacity = '0.5';
    c.style.pointerEvents = 'none';
  });

  setTimeout(() => {
    startLiveTracking();
    // Reset swipe handle positions
    const h1 = document.getElementById('swipe-handle');
    const h2 = document.getElementById('swipe-handle-emergency');
    if (h1) h1.style.transform = 'translateX(0px)';
    if (h2) h2.style.transform = 'translateX(0px)';
    document.querySelectorAll('.checkout-swipe-container').forEach(c => {
      c.style.opacity = '1';
      c.style.pointerEvents = 'auto';
    });
  }, 600);
}

// Live tracking simulator
let trackTimer = null;
function startLiveTracking() {
  // Show tracking tab
  document.querySelectorAll('.screen-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById('screen-tracking').classList.add('active');

  // Reset steps status visual
  const stepR = document.getElementById('step-received');
  const stepP = document.getElementById('step-packing');
  const stepT = document.getElementById('step-transit');

  stepR.className = "tracking-step done";
  stepP.className = "tracking-step active";
  stepT.className = "tracking-step";

  // Reset Rider Map position
  const rider = document.getElementById('tracker-rider');
  const routeFilled = document.getElementById('route-filled');
  rider.style.top = '100px';
  rider.style.left = '30px';
  routeFilled.setAttribute('stroke-dasharray', '0 1000');

  // Countdown timer simulation
  let duration = 719; // 11:59 mins
  const countdownEl = document.getElementById('tracking-countdown');
  const statusTxt = document.getElementById('tracking-status-text');
  const subTxt = document.getElementById('tracking-sub-text');

  if (trackTimer) clearInterval(trackTimer);

  trackTimer = setInterval(() => {
    if (duration <= 0) {
      clearInterval(trackTimer);
      return;
    }
    duration--;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    countdownEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);

  // Animate GPS dot and steps
  setTimeout(() => {
    // Step 2 complete, Rider in transit
    stepP.className = "tracking-step done";
    stepT.className = "tracking-step active";
    statusTxt.innerText = "Rider in Transit";
    subTxt.innerText = "Simulating GPS live tracking updates";

    // Start Rider icon transition (move along route path)
    rider.style.top = '50px';
    rider.style.left = '140px';
    routeFilled.setAttribute('stroke-dasharray', '150 1000');
  }, 3000);

  setTimeout(() => {
    // Rider near destination
    rider.style.top = '30px';
    rider.style.left = '200px';
    routeFilled.setAttribute('stroke-dasharray', '300 1000');
  }, 6000);

  setTimeout(() => {
    stepT.className = "tracking-step done";
    statusTxt.innerText = "Order Delivered!";
    subTxt.innerText = "Left at door. Enjoy your purchase!";
    rider.style.top = '30px';
    rider.style.left = '230px';
  }, 9000);
}

function resetToHome() {
  if (trackTimer) clearInterval(trackTimer);
  switchFlow('emergency');
}
