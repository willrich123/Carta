// Variáveis globais
let isLetterOpen = false;
let currentPhotoTarget = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    initializeAnimations();
    createBackgroundHearts();
    addScrollEffects();
});

// Função para abrir/fechar a carta
function toggleLetter() {
    const envelope = document.getElementById('letterEnvelope');
    const body = document.body;
    
    if (!isLetterOpen) {
        // Abrir carta
        envelope.classList.add('open');
        body.style.overflow = 'hidden'; // Previne scroll do body
        isLetterOpen = true;
        
        // Animar entrada dos elementos da carta
        setTimeout(() => {
            animateLetterContent();
        }, 800);
        
    } else {
        // Fechar carta
        envelope.classList.remove('open');
        body.style.overflow = 'auto';
        isLetterOpen = false;
    }
}

// Animações de entrada do conteúdo da carta
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

// Criar corações flutuantes no fundo
function createBackgroundHearts() {
    const heartsContainer = document.querySelector('.background-hearts');
    const heartEmojis = ['💕', '💖', '💗', '💝', '❤️', '💘'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-bg-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Posição aleatória
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        heart.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Animação
        heart.style.animation = `floatBgHearts ${Math.random() * 10 + 10}s linear infinite`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        
        heartsContainer.appendChild(heart);
        
        // Remover após a animação
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 15000);
    }
    
    // Criar corações periodicamente
    setInterval(createHeart, 3000);
    
    // Criar alguns corações iniciais
    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 1000);
    }
}

// Efeitos de rolagem
function addScrollEffects() {
    const letterContent = document.getElementById('letterContent');
    
    letterContent.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const scrollPercent = scrollTop / scrollHeight;
        
        // Efeito parallax nos corações flutuantes
        const floatingHearts = document.querySelectorAll('.floating-hearts .heart');
        floatingHearts.forEach((heart, index) => {
            const speed = (index + 1) * 0.5;
            heart.style.transform = `translateY(${scrollPercent * speed * 20}px) translateX(-50%)`;
        });
        
        // Efeito de fade nos elementos conforme rolagem
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

// Função para adicionar foto
function addPhoto(element) {
    currentPhotoTarget = element;
    document.getElementById('photoInput').click();
}

// Manipular upload de foto
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && currentPhotoTarget) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Criar elemento de imagem
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'photo-item';
            img.style.opacity = '0';
            
            // Limpar placeholder
            currentPhotoTarget.innerHTML = '';
            currentPhotoTarget.appendChild(img);
            
            // Animar entrada da foto
            setTimeout(() => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            }, 100);
            
            // Adicionar efeito de hover
            currentPhotoTarget.style.cursor = 'default';
            currentPhotoTarget.addEventListener('mouseenter', function() {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.3s ease';
            });
            
            currentPhotoTarget.addEventListener('mouseleave', function() {
                img.style.transform = 'scale(1)';
            });
            
            // Adicionar funcionalidade de clique para trocar foto
            currentPhotoTarget.addEventListener('click', function() {
                addPhoto(this);
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    // Limpar input
    event.target.value = '';
}

// Inicializar animações
function initializeAnimations() {
    // Animação de entrada do envelope
    const envelope = document.getElementById('letterEnvelope');
    envelope.style.opacity = '0';
    envelope.style.transform = 'translateY(50px) scale(0.9)';
    
    setTimeout(() => {
        envelope.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        envelope.style.opacity = '1';
        envelope.style.transform = 'translateY(0) scale(1)';
    }, 500);
    
    // Adicionar efeito de brilho no envelope
    setInterval(() => {
        if (!isLetterOpen) {
            envelope.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 182, 193, 0.5)';
            setTimeout(() => {
                envelope.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }, 1000);
        }
    }, 5000);
}

// Adicionar efeitos de partículas ao clicar
document.addEventListener('click', function(e) {
    if (isLetterOpen) {
        createClickParticles(e.clientX, e.clientY);
    }
});

function createClickParticles(x, y) {
    const particles = ['✨', '💫', '⭐', '💖'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.fontSize = '1rem';
        particle.style.opacity = '1';
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 50;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        particle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.left = endX + 'px';
            particle.style.top = endY + 'px';
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.5)';
        }, 10);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
}

// Adicionar efeito de digitação nas mensagens editáveis
document.addEventListener('DOMContentLoaded', function() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.background = 'linear-gradient(145deg, #fff, #fef7f7)';
            this.style.boxShadow = '0 0 10px rgba(255, 182, 193, 0.3)';
        });
        
        element.addEventListener('blur', function() {
            this.style.background = 'transparent';
            this.style.boxShadow = 'none';
        });
    });
});

