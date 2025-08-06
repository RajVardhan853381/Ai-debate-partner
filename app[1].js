// Application data
const appData = {
  "sampleTopics": [
    {
      "id": 1,
      "topic": "AI should be regulated by government",
      "description": "Debate the role of government oversight in artificial intelligence development"
    },
    {
      "id": 2, 
      "topic": "Remote work is more productive than office work",
      "description": "Compare productivity levels between remote and in-person work environments"
    },
    {
      "id": 3,
      "topic": "Social media has a net positive impact on society", 
      "description": "Evaluate the overall social benefits versus harms of social media platforms"
    },
    {
      "id": 4,
      "topic": "Climate change is primarily caused by human activity",
      "description": "Examine the evidence for anthropogenic versus natural climate change factors"
    },
    {
      "id": 5,
      "topic": "Universal basic income would reduce poverty",
      "description": "Assess the potential economic and social impacts of UBI programs"
    }
  ],
  "mockSources": [
    {
      "name": "Wikipedia",
      "type": "encyclopedia",
      "reliability": "high",
      "icon": "📚"
    },
    {
      "name": "Reuters News",
      "type": "news",
      "reliability": "high", 
      "icon": "📰"
    },
    {
      "name": "Nature Journal",
      "type": "academic",
      "reliability": "very-high",
      "icon": "🔬"
    },
    {
      "name": "Pew Research",
      "type": "research",
      "reliability": "high",
      "icon": "📊"
    },
    {
      "name": "Harvard Business Review",
      "type": "business",
      "reliability": "high",
      "icon": "💼"
    }
  ],
  "sampleCounterArguments": {
    "ai-regulation": [
      {
        "title": "Innovation Stifling Concerns",
        "argument": "Government regulation could slow down AI innovation and put countries at a competitive disadvantage globally.",
        "evidence": "Historical examples show that over-regulation in emerging technologies has led to innovation migration to less regulated markets.",
        "citations": ["Tech Innovation Report 2023", "Global AI Competitiveness Index"],
        "strength": 4,
        "logicalStructure": "Historical precedent → Current risk → Future consequence"
      },
      {
        "title": "Regulatory Complexity",
        "argument": "AI technology evolves too rapidly for traditional regulatory frameworks to keep pace effectively.",
        "evidence": "Current AI capabilities change every 6-12 months, while regulatory processes typically take 2-5 years.",
        "citations": ["AI Development Timeline Study", "Regulatory Response Analysis 2024"],
        "strength": 5,
        "logicalStructure": "Technology pace → Regulatory pace → Effectiveness gap"
      }
    ],
    "remote-work": [
      {
        "title": "Collaboration Challenges",
        "argument": "Remote work reduces spontaneous collaboration and creative problem-solving that occurs in physical offices.",
        "evidence": "Studies show 23% decrease in informal knowledge sharing and 15% reduction in breakthrough innovations in fully remote teams.",
        "citations": ["MIT Collaboration Study 2023", "Remote Work Innovation Report"],
        "strength": 4,
        "logicalStructure": "Physical proximity → Informal interaction → Innovation outcomes"
      },
      {
        "title": "Management Oversight",
        "argument": "Remote work makes it difficult to provide adequate mentorship and career development for junior employees.",
        "evidence": "Survey data indicates 67% of entry-level employees prefer in-person mentoring and report slower skill development remotely.",
        "citations": ["Career Development Survey 2024", "Mentorship Effectiveness Study"],
        "strength": 3,
        "logicalStructure": "Learning needs → Mentorship methods → Career outcomes"
      }
    ]
  },
  "debateTips": [
    "Use specific examples and data to support your arguments",
    "Acknowledge the strongest points of your opponent's position",
    "Structure arguments with claim → evidence → reasoning",
    "Avoid ad hominem attacks and focus on ideas",
    "Question assumptions and definitions",
    "Use analogies to clarify complex concepts"
  ],
  "logicalFallacies": [
    {
      "name": "Straw Man",
      "description": "Misrepresenting someone's argument to make it easier to attack"
    },
    {
      "name": "Ad Hominem", 
      "description": "Attacking the person making the argument rather than the argument itself"
    },
    {
      "name": "False Dichotomy",
      "description": "Presenting only two options when more exist"
    },
    {
      "name": "Appeal to Authority",
      "description": "Using an authority as evidence when the authority is not an expert"
    }
  ]
};

