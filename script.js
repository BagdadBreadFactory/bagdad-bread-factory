

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}



document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

        if (navLinks) {

            navLinks.classList.remove("active");

        }

    });

});


const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("sticky");

    } else {

        header.classList.remove("sticky");

    }

});


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
    threshold: 0.2
}

);

sections.forEach(section => {

    section.classList.add("hidden");

    observer.observe(section);

});


const counters = document.querySelectorAll(".stat-card h2");

const counterObserver = new IntersectionObserver(

(entries) => {

entries.forEach(entry => {

if (!entry.isIntersecting) return;

const counter = entry.target;

const targetText = counter.innerText;

let target;

if (targetText.includes("+")) {

target = parseInt(targetText);

} else if (targetText.includes("%")) {

target = parseInt(targetText);

} else {

return;

}

let count = 0;

const speed = target / 100;

const updateCounter = () => {

count += speed;

if (count < target) {

counter.innerText = Math.floor(count) +
(targetText.includes("+") ? "+" : "%");

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

threshold:0.5

}

);

counters.forEach(counter=>{

counterObserver.observe(counter);

});


const year = document.getElementById("year");

if(year){

year.textContent = new Date().getFullYear();

}






// Search Menu

const search = document.getElementById("menuSearch");

if(search){

search.addEventListener("keyup", function(){

let value = this.value.toLowerCase();

let rows = document.querySelectorAll(".menu-table tbody tr");

rows.forEach(row=>{

let text = row.innerText.toLowerCase();

row.style.display = text.includes(value) ? "" : "none";

});

});

}
