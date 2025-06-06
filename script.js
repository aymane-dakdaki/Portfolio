// JavaScript for interactivity and animations

// ... (code for cursor, typing, scroll reveal, menu, form is unchanged) ...
// 1. Custom Mouse Cursor
const customCursor = document.querySelector('.custom-cursor');
if (customCursor) { // Check if the element exists
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, input[type="submit"], .project-card, .skill-card, .certificate-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
        });
    });
}


// 2. Typing Effect in Hero Section
const typingTextElement = document.getElementById('typing-text');
if (typingTextElement) { // Check if the element exists
    const phrases = [
        "A Network Administrator.",
        "A Cybersecurity Analyst.",
        "A Technical Support Specialist.",
        "A Software Developer.",
        "A Problem Solver."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentTypingSpeed = 100; // milliseconds per character

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            currentTypingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            currentTypingSpeed = 100;
        } else {
            currentTypingSpeed = isDeleting ? 50 : 100;
        }

        setTimeout(typeWriter, currentTypingSpeed);
    }
}


// 3. Scroll Reveal Animation
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
if (scrollRevealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });
}

// 4. Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.setAttribute('aria-hidden', isExpanded);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });
}

// 5. Contact Form Submission (Frontend only)
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
        formMessage.classList.remove('hidden');
        formMessage.classList.add('text-green-400');
        formMessage.classList.remove('text-red-400');

        setTimeout(() => {
            contactForm.reset();
            formMessage.classList.add('hidden');
        }, 3000);
    });
}


