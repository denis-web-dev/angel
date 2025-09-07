const sliderData = [
    {
        number: "1",
        image: "images/slider/Card_bg-1.jpg",
        text: "Косметология: уходы, инъекции, лифтинг"
    },
    {
        number: "2",
        image: "images/slider/Card_2-mobile.jpg",
        text: "Коррекция фигуры и силуэта",

    },
    {
        number: "3",
        image: "images/slider/Card_3-mobile.jpg",
        text: "SPA и европейские массажи"
    },
    {
        number: "4",
        image: "images/slider/Card_4-mobile.jpg",
        text: "Велнес-программы и флоатация"
    },
    {
        number: "5",
        image: "images/slider/Card_5-mobile.jpg",
        text: "Beauty-услуги: волосы, ногти, макияж"
    },
    {
        number: "6",
        image: "images/slider/Card_6-mobile.jpg",
        text: "Тайские и балийские массажи"
    }
];

const cardTrack = document.getElementById("card-track");
const fullscreenBg = document.getElementById("fullscreen-bg");
const burgerMenu = document.getElementById("burger-menu");
const navMenu = document.getElementById("nav-menu");
const title = document.querySelector(".first-screen__title");
const defaultTitle = title ? title.innerHTML : "";

let activeIndex = 0;
let cards = [];


function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

sliderData.forEach((item, index) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-wrapper");

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.animationDelay = `${index * 0.1}s`;

    const cardNumber = document.createElement("div");
    cardNumber.className = "card-number";
    cardNumber.innerText = item.number;
    card.appendChild(cardNumber);

    const img = document.createElement("img");
    img.src = item.image;
    img.loading = "lazy";
    img.alt = item.text;

    const text = document.createElement("div");
    text.className = "card-text";
    text.innerText = item.text;

    const scrollbar = document.createElement("div");
    scrollbar.className = "card-scrollbar";
    const scrollbarLine = document.createElement("div");
    scrollbarLine.className = "card-scrollbar-line";
    const scrollbarFill = document.createElement("div");
    scrollbarFill.className = "card-scrollbar-fill";
    scrollbarLine.appendChild(scrollbarFill);
    scrollbar.appendChild(scrollbarLine);

    card.appendChild(img);
    card.appendChild(text);
    cardWrapper.appendChild(card);
    cardWrapper.appendChild(scrollbar);
    cardTrack.appendChild(cardWrapper);
    cards.push(card);

    card.addEventListener("click", debounce(() => {
        activeIndex = index;
        updateActiveCard();
        scrollToCard(index);
    }, 200));
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fullscreenBg.style.backgroundImage = `url(${sliderData[activeIndex].image})`;
            observer.disconnect();
        }
    });
    observer.observe(fullscreenBg);
});

function updateActiveCard() {
    cards.forEach((card, i) => {
        card.classList.toggle("active", i === activeIndex);
    });
    fullscreenBg.style.backgroundImage = `url(${sliderData[activeIndex].image})`;
    if (title && window.innerWidth <= 768) {
        title.innerText = sliderData[activeIndex].text;
    } else if (title) {
        title.innerHTML = defaultTitle;
    }
    }

    function scrollToCard(index) {
        const cardWidth = cards[0].offsetWidth + 14;
        const scrollX = cardWidth * index;
        cardTrack.scrollTo({ left: scrollX, behavior: "smooth" });
    }

function handleResize() {
    if (window.innerWidth <= 768 && title) {
        title.innerText = sliderData[activeIndex].text;
    } else if (title) {
        title.innerHTML = defaultTitle;
    }
}

    // Auto slide
    function autoSlide() {
        activeIndex = (activeIndex + 1) % sliderData.length;
        updateActiveCard();
        scrollToCard(activeIndex);
    }
    setInterval(autoSlide, 3000);

    // Initialize
    updateActiveCard();

window.addEventListener("resize", debounce(handleResize, 100));

    // Burger Menu
burgerMenu.addEventListener("click", () => {
    navMenu.classList.toggle("active"); // Оставлено: переключение класса .active
    document.body.classList.toggle("no-scroll"); // Оставлено: блокировка скролла
    // Добавлено: добавляем атрибут для экранных читалок
    const isOpen = navMenu.classList.contains("active");
    burgerMenu.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

document.querySelectorAll(".menu__link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active"); // Закрываем меню
        document.body.classList.remove("no-scroll"); // Убираем блокировку скролла
        burgerMenu.setAttribute("aria-label", "Открыть меню"); // Обновляем aria-label
    });
});

    // Для формы
    document.addEventListener("DOMContentLoaded", () => {
        const phoneInput = document.querySelector(".form__input--phone");
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.startsWith("7")) value = value.slice(1);
                if (value.length > 10) value = value.slice(0, 10);
                let formatted = "+7";
                if (value.length > 0) formatted += ` (${value.slice(0, 3)}`;
                if (value.length > 3) formatted += `) ${value.slice(3, 6)}`;
                if (value.length > 6) formatted += `-${value.slice(6, 8)}`;
                if (value.length > 8) formatted += `-${value.slice(8, 10)}`;
                e.target.value = formatted;
            });
        }
        const form = document.getElementById("form");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (form.querySelectorAll(":invalid").length > 0) {
                    alert("Пожалуйста, заполните все поля корректно");
                    return;
                }
                const token = await grecaptcha.execute("your-site-key-here", { action: "submit" });
                const formData = new FormData(form);
                formData.append("g-recaptcha-response", token);
                formData.append("section", "main");
                fetch("send.php", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.text())
                    .then(() => alert("Форма успешно отправлена!"))
                    .catch(() => alert("Ошибка при отправке формы"));
            });
        }
    });
