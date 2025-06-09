// Variáveis globais
let isLetterOpen = false;
let currentPhotoTarget = null;

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
    initializeAnimations();
    createBackgroundHearts();
    addScrollEffects();
    loadLetterContent(); // Carrega conteúdo salvo
});

// Função para abrir/fechar a carta
function toggleLetter() {
    const envelope = document.getElementById('letterEnvelope');
    const body = document.body;

    if (!isLetterOpen) {
        envelope.classList.add('open');
        body.style.overflow = 'hidden';
        isLetterOpen = true;
        setTimeout(() => animateLetterContent(), 800);
    } else {
        envelope.classList.remove('open');
        body.style.overflow = 'auto';
        isLetterOpen = false;
    }
}

// Animações do conteúdo
function animateLetterContent() {
    const sections = document.querySelectorAll('.letter-content section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Corações flutuantes
function createBackgroundHearts() {
    const heartsContainer = document.querySelector('.background-hearts');
    const heartEmojis = ['💕', '💖', '💗', '💝', '❤️', '💘'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-bg-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        heart.style.opacity = Math.random() * 0.3 + 0.1;
        heart.style.animation = `floatBgHearts ${Math.random() * 10 + 10}s linear infinite`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 15000);
    }

    setInterval(createHeart, 3000);
    for (let i = 0; i < 5; i++) setTimeout(createHeart, i * 1000);
}

// Efeitos de rolagem
function addScrollEffects() {
    const letterContent = document.getElementById('letterContent');
    letterContent.addEventListener('scroll', function () {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const scrollPercent = scrollTop / scrollHeight;

        const floatingHearts = document.querySelectorAll('.floating-hearts .heart');
        floatingHearts.forEach((heart, index) => {
            const speed = (index + 1) * 0.5;
            heart.style.transform = `translateY(${scrollPercent * speed * 20}px) translateX(-50%)`;
        });

        const sections = document.querySelectorAll('.letter-content section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const containerRect = letterContent.getBoundingClientRect();

            if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

// Selecionar elemento para inserir imagem
function addPhoto(element) {
    currentPhotoTarget = element;
    document.getElementById('photoInput').click();
}

// Carregar imagem
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && currentPhotoTarget) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'photo-item';
            img.style.opacity = '0';
            currentPhotoTarget.innerHTML = '';
            currentPhotoTarget.appendChild(img);

            setTimeout(() => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            }, 100);

            currentPhotoTarget.style.cursor = 'default';
            currentPhotoTarget.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });
            currentPhotoTarget.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
            currentPhotoTarget.addEventListener('click', function () {
                addPhoto(this);
            });
        };
        reader.readAsDataURL(file);
    }
    event.target.value = '';
}

// Salvar conteúdo da carta (incluindo imagens)
function saveLetterContent() {
    const content = {
        name: document.querySelector('.name')?.textContent || '',
        messages: [],
        photos: []
    };

    document.querySelectorAll('.message-text').forEach(msg => {
        content.messages.push(msg.textContent);
    });

    document.querySelectorAll('.photo-container').forEach(photoDiv => {
        const img = photoDiv.querySelector('img');
        content.photos.push(img ? img.src : null);
    });

    localStorage.setItem('valentinesLetter', JSON.stringify(content));

    const saveIndicator = document.createElement('div');
    saveIndicator.textContent = '💾 Carta salva!';
    Object.assign(saveIndicator.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 20px',
        borderRadius: '20px',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(saveIndicator);
    setTimeout(() => saveIndicator.style.opacity = '1', 10);
    setTimeout(() => {
        saveIndicator.style.opacity = '0';
        setTimeout(() => saveIndicator.remove(), 300);
    }, 2000);
}

// Carregar conteúdo da carta (incluindo imagens)
function loadLetterContent() {
    const saved = localStorage.getItem('valentinesLetter');
    if (saved) {
        const content = JSON.parse(saved);
        const messageElements = document.querySelectorAll('.message-text');

        content.messages.forEach((msg, index) => {
            if (messageElements[index]) {
                messageElements[index].textContent = msg;
            }
        });

        if (content.name) {
            document.querySelector('.name').textContent = content.name;
        }

        const photoContainers = document.querySelectorAll('.photo-container');
        content.photos.forEach((photoSrc, index) => {
            if (photoContainers[index] && photoSrc) {
                const img = document.createElement('img');
                img.src = photoSrc;
                img.className = 'photo-item';
                photoContainers[index].innerHTML = '';
                photoContainers[index].appendChild(img);
            }
        });
    }
}

// Auto-salvar a cada 30 segundos
setInterval(saveLetterContent, 30000);

// Digitação com efeito
document.addEventListener('DOMContentLoaded', function () {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.style.background = 'linear-gradient(145deg, #fff, #fef7f7)';
            this.style.boxShadow = '0 0 10px rgba(255, 182, 193, 0.3)';
        });
        element.addEventListener('blur', function () {
            this.style.background = 'transparent';
            this.style.boxShadow = 'none';
        });
    });
});

// Input para upload
if (!document.getElementById('photoInput')) {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'photoInput';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', handlePhotoUpload);
    document.body.appendChild(input);
}