// Application state
let currentDebate = {
  topic: '',
  stance: '',
  counterArguments: [],
  chatHistory: []
};

// DOM elements
const debateForm = document.getElementById('debateForm');
const topicText = document.getElementById('topicText');
const stanceSelect = document.getElementById('stance');
const sampleTopicsContainer = document.getElementById('sampleTopics');
const analysisSection = document.getElementById('analysisSection');
const retrievalSection = document.getElementById('retrievalSection');
const counterArgumentsSection = document.getElementById('counterArgumentsSection');
const debateInterface = document.getElementById('debateInterface');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  populateSampleTopics();
  populateDebateTips();
  populateLogicalFallacies();
  setupEventListeners();
  initializeFactChecking();
}

function populateSampleTopics() {
  const container = sampleTopicsContainer;
  container.innerHTML = '';
  
  appData.sampleTopics.forEach(topic => {
    const topicCard = document.createElement('div');
    topicCard.className = 'topic-card';
    topicCard.innerHTML = `
      <h4 class="topic-card__title">${topic.topic}</h4>
      <p class="topic-card__description">${topic.description}</p>
    `;
    
    topicCard.addEventListener('click', () => {
      topicText.value = topic.topic;
      topicText.focus();
    });
    
    container.appendChild(topicCard);
  });
}

function populateDebateTips() {
  const container = document.getElementById('tipsContainer');
  container.innerHTML = '';
  
  appData.debateTips.forEach(tip => {
    const tipItem = document.createElement('div');
    tipItem.className = 'tip-item';
    tipItem.textContent = tip;
    container.appendChild(tipItem);
  });
}

function populateLogicalFallacies() {
  const container = document.getElementById('fallaciesList');
  container.innerHTML = '';
  
  appData.logicalFallacies.forEach(fallacy => {
    const fallacyItem = document.createElement('div');
    fallacyItem.className = 'fallacy-item';
    fallacyItem.innerHTML = `
      <div class="fallacy-name">${fallacy.name}</div>
      <p class="fallacy-description">${fallacy.description}</p>
    `;
    container.appendChild(fallacyItem);
  });
}

function setupEventListeners() {
  // Form submission
  debateForm.addEventListener('submit', handleFormSubmission);
  
  // Chat functionality
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendMessage');
  
  sendButton.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
  
  // Quick actions
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      handleQuickAction(action);
    });
  });
  
  // Modal functionality
  const modal = document.getElementById('sourceModal');
  const modalClose = document.getElementById('modalClose');
  
  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

async function handleFormSubmission(e) {
  e.preventDefault();
  
  const topic = topicText.value.trim();
  const stance = stanceSelect.value;
  
  if (!topic) {
    alert('Please enter a debate topic');
    return;
  }
  
  currentDebate.topic = topic;
  currentDebate.stance = stance;
  
  // Hide topic input and show analysis
  document.getElementById('topicInput').classList.add('hidden');
  analysisSection.classList.remove('hidden');
  
  await simulateArgumentAnalysis(topic, stance);
  await simulateRAGRetrieval(topic);
  await generateCounterArguments(topic, stance);
  
  // Show debate interface
  debateInterface.classList.remove('hidden');
  initializeChatInterface();
}

