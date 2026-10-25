
const form = document.getElementById("registration-form");
const message = document.getElementById("message");
const registrationList = document.getElementById("registration-list");
const clearButton = document.getElementById("clear-btn");

const storageKey = "aiSocietyRegistrations";


const phoneInput = document.getElementById("phone");

phoneInput.pattern = "03[0-9]{9}";
phoneInput.title = "Enter an 11-digit Pakistani mobile number starting with 03.";
phoneInput.minLength = 11;
phoneInput.maxLength = 11;


function getRegistrations() {
    try {
        const savedData = localStorage.getItem(storageKey);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Could not read saved registrations:", error);
        return [];
    }
}


function displayRegistrations() {
    const registrations = getRegistrations();

    registrationList.replaceChildren();

    if (registrations.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No registrations saved yet.";
        registrationList.appendChild(item);
        return;
    }

    registrations.forEach(function(registration, index) {
        const item = document.createElement("li");

        item.textContent =
            (index + 1) + ". " +
            "Name: " + registration.fullname +
            " | Email: " + registration.email +
            " | Phone: " + registration.phone +
            " | Event: " + registration.event +
            " | Source: " + registration.source;

        registrationList.appendChild(item);
    });
}


form.addEventListener("submit", function(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = phoneInput.value.trim();
    const selectedEvent = document.getElementById("event").value;

    const selectedSource = document.querySelector(
        'input[name="source"]:checked'
    );

    if (
        fullname === "" ||
        email === "" ||
        phone === "" ||
        selectedEvent === "" ||
        !selectedSource
    ) {
        message.textContent = "Please complete all fields.";
        return;
    }

    const registration = {
        fullname: fullname,
        email: email,
        phone: phone,
        event: selectedEvent,
        source: selectedSource.value
    };

    const registrations = getRegistrations();
    registrations.push(registration);

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(registrations)
        );

        message.textContent =
            "Registration successful! Your details have been saved.";

        form.reset();
        displayRegistrations();
    } catch (error) {
        message.textContent =
            "Could not save registration. Please check browser storage.";
        console.error("Could not save registration:", error);
    }
});


clearButton.addEventListener("click", function() {
    const registrations = getRegistrations();

    if (registrations.length === 0) {
        message.textContent = "There are no saved registrations to clear.";
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to clear all registrations?"
    );

    if (confirmClear) {
        localStorage.removeItem(storageKey);
        displayRegistrations();
        message.textContent = "All registrations have been cleared.";
    }
});


displayRegistrations();