// Função para salvar o conteúdo da carta
function saveLetterContent() {
    const content = {
        messages: [],
        name: document.querySelector('.name').textContent
    };
    
    document.querySelectorAll('.message-text').forEach(msg => {
        content.messages.push(msg.textContent);
    });
    
    localStorage.setItem('valentinesLetter', JSON.stringify(content));
    
    // Mostrar feedback visual
    const saveIndicator = document.createElement('div');
    saveIndicator.textContent = '💾 Carta salva!';
    saveIndicator.style.position = 'fixed';
    saveIndicator.style.top = '20px';
    saveIndicator.style.left = '50%';
    saveIndicator.style.transform = 'translateX(-50%)';
    saveIndicator.style.background = 'rgba(255, 255, 255, 0.9)';
    saveIndicator.style.padding = '10px 20px';
    saveIndicator.style.borderRadius = '20px';
    saveIndicator.style.zIndex = '9999';
    saveIndicator.style.opacity = '0';
    saveIndicator.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(saveIndicator);
    
    setTimeout(() => saveIndicator.style.opacity = '1', 10);
    setTimeout(() => {
        saveIndicator.style.opacity = '0';
        setTimeout(() => {
            if (saveIndicator.parentNode) {
                saveIndicator.parentNode.removeChild(saveIndicator);
            }
        }, 300);
    }, 2000);
}

// Carregar conteúdo salvo
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
    }
}

// Auto-salvar a cada 30 segundos
setInterval(saveLetterContent, 30000);

// Carregar conteúdo ao inicializar
document.addEventListener('DOMContentLoaded', loadLetterContent);


// Funcionalidades avançadas para gerenciamento de fotos

// Função melhorada para adicionar foto com preview
function addPhotoAdvanced(element) {
    currentPhotoTarget = element;
    
    // Adicionar classe de loading
    element.classList.add('loading');
    
    // Criar input customizado se não existir
    let photoInput = document.getElementById('photoInput');
    if (!photoInput) {
        photoInput = document.createElement('input');
        photoInput.type = 'file';
        photoInput.id = 'photoInput';
        photoInput.accept = 'image/*';
        photoInput.style.display = 'none';
        photoInput.onchange = handlePhotoUploadAdvanced;
        document.body.appendChild(photoInput);
    }
    
    photoInput.click();
}

// Manipulação avançada de upload de foto
function handlePhotoUploadAdvanced(event) {
    const file = event.target.files[0];
    if (file && currentPhotoTarget) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            currentPhotoTarget.classList.remove('loading');
            return;
        }
        
        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB.');
            currentPhotoTarget.classList.remove('loading');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Criar canvas para redimensionar a imagem
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calcular dimensões mantendo proporção
                const maxSize = 800;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Desenhar imagem redimensionada
                ctx.drawImage(img, 0, 0, width, height);
                
                // Converter para base64
                const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // Criar elemento de imagem final
                createPhotoElement(resizedDataUrl, currentPhotoTarget);
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Limpar input
    event.target.value = '';
}

// Criar elemento de foto com controles
function createPhotoElement(src, container) {
    // Limpar container
    container.innerHTML = '';
    container.classList.remove('loading');
    
    // Criar wrapper da foto
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-wrapper';
    
    // Criar imagem
    const img = document.createElement('img');
    img.src = src;
    img.className = 'photo-item';
    img.style.opacity = '0';
    
    // Criar controles da foto
    const controls = document.createElement('div');
    controls.className = 'photo-controls';
    
    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.className = 'photo-remove-btn';
    removeBtn.innerHTML = '✕';
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        removePhoto(container);
    };
    
    // Botão de filtro
    const filterBtn = document.createElement('button');
    filterBtn.className = 'photo-filter-btn';
    filterBtn.innerHTML = '🎨';
    filterBtn.onclick = (e) => {
        e.stopPropagation();
        togglePhotoFilter(img);
    };
    
    controls.appendChild(removeBtn);
    controls.appendChild(filterBtn);
    
    photoWrapper.appendChild(img);
    photoWrapper.appendChild(controls);
    container.appendChild(photoWrapper);
    
    // Animar entrada da foto
    setTimeout(() => {
        img.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
        img.style.opacity = '1';
    }, 100);
    
    // Adicionar efeitos de hover
    container.style.cursor = 'pointer';
    container.addEventListener('mouseenter', function() {
        controls.style.opacity = '1';
        img.style.transform = 'scale(1.05)';
    });
    
    container.addEventListener('mouseleave', function() {
        controls.style.opacity = '0';
        img.style.transform = 'scale(1)';
    });
    
    // Adicionar funcionalidade de clique para trocar foto
    container.addEventListener('click', function(e) {
        if (!e.target.closest('.photo-controls')) {
            addPhotoAdvanced(this);
        }
    });
    
    // Salvar automaticamente
    saveLetterContent();
}

