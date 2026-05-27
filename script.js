/*
  ════════════════════════════════════════
  NAMASTE. HAUS — CUSTOM BOOKING ENGINE
  VIBRANT CORE LOGIC & GSAP ANIMATIONS
  ════════════════════════════════════════
*/

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbx9hoE3zGi6vbw6wtU6OsmKNJOwFLAOYtUiUO_q1NH4BY1GM05F7YkF4f9GWeNWVa42sA/exec'; // Set your actual URL here

// ════════════════════════════════════════
// 1. DATA OBJECTS & ENGINES
// ════════════════════════════════════════

const bookingState = {
  appointmentType:  null,   // individual / group
  selectedServices: [],     // array of service objects
  selectedStaff:    null,     // staff object
  selectedDate:     null,     // Date object
  selectedTime:     null,     // e.g., "10:30 AM"
  currentStep:      1,
  promoCode:        '',
  discountAmount:   0,
  totalPrice:       0,
  finalPrice:       0,
  
  // Group Booking participant fields
  groupParticipants: [],    // Array of { id: number, name: string, services: [] }
  activeParticipantId: null
};

const services = {
  featured: [
    {id:'promo-gel-mani-pedi', category:'featured', name:'[PROMO] Gel Mani + Gel Pedi', duration:'2hr', durationMins:120, price:218, badge:'Hot Deal', savePercent:null, description:'Long-lasting chip-free shine on both hands and feet.'},
    {id:'lash-gel-bundle', category:'featured', name:'Lash Lift + Gel Mani Pedi', duration:'3hr 15min', durationMins:195, price:350, badge:'Save 12%', savePercent:12, description:'Lash lift combined with full gel mani and pedi experience.'},
    {id:'xtips-lash-bundle', category:'featured', name:'Gel Xtips + Lash Lift', duration:'3hr', durationMins:180, price:330, badge:'Save 6%', savePercent:6, description:'Gel extensions combined with a refreshing lash lift.'},
    {id:'wellness', category:'featured', name:'Fall Into Wellness (3 services)', duration:'2hr', durationMins:120, price:180, badge:'Bundle', description:'Three rejuvenating services in one luxurious session.'},
    {id:'feat-gel-mani', category:'featured', name:'Gel Manicure (Featured)', duration:'1hr 15min', durationMins:75, price:118, badge:'Most Booked', description:'Glossy, durable, chip-free nails for any occasion.'},
    {id:'feat-lash-lift', category:'featured', name:'Lash Lift (Featured)', duration:'1hr', durationMins:60, price:150, badge:'Staff Fave', description:'Lifts and curls your natural lashes for wide-eyed effect.'}
  ],
  manicure: [
    {id:'gel-spa-mani', category:'manicure', name:'Gel Spa Mani', duration:'1hr', durationMins:60, price:178, description:'Hand spa with hydrating mask plus long-lasting gel formula.'},
    {id:'gel-mani', category:'manicure', name:'Gel Manicure', duration:'1hr 15min', durationMins:75, price:118, badge:'Most Booked', description:'Glossy, durable, chip-free nails for any occasion.'},
    {id:'gel-removal', category:'manicure', name:'Gel Removal', duration:'1hr', durationMins:60, price:30, pricePrefix:'from', description:'Gentle removal keeping your natural nails healthy.'},
    {id:'buff-mani', category:'manicure', name:'Buff Manicure', duration:'45min', durationMins:45, price:65, description:'Natural nail buffing and shaping for a clean finish.'}
  ],
  pedicure: [
    {id:'gel-spa-pedi', category:'pedicure', name:'Gel Spa Pedi', duration:'1hr', durationMins:60, price:178, description:'Full foot spa treatment with gel colour finish.'},
    {id:'gel-pedi', category:'pedicure', name:'Gel Pedicure', duration:'1hr 15min', durationMins:75, price:118, description:'Chip-free glossy gel finish for your feet.'},
    {id:'buff-pedi', category:'pedicure', name:'Buff Pedicure', duration:'45min', durationMins:45, price:65, description:'Natural buffing and shaping for clean healthy nails.'}
  ],
  extensions: [
    {id:'xtips-full', category:'extensions', name:'X Tips Extensions (FULL tip)', duration:'2hr', durationMins:120, price:200, description:'Full tip extensions adding length and strength naturally.'},
    {id:'gel-xtips', category:'extensions', name:'Gel X Tips', duration:'2hr', durationMins:120, price:180, description:'Gel-based extensions for a lightweight flawless look.'}
  ],
  lash: [
    {id:'lash-lift', category:'lash', name:'Lash Lift', duration:'1hr', durationMins:60, price:150, badge:'Staff Fave', description:'Lifts and curls your natural lashes for wide-eyed effect.'}
  ],
  lashExtensions: [
    {id:'classic-natural', category:'lashExtensions', name:'Classic Natural', duration:'1hr', durationMins:60, price:200, description:'Subtle short extensions for a soft refined look.'},
    {id:'w-spike-volume', category:'lashExtensions', name:'W Spike Mini Volume', duration:'1hr', durationMins:60, price:228, badge:'New', description:'Triple-split lash design for enhanced volume and drama.'},
    {id:'cosmic', category:'lashExtensions', name:'Cosmic', duration:'1hr', durationMins:60, price:25, description:'Cosmic-style lash extensions for a bold statement look.'},
    {id:'colour-lash', category:'lashExtensions', name:'Colour Lash', duration:'1hr', durationMins:60, price:80, description:'Coloured lash extensions to express your personality.'}
  ],
  addOns: [
    {id:'gel-removal-addon', category:'addOns', name:'Gel Removal', duration:'1hr', durationMins:60, price:30, pricePrefix:'from', description:'Gentle removal keeping your natural nails healthy.'},
    {id:'ext-removal', category:'addOns', name:'Extensions Removal', duration:'1hr', durationMins:60, price:80, pricePrefix:'from', description:'Careful removal protecting your natural nail bed.'}
  ],
  hairRemoval: [
    {id:'lip-wax', category:'hairRemoval', name:'Upper Lip Waxing', duration:'1hr', durationMins:60, price:30, description:'Quick and precise upper lip hair removal.'},
    {id:'armpit-wax', category:'hairRemoval', name:'Armpit Waxing', duration:'1hr', durationMins:60, price:50, description:'Smooth clean armpit waxing with minimal discomfort.'}
  ],
  men: [
    {id:'men-buff-mani', category:'men', name:'Buff Manicure (Men)', duration:'45min', durationMins:45, price:65, description:'Clean natural nail grooming for men.'},
    {id:'men-buff-pedi', category:'men', name:'Buff Pedicure (Men)', duration:'45min', durationMins:45, price:65, description:'Clean natural nail grooming for men feet.'}
  ],
  hotDeals: [
    {id:'deal-gel-xtips-lash', category:'hotDeals', name:'Gel Xtips + Lash Lift', duration:'3hr', durationMins:180, price:330, badge:'Save 6%', savePercent:6, description:'Gel extensions combined with a refreshing lash lift.'},
    {id:'deal-lash-gel-bundle', category:'hotDeals', name:'Lash Lift + Gel Mani Pedi', duration:'3hr 15min', durationMins:195, price:350, badge:'Save 12%', savePercent:12, description:'Lash lift combined with full gel mani and pedi experience.'},
    {id:'deal-wellness', category:'hotDeals', name:'Fall Into Wellness (3 services)', duration:'2hr', durationMins:120, price:180, badge:'Bundle', description:'Three rejuvenating services in one luxurious session.'},
    {id:'deal-promo-gel-mani-pedi', category:'hotDeals', name:'[PROMO] Gel Mani + Gel Pedi', duration:'2hr', durationMins:120, price:218, badge:'Hot Deal', description:'Long-lasting chip-free shine on both hands and feet.'}
  ]
};

