'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// --- Form Validation and Submission Logic ---

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

// 1. Function to check if all required fields are valid/filled
const checkFormValidity = () => {
    // Check if ALL form inputs (name, email, message) have a non-empty trimmed value
    const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');

    if (allFilled) {
        formBtn.removeAttribute('disabled');
    } else {
        formBtn.setAttribute('disabled', true);
    }
};

// 2. Add event listeners to all inputs to check validity on every change
formInputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
});

// 3. Form Submission Logic (from your reference)
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // The button is only enabled if all fields are filled, but we re-check for safety
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    
    // NOTE: This is the dummy Formspree endpoint from your reference.
    // **You MUST replace "https://formspree.io/f/mzzjdoqq" with your own endpoint.**
    const FORM_ENDPOINT = "https://formspree.io/f/mzzjdoqq"; 
    
    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }

    // Temporarily disable button to prevent multiple submissions
    formBtn.setAttribute('disabled', true);
    formBtn.querySelector('span').textContent = 'Sending...';

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        // Parse JSON response for better error info
        const result = await response.json();
        console.log(result);

        if (response.ok) {
            alert("Message sent successfully! Thank you.");
            form.reset();
        } else {
            alert(`Failed to send: ${result.error || 'Unknown error'}`);
        }
    } catch (err) {
        console.error("Submission Error:", err);
        alert("Network error. Please try again later.");
    } finally {
        // Re-enable the button and reset text/state
        formBtn.querySelector('span').textContent = 'Send Message';
        // Re-check validity in case reset left fields empty
        checkFormValidity();
    }
});