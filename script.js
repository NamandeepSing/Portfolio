document.addEventListener('DOMContentLoaded', function() {
    // try { initFaceTracking(); } catch (e) { console.error("FaceTracking failed", e); }
    try { initVoiceControl(); } catch (e) { console.error("VoiceControl failed", e); }
    try { createParticles(); } catch (e) { console.error("Particles failed", e); }
    try { makePortfolioDraggable(); } catch (e) { console.error("Draggable failed", e); }
    try { initAIChat(); } catch (e) { console.error("AI Chat failed", e); }
    try { addGameEasterEgg(); } catch (e) { console.error("Easter Egg failed", e); }
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        updateAgentMessage(isDark ? "Dark theme activated for better night viewing." : "Light theme activated for daytime clarity.");
    });
    
    // Audio Controls
    const audioToggle = document.getElementById('toggle-audio');
    const bgAudio = document.getElementById('bg-audio');
    let audioEnabled = false;
    
    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        
        if (audioEnabled) {
            bgAudio.play()
                .then(() => {
                    audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    updateAgentMessage("Ambient sounds enabled for immersive experience.");
                })
                .catch(error => {
                    console.error("Audio playback failed:", error);
                    audioEnabled = false;
                });
        } else {
            bgAudio.pause();
            audioToggle.innerHTML = '<i class="fas fa-music"></i>';
            updateAgentMessage("Ambient sounds disabled.");
        }
        localStorage.setItem('audioEnabled', audioEnabled);
    });
    
    // Initialize audio preference
    if (localStorage.getItem('audioEnabled') === 'true') {
        audioToggle.click();
    }
    
    // VR Mode Toggle
    const vrToggle = document.getElementById('toggle-vr');
    
    vrToggle.addEventListener('click', () => {
        body.classList.toggle('vr-mode');
        const isVR = body.classList.contains('vr-mode');
        vrToggle.innerHTML = isVR ? '<i class="fas fa-times"></i>' : '<i class="fas fa-vr-cardboard"></i>';
        
        if (isVR) {
            updateAgentMessage("VR mode activated! Try hovering over portfolio items for 3D effect.");
            playSoundEffect('audio/vr-activate.mp3');
        } else {
            updateAgentMessage("VR mode deactivated.");
        }
    });
    
    // Intelligent Agent
    const agent = document.getElementById('agent');
    const agentContainer = document.getElementById('agent-container');
    const agentMessage = document.getElementById('agent-message');
    
    // Agent messages based on time of day
    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning! Ready to explore my portfolio?";
        if (hour < 18) return "Good afternoon! Let me show you around.";
        return "Good evening! Take a look at my work.";
    }
    
    // Update agent message
    function updateAgentMessage(message, duration = 3000) {
        agentMessage.textContent = message;
        agentMessage.style.opacity = '1';
        agentMessage.style.visibility = 'visible';
        
        if (duration) {
            setTimeout(() => {
                agentMessage.style.opacity = '0';
                agentMessage.style.visibility = 'hidden';
            }, duration);
        }
    }
    
    
    // Initial agent greeting
    setTimeout(() => {
        updateAgentMessage(getTimeBasedGreeting(), 5000);
    }, 2000);
    
    // Agent follows cursor
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        const agentRect = agent.getBoundingClientRect();
        const agentX = agentRect.left + agentRect.width / 2;
        const agentY = agentRect.top + agentRect.height / 2;
        
        const angle = Math.atan2(y - agentY, x - agentX) * 180 / Math.PI;
        
        const eyes = document.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.transform = `rotate(${angle}deg)`;
        });
    });
    
    // Agent interaction
    agent.addEventListener('click', () => {
        const messages = [
            "I specialize in multimodal interfaces and mixed reality!",
            "Try hovering over the services for a cool effect!",
            "Check out the VR mode toggle in the bottom right!",
            "The portfolio items have 3D hover effects in VR mode!",
            "You can toggle dark/light mode in the top right!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        updateAgentMessage(randomMessage, 4000);
        playSoundEffect('audio/agent-speak.mp3');
    });
    
    // Play sound effects
    function playSoundEffect(src) {
        if (!audioEnabled) return;
        
        const sound = new Audio(src);
        sound.volume = 0.3;
        sound.play().catch(error => console.error("Sound effect error:", error));
    }
    
    // Simulate haptic feedback
    function simulateHaptic() {
        if (!document.getElementById('haptic-toggle')?.checked) return;
        
        body.classList.add('haptic-pulse');
        setTimeout(() => {
            body.classList.remove('haptic-pulse');
        }, 100);
        
        playSoundEffect('audio/haptic-click.mp3');
        
        // Device vibration if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Add haptic feedback to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, .tab-links, .filter-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('click', simulateHaptic);
    });
    
    // Initialize haptic preference
    const hapticToggle = document.getElementById('haptic-toggle');
    if (hapticToggle) {
        hapticToggle.checked = localStorage.getItem('hapticEnabled') !== 'false';
        hapticToggle.addEventListener('change', () => {
            localStorage.setItem('hapticEnabled', hapticToggle.checked);
            updateAgentMessage(`Haptic feedback ${hapticToggle.checked ? 'enabled' : 'disabled'}`);
            playSoundEffect('audio/toggle.mp3');
        });
    }
    
    // Service box hover effect
    const serviceBoxes = document.querySelectorAll('.service-box');
    serviceBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const x = e.pageX - box.getBoundingClientRect().left;
            const y = e.pageY - box.getBoundingClientRect().top;
            
            const effect = box.querySelector('.service-hover-effect');
            if (effect) {
                effect.style.setProperty('--x', `${x}px`);
                effect.style.setProperty('--y', `${y}px`);
            }
        });
    });
    
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-box');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            updateAgentMessage(`Showing ${filterValue === 'all' ? 'all projects' : filterValue + ' projects'}`);
            playSoundEffect('audio/filter-change.mp3');
        });
    });
    
    // Social proof counters
    const visitorCount = document.getElementById('visitor-count');
    const likeCount = document.getElementById('like-count');
    const commentCount = document.getElementById('comment-count');
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                element.textContent = target;
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }
    
    setTimeout(() => {
        if (visitorCount) animateCounter(visitorCount, 1245);
        if (likeCount) animateCounter(likeCount, 872);
        if (commentCount) animateCounter(commentCount, 156);
    }, 1000);
    
    // Active viewers simulation
    const viewerNotification = document.getElementById('viewer-notification');
    const activeViewers = document.getElementById('active-viewers');
    
    function updateViewerCount() {
        if (activeViewers) {
            const baseCount = Math.floor(Math.random() * 5) + 3;
            activeViewers.textContent = `${baseCount} people`;
            setTimeout(updateViewerCount, Math.random() * 5000 + 5000);
        }
    }
    
    if (viewerNotification) {
        setTimeout(() => {
            viewerNotification.style.display = 'inline-flex';
            updateViewerCount();
        }, 3000);
    }
    
    // Form submission
    const contactForm = document.getElementById('contact-form');
    const feedbackForm = document.getElementById('feedback-form');
    
    function handleFormSubmit(form, successMessage) {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                simulateHaptic();
                
                Swal.fire({
                    title: 'Success!',
                    text: successMessage,
                    icon: 'success',
                    confirmButtonColor: '#59B2F4',
                });
                
                form.reset();
                updateAgentMessage("Thank you for your message! I'll get back to you soon.");
                playSoundEffect('audio/form-success.mp3');
            });
        }
    }
    
    handleFormSubmit(contactForm, 'Your message has been sent successfully!');
    handleFormSubmit(feedbackForm, 'Thank you for your feedback!');
    
    // Typed.js initialization
    if (document.querySelector('.typed-text')) {
        const typed = new Typed('.typed-text', {
            strings: ['Frontend Developer', 'Backend Developer', 'ML Engineer'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }
    
    // Swiper initialization
    if (document.querySelector('.swiper')) {
        const swiper = new Swiper('.swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
    
    // Mobile menu toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            navbar.classList.toggle('active');
            
            if (navbar.classList.contains('active')) {
                updateAgentMessage("Mobile menu opened. Choose a section to explore!");
            }
        });
        
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }
    
    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) header.classList.toggle('sticky', window.scrollY > 100);
        
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) backToTop.classList.toggle('active', window.scrollY > 300);
    });
    
    // Context-aware agent messages based on scroll position
    let lastSection = '';
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 300 && window.scrollY < sectionTop + sectionHeight - 300) {
                currentSection = section.id;
            }
        });
        
        if (currentSection !== lastSection) {
            lastSection = currentSection;
            let message = '';
            
            switch(currentSection) {
                case 'home':
                    message = "Welcome to my portfolio! Scroll down to learn more about me.";
                    break;
                case 'about':
                    message = "Here's more about my skills and experience. Try hovering over the QR code!";
                    break;
                case 'services':
                    message = "These are my core services. Hover over them for a cool effect!";
                    break;
                case 'portfolio':
                    message = "Check out my projects. Use the filters to sort them by category!";
                    break;
                case 'testimonials':
                    message = "See what clients say about my work. You can leave feedback too!";
                    break;
                case 'contact':
                    message = "Ready to work together? Fill out the form to get in touch!";
                    break;
            }
            
            if (message) updateAgentMessage(message, 5000);
        }
    });
    
    // Tab functionality
    
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            updateAgentMessage("Taking you back to the top!");
            playSoundEffect('audio/scroll-up.mp3');
        });
    }
    
    // QR code interaction
    const qrCode = document.getElementById('qr-code');
    if (qrCode) {
        qrCode.addEventListener('click', () => {
            Swal.fire({
                title: 'AR Experience',
                text: 'Scan this QR code with your mobile device to view an AR demo of my work!',
                imageUrl: 'img/qr-code.png',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'AR Experience QR Code',
                confirmButtonText: 'Got it!',
                confirmButtonColor: '#59B2F4',
            });
            updateAgentMessage("AR demo activated! Scan the QR code with your mobile device.");
            playSoundEffect('audio/ar-activate.mp3');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
    
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
    
                document.querySelectorAll('.navbar a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    
    // Initialize active section tracking
    function setActiveLink() {
        const scrollPosition = window.scrollY;
        const navbarLinks = document.querySelectorAll('.navbar a');
        
        navbarLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            
            if (section) {
                if (section.offsetTop <= scrollPosition + 150 && 
                    section.offsetTop + section.offsetHeight > scrollPosition + 150) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
    
    // Easter egg - Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                document.body.style.animation = 'rainbow 5s linear infinite';
                updateAgentMessage("Secret mode activated! Enjoy the colors!", 5000);
                playSoundEffect('audio/easter-egg.mp3');
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
            }
        } else {
            konamiIndex = 0;
        }
    });
    const glow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX - 75}px, ${e.clientY - 75}px)`;
    });

    
    // Add rainbow animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Custom cursor for VR mode
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('vr-mode')) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        });
        
        document.addEventListener('mouseenter', () => {
            if (document.body.classList.contains('vr-mode')) {
                cursor.style.opacity = '1';
            }
        });
        
        document.addEventListener('mouseleave', () => {
            if (document.body.classList.contains('vr-mode')) {
                cursor.style.opacity = '0';
            }
        });
        
        // Add active state to cursor when hovering interactive elements
        document.querySelectorAll('a, button, .portfolio-box, .service-box, .tab-links').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (document.body.classList.contains('vr-mode')) {
                    document.querySelector('.custom-cursor').classList.add('active');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (document.body.classList.contains('vr-mode')) {
                    document.querySelector('.custom-cursor').classList.remove('active');
                }
            });
        });
    }
    
    initCustomCursor();
    
    // Final initialization
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('active');
    }
    
    // Final agent message
    setTimeout(() => {
        updateAgentMessage("Feel free to explore! I'm here if you need help.", 6000);
    }, 3000);
    
    // Check device capabilities
    function checkDeviceCapabilities() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMotionSupported = window.DeviceMotionEvent !== undefined;
        const isVRSupported = navigator.xr !== undefined;
        
        let capabilityMessage = "Your device supports: ";
        const capabilities = [];
        
        if (isTouchDevice) capabilities.push("touch");
        if (isMotionSupported) capabilities.push("motion sensing");
        if (isVRSupported) capabilities.push("VR");
        
        if (capabilities.length > 0) {
            capabilityMessage += capabilities.join(", ");
            setTimeout(() => {
                updateAgentMessage(capabilityMessage, 5000);
            }, 8000);
        }
        
        if (!isVRSupported) {
            const vrToggle = document.getElementById('toggle-vr');
            if (vrToggle) vrToggle.style.display = 'none';
        }
    }
    
    setTimeout(checkDeviceCapabilities, 5000);
});

function updateAgentMessage(message) {
    const agentMsg = document.getElementById('agent-message');
    if (agentMsg) agentMsg.textContent = message;
}
function openTab(event, tabName) {
    const tabLinks = document.querySelectorAll('.tab-links');
    const tabContents = document.querySelectorAll('.tab-contents');

    tabLinks.forEach(link => link.classList.remove('active-link'));
    tabContents.forEach(content => content.classList.remove('active-tab'));

    document.getElementById(tabName).classList.add('active-tab');
    event.currentTarget.classList.add('active-link');
}

async function initFaceTracking() {
    // 1. Create avatar element
    const avatar = document.createElement('div');
    avatar.id = 'face-avatar';
    avatar.style.cssText = `
        position: fixed;
        width: 150px;
        height: 150px;
        background: url('img/3d-avatar.png') center/contain no-repeat;
        z-index: 1000;
        pointer-events: none;
        transition: left 0.15s ease-out, top 0.15s ease-out;
        left: 0px;
        top: 0px;
        filter: drop-shadow(0 0 5px #00f4ff80);
        `;
    document.body.appendChild(avatar);
  
    // 2. Load models
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
      ]);
      console.log("Face API models loaded.");
    } catch (err) {
      console.error("Model loading failed:", err);
      return;
    }
  
    // 3. Setup video feed
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      video.srcObject = stream;
      await video.play();
      console.log("Camera stream ready.");
    } catch (err) {
      console.error("Camera access failed:", err);
      return;
    }
  
    // 4. Create canvas once for all detections
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '999';
    document.body.appendChild(canvas);
  
    faceapi.matchDimensions(canvas, {
      width: video.videoWidth,
      height: video.videoHeight
    });
  
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.4
    });
  
    // 5. Animate tracking
    let prevX = window.innerWidth / 2;
    let prevY = window.innerHeight / 2;
  
    async function track() {
      const result = await faceapi.detectSingleFace(video, options).withFaceLandmarks();
  
      const dims = faceapi.matchDimensions(canvas, {
        width: video.videoWidth,
        height: video.videoHeight
      });
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  
      if (result) {
        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims));
        faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(result, dims));
  
        const nose = result.landmarks.getNose();
        const rawX = (nose[3].x / video.videoWidth) * window.innerWidth;
        const rawY = (nose[3].y / video.videoHeight) * window.innerHeight;
  
        // Smooth movement using linear interpolation
        const smoothX = prevX + (rawX - prevX) * 0.2;
        const smoothY = prevY + (rawY - prevY) * 0.2;
        avatar.style.left = `${smoothX}px`;
        avatar.style.top = `${smoothY}px`;
  
        prevX = smoothX;
        prevY = smoothY;
      } else {
        // Optional: fade or center when no face
        avatar.style.left = `50%`;
        avatar.style.top = `50%`;
      }
  
      requestAnimationFrame(track);
    }
  
    track();
  }
  
  // Start tracking
//   initFaceTracking();

// Start the application
// initFaceTracking();
  
//   // Initialize when scripts are loaded
//   window.addEventListener('DOMContentLoaded', () => {
//     // Wait for face-api.js to be ready
//     if (typeof faceapi !== 'undefined') {
//       initFaceTracking();
//     } else {
//       console.error('face-api.js not loaded');
//     }
//   });
  
  function initVoiceControl() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Initialize message for user feedback
    const updateAgentMessage = (message) => {
        console.log(message);  // Log the message for debugging
        alert(message);  // For now, showing alert for user feedback
    }

    recognition.onstart = () => {
        updateAgentMessage("Voice recognition started. Try saying 'dark mode' or 'VR mode'.");
    }

    recognition.onend = () => {
        updateAgentMessage("Voice recognition stopped. Click the button to start again.");
    }

    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();
        console.log("Command detected:", command);  // Log detected command

        if (command.includes('dark mode')) {
            console.log("Dark mode command recognized.");
            document.getElementById('theme-toggle').click();
            updateAgentMessage("Dark mode activated!");
        }
        if (command.includes('vr mode')) {
            console.log("VR mode command recognized.");
            document.getElementById('toggle-vr').click();
            updateAgentMessage("VR mode activated!");
        }
        if (command.includes('contact')) {
            console.log("Contact command recognized.");
            document.querySelector('a[href="#contact"]').click();
            updateAgentMessage("Navigating to contact section.");
        }
    };

    recognition.onerror = (event) => {
        updateAgentMessage(`Error occurred: ${event.error}`);
    };

    // Add voice control button
    const voiceBtn = document.createElement('button');
    voiceBtn.id = 'voice-control-btn';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceBtn.className = 'voice-btn';
    document.body.appendChild(voiceBtn);

    // Button click to start recognition
    document.addEventListener('click', (e) => {
        if (e.target.id === 'voice-control-btn') {
            updateAgentMessage("Voice control activated! Speak now.");
            recognition.start();
        }
    });

    // Add CSS dynamically for styling
    const style = document.createElement('style');
    style.textContent = `
        .voice-btn {
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #59B2F4;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .voice-btn:hover {
            transform: scale(1.1);
        }
        .voice-btn.listening {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(89, 178, 244, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(89, 178, 244, 0); }
            100% { box-shadow: 0 0 0 0 rgba(89, 178, 244, 0); }
        }s
    `;
    document.head.appendChild(style);
}

// initVoiceControl();



function createParticles() {
    // Setup
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles
    const particles = [];
    const particleCount = Math.min(window.innerWidth / 3, 300); // Limit count
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1, // Increase max size
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.5, // Random opacity
            color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random hue
        });
    }

    // Mouse
    let mouseX = null;
    let mouseY = null;
    
    // Animation
    let animationId;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gradient Background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach((p, i) => {
            // Movement
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounds
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            // Mouse interaction
            if (mouseX !== null && mouseY !== null) {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    p.x += dx * 0.05 * force; // Increased interaction force
                    p.y += dy * 0.05 * force;
                    p.size = Math.random() * 4 + 1; // Change size on interaction
                }
            }

            // Draw particle with dynamic opacity and color
            ctx.fillStyle = `hsla(${(Math.random() * 360)}, 100%, 50%, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(89, 178, 244, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    // Event Listeners
    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // CSS Styling
    const style = document.createElement('style');
    style.textContent = `
        #particle-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.2; /* Adjust opacity to make it subtle */
            pointer-events: none; /* Ensure it doesn't interfere with interactions */

            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Start animation
    animate();

    // Cleanup method
    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(canvas);
            document.head.removeChild(style);
        }
    };
}


// Usage:
const particles = createParticles();
Later: particles.destroy();
function makePortfolioDraggable() {
    const portfolioItems = document.querySelectorAll('.portfolio-box');
    
    portfolioItems.forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.id);
            setTimeout(() => {
                item.style.opacity = '0.4';
            }, 0);
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
        });
    });
    
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        
        // Calculate new position
        const dropX = e.clientX;
        const dropY = e.clientY;
        
        // Apply 3D transform based on drop position
        const xDist = dropX - window.innerWidth/2;
        const yDist = dropY - window.innerHeight/2;
        
        draggable.style.transform = `
            translate(${dropX - draggable.offsetWidth/2}px, ${dropY - draggable.offsetHeight/2}px)
            rotateX(${yDist/20}deg)
            rotateY(${xDist/20}deg)
        `;
    });
    
    // Add to CSS:
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-box {
            transition: transform 0.5s ease, opacity 0.3s ease;
            cursor: grab;
        }
        .portfolio-box:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);
}
function initAIChat() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'ai-chat-container';
    chatContainer.innerHTML = `
        <div id="ai-chat-header">
            <h3>Ask Me Anything</h3>
            <button id="close-chat"><i class="fas fa-times"></i></button>
        </div>
        <div id="ai-chat-messages"></div>
        <div id="ai-chat-input">
            <input type="text" placeholder="Ask about my skills or projects...">
            <button id="send-message"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(chatContainer);
    
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chat-btn';
    chatBtn.innerHTML = '<i class="fas fa-robot"></i>';
    document.body.appendChild(chatBtn);
    
    // Simple AI responses (in a real app you'd connect to an API)
    const aiResponses = {
        "skills": "I specialize in AR/VR development, 3D modeling, and multimodal UI design. Check my 'About' section for details!",
        "projects": "My portfolio showcases my best work. Try filtering by AR, VR or 3D to see specific projects!",
        "contact": "You can reach me through the contact form or connect with me on LinkedIn. Just say 'contact'!",
        "default": "I'm an AI assistant for Mark's portfolio. Ask about his skills, projects, or how to contact him!"
    };
    
    chatBtn.addEventListener('click', () => {
        chatContainer.style.display = 'block';
    });
    
    document.getElementById('close-chat')?.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });
    
    document.getElementById('send-message')?.addEventListener('click', sendMessage);
    document.querySelector('#ai-chat-input input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    function sendMessage() {
        const input = document.querySelector('#ai-chat-input input');
        const message = input.value.toLowerCase();
        input.value = '';
        
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        
        // Generate AI response
        let response = aiResponses.default;
        if (message.includes('skill')) response = aiResponses.skills;
        if (message.includes('project') || message.includes('work')) response = aiResponses.projects;
        if (message.includes('contact') || message.includes('hire')) response = aiResponses.contact;
        
        // Simulate typing
        setTimeout(() => {
            addMessage(response, 'ai');
        }, 1000);
    }
    
    function addMessage(text, sender) {
        const messages = document.getElementById('ai-chat-messages');
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }
    
    // Add to CSS:
    const style = document.createElement('style');
    style.textContent = `
        #ai-chat-btn {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--main-color);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 0 15px var(--main-color);
            transition: all 0.3s ease;
        }
        #ai-chat-btn:hover {
            transform: scale(1.1);
        }
        #ai-chat-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 300px;
            height: 400px;
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 1001;
            overflow: hidden;
        }
        #ai-chat-header {
            padding: 15px;
            background: var(--main-color);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #ai-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
        }
        #ai-chat-input {
            padding: 10px;
            display: flex;
            border-top: 1px solid var(--shadow-color);
        }
        #ai-chat-input input {
            flex: 1;
            padding: 8px;
            border: 1px solid var(--main-color);
            border-radius: 20px;
            margin-right: 10px;
        }
        #ai-chat-input button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--main-color);
            color: white;
            border: none;
            cursor: pointer;
        }
        .message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 80%;
        }
        .message.user {
            background: var(--main-color);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }
        .message.ai {
            background: var(--snd-bg-color);
            margin-right: auto;
            border-bottom-left-radius: 5px;
        }
    `;
    document.head.appendChild(style);
}
function addGameEasterEgg() {
    // Add a hidden trigger element
    const trigger = document.createElement('div');
    trigger.className = 'easter-egg-trigger';
    trigger.innerHTML = '???';
    document.body.appendChild(trigger);

    // Add to CSS:
    const style = document.createElement('style');
    style.textContent = `
        .easter-egg-trigger {
            position: fixed;
            top: 10px;
            left: 10px;
            color: white; /* Make visible for testing */
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
        }
        #easter-egg-game {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9998;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: white;
        }
        #game-canvas {
            border: 2px solid white;
            background: #111;
        }
        #close-game {
            padding: 10px 20px;
            background: #fff;
            color: #000;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'easter-egg-game';
    gameContainer.innerHTML = `
        <h2>Secret Portfolio Game!</h2>
        <p>Score: 0. Use arrow keys to move. Collect the cubes!</p>
        <canvas id="game-canvas" width="600" height="400"></canvas>
        <button id="close-game">Back to Portfolio</button>
    `;
    document.body.appendChild(gameContainer);

    // Show game on click
    trigger.addEventListener('click', () => {
        gameContainer.style.display = 'flex';
        startMiniGame();
    });

    // Close button
    gameContainer.addEventListener('click', (e) => {
        if (e.target.id === 'close-game') {
            gameContainer.style.display = 'none';
        }
    });

    function startMiniGame() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        const player = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 20,
            speed: 4,
            color: '#00f'
        };

        let cubes = [];
        let score = 0;
        const keys = {};

        // Generate initial cubes
        function generateCubes() {
            cubes = [];
            for (let i = 0; i < 5; i++) {
                cubes.push({
                    x: Math.random() * (canvas.width - 15),
                    y: Math.random() * (canvas.height - 15),
                    size: 15,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`
                });
            }
        }
        generateCubes();

        // Listen for keyboard
        document.addEventListener('keydown', e => keys[e.key] = true);
        document.addEventListener('keyup', e => keys[e.key] = false);

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Move player
            if (keys['ArrowUp']) player.y -= player.speed;
            if (keys['ArrowDown']) player.y += player.speed;
            if (keys['ArrowLeft']) player.x -= player.speed;
            if (keys['ArrowRight']) player.x += player.speed;

            // Boundaries
            player.x = Math.max(0, Math.min(player.x, canvas.width - player.size));
            player.y = Math.max(0, Math.min(player.y, canvas.height - player.size));

            // Draw player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.size, player.size);

            // Draw cubes & check collisions
            cubes.forEach((cube, i) => {
                ctx.fillStyle = cube.color;
                ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

                if (player.x < cube.x + cube.size &&
                    player.x + player.size > cube.x &&
                    player.y < cube.y + cube.size &&
                    player.y + player.size > cube.y) {
                    // Collision!
                    cubes.splice(i, 1);
                    score++;
                    updateScoreText();
                    // Add new cube
                    cubes.push({
                        x: Math.random() * (canvas.width - 15),
                        y: Math.random() * (canvas.height - 15),
                        size: 15,
                        color: `hsl(${Math.random() * 360}, 70%, 50%)`
                    });
                }
            });

            requestAnimationFrame(gameLoop);
        }

        function updateScoreText() {
            const scoreText = gameContainer.querySelector('p');
            scoreText.textContent = `Score: ${score}. Use arrow keys to move. Collect the cubes!`;
        }

        updateScoreText();
        gameLoop();
    }
}



// Service worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Beforeinstallprompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const agentMessage = document.getElementById('agent-message');
    if (agentMessage) {
        agentMessage.textContent = "This website can be installed as an app!";
        document.getElementById('agent-container').style.opacity = '1';
        setTimeout(() => {
            document.getElementById('agent-container').style.opacity = '0';
        }, 5000);
    }
    
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.className = 'btn btn-primary';
    installButton.style.margin = '1rem auto';
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                const agentMessage = document.getElementById('agent-message');
                if (agentMessage) {
                    agentMessage.textContent = "Thank you for installing!";
                    document.getElementById('agent-container').style.opacity = '1';
                    setTimeout(() => {
                        document.getElementById('agent-container').style.opacity = '0';
                    }, 3000);
                }
            }
            deferredPrompt = null;
        });
    });
    
    const liveFeedback = document.querySelector('.live-feedback');
    if (liveFeedback) {
        liveFeedback.appendChild(installButton);
    }
});