const staff = [
  {
    id: 'no-pref', 
    name: 'No Preference', 
    subtitle: 'Maximum availability', 
    speciality: 'Any service', 
    signature: 'We will match you with the best available professional.', 
    photo: null,
    bio: 'Our system will select the absolute best available professional for your specific set of services, ensuring maximum slot availability and zero wait times.',
    reviews: []
  },
  {
    id: 'livia', 
    name: 'Livia', 
    subtitle: 'Nail Specialist', 
    speciality: 'Gel, Manicure, Pedicure', 
    signature: 'Precision in every stroke.', 
    photo: 'staff-livia.jpg',
    bio: 'Livia has over 6 years of experience in luxury nail therapy. Specializing in precision gel work and advanced cuticle care, she is dedicated to maintaining the health and natural beauty of your nails.',
    reviews: [
      { stars: 5, text: 'Livia is incredibly precise! My gel nails lasted 4 weeks without a single chip!', author: 'Michelle W.' },
      { stars: 5, text: 'Clean, precise, and extremely professional. The best mani-pedi in KL!', author: 'Joanne L.' }
    ]
  },
  {
    id: 'deni', 
    name: 'Deni', 
    subtitle: 'Nail Art Specialist', 
    speciality: 'Nail Art, Extensions', 
    signature: 'Where art meets your nails.', 
    photo: 'staff-deni.jpg',
    bio: "Deni is an artist at heart, bringing custom illustrations, hand-painted details, and avant-garde designs to your fingertips. With 5+ years of nail art engineering, she transforms nails into wearable art.",
    reviews: [
      { stars: 5, text: "A literal master of nail art. Deni can paint anything perfectly!", author: 'Rachel G.' },
      { stars: 5, text: "Stunning designs, every single time. She's creative and so gentle.", author: 'Tasha M.' }
    ]
  },
  {
    id: 'hannah', 
    name: 'Hannah', 
    subtitle: 'Lash Specialist', 
    speciality: 'Lash Lift, Lash Extensions', 
    signature: 'Your comfort is my canvas.', 
    photo: 'staff-hannah.jpg',
    bio: 'Hannah is a certified lash technician specializing in keratin lash lifts and high-retention classic natural extensions. She focuses on custom mapping to enhance your unique eye shape.',
    reviews: [
      { stars: 5, text: 'Hannah is so gentle, I fell asleep! My lash lift is gorgeous and lasted 6 weeks.', author: 'Priya S.' },
      { stars: 5, text: 'Absolutely flawless lash extensions. Super lightweight and natural!', author: 'Sarah D.' }
    ]
  }
];

const upsellMap = {
  'gel-mani':    ['gel-pedi','gel-removal'],
  'gel-pedi':    ['gel-mani','gel-removal'],
  'xtips-full':  ['ext-removal','gel-removal'],
  'gel-xtips':   ['ext-removal'],
  'lash-lift':   ['lash-gel-bundle'],
  'classic-natural':['colour-lash'],
  'buff-mani':   ['buff-pedi']
};

const promoCodes = {
  'WELCOME10': {type:'percent', value:10},
  'MAMA20':    {type:'percent', value:20},
  'NEWHAUS':   {type:'flat',    value:30}
};

// Available time slots (10:00 AM to 6:30 PM, 30-min intervals)
const baseTimeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

// Date and Time Helper Calendar Variables
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// ════════════════════════════════════════
// 2. PAGE ENTRY / INITIAL STATE / APP OVERVIEW
// ════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  checkStoreLiveStatus();
  setInterval(checkStoreLiveStatus, 60000); // Check live status every minute

  // sessionStorage Splash Screen check
  const splash = document.getElementById('splash-screen');
  if (sessionStorage.getItem('splashSeen')) {
    splash.style.display = 'none';
    showStep(1);
  } else {
    // Show splash screen, then fade out
    sessionStorage.setItem('splashSeen', '1');
    gsap.from("#splash-logo", {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
    
    gsap.to("#splash-logo", {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.2
    });

    gsap.to(".splash-tagline", {
      opacity: 1,
      duration: 0.8,
      delay: 1.2
    });

    setTimeout(() => {
      gsap.to("#splash-screen", {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          splash.style.display = 'none';
          showStep(1);
        }
      });
    }, 2800);
  }

  // Set default payment method to Pay at Salon
  bookingState.paymentMethod = 'pay-at-salon';
  
  // Parallax Scroll Effect
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroImage = document.getElementById('entry-hero-image');
    if (heroImage && bookingState.currentStep === 1) {
      heroImage.style.transform = `translateY(${y * 0.3}px)`;
    }
    
    // Step 4 parallax calendar background
    const calParallax = document.getElementById('calendar-parallax-bg');
    if (calParallax && bookingState.currentStep === 4) {
      calParallax.style.transform = `translateY(${(y - calParallax.parentElement.offsetTop) * 0.3}px)`;
    }

    // Dynamic Butter-Smooth Parallax Lag Cart Panel floating
    const cartPanel = document.querySelector('.cart-preview-panel');
    if (cartPanel && window.innerWidth > 768 && bookingState.currentStep >= 2 && bookingState.currentStep <= 5) {
      const container = document.querySelector('.wizard-layout');
      // Max offset constraints to prevent collision with other sections at the absolute bottom
      const maxOffset = container ? (container.offsetHeight - cartPanel.offsetHeight - 40) : 1000;
      const targetY = Math.min(Math.max(0, y * 0.42), Math.max(0, maxOffset));
      
      gsap.to(cartPanel, {
        y: targetY,
        duration: 0.85,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  });
}

// Store Live Open/Closed checks
function checkStoreLiveStatus() {
  const date = new Date();
  // KL timezone calculation (UTC +8)
  const localTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (3600000 * 8));
  
  const day = localTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const hour = localTime.getHours();
  
  const statusDot = document.getElementById('live-status-dot');
  const statusText = document.getElementById('live-status-text');
  
  if (day === 0) {
    // Sunday closed
    statusDot.className = 'status-dot closed';
    statusText.innerText = 'Closed · Opens Mon 10AM';
  } else if (hour >= 10 && hour < 19) {
    // Mon-Sat 10AM-7PM open
    statusDot.className = 'status-dot open';
    statusText.innerText = 'Open now';
  } else {
    // Mon-Sat closed
    statusDot.className = 'status-dot closed';
    if (day === 6) {
      statusText.innerText = 'Closed · Opens Mon 10AM';
    } else {
      statusText.innerText = `Closed · Opens tomorrow 10AM`;
    }
  }
}

// ════════════════════════════════════════
// 3. STEP MANAGEMENT & ANIMATION ENGINE
// ════════════════════════════════════════

function showStep(stepNumber) {
  const prevStep = bookingState.currentStep;
  bookingState.currentStep = stepNumber;
  
  const allSections = [
    document.getElementById('step-1'),
    document.getElementById('main-wizard-container'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4'),
    document.getElementById('step-5'),
    document.getElementById('step-6')
  ];

  // Header display check: visible starting at Step 2 (wizard) up to Step 5
  const header = document.querySelector('.header-minimal');
  if (stepNumber >= 2 && stepNumber <= 5) {
    header.style.display = 'flex';
  } else {
    header.style.display = 'none';
  }

  // Track event in Google Analytics
  const stepsMap = {
    1: 'entry',
    2: 'services',
    3: 'staff',
    4: 'datetime',
    5: 'review',
    6: 'confirmation'
  };
  if (stepsMap[stepNumber]) {
    trackStepView(stepNumber, stepsMap[stepNumber]);
  }

  // Handle take-over screens (Step 1, Main Wizard container, Step 6 confirmation)
  if (stepNumber === 1) {
    allSections.forEach(s => s.style.display = 'none');
    const step1 = document.getElementById('step-1');
    step1.style.display = 'grid';
    animateStep1Entrance();
  } else if (stepNumber === 6) {
    allSections.forEach(s => s.style.display = 'none');
    const step6 = document.getElementById('step-6');
    step6.style.display = 'flex';
    animateConfirmationScreen();
  } else {
    // Wizard layouts
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-6').style.display = 'none';
    
    const wizardMain = document.getElementById('main-wizard-container');
    wizardMain.style.display = 'block';

    const nextContainer = document.getElementById(`step-${stepNumber}`);
    
    // Hide other inner wizard containers
    for (let i = 2; i <= 5; i++) {
      if (i !== stepNumber) {
        document.getElementById(`step-${i}`).style.display = 'none';
      }
    }
    
    nextContainer.style.display = 'block';
    
    // Smooth horizontal glide & fade transition for the entire step screen
    gsap.fromTo(nextContainer,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
    );
    
    // Trigger entrance animation for this sub-step
    animateSubStepEntrance(nextContainer);
    
    // Load step contents dynamically
    loadStepDynamicContents(stepNumber);
    
    // Refresh cart bindings and updates
    updateCartDisplay();
  }
}

function animateStep1Entrance() {
  const parent = document.getElementById('step-1');
  const label = parent.querySelector('.t-label');
  const heading = parent.querySelector('.t-hero');
  const body = parent.querySelector('.t-editorial');
  const social = parent.querySelector('.social-proof-strip');
  const cta = parent.querySelector('.entry-options-stack');

  gsap.set([label, heading, body, social, cta], { opacity: 0 });
  gsap.set(heading, { y: 32 });
  gsap.set(body, { y: 24 });
  gsap.set(label, { y: 16 });
  gsap.set(social, { y: 12 });
  gsap.set(cta, { y: 20 });

  // Luxurious ambient breathing animation on the portrait photo and backdrop blur in sync
  gsap.to("#entry-hero-image", {
    scale: 1.015, // Extremely subtle 1.5% zoom so it doesn't crop the lady photo
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
  
  gsap.to(".hero-image-blur-underlay", {
    scale: 1.05,
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.8 }
  });
  tl.to(label,  { opacity: 1, y: 0 })
    .to(heading, { opacity: 1, y: 0 }, "-=0.5")
    .to(body,    { opacity: 1, y: 0 }, "-=0.4")
    .to(social,  { opacity: 1, y: 0 }, "-=0.4")
    .to(cta,     { opacity: 1, y: 0 }, "-=0.3")
    .add(() => {
      // Gentle, breathing staggered floating loops for option cards to feel tactile and alive
      gsap.to(".option-selection-card", {
        y: -6,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });
    });
}

function animateSubStepEntrance(container) {
  const label = container.querySelector('.step-tag');
  const heading = container.querySelector('.step-title');
  const body = container.querySelector('.step-editorial');
  
  if (!label || !heading) return;

  gsap.set([label, heading, body], { opacity: 0 });
  gsap.set(heading, { y: 32 });
  if (body) gsap.set(body, { y: 24 });
  gsap.set(label, { y: 16 });

  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.8 }
  });
  tl.to(label,  { opacity: 1, y: 0 })
    .to(heading, { opacity: 1, y: 0 }, "-=0.5");
  if (body) {
    tl.to(body, { opacity: 1, y: 0 }, "-=0.4");
  }
}

