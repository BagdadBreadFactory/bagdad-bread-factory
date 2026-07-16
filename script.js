document.addEventListener("DOMContentLoaded", function () {
    
  
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

   
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

   
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

  
    const animatedSections = document.querySelectorAll("section.animate-on-scroll");
    
    if (animatedSections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        animatedSections.forEach(section => {
            section.classList.add("hidden");
            observer.observe(section);
        });
    }

   
    const counters = document.querySelectorAll(".stat-card h2");
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const counter = entry.target;
                    const targetText = counter.innerText.trim();
                    
                    if (targetText.includes("/")) {
                        counterObserver.unobserve(counter);
                        return;
                    }

                    const numericValue = parseInt(targetText.replace(/[^0-9]/g, ''));
                    if (isNaN(numericValue)) {
                        counterObserver.unobserve(counter);
                        return;
                    }

                    let count = 0;
                    const speed = numericValue / 50;

                    const updateCounter = () => {
                        count += speed;
                        if (count < numericValue) {
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
            { threshold: 0.5 }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

  
    const searchInput = document.getElementById("menuSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase().trim();
            const categories = document.querySelectorAll(".menu-category");

            categories.forEach(category => {
                const rows = category.querySelectorAll(".menu-table tbody tr");
                let visibleRowsInSubGrid = 0;

                rows.forEach(row => {
                    // Bypass checking notification details or text-only updates
                    if (row.classList.contains("info-row") || row.cells.length < 2) {
                        row.style.display = "";
                        return;
                    }

                    const productName = row.cells[0].innerText.toLowerCase();
                    
                   
                    const isDirectMatch = productName.includes(query);
                    const isPrefixMatch = productName.startsWith(query);
                    const isFuzzyMatch = query.split(" ").every(word => productName.includes(word));

                    if (isDirectMatch || isPrefixMatch || isFuzzyMatch) {
                        row.style.display = "";
                        visibleRowsInSubGrid++;
                    } else {
                        row.style.display = "none";
                    }
                });

               
                if (query !== "" && visibleRowsInSubGrid === 0) {
                    category.classList.add("hide-category");
                } else {
                    category.classList.remove("hide-category");
                }
            });
        });
    }
});