// 6. Hero Section Canvas Animation (Network Nodes & Data Flow)
const canvas = document.getElementById('hero-canvas');
if (canvas) { 
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let edges = []; // ** NEW: Array to hold permanent connections **
    let dataPackets = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Node Class (update method is unchanged)
    class Node {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.baseVx = this.vx;
            this.baseVy = this.vy;
            this.originalX = x;
            this.originalY = y;
            this.maxSpeed = 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            let dx_mouse = this.x - mouse.x;
            let dy_mouse = this.y - mouse.y;
            let distance_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
            if (mouse.x !== null && distance_mouse < mouse.radius + this.radius) {
                let forceDirectionX = dx_mouse / distance_mouse;
                let forceDirectionY = dy_mouse / distance_mouse;
                let force = (mouse.radius + this.radius - distance_mouse) / (mouse.radius + this.radius);
                let repulsionStrength = 1;
                this.vx += forceDirectionX * force * repulsionStrength;
                this.vy += forceDirectionY * force * repulsionStrength;
            } else {
                let dx_initial = this.originalX - this.x;
                let dy_initial = this.originalY - this.y;
                let dist_initial = Math.sqrt(dx_initial * dx_initial + dy_initial * dy_initial);
                const return_to_initial_strength = 0.005;
                if (dist_initial > 1) {
                    this.vx += (dx_initial / dist_initial) * return_to_initial_strength;
                    this.vy += (dy_initial / dist_initial) * return_to_initial_strength;
                }
                this.vx += (this.baseVx - this.vx) * 0.05;
                this.vy += (this.baseVy - this.vy) * 0.05;
            }
            for (let i = 0; i < nodes.length; i++) {
                let otherNode = nodes[i];
                if (this !== otherNode) {
                    let dx_node = this.x - otherNode.x;
                    let dy_node = this.y - otherNode.y;
                    let distance_node = Math.sqrt(dx_node * dx_node + dy_node * dy_node);
                    const min_node_distance = this.radius + otherNode.radius + 15;
                    const node_repulsion_strength = 0.02;
                    if (distance_node < min_node_distance && distance_node > 0) {
                        let forceDirectionX = dx_node / distance_node;
                        let forceDirectionY = dy_node / distance_node;
                        let force = (min_node_distance - distance_node) / min_node_distance;
                        this.vx += forceDirectionX * force * node_repulsion_strength;
                        this.vy += forceDirectionY * force * node_repulsion_strength;
                    }
                }
            }
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > this.maxSpeed) {
                this.vx = (this.vx / currentSpeed) * this.maxSpeed;
                this.vy = (this.vy / currentSpeed) * this.maxSpeed;
            }
            this.x += this.vx;
            this.y += this.vy;
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.vx *= -1;
                this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.vy *= -1;
                this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
            }
            this.draw();
        }
    }

    // Data Packet Class (unchanged)
    class DataPacket {
        constructor(startNode, endNode, color, speed) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.x = startNode.x;
            this.y = startNode.y;
            this.color = color;
            this.speed = speed;
            this.progress = 0;
            this.radius = 3;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.startNode = this.endNode;
                let possibleNextNodes = nodes.filter(n => n !== this.startNode);
                if (possibleNextNodes.length === 0 && nodes.length > 0) {
                    this.endNode = nodes[0];
                } else if (possibleNextNodes.length === 0 && nodes.length === 0) {
                    return;
                } else {
                    this.endNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];
                }
                this.progress = 0;
            }
            if (!this.startNode || !this.endNode) {
                if (nodes.length > 1) {
                    this.startNode = nodes[Math.floor(Math.random() * nodes.length)];
                    this.endNode = nodes.filter(n => n !== this.startNode)[0] || this.startNode;
                    this.progress = 0;
                    if (!this.startNode || !this.endNode) return;
                } else {
                    return;
                }
            }
            this.x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            this.y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
            let dx_mouse_packet = this.x - mouse.x;
            let dy_mouse_packet = this.y - mouse.y;
            let distance_mouse_packet = Math.sqrt(dx_mouse_packet * dx_mouse_packet + dy_mouse_packet * dy_mouse_packet);
            if (mouse.x !== null && distance_mouse_packet < mouse.radius + this.radius && distance_mouse_packet > 0) {
                let forceDirectionX = dx_mouse_packet / distance_mouse_packet;
                let forceDirectionY = dy_mouse_packet / distance_mouse_packet;
                let force = (mouse.radius + this.radius - distance_mouse_packet) / (mouse.radius + this.radius);
                let repulsionStrength = 0.8;
                this.x += forceDirectionX * force * repulsionStrength * 2;
                this.y += forceDirectionY * force * repulsionStrength * 2;
            }
            this.draw();
        }
    }


    const numNodes = 25; 
    const numDataPackets = 15;
    const connectionsPerNode = 2; // ** NEW: How many connections each node should have **

    function initNetwork() {
        nodes = [];
        edges = []; // ** Clear edges on init **
        dataPackets = [];
        const homeSection = document.getElementById('home');
        if (!homeSection) return;
        
        canvas.width = homeSection.clientWidth; 
        canvas.height = homeSection.clientHeight;

        // Create Nodes
        for (let i = 0; i < numNodes; i++) {
            let radius = Math.random() * 5 + 4; 
            let x = Math.random() * (canvas.width - radius * 2) + radius; 
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let color = `rgba(129, 140, 248, ${Math.random() * 0.3 + 0.5})`; 
            nodes.push(new Node(x, y, radius, color));
        }
        
        // ** NEW: Create permanent edges between nearest neighbors **
        for (let i = 0; i < nodes.length; i++) {
            let distances = [];
            for (let j = 0; j < nodes.length; j++) {
                if (i !== j) {
                    let dist = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
                    distances.push({ nodeIndex: j, distance: dist });
                }
            }
            // Sort by distance and take the closest ones
            distances.sort((a, b) => a.distance - b.distance);
            for (let k = 0; k < connectionsPerNode && k < distances.length; k++) {
                // To avoid duplicate edges (e.g., A-B and B-A), we'll add a check before pushing
                let edgeExists = edges.some(edge => 
                    (edge.source === nodes[i] && edge.target === nodes[distances[k].nodeIndex]) ||
                    (edge.source === nodes[distances[k].nodeIndex] && edge.target === nodes[i])
                );
                if (!edgeExists) {
                    edges.push({ source: nodes[i], target: nodes[distances[k].nodeIndex] });
                }
            }
        }


        // Create Data Packets
        if (nodes.length > 1) { 
            for (let i = 0; i < numDataPackets; i++) {
                let startNode = nodes[Math.floor(Math.random() * nodes.length)];
                let endNode = nodes[Math.floor(Math.random() * nodes.length)];
                while (startNode === endNode) {
                    endNode = nodes[Math.floor(Math.random() * nodes.length)];
                }
                let speed = (Math.random() * 0.003) + 0.0015; 
                let color = `rgba(74, 222, 128, ${Math.random() * 0.4 + 0.6})`; 
                dataPackets.push(new DataPacket(startNode, endNode, color, speed));
            }
        }
    }

    function animateNetwork() {
        requestAnimationFrame(animateNetwork);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ** NEW: Draw the permanent edges **
        const maxDistForFade = Math.min(canvas.width, canvas.height) / 2;
        for (const edge of edges) {
            let dist = Math.sqrt(Math.pow(edge.source.x - edge.target.x, 2) + Math.pow(edge.source.y - edge.target.y, 2));
            ctx.beginPath();
            ctx.moveTo(edge.source.x, edge.source.y);
            ctx.lineTo(edge.target.x, edge.target.y);
            // Fade lines based on their length, but don't break the connection
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.4 - (dist / maxDistForFade) * 0.3})`;
            ctx.lineWidth = Math.max(0.1, 0.8 - (dist / maxDistForFade));
            ctx.stroke();
        }

        nodes.forEach(node => node.update());
        dataPackets.forEach(packet => packet.update());
    }

    // ... (rest of the code is unchanged)
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect(); 
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null; 
        mouse.y = null;
    });
    
    function handleResize() {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            canvas.width = homeSection.clientWidth;
            canvas.height = homeSection.clientHeight;
            initNetwork(); 
        }
    }

    window.addEventListener('resize', handleResize);
}

// General DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    if (typingTextElement) { 
        typeWriter();
    }
    if (canvas) { 
        const homeSection = document.getElementById('home');
        if (homeSection) { 
            canvas.width = homeSection.clientWidth;
            canvas.height = homeSection.clientHeight;
            if (typeof initNetwork === "function" && typeof animateNetwork === "function") {
                 initNetwork();
                 animateNetwork();
            }
        }
    }
});