// Remover foto
function removePhoto(container) {
    // Animar saída
    const photoWrapper = container.querySelector('.photo-wrapper');
    if (photoWrapper) {
        photoWrapper.style.transition = 'all 0.3s ease';
        photoWrapper.style.opacity = '0';
        photoWrapper.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            // Restaurar placeholder
            container.innerHTML = `
                <span class="add-photo-icon">📷</span>
                <span class="add-photo-text">Clique para adicionar uma foto</span>
            `;
            container.style.cursor = 'pointer';
            
            // Remover event listeners antigos
            container.replaceWith(container.cloneNode(true));
            const newContainer = container.parentNode.lastElementChild;
            newContainer.onclick = () => addPhotoAdvanced(newContainer);
            
            saveLetterContent();
        }, 300);
    }
}

// Alternar filtro da foto
function togglePhotoFilter(img) {
    const filters = [
        'none',
        'sepia(100%)',
        'grayscale(100%)',
        'brightness(1.2) contrast(1.1)',
        'hue-rotate(45deg) saturate(1.3)',
        'blur(1px) brightness(1.1)',
        'contrast(1.2) saturate(1.5)'
    ];
    
    let currentFilter = img.style.filter || 'none';
    let currentIndex = filters.indexOf(currentFilter);
    let nextIndex = (currentIndex + 1) % filters.length;
    
    img.style.filter = filters[nextIndex];
    img.style.transition = 'filter 0.3s ease';
    
    // Feedback visual
    const filterName = [
        'Original', 'Sépia', 'Preto e Branco', 'Brilhante', 
        'Colorido', 'Suave', 'Vibrante'
    ][nextIndex];
    
    showFilterFeedback(filterName, img);
}

// Mostrar feedback do filtro
function showFilterFeedback(filterName, img) {
    const feedback = document.createElement('div');
    feedback.textContent = filterName;
    feedback.className = 'filter-feedback';
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.background = 'rgba(0, 0, 0, 0.8)';
    feedback.style.color = 'white';
    feedback.style.padding = '5px 10px';
    feedback.style.borderRadius = '15px';
    feedback.style.fontSize = '0.8rem';
    feedback.style.zIndex = '1000';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease';
    
    img.parentNode.style.position = 'relative';
    img.parentNode.appendChild(feedback);
    
    setTimeout(() => feedback.style.opacity = '1', 10);
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 1500);
}

// Implementar drag & drop
function initializeDragAndDrop() {
    const photoPlaceholders = document.querySelectorAll('.photo-placeholder');
    
    photoPlaceholders.forEach(placeholder => {
        // Eventos de drag & drop
        placeholder.addEventListener('dragover', handleDragOver);
        placeholder.addEventListener('dragenter', handleDragEnter);
        placeholder.addEventListener('dragleave', handleDragLeave);
        placeholder.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            currentPhotoTarget = this;
            
            // Simular evento de input
            const fakeEvent = {
                target: {
                    files: [file],
                    value: ''
                }
            };
            
            handlePhotoUploadAdvanced(fakeEvent);
        }
    }
}

// Salvar fotos no localStorage (versão melhorada)
function savePhotosToStorage() {
    const photos = [];
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(img => {
        photos.push({
            src: img.src,
            filter: img.style.filter || 'none'
        });
    });
    
    localStorage.setItem('valentinesPhotos', JSON.stringify(photos));
}

// Carregar fotos do localStorage
function loadPhotosFromStorage() {
    const saved = localStorage.getItem('valentinesPhotos');
    if (saved) {
        const photos = JSON.parse(saved);
        const placeholders = document.querySelectorAll('.photo-placeholder');
        
        photos.forEach((photo, index) => {
            if (placeholders[index] && photo.src) {
                currentPhotoTarget = placeholders[index];
                createPhotoElement(photo.src, placeholders[index]);
                
                // Aplicar filtro salvo
                setTimeout(() => {
                    const img = placeholders[index].querySelector('.photo-item');
                    if (img && photo.filter) {
                        img.style.filter = photo.filter;
                    }
                }, 100);
            }
        });
    }
}

// Atualizar função de salvamento principal
const originalSaveLetterContent = saveLetterContent;
saveLetterContent = function() {
    originalSaveLetterContent();
    savePhotosToStorage();
};

// Atualizar função de carregamento principal
const originalLoadLetterContent = loadLetterContent;
loadLetterContent = function() {
    originalLoadLetterContent();
    loadPhotosFromStorage();
};

// Inicializar funcionalidades avançadas
document.addEventListener('DOMContentLoaded', function() {
    // Substituir função de clique simples pela avançada
    const placeholders = document.querySelectorAll('.photo-placeholder');
    placeholders.forEach(placeholder => {
        placeholder.onclick = () => addPhotoAdvanced(placeholder);
    });
    
    // Inicializar drag & drop
    initializeDragAndDrop();
    
    // Carregar fotos salvas
    setTimeout(loadPhotosFromStorage, 500);
});

