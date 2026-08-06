document.addEventListener('DOMContentLoaded', () => {
    const siteHeader = document.getElementById('site-header');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuSearch = document.getElementById('menuSearch');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const announcementBar = document.getElementById('announcement-bar');
    const closeAnnouncement = document.getElementById('closeAnnouncement');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // 1. Announcement bar close
    if (closeAnnouncement && announcementBar) {
        closeAnnouncement.addEventListener('click', () => {
            announcementBar.style.display = 'none';
            siteHeader.style.top = '0';
        });
    }

    // 2. Sticky header & scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        if (scrollToTopBtn) {
            scrollToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.style.display = 'none';
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Dark mode toggle
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // 4. Mobile Navigation
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('open');
            });
        });
    }

    // 5. Store Live Status Badge (7:00 AM - 11:00 PM)
    const storeStatusBadge = document.getElementById('storeStatusBadge');
    if (storeStatusBadge) {
        const checkStoreStatus = () => {
            const now = new Date();
            const hour = now.getHours();
            const statusText = storeStatusBadge.querySelector('.status-text');
            if (hour >= 7 && hour < 23) {
                storeStatusBadge.className = 'store-status-badge open';
                statusText.textContent = 'Open Now (Till 11 PM)';
            } else {
                storeStatusBadge.className = 'store-status-badge closed';
                statusText.textContent = 'Closed (Opens 7 AM)';
            }
        };
        checkStoreStatus();
        setInterval(checkStoreStatus, 60000);
    }

    // 6. Interactive Price Estimator
    const estCategory = document.getElementById('estCategory');
    const estQuantity = document.getElementById('estQuantity');
    const estResult = document.getElementById('estResult');
    const estOrderBtn = document.getElementById('estOrderBtn');

    const prices = { bread: 60, burger: 60, cake: 350, laddu: 200, samosa: 10 };

    if (estCategory && estQuantity && estResult) {
        const updateEstimator = () => {
            const cat = estCategory.value;
            const qty = parseInt(estQuantity.value) || 1;
            const total = (prices[cat] || 60) * qty;
            estResult.textContent = `৳${total} BDT`;
        };
        estCategory.addEventListener('change', updateEstimator);
        estQuantity.addEventListener('input', updateEstimator);

        if (estOrderBtn) {
            estOrderBtn.addEventListener('click', () => {
                const cat = estCategory.options[estCategory.selectedIndex].text;
                const qty = estQuantity.value;
                const total = estResult.textContent;
                const msg = encodeURIComponent(`Hello Bagdad Bread Factory, I would like to estimate/order:\n- ${cat} x ${qty}\n- Total: ${total}`);
                window.open(`https://wa.me/8801711063961?text=${msg}`, '_blank');
            });
        }
    }

    // 7. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });

    // 8. Menu Search & Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.menu-category-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');

                categoryCards.forEach(card => {
                    card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? '' : 'none';
                });
            });
        });
    }

    if (menuSearch) {
        menuSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            categoryCards.forEach(card => {
                const rows = card.querySelectorAll('tbody tr');
                let matchFound = false;

                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = '';
                        matchFound = true;
                    } else {
                        row.style.display = 'none';
                    }
                });
                card.style.display = (query === '' || matchFound) ? '' : 'none';
            });
        });
    }

    // 9. Interactive Shopping Cart & WhatsApp Checkout
    let cart = JSON.parse(localStorage.getItem('bagdad_cart')) || [];
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const checkoutWhatsAppBtn = document.getElementById('checkoutWhatsAppBtn');

    const updateCartUI = () => {
        localStorage.setItem('bagdad_cart', JSON.stringify(cart));
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartBadge) cartBadge.textContent = totalItems;

        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
            if (cartTotalPrice) cartTotalPrice.textContent = '৳0 BDT';
            if (checkoutWhatsAppBtn) checkoutWhatsAppBtn.disabled = true;
            return;
        }

        let html = '';
        let grandTotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            grandTotal += itemTotal;
            html += `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>৳${item.price} x ${item.qty} = ৳${itemTotal}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-btn" onclick="decreaseCartQty(${index})">-</button>
                        <span>${item.qty}</span>
                        <button class="cart-qty-btn" onclick="increaseCartQty(${index})">+</button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        if (cartTotalPrice) cartTotalPrice.textContent = `৳${grandTotal} BDT`;
        if (checkoutWhatsAppBtn) checkoutWhatsAppBtn.disabled = false;
    };

    window.increaseCartQty = (index) => {
        cart[index].qty++;
        updateCartUI();
    };

    window.decreaseCartQty = (index) => {
        cart[index].qty--;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    if (cartToggleBtn && cartDrawer) {
        cartToggleBtn.addEventListener('click', () => cartDrawer.classList.add('active'));
        closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));
        cartDrawer.addEventListener('click', (e) => {
            if (e.target === cartDrawer) cartDrawer.classList.remove('active');
        });
    }

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const name = row.getAttribute('data-name');
            const price = parseFloat(row.getAttribute('data-price'));

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            updateCartUI();
            if (cartDrawer) cartDrawer.classList.add('active');
        });
    });

    if (checkoutWhatsAppBtn) {
        checkoutWhatsAppBtn.addEventListener('click', () => {
            let msg = 'Hello Bagdad Bread Factory, I would like to place an order:%0A';
            let grandTotal = 0;
            cart.forEach(item => {
                const total = item.price * item.qty;
                grandTotal += total;
                msg += `- ${item.name} (${item.qty}x) = ৳${total}%0A`;
            });
            msg += `%0AGrand Total: ৳${grandTotal} BDT`;
            window.open(`https://wa.me/8801711063961?text=${msg}`, '_blank');
        });
    }

    updateCartUI();

    // 10. Interactive Gallery Lightbox
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.getElementById('closeLightbox');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const caption = item.getAttribute('data-caption');
            if (lightboxImg && lightboxModal) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = caption;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (closeLightbox && lightboxModal) {
        closeLightbox.addEventListener('click', () => lightboxModal.classList.remove('active'));
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) lightboxModal.classList.remove('active');
        });
    }

    // 11. Interactive Review Modal & Submission
    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const reviewForm = document.getElementById('reviewForm');
    const testimonialsGrid = document.getElementById('testimonialsGrid');

    if (openReviewModalBtn && reviewModal) {
        openReviewModalBtn.addEventListener('click', () => reviewModal.classList.add('active'));
        closeReviewModal.addEventListener('click', () => reviewModal.classList.remove('active'));
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) reviewModal.classList.remove('active');
        });
    }

    if (reviewForm && testimonialsGrid) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewerName').value;
            const role = document.getElementById('reviewerRole').value;
            const starsCount = parseInt(document.getElementById('reviewerStars').value);
            const text = document.getElementById('reviewerText').value;

            let starsHTML = '';
            for (let i = 0; i < starsCount; i++) {
                starsHTML += '<i class="fas fa-star"></i>';
            }

            const newCard = document.createElement('div');
            newCard.className = 'testimonial-card reveal-up in-view';
            newCard.innerHTML = `
                <div class="stars">${starsHTML}</div>
                <p>"${text}"</p>
                <div class="client-info">
                    <strong>${name}</strong>
                    <span>${role}</span>
                </div>
            `;
            testimonialsGrid.prepend(newCard);
            reviewModal.classList.remove('active');
            reviewForm.reset();
            alert('Thank you for your valuable review!');
        });
    }

    // 12. Scroll reveal animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        .reveal-up.in-view, .reveal-left.in-view, .reveal-right.in-view, .reveal-scale.in-view {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});