function navigateToNextStep() {
  const current = bookingState.currentStep;
  if (current === 2 && bookingState.selectedServices.length > 0) {
    showStep(3);
  } else if (current === 3 && bookingState.selectedStaff !== null) {
    showStep(4);
  } else if (current === 4 && bookingState.selectedDate !== null && bookingState.selectedTime !== null) {
    showStep(5);
  }
}

function loadStepDynamicContents(stepNumber) {
  if (stepNumber === 2) {
    renderGroupParticipantManager();
    renderCategoryTabs();
    renderServiceCards('featured'); // default category
  } else if (stepNumber === 3) {
    renderStaffCards();
  } else if (stepNumber === 4) {
    renderCalendarGrid();
  } else if (stepNumber === 5) {
    renderReviewSummary();
    validateConfirmButtonState();
  }
}

// ════════════════════════════════════════
// 4. STEP 2: CATEGORY FILTERING & DYNAMIC CARDS
// ════════════════════════════════════════

function renderCategoryTabs() {
  const categoriesRow = document.getElementById('categories-tabs-row');
  if (!categoriesRow) return;
  
  const labelsMap = {
    featured: 'Featured',
    manicure: 'Manicure',
    pedicure: 'Pedicure',
    extensions: 'Extensions',
    lash: 'Lash',
    lashExtensions: 'Lash Extensions',
    addOns: 'Add Ons',
    hairRemoval: 'Hair Removal',
    men: 'Men',
    hotDeals: 'Hot Deals'
  };

  categoriesRow.innerHTML = '';
  Object.keys(services).forEach(catKey => {
    const activeClass = (catKey === 'featured') ? 'active' : '';
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `pill-tab ${activeClass}`;
    tab.innerText = labelsMap[catKey] || catKey;
    tab.setAttribute('onclick', `switchCategoryTab('${catKey}', this)`);
    categoriesRow.appendChild(tab);
  });
}

function switchCategoryTab(categoryKey, tabNode) {
  // Toggle active styling
  const allTabs = document.querySelectorAll('.pill-tab');
  allTabs.forEach(t => t.classList.remove('active'));
  tabNode.classList.add('active');

  const servicesGrid = document.getElementById('services-grid-list');
  
  // Tab switch fading animation
  gsap.fromTo(servicesGrid, 
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
  );

  renderServiceCards(categoryKey);
}

function renderServiceCards(categoryKey) {
  const servicesGrid = document.getElementById('services-grid-list');
  if (!servicesGrid) return;
  
  servicesGrid.innerHTML = '';
  const list = services[categoryKey] || [];
  
  // Section Editorial Moment headers
  const editorialMoments = {
    manicure: "Precision in every stroke. ✨",
    lash: "Lift your look, lift your day.",
    extensions: "Details that don't go unnoticed."
  };
  
  if (editorialMoments[categoryKey]) {
    const editNode = document.createElement('div');
    editNode.className = 't-editorial';
    editNode.style.textAlign = 'center';
    editNode.style.padding = '32px 0 12px';
    editNode.innerText = editorialMoments[categoryKey];
    servicesGrid.appendChild(editNode);
  }

  list.forEach(srv => {
    const isSelected = bookingState.appointmentType === 'group'
      ? (bookingState.groupParticipants.find(p => p.id === bookingState.activeParticipantId)?.services.some(s => s.id === srv.id) || false)
      : bookingState.selectedServices.some(s => s.id === srv.id);
    const cardSelectedClass = isSelected ? 'selected' : '';
    const buttonIcon = isSelected ? '✓' : '+';
    const buttonAddedClass = isSelected ? 'added' : '';
    
    // Assign thumbnail photo assets dynamically based on categories
    let imageSrc = 'photo-2.jpg';
    if (srv.category === 'pedicure') imageSrc = 'photo-3.jpg';
    if (srv.category === 'lash' || srv.category === 'lashExtensions') imageSrc = 'photo-4.jpg';
    if (srv.category === 'extensions') imageSrc = 'photo-5.jpg';
    if (srv.category === 'featured' || srv.category === 'hotDeals') {
      if (srv.id === 'promo-gel-mani-pedi' || srv.id === 'deal-promo-gel-mani-pedi') imageSrc = 'photo-2.jpg';
      if (srv.id === 'lash-gel-bundle' || srv.id === 'deal-lash-gel-bundle') imageSrc = 'photo-4.jpg';
      if (srv.id === 'xtips-lash-bundle' || srv.id === 'deal-gel-xtips-lash') imageSrc = 'photo-5.jpg';
      if (srv.id === 'wellness' || srv.id === 'deal-wellness') imageSrc = 'photo-3.jpg';
    }

    const card = document.createElement('div');
    card.className = `service-card ${cardSelectedClass}`;
    card.id = `srv-card-${srv.id}`;
    card.setAttribute('onclick', `toggleServiceSelection('${srv.id}', '${categoryKey}', event)`);
    
    let badgeHTML = '';
    if (srv.badge) {
      let badgeType = 'fave';
      if (srv.badge.includes('Deal') || srv.badge.includes('Hot')) badgeType = 'deal';
      if (srv.badge.includes('%')) badgeType = 'save';
      if (srv.badge.includes('New')) badgeType = 'new';
      badgeHTML = `<span class="badge-service ${badgeType}">${srv.badge}</span>`;
    }

    const pricePrefixText = srv.pricePrefix ? `${srv.pricePrefix} ` : '';

    card.innerHTML = `
      <div class="service-thumbnail-container skeleton">
        ${badgeHTML}
        <img src="${imageSrc}" alt="${srv.name}" onload="this.parentElement.classList.remove('skeleton')">
      </div>
      
      <div class="service-card-info">
        <h3>${srv.name}</h3>
        <p class="desc">${srv.description}</p>
        
        <div class="service-card-footer">
          <div class="left-block">
            <span class="price-text">${pricePrefixText}MYR ${srv.price}</span>
            <span class="duration-text"><i class="fa-regular fa-clock"></i> ${srv.duration}</span>
          </div>
        </div>
      </div>
      
      <div class="service-card-action">
        <button type="button" class="add-service-circle-btn ${buttonAddedClass}" onclick="toggleServiceSelection('${srv.id}', '${categoryKey}', event)">
          ${buttonIcon}
        </button>
      </div>
    `;

    servicesGrid.appendChild(card);
    
    // Render inline upsell card suggestions if this card was previously selected
    if (isSelected) {
      renderInlineUpsellCard(srv.id, card);
    }
  });

  // Inject luxury gold-tinted prompt banner if active guest has selected services
  if (bookingState.appointmentType === 'group') {
    const activeGuest = bookingState.groupParticipants.find(p => p.id === bookingState.activeParticipantId);
    if (activeGuest && activeGuest.services.length > 0) {
      const banner = document.createElement('div');
      banner.className = 'group-prompt-banner';
      banner.innerHTML = `
        <div class="prompt-text">
          <i class="fa-solid fa-user-group"></i>
          <div>
            <h4>Group Booking Progress</h4>
            <p>Select services for another person, or proceed to choose a professional.</p>
          </div>
        </div>
        <div class="prompt-actions">
          <button type="button" class="btn-group-action add" onclick="addGroupParticipant()">+ Add Person</button>
          <button type="button" class="btn-group-action continue" onclick="navigateToNextStep()">Continue <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      `;
      servicesGrid.appendChild(banner);
    }
  }

  // Dynamic card entrance animation (smooth and reliable transition on load/tab switch)
  gsap.fromTo(".service-card", 
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }
  );

  if (bookingState.appointmentType === 'group') {
    gsap.fromTo(".group-prompt-banner",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power3.out" }
    );
  }
}

