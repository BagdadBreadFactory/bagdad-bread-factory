document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. MOBILE NAV TOGGLE
    // ==========================================================================
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // ==========================================================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
            // Close mobile menu after clicking a link
            if (navLinks) {
                navLinks.classList.remove("active");
            }
        });
    });

    // ==========================================================================
    // 3. STICKY HEADER ON SCROLL
    // ==========================================================================
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        });
    }

    // ==========================================================================
    // 4. SCROLL ANIMATION FOR SECTIONS (FADE IN)
    // ==========================================================================
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.15 // Slightly lowered for better mobile performance
        }
    );

    sections.forEach(section => {
        section.classList.add("hidden");
        observer.observe(section);
    });

    // ==========================================================================
    // 5. ANIMATED STATS COUNTER (FIXED FOR ALL UNIT TYPES)
    // ==========================================================================
    const counters = document.querySelectorAll(".stat-card h2");
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const targetText = counter.innerText.trim();
                
                // Safe check: Extract numbers only (handles "25+", "5000+", "100%")
                // Skips complex non-standard strings like "24/7" to prevent NaN bugs
                const numericValue = parseInt(targetText.replace(/[^0-9]/g, ''));
                
                if (isNaN(numericValue) || targetText.includes("/")) {
                    // Keep non-numeric values (like "24/7") static and solid
                    counterObserver.unobserve(counter);
                    return;
                }

                let count = 0;
                const speed = numericValue / 80; // Speed factor

                const updateCounter = () => {
                    count += speed;
                    if (count < numericValue) {
                        // Extract any trailing symbols (%, +) to append back during ticking
                        const suffix = targetText.replace(/[0-9]/g, '');
                        counter.innerText = Math.floor(count) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = targetText;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            });
        },
        {
            threshold: 0.5
        }
    );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ==========================================================================
    // 6. DYNAMIC CURRENT YEAR FOR FOOTER
    // ==========================================================================
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 7. REAL-TIME MENU SEARCH
    // ==========================================================================
    const search = document.getElementById("menuSearch");
    if (search) {
        search.addEventListener("keyup", function () {
            let value = this.value.toLowerCase();
            let rows = document.querySelectorAll(".menu-table tbody tr");

            rows.forEach(row => {
                let text = row.innerText.toLowerCase();
                // Keeps notices or special center messages visible while filtering
                if (row.cells.length < 2) {
                    row.style.display = ""; 
                } else {
                    row.style.display = text.includes(value) ? "" : "none";
                }
            });
        });
    }
});