<script>
    let currentStep = 0;
    const steps = document.querySelectorAll(".step-content");
    const progressDots = document.querySelectorAll(".progress-dot");

    function showStep(n) {
        steps[currentStep].classList.remove("active");
        currentStep = n;
        steps[currentStep].classList.add("active");

        document.getElementById("prevBtn").style.display = currentStep === 0 ? "none" : "inline-block";
        const nextBtn = document.getElementById("nextBtn");
        if (currentStep === steps.length - 1) {
            nextBtn.textContent = "Order via WhatsApp";
            nextBtn.className = "btn-submit";
        } else {
            nextBtn.textContent = "Next Step";
            nextBtn.className = "btn-next";
        }

        progressDots.forEach((dot, index) => {
            dot.classList.toggle("active", index <= currentStep);
        });
    }

    function nextPrev(n) {
        if (currentStep === steps.length - 1 && n === 1) {
            sendToWhatsApp();
            return;
        }
        currentStep += n;
        showStep(currentStep);
    }

    document.querySelectorAll('.option-card').forEach(card => {
        const input = card.querySelector('input');
        
        card.addEventListener('click', () => {
            if (input.type === 'radio') {
                const name = input.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    radio.closest('.option-card').classList.remove('selected');
                });
                card.classList.add('selected');
                input.checked = true;
            } else if (input.type === 'checkbox') {
                input.checked = !input.checked;
                card.classList.toggle('selected', input.checked);
            }
            updateSummaryAndPrice();
        });
    });

    document.getElementById('colorTheme').addEventListener('input', updateSummaryAndPrice);
    document.getElementById('cakeMessage').addEventListener('input', updateSummaryAndPrice);

    function updateSummaryAndPrice() {
        let total = 0;

        const selectedSize = document.querySelector('input[name="size"]:checked');
        if (selectedSize) {
            total += parseFloat(selectedSize.dataset.price);
            document.getElementById('sumSize').textContent = selectedSize.value;
        }

        const selectedFlavor = document.querySelector('input[name="flavor"]:checked');
        if (selectedFlavor) {
            total += parseFloat(selectedFlavor.dataset.price);
            document.getElementById('sumFlavor').textContent = selectedFlavor.value;
        }

        const selectedFrosting = document.querySelector('input[name="frosting"]:checked');
        if (selectedFrosting) {
            total += parseFloat(selectedFrosting.dataset.price);
            document.getElementById('sumFrosting').textContent = selectedFrosting.value;
        }

        const colorVal = document.getElementById('colorTheme').value.trim();
        document.getElementById('sumColor').textContent = colorVal ? colorVal : 'Default';

        const msgVal = document.getElementById('cakeMessage').value.trim();
        document.getElementById('sumMessage').textContent = msgVal ? msgVal : 'None';

        let addonNames = [];
        document.querySelectorAll('input[name="addon"]:checked').forEach(addon => {
            total += parseFloat(addon.dataset.price);
            addonNames.push(addon.closest('.option-card').querySelector('strong').textContent);
        });
        document.getElementById('sumAddons').textContent = addonNames.length > 0 ? addonNames.join(', ') : 'None';

        document.getElementById('sumTotal').textContent = `৳${total.toLocaleString('en-IN')}`;
    }

    function sendToWhatsApp() {
        const phoneNumber = "8801711063961";
        
        const size = document.getElementById('sumSize').textContent;
        const flavor = document.getElementById('sumFlavor').textContent;
        const frosting = document.getElementById('sumFrosting').textContent;
        const color = document.getElementById('sumColor').textContent;
        const message = document.getElementById('sumMessage').textContent;
        const addons = document.getElementById('sumAddons').textContent;
        const total = document.getElementById('sumTotal').textContent;

        const text = `Hello! I want to order a custom cake:%0A%0A*Size:* ${size}%0A*Flavor:* ${flavor}%0A*Frosting:* ${frosting}%0A*Color Theme:* ${color}%0A*Cake Message:* ${message}%0A*Add-ons:* ${addons}%0A%0A*Total Cost:* ${total}`;

        const url = `https://wa.me/${phoneNumber}?text=${text}`;
        window.open(url, '_blank');
    }
</script>