function toggleServiceSelection(serviceId, categoryKey, event) {
  if (event) event.stopPropagation();

  // Find service object
  let srvObject = null;
  for (const cat in services) {
    const matched = services[cat].find(s => s.id === serviceId);
    if (matched) {
      srvObject = matched;
      break;
    }
  }

  if (!srvObject) return;

  const cardNode = document.getElementById(`srv-card-${serviceId}`);
  const btnNode = cardNode ? cardNode.querySelector('.add-service-circle-btn') : null;

  if (bookingState.appointmentType === 'group') {
    const guest = bookingState.groupParticipants.find(p => p.id === bookingState.activeParticipantId);
    if (!guest) return;

    const existingIndex = guest.services.findIndex(s => s.id === serviceId);
    if (existingIndex >= 0) {
      // Remove service from guest
      guest.services.splice(existingIndex, 1);
      if (cardNode) cardNode.classList.remove('selected');
      if (btnNode) {
        btnNode.innerText = '+';
        btnNode.classList.remove('added');
      }
      
      const upsellBox = document.getElementById(`upsell-container-${serviceId}`);
      if (upsellBox) upsellBox.remove();
    } else {
      // Add service to guest
      guest.services.push(srvObject);
      if (cardNode) cardNode.classList.add('selected');
      if (btnNode) {
        btnNode.innerText = '✓';
        btnNode.classList.add('added');
        gsap.fromTo(btnNode, 
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
        );
      }
      if (cardNode) {
        gsap.to(cardNode, {
          borderColor: "#2D5C3E",
          boxShadow: "0 0 0 4px rgba(45,92,62,0.15)",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      }
      if (cardNode) {
        renderInlineUpsellCard(serviceId, cardNode);
      }
      trackServiceAdded(srvObject);
    }
    syncGroupSelectedServices();
  } else {
    // Individual flow
    const index = bookingState.selectedServices.findIndex(s => s.id === serviceId);
    if (index >= 0) {
      // Remove service
      bookingState.selectedServices.splice(index, 1);
      if (cardNode) cardNode.classList.remove('selected');
      if (btnNode) {
        btnNode.innerText = '+';
        btnNode.classList.remove('added');
      }
      
      const upsellBox = document.getElementById(`upsell-container-${serviceId}`);
      if (upsellBox) upsellBox.remove();
    } else {
      // Add service
      bookingState.selectedServices.push(srvObject);
      if (cardNode) cardNode.classList.add('selected');
      if (btnNode) {
        btnNode.innerText = '✓';
        btnNode.classList.add('added');
        gsap.fromTo(btnNode, 
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
        );
      }
      if (cardNode) {
        gsap.to(cardNode, {
          borderColor: "#2D5C3E",
          boxShadow: "0 0 0 4px rgba(45,92,62,0.15)",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      }
      if (cardNode) {
        renderInlineUpsellCard(serviceId, cardNode);
      }
      trackServiceAdded(srvObject);
    }
  }

  updateCartDisplay();
}

function renderInlineUpsellCard(serviceId, parentCardNode) {
  // Remove duplicate suggestions if they exist
  const existing = document.getElementById(`upsell-container-${serviceId}`);
  if (existing) existing.remove();

  const upMapped = upsellMap[serviceId];
  if (!upMapped || upMapped.length === 0) return;

  // Select first mapped recommendation item not already selected
  let targetUpsellSrv = null;
  for (const itemKey of upMapped) {
    if (!bookingState.selectedServices.some(s => s.id === itemKey)) {
      // Find object
      for (const cat in services) {
        const found = services[cat].find(s => s.id === itemKey);
        if (found) {
          targetUpsellSrv = found;
          break;
        }
      }
    }
    if (targetUpsellSrv) break;
  }

  if (!targetUpsellSrv) return;

  const upsellBox = document.createElement('div');
  upsellBox.className = 'upsell-suggestion-card';
  upsellBox.id = `upsell-container-${serviceId}`;
  
  upsellBox.innerHTML = `
    <span class="upsell-label">Complete the look → <em>Add ${targetUpsellSrv.name} (MYR ${targetUpsellSrv.price})</em></span>
    <button type="button" onclick="addUpsellServiceClick('${targetUpsellSrv.id}', '${serviceId}')">+ Add</button>
  `;
  
  // Insert immediately after parent card
  parentCardNode.insertAdjacentElement('afterend', upsellBox);
  
  // Fade in animation
  gsap.fromTo(upsellBox,
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
  );
}

function addUpsellServiceClick(upsellId, originalServiceId) {
  // Add recommended service
  toggleServiceSelection(upsellId);
  
  // Close suggestion banner
  const banner = document.getElementById(`upsell-container-${originalServiceId}`);
  if (banner) {
    gsap.to(banner, {
      opacity: 0,
      height: 0,
      padding: 0,
      marginTop: 0,
      duration: 0.3,
      onComplete: () => banner.remove()
    });
  }
}

// ════════════════════════════════════════
// 5. STICKY PREVIEW CART MANAGER
// ════════════════════════════════════════

function updateCartDisplay() {
  const selectedItemsNode = document.getElementById('cart-selected-items-node');
  const cloneDrawerItemsNode = document.getElementById('mobile-drawer-cloned-cart-items');
  const contNavBtn = document.getElementById('cart-continue-navigation-btn');
  const mobStickyBtn = document.getElementById('mobile-cart-continue-btn');
  const mobItemCountLabel = document.getElementById('mobile-cart-items-count-label');
  const mobTotalLabel = document.getElementById('mobile-cart-total-label');
  const drawerTotalLabel = document.getElementById('mobile-drawer-total-label');
  const promoSectionNode = document.getElementById('cart-promo-input-section');
  const promoToggleLink = document.getElementById('promo-codes-toggle-link');

  if (!selectedItemsNode) return;

  const count = bookingState.selectedServices.length;

  // Handle navigation activation buttons
  if (count > 0) {
    contNavBtn.disabled = false;
    mobStickyBtn.disabled = false;
    promoSectionNode.style.display = 'block';
    promoToggleLink.style.display = 'none';
  } else {
    contNavBtn.disabled = true;
    mobStickyBtn.disabled = true;
    promoSectionNode.style.display = 'none';
    promoToggleLink.style.display = 'block';
    bookingState.promoCode = '';
    bookingState.discountAmount = 0;
  }

  // Calculate pricing sums
  const baseSum = bookingState.selectedServices.reduce((acc, s) => acc + s.price, 0);
  bookingState.totalPrice = baseSum;
  bookingState.finalPrice = Math.max(0, baseSum - bookingState.discountAmount);

  // Trigger price counting transition
  animateCartPriceNode('cart-total-price-label', bookingState.finalPrice);
  animateCartPriceNode('qr-amount-label', bookingState.finalPrice);
  
  if (mobTotalLabel) mobTotalLabel.innerText = `MYR ${bookingState.finalPrice}`;
  if (drawerTotalLabel) drawerTotalLabel.innerText = `MYR ${bookingState.finalPrice}`;
  if (mobItemCountLabel) {
    mobItemCountLabel.innerText = count === 1 ? '1 Service Selected' : `${count} Services Selected`;
  }

  // Display discounts row if applied
  const discountRow = document.getElementById('cart-summary-discounts-row');
  const discountVal = document.getElementById('cart-summary-discounts-value');
  if (bookingState.discountAmount > 0) {
    discountRow.style.display = 'flex';
    discountVal.innerText = `-MYR ${bookingState.discountAmount}`;
  } else {
    discountRow.style.display = 'none';
  }

  // Build cart item rows HTML
  const buildCartListHTML = () => {
    if (count === 0) {
      return `
        <div class="cart-empty-state">
          <i class="fa-solid fa-scissors"></i>
          <p>No services selected yet</p>
          <span style="font-size: 11px; color: var(--muted);">Add a service to get started</span>
        </div>
      `;
    }

    let itemsHTML = '';
    bookingState.selectedServices.forEach(s => {
      const staffName = bookingState.selectedStaff ? bookingState.selectedStaff.name : 'No Preference';
      const guestLabel = s.guestName ? ` <em style="font-family: Georgia, serif; font-size: 11px; color: var(--muted); font-style: italic;">(${s.guestName})</em>` : '';
      const removeArgs = s.guestId ? `'${s.id.split('-guest-')[0]}', '${s.guestId}'` : `'${s.id}', ''`;
      
      itemsHTML += `
        <div class="cart-item-row" id="cart-row-${s.id}">
          <div class="cart-item-details">
            <h4>${s.name}${guestLabel}</h4>
            <span><i class="fa-regular fa-clock"></i> ${s.duration} · Spec: ${staffName}</span>
          </div>
          <div class="cart-item-price-block">
            <span>MYR ${s.price}</span>
            <button type="button" class="cart-item-remove-btn" onclick="removeCartItem(${removeArgs})"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `;
    });
    return itemsHTML;
  };

  const htmlContent = buildCartListHTML();
  selectedItemsNode.innerHTML = htmlContent;

  // Sync contents to the slide mobile drawer clones if open
  if (cloneDrawerItemsNode) {
    cloneDrawerItemsNode.innerHTML = htmlContent;
  }
}

function animateCartPriceNode(elementId, newTotal) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const currentVal = parseInt(el.innerText.replace(/[^0-9]/g, '')) || 0;
  
  // Interpolated counting GSAP animations
  gsap.to(el, {
    innerText: newTotal,
    duration: 0.6,
    snap: { innerText: 1 },
    ease: "power2.out",
    onUpdate: function () {
      el.innerText = `MYR ${Math.floor(el.innerText)}`;
    }
  });
}

function togglePromoInputField() {
  const block = document.getElementById('cart-promo-input-section');
  block.style.display = block.style.display === 'none' ? 'block' : 'none';
}

function applyPromoCodeInput() {
  const inputEl = document.getElementById('promo-code-input');
  const feedbackNode = document.getElementById('promo-feedback-text-node');
  
  if (!inputEl || !inputEl.value) return;
  const code = inputEl.value.toUpperCase().trim();

  const match = promoCodes[code];
  feedbackNode.style.display = 'block';

  if (match) {
    feedbackNode.className = 'promo-feedback-text success';
    
    let calcDiscount = 0;
    if (match.type === 'percent') {
      calcDiscount = Math.round((bookingState.totalPrice * (match.value / 100)));
    } else {
      calcDiscount = match.value;
    }

    bookingState.promoCode = code;
    bookingState.discountAmount = calcDiscount;
    bookingState.finalPrice = Math.max(0, bookingState.totalPrice - calcDiscount);
    
    feedbackNode.innerHTML = `<i class="fa-solid fa-circle-check"></i> Code applied! Saved MYR ${calcDiscount} 🎉`;
    
    updateCartDisplay();
  } else {
    feedbackNode.className = 'promo-feedback-text error';
    feedbackNode.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Invalid promo code`;
    document.getElementById('promo-code-input').style.borderColor = '#C4756A';
    
    bookingState.promoCode = '';
    bookingState.discountAmount = 0;
    
    updateCartDisplay();
  }
}

// Mobile Slide Cart Expand / Collapse
function expandMobileCartDrawer() {
  const overlay = document.getElementById('mobile-cart-drawer-overlay-node');
  const drawer = document.getElementById('mobile-cart-drawer-node');
  
  overlay.style.display = 'block';
  drawer.style.display = 'block';
  
  // Clone secondary actions like promo fields over to the drawer
  const promoBlock = document.getElementById('cart-promo-input-section');
  const targetClonePromo = document.getElementById('mobile-drawer-cloned-promo-section');
  if (promoBlock && targetClonePromo) {
    targetClonePromo.innerHTML = promoBlock.innerHTML;
  }

  setTimeout(() => {
    drawer.style.transform = 'translateY(0%)';
  }, 10);
}

function collapseMobileCartDrawer() {
  const overlay = document.getElementById('mobile-cart-drawer-overlay-node');
  const drawer = document.getElementById('mobile-cart-drawer-node');
  
  drawer.style.transform = 'translateY(100%)';
  setTimeout(() => {
    overlay.style.display = 'none';
    drawer.style.display = 'none';
  }, 400);
}

// ════════════════════════════════════════
// 6. STEP 3: STAFF PROFESSIONAL SELECTION
// ════════════════════════════════════════

function renderStaffCards() {
  const staffGrid = document.getElementById('staff-grid-list');
  if (!staffGrid) return;
  
  staffGrid.innerHTML = '';
  
  staff.forEach(member => {
    const isSelected = bookingState.selectedStaff && bookingState.selectedStaff.id === member.id;
    const cardSelectedClass = isSelected ? 'selected' : '';
    const buttonText = isSelected ? 'Selected' : 'Select';
    const buttonClass = isSelected ? 'btn-primary' : 'btn-ghost';
    
    const card = document.createElement('div');
    card.className = `staff-card ${cardSelectedClass}`;
    card.id = `staff-card-${member.id}`;
    card.setAttribute('onclick', `selectStaffMember('${member.id}', event)`);
    
    // Speciality tags badges compilation
    let tagsHTML = '';
    member.speciality.split(',').forEach(tag => {
      tagsHTML += `<span class="staff-pill-badge">${tag.trim()}</span>`;
    });

    let photoHTML = '';
    if (member.photo) {
      photoHTML = `<img src="${member.photo}" alt="${member.name}">`;
    } else {
      photoHTML = `
        <div class="staff-initials-circle">
          <span>NH</span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="staff-photo-container" onclick="openBioPopoverModal('${member.id}', event)">
        ${photoHTML}
      </div>
      
      <div class="staff-card-content">
        <span class="sub">${member.subtitle}</span>
        <h3>${member.name}</h3>
        
        <div class="staff-speciality-tags">
          ${tagsHTML}
        </div>
        
        <p class="staff-signature-quote">"${member.signature}"</p>
        
        <span class="staff-bio-link" onclick="openBioPopoverModal('${member.id}', event)">View Bio & Reviews</span>
        
        <button type="button" class="${buttonClass} staff-card-select-btn" onclick="selectStaffMember('${member.id}', event)">
          ${buttonText}
        </button>
      </div>
    `;

    staffGrid.appendChild(card);
    
  });

  // Entrance slide anims
  gsap.from(".staff-card", {
    opacity: 0,
    y: 50,
    stagger: 0.12,
    duration: 0.6,
    ease: "power3.out"
  });
}

function selectStaffMember(staffId, event) {
  if (event) event.stopPropagation();

  const selectedObject = staff.find(m => m.id === staffId);
  bookingState.selectedStaff = selectedObject;
  
  // Rerender cards to reflect state changes
  renderStaffCards();
  
  // Refresh main navigation cart CTA button
  updateCartDisplay();
}

// ════════════════════════════════════════
// 7. STEP 4: MONTH CALENDAR & SLOTS ENGINE
// ════════════════════════════════════════

function renderCalendarGrid() {
  const gridNode = document.getElementById('calendar-days-grid-nodes');
  const labelEl = document.getElementById('calendar-month-year-label');
  
  if (!gridNode) return;

  gridNode.innerHTML = '';
  
  const monthsNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  labelEl.innerText = `${monthsNames[currentMonth]} ${currentYear}`;

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  // Render empty padding cells for previous month overhang
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    gridNode.appendChild(emptyCell);
  }

  // Render day numbers
  for (let dayNum = 1; dayNum <= lastDay; dayNum++) {
    const cellDate = new Date(currentYear, currentMonth, dayNum);
    const dayOfWeek = cellDate.getDay();
    
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    cell.innerText = dayNum;

    // Check if cell corresponds to today
    if (cellDate.toDateString() === today.toDateString()) {
      cell.classList.add('today');
    }

    // Closed on Sundays
    if (dayOfWeek === 0) {
      cell.classList.add('closed');
      cell.setAttribute('title', "We're closed on Sundays. See you Monday! 🌿");
      cell.style.cursor = 'not-allowed';
    } 
    // Disable past calendar dates
    else if (cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      cell.classList.add('disabled');
    } 
    // Selectable active days
    else {
      // Selected date styling check
      if (bookingState.selectedDate && cellDate.toDateString() === bookingState.selectedDate.toDateString()) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', () => {
        selectBookingDate(cellDate, cell);
      });
    }

    gridNode.appendChild(cell);
  }
}

function prevMonth() {
  const today = new Date();
  if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
    return; // Don't navigate to past months
  }
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendarGrid();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendarGrid();
}

function selectBookingDate(dateObj, cellNode) {
  bookingState.selectedDate = dateObj;
  
  // Popping back spring scale animations
  gsap.fromTo(cellNode,
    { scale: 0.8 },
    { scale: 1, duration: 0.3, ease: "back.out(2)" }
  );

  // Rerender cells to reflect selection
  renderCalendarGrid();
  
  // Display time slots
  renderTimeSlots();
  
  updateCartDisplay();
}

function renderTimeSlots() {
  const section = document.getElementById('time-slots-section');
  const gridNode = document.getElementById('time-slots-grid-nodes');
  
  if (!section || !gridNode) return;

  gridNode.innerHTML = '';
  section.style.display = 'block';

  // GSAP slide in anim on reappear
  gsap.fromTo(section,
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
  );

  baseTimeSlots.forEach(slot => {
    const isSelected = bookingState.selectedTime === slot;
    const selectedClass = isSelected ? 'selected' : '';
    
    // Format duration ranges (e.g. 10:30 AM -> 11:45 AM)
    const formattedEndRange = calculateSlotEndRange(slot);

    const card = document.createElement('div');
    card.className = `time-slot-card ${selectedClass}`;
    card.innerHTML = `
      <div style="font-weight: 500; font-size: 15px;">${slot}</div>
      <div style="font-size: 11px; opacity: 0.7; margin-top: 2px;">until ${formattedEndRange}</div>
    `;
    
    card.addEventListener('click', () => {
      selectBookingTimeSlot(slot);
    });

    gridNode.appendChild(card);
  });
}

function calculateSlotEndRange(startSlotStr) {
  // Compute total duration of selections in minutes
  const totalMins = bookingState.selectedServices.reduce((acc, s) => acc + (s.durationMins || 60), 0);
  
  // Parse start time (e.g., "10:30 AM")
  const parts = startSlotStr.split(' ');
  const timeParts = parts[0].split(':');
  let hrs = parseInt(timeParts[0]);
  const mins = parseInt(timeParts[1]);
  const isPM = parts[1] === 'PM';

  if (isPM && hrs !== 12) hrs += 12;
  if (!isPM && hrs === 12) hrs = 0;

  const date = new Date(2026, 0, 1, hrs, mins);
  const endDate = new Date(date.getTime() + totalMins * 60000);

  let endHrs = endDate.getHours();
  const endMins = endDate.getMinutes();
  const suffix = endHrs >= 12 ? 'PM' : 'AM';

  if (endHrs > 12) endHrs -= 12;
  if (endHrs === 0) endHrs = 12;

  const minFormatted = String(endMins).padStart(2, '0');
  return `${endHrs}:${minFormatted} ${suffix}`;
}

function selectBookingTimeSlot(slotStr) {
  bookingState.selectedTime = slotStr;
  
  // Re-render slots to refresh focus styling
  renderTimeSlots();
  
  // Refresh navigation CTA
  updateCartDisplay();
}

// ════════════════════════════════════════
// 8. STEP 5: REVIEW & QR SCREEN VALIDATIONS
// ════════════════════════════════════════

function renderReviewSummary() {
  const rowsNode = document.getElementById('review-summary-rows-block');
  if (!rowsNode) return;

  const servicesNames = bookingState.selectedServices.map(s => s.name).join(', ');
  const staffName = bookingState.selectedStaff ? bookingState.selectedStaff.name : 'No Preference';
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = bookingState.selectedDate ? bookingState.selectedDate.toLocaleDateString('en-US', options) : '';

  rowsNode.innerHTML = `
    <div class="review-summary-row summary-row">
      <span class="lbl">Services</span>
      <span class="val">${servicesNames}</span>
    </div>
    <div class="review-summary-row summary-row">
      <span class="lbl">Specialist</span>
      <span class="val">${staffName}</span>
    </div>
    <div class="review-summary-row summary-row">
      <span class="lbl">Date</span>
      <span class="val">${formattedDate}</span>
    </div>
    <div class="review-summary-row summary-row">
      <span class="lbl">Moment</span>
      <span class="val">${bookingState.selectedTime}</span>
    </div>
    <div class="review-summary-row summary-row">
      <span class="lbl">Total Price</span>
      <span class="val" style="color: var(--green); font-weight: bold; font-size: 18px;">MYR ${bookingState.finalPrice}</span>
    </div>
  `;

  // Line-by-line stagger load animation
  gsap.from(".summary-row", {
    opacity: 0,
    y: 12,
    stagger: 0.08,
    duration: 0.5,
    ease: "power2.out"
  });
}

// Dynamic Input field blur checkers
function validateInputName() {
  const input = document.getElementById('input-full-name');
  const wrapper = document.getElementById('name-input-wrapper');
  const errorMsg = document.getElementById('name-error-msg');
  const icon = document.getElementById('name-validation-icon');

  const isValid = input.value.trim().length >= 2;
  
  if (isValid) {
    wrapper.className = 'input-validated-wrapper valid';
    errorMsg.style.display = 'none';
    icon.className = 'input-validation-icon fa-solid fa-circle-check';
    icon.style.color = '#2D5C3E';
    bookingState.customerName = input.value.trim();
  } else {
    wrapper.className = 'input-validated-wrapper invalid';
    errorMsg.style.display = 'block';
    icon.className = 'input-validation-icon fa-solid fa-triangle-exclamation';
    icon.style.color = '#C4756A';
    bookingState.customerName = '';
  }
  validateConfirmButtonState();
}

function validateInputEmail() {
  const input = document.getElementById('input-email');
  const wrapper = document.getElementById('email-input-wrapper');
  const errorMsg = document.getElementById('email-error-msg');
  const icon = document.getElementById('email-validation-icon');

  // Simple standard email match pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(input.value.trim());

  if (isValid) {
    wrapper.className = 'input-validated-wrapper valid';
    errorMsg.style.display = 'none';
    icon.className = 'input-validation-icon fa-solid fa-circle-check';
    icon.style.color = '#2D5C3E';
    bookingState.customerEmail = input.value.trim();
  } else {
    wrapper.className = 'input-validated-wrapper invalid';
    errorMsg.style.display = 'block';
    icon.className = 'input-validation-icon fa-solid fa-triangle-exclamation';
    icon.style.color = '#C4756A';
    bookingState.customerEmail = '';
  }
  validateConfirmButtonState();
}

function validateInputPhone() {
  const input = document.getElementById('input-phone');
  const wrapper = document.getElementById('phone-input-wrapper');
  const errorMsg = document.getElementById('phone-error-msg');
  const icon = document.getElementById('phone-validation-icon');

  const val = input.value.trim();
  const isValid = val.startsWith('+60') || val.startsWith('01') || val.startsWith('60');

  if (isValid && val.length >= 9) {
    wrapper.className = 'input-validated-wrapper valid';
    errorMsg.style.display = 'none';
    icon.className = 'input-validation-icon fa-solid fa-circle-check';
    icon.style.color = '#2D5C3E';
    
    // Auto-inject country code +60 if needed
    let formattedPhone = val;
    if (val.startsWith('01')) {
      formattedPhone = '+60' + val.substring(1);
    } else if (val.startsWith('60')) {
      formattedPhone = '+' + val;
    }
    bookingState.customerPhone = formattedPhone;
  } else {
    wrapper.className = 'input-validated-wrapper invalid';
    errorMsg.style.display = 'block';
    icon.className = 'input-validation-icon fa-solid fa-triangle-exclamation';
    icon.style.color = '#C4756A';
    bookingState.customerPhone = '';
  }
  validateConfirmButtonState();
}

function selectPaymentMethod(methodKey) {
  bookingState.paymentMethod = methodKey;
  
  const qrCard = document.getElementById('pay-method-qr');
  const counterCard = document.getElementById('pay-method-counter');
  const qrPanel = document.getElementById('qr-deposit-panel');

  if (methodKey === 'qr-transfer') {
    qrCard.className = 'payment-method-card selected';
    counterCard.className = 'payment-method-card';
    qrPanel.style.display = 'flex';
    
    // Scale bounce anim
    gsap.fromTo(qrPanel,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
    );
  } else {
    counterCard.className = 'payment-method-card selected';
    qrCard.className = 'payment-method-card';
    qrPanel.style.display = 'none';
    bookingState.paymentProofFile = null;
  }

  validateConfirmButtonState();
}

// Dashed upload target handlers
function triggerFileInputClick() {
  document.getElementById('payment-file-input').click();
}

function handleFileSelected(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processUploadedFile(files[0]);
  }
}

function setupDragAndDropUploader() {
  const zone = document.getElementById('payment-drag-upload-target');
  if (!zone) return;

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
    }
  });
}

function processUploadedFile(file) {
  // Limit bounds to Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert("File exceeds maximum 5MB size limit.");
    return;
  }

  bookingState.paymentProofFile = file;

  // Display feedback label card
  document.getElementById('payment-drag-upload-target').style.display = 'none';
  const card = document.getElementById('payment-proof-uploaded-card');
  card.style.display = 'flex';
  
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  document.getElementById('payment-filename-label').innerText = `${file.name} (${sizeMB} MB)`;

  // Confetti payment explosion
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#E8C4BA', '#D4C5A4', '#2D5C3E', '#F5EFE2']
  });

  validateConfirmButtonState();
}

function removeUploadedReceipt() {
  bookingState.paymentProofFile = null;
  document.getElementById('payment-proof-uploaded-card').style.display = 'none';
  document.getElementById('payment-drag-upload-target').style.display = 'flex';
  document.getElementById('payment-file-input').value = '';
  
  validateConfirmButtonState();
}

function validateConfirmButtonState() {
  const btn = document.getElementById('confirm-booking-btn');
  if (!btn) return;

  const isFormValid = bookingState.customerName && bookingState.customerName.trim() !== '' &&
                      bookingState.customerEmail && bookingState.customerEmail.trim() !== '' &&
                      bookingState.customerPhone && bookingState.customerPhone.trim() !== '';

  if (isFormValid) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// Copy Bank Acc node clip helpers
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const copyBadge = document.getElementById('copy-bank-acc');
    const originalText = copyBadge.innerText;
    copyBadge.innerText = 'Copied!';
    copyBadge.style.background = '#2D5C3E';
    copyBadge.style.color = '#F5EFE2';
    
    setTimeout(() => {
      copyBadge.innerText = originalText;
      copyBadge.style.background = '';
      copyBadge.style.color = '';
    }, 1500);
  });
}

// ════════════════════════════════════════
// 9. SUBMISSION & BACKEND CONNECTOR
// ════════════════════════════════════════

async function handleConfirmBookingSubmit() {
  const btn = document.getElementById('confirm-booking-btn');
  btn.disabled = true;
  
  // spinning loader SVG
  btn.innerHTML = `
    <svg class="spinning-loader" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="var(--cream)" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="10"/>
    </svg>
    Processing...
  `;

  // Detect device and landing reference source
  const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('utm_source') || 'direct';

  const payload = {
    action: 'newBooking',
    customerName:      bookingState.customerName,
    customerEmail:     bookingState.customerEmail,
    customerPhone:     bookingState.customerPhone,
    appointmentType:   bookingState.appointmentType,
    servicesSelected:  bookingState.selectedServices.map(s => s.name).join(', '),
    serviceCategory:   bookingState.selectedServices.map(s => s.category).filter((v, i, a) => a.indexOf(v) === i).join(', '),
    totalPrice:        bookingState.totalPrice,
    promoCode:         bookingState.promoCode,
    discountAmount:    bookingState.discountAmount,
    finalPrice:        bookingState.finalPrice,
    staffPreference:   bookingState.selectedStaff ? bookingState.selectedStaff.name : 'No Preference',
    appointmentDate:   bookingState.selectedDate.toISOString().split('T')[0],
    appointmentTime:   bookingState.selectedTime,
    appointmentDuration: bookingState.selectedServices.reduce((t, s) => t + (s.durationMins || 60), 0) + ' mins',
    specialRequests:   document.getElementById('input-requests').value.trim() || '',
    paymentMethod:     bookingState.paymentMethod,
    source:            source,
    deviceType:        deviceType
  };

  // If Sandbox Mode: mock/simulate Apps Script backend integrations
  if (GAS_URL === 'YOUR_WEB_APP_URL_HERE' || GAS_URL.trim() === '') {
    console.log("SANDBOX DATABASE MODE: Fulfilling local booking records.");
    
    setTimeout(async () => {
      // Mock generate NH booking ID
      const mockToday = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const mockBookingId = `NH-${mockToday}-${Math.floor(100 + Math.random() * 900)}`;
      bookingState.bookingId = mockBookingId;

      if (bookingState.paymentMethod === 'qr-transfer' && bookingState.paymentProofFile) {
        console.log("SANDBOX: Simulated payment screenshot Drive file upload successful.");
      }

      // Track Booking complete
      trackBookingComplete(mockBookingId);

      // Transition screen
      showStep(6);
    }, 1800);
    return;
  }

  // Active Connection POST pipeline
  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
    
    const result = await res.json();
    
    if (result.success) {
      bookingState.bookingId = result.bookingId;
      
      // If QR Transfer - file base64 Drive uploader
      if (bookingState.paymentMethod === 'qr-transfer' && bookingState.paymentProofFile) {
        await uploadReceiptProofToServer(bookingState.paymentProofFile, result.bookingId);
      }

      trackBookingComplete(result.bookingId);
      showStep(6);
    } else {
      showSubmissionError(result.error);
    }
  } catch (err) {
    console.error("Fetch pipeline error: ", err);
    showSubmissionError(err.message);
  }
}

function showSubmissionError(errorMsg) {
  let detail = "";
  if (errorMsg) {
    detail = `\n\nError details: ${errorMsg}`;
  }
  alert(`Booking Submission Error!\nWe couldn't sync your booking with our database.${detail}\n\nPlease verify your Google Sheet and script setup, or email us at hello@namastehaus.com to complete your booking.`);
  const btn = document.getElementById('confirm-booking-btn');
  btn.disabled = false;
  btn.innerText = 'Confirm My Booking';
}

async function uploadReceiptProofToServer(file, bookingId) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const ext = file.name.split('.').pop();

      const uploadPayload = {
        action: 'uploadProof',
        bookingId: bookingId,
        fileBase64: base64,
        mimeType: file.type,
        ext: ext,
        fileName: file.name
      };

      try {
        const res = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(uploadPayload)
        });
        const result = await res.json();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
  });
}