async function simulateArgumentAnalysis(topic, stance) {
  const positionDisplay = document.getElementById('positionDisplay');
  const analysisStatus = document.getElementById('analysisStatus');
  const analysisResults = document.getElementById('analysisResults');
  const keyPoints = document.getElementById('keyPoints');
  const strengthRating = document.getElementById('strengthRating');
  
  // Display user position
  positionDisplay.innerHTML = `
    <strong>Topic:</strong> ${topic}<br>
    <strong>Stance:</strong> ${stance.charAt(0).toUpperCase() + stance.slice(1)}
  `;
  
  // Simulate analysis delay
  await delay(2000);
  
  // Update status
  analysisStatus.innerHTML = '<span class="status status--success">✓ Analysis complete</span>';
  
  // Show results
  analysisResults.classList.remove('hidden');
  
  // Generate key points
  const points = generateKeyPoints(topic);
  keyPoints.innerHTML = '';
  points.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    keyPoints.appendChild(li);
  });
  
  // Generate strength rating
  const strength = Math.floor(Math.random() * 2) + 3; // 3-4 stars
  strengthRating.innerHTML = generateStarRating(strength);
  
  // Update fact checking
  updateFactChecking('analysis-complete', 'Argument structure analyzed');
}

async function simulateRAGRetrieval(topic) {
  retrievalSection.classList.remove('hidden');
  
  const sourcesGrid = document.getElementById('sourcesGrid');
  const retrievedFacts = document.getElementById('retrievedFacts');
  const factsList = document.getElementById('factsList');
  
  // Create source items
  sourcesGrid.innerHTML = '';
  appData.mockSources.forEach((source, index) => {
    const sourceItem = document.createElement('div');
    sourceItem.className = 'source-item';
    sourceItem.innerHTML = `
      <div class="source-icon">${source.icon}</div>
      <div class="source-name">${source.name}</div>
      <div class="source-status">Searching...</div>
    `;
    sourcesGrid.appendChild(sourceItem);
    
    // Simulate retrieval process
    setTimeout(() => {
      sourceItem.classList.add('retrieving');
      sourceItem.querySelector('.source-status').textContent = 'Retrieving...';
      
      setTimeout(() => {
        sourceItem.classList.remove('retrieving');
        sourceItem.classList.add('complete');
        sourceItem.querySelector('.source-status').textContent = 'Complete';
        
        if (index === appData.mockSources.length - 1) {
          // Show retrieved facts after all sources complete
          setTimeout(() => {
            showRetrievedFacts(topic, factsList, retrievedFacts);
          }, 500);
        }
      }, 1000 + index * 300);
    }, index * 200);
  });
  
  updateFactChecking('retrieval-active', 'Retrieving information from sources');
}

function showRetrievedFacts(topic, factsList, retrievedFacts) {
  const facts = generateRetrievedFacts(topic);
  factsList.innerHTML = '';
  
  facts.forEach(fact => {
    const factItem = document.createElement('div');
    factItem.className = 'fact-item';
    factItem.textContent = fact;
    factsList.appendChild(factItem);
  });
  
  retrievedFacts.classList.remove('hidden');
  updateFactChecking('facts-retrieved', `${facts.length} relevant facts retrieved`);
}

async function generateCounterArguments(topic, stance) {
  counterArgumentsSection.classList.remove('hidden');
  
  const argumentsContainer = document.getElementById('argumentsContainer');
  argumentsContainer.innerHTML = '<div class="loading-spinner"></div>';
  
  await delay(3000);
  
  const counterArgs = getCounterArguments(topic, stance);
  currentDebate.counterArguments = counterArgs;
  
  argumentsContainer.innerHTML = '';
  
  counterArgs.forEach((arg, index) => {
    const argCard = document.createElement('div');
    argCard.className = 'argument-card';
    argCard.innerHTML = `
      <div class="argument-header expandable" data-target="arg-${index}">
        <h3 class="argument-title">${arg.title}</h3>
        <div class="argument-strength">
          <span>Strength:</span>
          ${generateStarRating(arg.strength)}
        </div>
      </div>
      <div class="argument-body collapsible" id="arg-${index}" style="max-height: 0;">
        <div class="argument-content">${arg.argument}</div>
        <div class="argument-evidence">
          <strong>Evidence:</strong> ${arg.evidence}
        </div>
        <div class="argument-citations">
          ${arg.citations.map(citation => 
            `<a href="#" class="citation-link" onclick="showSourceModal('${citation}')">${citation}</a>`
          ).join('')}
        </div>
        <div class="logical-structure">
          <strong>Logical Structure:</strong> ${arg.logicalStructure}
        </div>
      </div>
    `;
    
    argumentsContainer.appendChild(argCard);
    
    // Add click handler for expandable
    const header = argCard.querySelector('.argument-header');
    header.addEventListener('click', () => {
      toggleArgumentCard(header);
    });
  });
  
  updateFactChecking('arguments-generated', `${counterArgs.length} counter-arguments generated`);
}