// ════════════════════════════════════════
// 10. STEP 6: RECEIPT CONFIRMATION
// ════════════════════════════════════════

function animateConfirmationScreen() {
  const container = document.getElementById('step-6');
  const heading = document.getElementById('confirmation-heading-label');
  const subText = document.getElementById('confirmation-sub-text');
  const bookingTag = document.getElementById('confirmation-booking-id-label');
  const card = container.querySelector('.confirmation-details-summary-card');
  const actionRow = container.querySelector('.confirmation-actions-row');
  
  // Set receipts data
  heading.innerText = `See you soon, ${bookingState.customerName}! ✨`;
  bookingTag.innerText = `Booking confirmed · [${bookingState.bookingId}]`;
  subText.innerText = `Your confirmation is on its way to ${bookingState.customerEmail}.\nWe can't wait to take care of you.`;
  
  document.getElementById('confirm-summary-services').innerText = bookingState.selectedServices.map(s => s.name).join(', ');
  document.getElementById('confirm-summary-staff').innerText = bookingState.selectedStaff ? bookingState.selectedStaff.name : 'No Preference';
  
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = bookingState.selectedDate.toLocaleDateString('en-US', options);
  document.getElementById('confirm-summary-datetime').innerText = `${dateStr} at ${bookingState.selectedTime}`;
  document.getElementById('confirm-summary-total').innerText = `MYR ${bookingState.finalPrice}`;

  // SVG Check path animate
  const checkPath = document.getElementById('confirm-check-path');
  const length = checkPath.getTotalLength();
  
  gsap.set(checkPath, { strokeDasharray: length, strokeDashoffset: length });
  gsap.set([heading, subText, bookingTag, card, actionRow], { opacity: 0 });
  gsap.set(heading, { y: 30 });
  gsap.set(card, { y: 20 });

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  
  tl.to(checkPath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", onComplete: () => {
      // Trigger dynamic luxury brand confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#2D5C3E', '#E8C4BA', '#F5EFE2', '#D4C5A4'] // Emerald Green, Rose Blush, Cream, and Soft Gold
      });
    }})
    .to(heading, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
    .to(bookingTag, { opacity: 1, duration: 0.4 }, "-=0.2")
    .to(subText, { opacity: 1, duration: 0.4 }, "-=0.2")
    .to(card, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
    .to(actionRow, { opacity: 1, duration: 0.4 }, "-=0.2");

  // Floating Loop logo
  gsap.to("#confirm-logo", {
    y: -8,
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 1.5
  });
}

function shareBookingWithFriend() {
  const shareText = `Hey! I just booked my session at Namaste. Haus nail and lash studio! Use code WELCOME10 for 10% off. Join me? 🌸✨`;
  if (navigator.share) {
    navigator.share({
      title: 'My Namaste. Haus Booking',
      text: shareText,
      url: window.location.href
    }).catch(err => console.log(err));
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Sharing message copied to clipboard! Paste it to your friends. 🌿");
    });
  }
}

// ════════════════════════════════════════
// 11. DYNAMIC APPOINTMENT ENTRY NAVIGATION
// ════════════════════════════════════════

function selectAppointmentType(typeKey) {
  bookingState.appointmentType = typeKey;
  if (typeKey === 'group') {
    bookingState.groupParticipants = [
      { id: 1, name: 'Guest 1', services: [] }
    ];
    bookingState.activeParticipantId = 1;
  } else {
    bookingState.groupParticipants = [];
    bookingState.activeParticipantId = null;
  }
  
  // Transition step out
  const currentStepEl = document.getElementById('step-1');
  const nextStepEl = document.getElementById('main-wizard-container');
  
  gsap.to(currentStepEl, {
    opacity: 0,
    x: -40,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      currentStepEl.style.display = 'none';
      showStep(2); // Go directly to Select Services
      
      gsap.fromTo(nextStepEl,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  });
}

// ════════════════════════════════════════
// 12. GOOGLE ANALYTICS EVENT TRACKERS
// ════════════════════════════════════════

function trackStepView(stepNumber, stepName) {
  if (typeof gtag === 'function') {
    gtag('event', 'step_viewed', {
      step_number: stepNumber,
      step_name: stepName
    });
  }
}

function trackServiceAdded(service) {
  if (typeof gtag === 'function') {
    gtag('event', 'add_to_cart', {
      currency: 'MYR',
      value: service.price,
      items: [{
        item_id: service.id,
        item_name: service.name,
        category: service.category,
        price: service.price
      }]
    });
  }
}

function trackBookingComplete(bookingId) {
  if (typeof gtag === 'function') {
    gtag('event', 'purchase', {
      transaction_id: bookingId,
      currency: 'MYR',
      value: bookingState.finalPrice,
      items: bookingState.selectedServices.map(s => ({
        item_id: s.id,
        item_name: s.name,
        price: s.price
      }))
    });
  }
}

window.addEventListener('beforeunload', () => {
  if (typeof gtag === 'function') {
    gtag('event', 'booking_abandoned', {
      last_step: bookingState.currentStep,
      services_selected: bookingState.selectedServices.length
    });
  }
});

// ════════════════════════════════════════
// 13. ADDITIONAL UPGRADES & HELPER IMPLEMENTATIONS
// ════════════════════════════════════════

function renderGroupParticipantManager() {
  const container = document.getElementById('group-participant-manager-row');
  if (!container) return;
  
  if (bookingState.appointmentType !== 'group') {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  
  let tabsHTML = '';
  bookingState.groupParticipants.forEach(p => {
    const activeClass = p.id === bookingState.activeParticipantId ? 'active' : '';
    const showRemove = bookingState.groupParticipants.length > 1;
    const removeBtnHTML = showRemove ? `<span class="remove-btn" onclick="removeGroupParticipant(${p.id}, event)">&times;</span>` : '';
    
    // Show count of services selected next to guest name
    const serviceCount = p.services.length;
    const countBadge = serviceCount > 0 ? ` <span style="font-size:9px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius:10px; margin-left:4px;">${serviceCount}</span>` : '';
    
    tabsHTML += `
      <div class="group-tab-pill ${activeClass}" onclick="switchGroupParticipant(${p.id})">
        <span>${p.name}${countBadge}</span>
        ${removeBtnHTML}
      </div>
    `;
  });
  
  container.innerHTML = `
    <div class="group-manager-panel">
      <div class="group-manager-header">
        <h3>Group Guests</h3>
      </div>
      <div class="group-tabs-row">
        ${tabsHTML}
        <button type="button" class="add-group-btn" onclick="addGroupParticipant()">
          <i class="fa-solid fa-plus"></i> Add Person
        </button>
      </div>
    </div>
  `;
}

function addGroupParticipant() {
  const nextId = bookingState.groupParticipants.length > 0 
    ? Math.max(...bookingState.groupParticipants.map(p => p.id)) + 1 
    : 1;
  const newGuest = {
    id: nextId,
    name: `Guest ${nextId}`,
    services: []
  };
  
  bookingState.groupParticipants.push(newGuest);
  bookingState.activeParticipantId = nextId;
  
  renderGroupParticipantManager();
  
  // Switch to featured category for new guest to make selecting easy
  const featuredTab = document.querySelector('.pill-tab');
  if (featuredTab) {
    switchCategoryTab('featured', featuredTab);
  } else {
    renderServiceCards('featured');
  }
  
  updateCartDisplay();
}

function removeGroupParticipant(id, event) {
  if (event) event.stopPropagation();
  
  if (bookingState.groupParticipants.length <= 1) return;
  
  const idx = bookingState.groupParticipants.findIndex(p => p.id === id);
  if (idx >= 0) {
    bookingState.groupParticipants.splice(idx, 1);
  }
  
  // Adjust active participant if we removed the active one
  if (bookingState.activeParticipantId === id) {
    bookingState.activeParticipantId = bookingState.groupParticipants[0].id;
  }
  
  syncGroupSelectedServices();
  renderGroupParticipantManager();
  
  // Rerender active cards
  const activeTab = document.querySelector('.pill-tab.active');
  let resolvedCat = 'featured';
  if (activeTab) {
    const labelsMap = {
      'Featured': 'featured',
      'Manicure': 'manicure',
      'Pedicure': 'pedicure',
      'Extensions': 'extensions',
      'Lash': 'lash',
      'Lash Extensions': 'lashExtensions',
      'Add Ons': 'addOns',
      'Hair Removal': 'hairRemoval',
      'Men': 'men',
      'Hot Deals': 'hotDeals'
    };
    resolvedCat = labelsMap[activeTab.innerText] || 'featured';
  }
  renderServiceCards(resolvedCat);
  updateCartDisplay();
}

function switchGroupParticipant(id) {
  bookingState.activeParticipantId = id;
  renderGroupParticipantManager();
  
  // Re-render services grid so the checkmarks reflect what this specific participant has selected!
  const activeTab = document.querySelector('.pill-tab.active');
  let resolvedCat = 'featured';
  if (activeTab) {
    const labelsMap = {
      'Featured': 'featured',
      'Manicure': 'manicure',
      'Pedicure': 'pedicure',
      'Extensions': 'extensions',
      'Lash': 'lash',
      'Lash Extensions': 'lashExtensions',
      'Add Ons': 'addOns',
      'Hair Removal': 'hairRemoval',
      'Men': 'men',
      'Hot Deals': 'hotDeals'
    };
    resolvedCat = labelsMap[activeTab.innerText] || 'featured';
  }
  renderServiceCards(resolvedCat);
}

function syncGroupSelectedServices() {
  bookingState.selectedServices = [];
  bookingState.groupParticipants.forEach(p => {
    p.services.forEach(srv => {
      // Create a cloned service object with guest name and guest id
      const srvClone = {
        ...srv,
        id: `${srv.id}-guest-${p.id}`, // Unique ID for cart row removal
        originalId: srv.id,
        guestId: p.id,
        guestName: p.name
      };
      bookingState.selectedServices.push(srvClone);
    });
  });
}

function removeCartItem(serviceId, guestId) {
  if (bookingState.appointmentType === 'group' && guestId) {
    const gId = parseInt(guestId);
    const guest = bookingState.groupParticipants.find(p => p.id === gId);
    if (guest) {
      const idx = guest.services.findIndex(s => s.id === serviceId);
      if (idx >= 0) {
        guest.services.splice(idx, 1);
      }
    }
    syncGroupSelectedServices();
  } else {
    const idx = bookingState.selectedServices.findIndex(s => s.id === serviceId);
    if (idx >= 0) {
      bookingState.selectedServices.splice(idx, 1);
    }
  }
  
  // Rerender services to update checkmarks
  const activeTab = document.querySelector('.pill-tab.active');
  let resolvedCat = 'featured';
  if (activeTab) {
    const labelsMap = {
      'Featured': 'featured',
      'Manicure': 'manicure',
      'Pedicure': 'pedicure',
      'Extensions': 'extensions',
      'Lash': 'lash',
      'Lash Extensions': 'lashExtensions',
      'Add Ons': 'addOns',
      'Hair Removal': 'hairRemoval',
      'Men': 'men',
      'Hot Deals': 'hotDeals'
    };
    resolvedCat = labelsMap[activeTab.innerText] || 'featured';
  }
  renderServiceCards(resolvedCat);
  updateCartDisplay();
}

function openBioPopoverModal(staffId, event) {
  if (event) event.stopPropagation();
  
  const member = staff.find(m => m.id === staffId);
  if (!member) return;
  
  const overlay = document.getElementById('bio-popover-overlay');
  const photoBanner = document.getElementById('bio-modal-photo-banner-node');
  const subtitleNode = document.getElementById('bio-modal-subtitle-node');
  const nameNode = document.getElementById('bio-modal-name-node');
  const paragraphNode = document.getElementById('bio-modal-paragraph-node');
  const reviewsListNode = document.getElementById('bio-modal-reviews-list-node');
  
  if (!overlay) return;
  
  // Set details
  if (member.photo) {
    photoBanner.innerHTML = `<img src="${member.photo}" alt="${member.name}">`;
  } else {
    photoBanner.innerHTML = `
      <div class="staff-initials-circle" style="width:100%; height:100%; border-radius:0; font-size:48px;">
        <span>NH</span>
      </div>
    `;
  }
  
  subtitleNode.innerText = member.subtitle;
  nameNode.innerText = member.name;
  paragraphNode.innerText = member.bio;
  
  // Build reviews HTML
  reviewsListNode.innerHTML = '';
  if (member.reviews && member.reviews.length > 0) {
    member.reviews.forEach(rev => {
      const starsHTML = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
      const bubble = document.createElement('div');
      bubble.className = 'bio-review-bubble';
      bubble.innerHTML = `
        <div class="bio-review-stars" style="color: #D4C5A4; font-size: 11px; margin-bottom: 4px;">${starsHTML}</div>
        <p class="bio-review-text" style="font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--charcoal); margin: 0 0 4px;">"${rev.text}"</p>
        <span class="bio-review-author" style="font-size: 11px; color: var(--ultra-muted); text-align: right; display: block;">— ${rev.author}</span>
      `;
      reviewsListNode.appendChild(bubble);
    });
  } else {
    reviewsListNode.innerHTML = `<p style="font-size: 13px; color: var(--muted); font-style: italic;">No reviews yet.</p>`;
  }
  
  overlay.style.display = 'flex';
  
  // GSAP animation
  gsap.fromTo(overlay.querySelector('.bio-modal-card'),
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
  );
}

function closeBioPopoverModal() {
  const overlay = document.getElementById('bio-popover-overlay');
  if (!overlay) return;
  
  gsap.to(overlay.querySelector('.bio-modal-card'), {
    y: 50,
    opacity: 0,
    duration: 0.3,
    ease: "power3.in",
    onComplete: () => {
      overlay.style.display = 'none';
    }
  });
}