function toggleArgumentCard(header) {
  const targetId = header.dataset.target;
  const body = document.getElementById(targetId);
  const isExpanded = !header.classList.contains('collapsed');
  
  if (isExpanded) {
    header.classList.add('collapsed');
    body.style.maxHeight = '0';
  } else {
    header.classList.remove('collapsed');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

function initializeChatInterface() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  
  // Add welcome message
  addChatMessage('ai', 'I\'ve generated counter-arguments to your position. Feel free to ask questions, request more details, or challenge any specific points. How would you like to proceed?');
}

function addChatMessage(sender, message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message--${sender}`;
  messageDiv.textContent = message;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  addChatMessage('user', message);
  chatInput.value = '';
  
  // Show typing indicator
  addTypingIndicator();
  
  // Simulate AI response
  setTimeout(() => {
    removeTypingIndicator();
    const response = generateAIResponse(message);
    addChatMessage('ai', response);
    updateFactChecking('response-generated', 'AI response fact-checked');
  }, 1000 + Math.random() * 2000);
}

function addTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message message--typing';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      AI is typing
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function handleQuickAction(action) {
  const actions = {
    'prove-it': 'Can you provide more concrete evidence for your strongest counter-argument?',
    'more-details': 'I\'d like more details about the methodology behind these claims.',
    'challenge': 'I disagree with your second point. What about the counterexamples?'
  };
  
  const message = actions[action];
  if (message) {
    document.getElementById('chatInput').value = message;
    sendChatMessage();
  }
}

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
  }
  return stars;
}

function generateKeyPoints(topic) {
  const points = [
    'Main claim clearly stated',
    'Position is debatable with multiple perspectives',
    'Topic has current relevance and available evidence',
    'Argument structure follows logical progression'
  ];
  
  if (topic.toLowerCase().includes('ai')) {
    points.push('Technology-focused argument with societal implications');
  }
  if (topic.toLowerCase().includes('remote') || topic.toLowerCase().includes('work')) {
    points.push('Workplace dynamics and productivity considerations');
  }
  
  return points;
}

function generateRetrievedFacts(topic) {
  const baseFacts = [
    'Recent studies show varying perspectives on this topic',
    'Statistical data supports multiple viewpoints',
    'Expert opinions differ based on methodology and context',
    'Historical precedents provide relevant insights'
  ];
  
  if (topic.toLowerCase().includes('ai')) {
    return [
      'AI development has accelerated 300% in the past 5 years',
      '73% of companies report AI implementation challenges',
      'Government AI regulations vary significantly by country',
      'Recent AI breakthroughs have outpaced regulatory frameworks'
    ];
  }
  
  if (topic.toLowerCase().includes('remote')) {
    return [
      'Remote work adoption increased 159% since 2020',
      'Productivity metrics show mixed results across industries',
      '68% of employees prefer hybrid work arrangements',
      'Collaboration tools usage has tripled in remote settings'
    ];
  }
  
  return baseFacts;
}

function getCounterArguments(topic, stance) {
  if (topic.toLowerCase().includes('ai') && topic.toLowerCase().includes('regulat')) {
    return appData.sampleCounterArguments['ai-regulation'];
  }
  
  if (topic.toLowerCase().includes('remote') && topic.toLowerCase().includes('work')) {
    return appData.sampleCounterArguments['remote-work'];
  }
  
  // Generic counter-arguments
  return [
    {
      title: 'Alternative Perspective',
      argument: 'There are significant considerations that challenge your position and suggest a more nuanced approach.',
      evidence: 'Multiple studies and expert analyses point to complexities that aren\'t immediately apparent in the initial argument.',
      citations: ['Academic Research 2024', 'Expert Analysis Report'],
      strength: 4,
      logicalStructure: 'Alternative evidence → Different conclusion → Balanced perspective'
    },
    {
      title: 'Implementation Challenges',
      argument: 'While the theoretical benefits may seem clear, practical implementation faces significant obstacles.',
      evidence: 'Real-world case studies demonstrate unexpected complications and unintended consequences.',
      citations: ['Implementation Study 2023', 'Case Study Analysis'],
      strength: 3,
      logicalStructure: 'Theory vs practice → Implementation barriers → Practical concerns'
    }
  ];
}

function generateAIResponse(userMessage) {
  const responses = [
    'Based on the retrieved evidence, I can provide additional context that supports this perspective...',
    'The latest research suggests there are several factors to consider that might modify this position...',
    'Let me break down the methodology behind that claim using the most recent data...',
    'That\'s an interesting challenge. The evidence shows a more complex picture than initially apparent...',
    'I understand your concern. Let me provide some additional citations that address this specific point...'
  ];
  
  if (userMessage.toLowerCase().includes('prove')) {
    return 'Here\'s additional evidence: Recent peer-reviewed studies (Nature 2024, Science 2024) show statistical significance with p<0.05. The methodology involved controlled experiments with sample sizes >10,000 participants.';
  }
  
  if (userMessage.toLowerCase().includes('details')) {
    return 'The methodology used randomized controlled trials with double-blind procedures. Data was collected over 18 months across 15 countries. Statistical analysis employed regression models accounting for confounding variables.';
  }
  
  if (userMessage.toLowerCase().includes('disagree') || userMessage.toLowerCase().includes('challenge')) {
    return 'I appreciate the challenge. You\'re right to question this point. Recent meta-analyses (2024) actually show conflicting results, with 3 studies supporting and 2 studies contradicting this claim. The evidence is more mixed than initially presented.';
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function updateFactChecking(status, message) {
  const factChecks = document.getElementById('factChecks');
  
  const statusMap = {
    'analysis-complete': { icon: '✓', class: 'status--success' },
    'retrieval-active': { icon: '🔍', class: 'status--info' },
    'facts-retrieved': { icon: '📊', class: 'status--success' },
    'arguments-generated': { icon: '💭', class: 'status--success' },
    'response-generated': { icon: '✓', class: 'status--success' }
  };
  
  const statusInfo = statusMap[status] || { icon: '⏳', class: 'status--info' };
  
  const factCheckItem = document.createElement('div');
  factCheckItem.className = 'fact-check-item';
  factCheckItem.innerHTML = `
    <div class="fact-check-status ${statusInfo.class}">
      <span class="status-icon">${statusInfo.icon}</span>
      ${message}
    </div>
  `;
  
  factChecks.appendChild(factCheckItem);
  
  // Keep only last 5 items
  while (factChecks.children.length > 5) {
    factChecks.removeChild(factChecks.firstChild);
  }
}

function initializeFactChecking() {
  updateFactChecking('init', 'Fact-checking system initialized');
}

function showSourceModal(citationName) {
  const modal = document.getElementById('sourceModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = citationName;
  modalBody.innerHTML = `
    <div style="margin-bottom: 16px;">
      <strong>Source Type:</strong> Academic Research<br>
      <strong>Publication Date:</strong> 2024<br>
      <strong>Reliability:</strong> High<br>
      <strong>Peer Reviewed:</strong> Yes
    </div>
    <div style="margin-bottom: 16px;">
      <strong>Abstract:</strong><br>
      This comprehensive study examines the topic through multiple methodological approaches, 
      providing evidence-based insights that inform current debates and policy decisions.
    </div>
    <div>
      <strong>Key Findings:</strong>
      <ul>
        <li>Statistical significance found across multiple variables</li>
        <li>Methodology validated through peer review process</li>
        <li>Results consistent with previous research trends</li>
        <li>Implications for future policy development</li>
      </ul>
    </div>
  `;
  
  modal.classList.remove('hidden');
}