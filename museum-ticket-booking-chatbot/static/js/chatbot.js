document.getElementById('send-btn').addEventListener('click', sendMessage);

let userLanguage = null;
let userDate = null;
let userTime = null;
let visitorCount = { adults: 0, children: 0 };
let selectedGallery = null;

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    if (!userLanguage) {
        handleLanguageSelection(userInput);
    } else if (!selectedGallery) {
        handleGallerySelection(userInput);
    } else if (!userDate) {
        handleDateSelection(userInput);
    } else if (!userTime) {
        handleTimeSelection(userInput);
    } else if (visitorCount.adults === 0 || visitorCount.children === 0) {
        handleVisitorCount(userInput);
    } else {
        handlePaymentProcess();
    }
}

function addMessage(content, className) {
    const message = document.createElement('div');
    message.classList.add('message', className);
    message.innerHTML = content;
    document.getElementById('chat-content').appendChild(message);
    document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
}

function handleLanguageSelection(input) {
    if (['english', 'bengali', 'hindi'].includes(input.toLowerCase())) {
        userLanguage = input.toLowerCase();
        addMessage(`Welcome to the Museum of Ancient Wonders! I'm MuseMate, your virtual ticket assistant.<br><br>
                    How may I assist you with booking tickets or providing information about our galleries today?`, 'bot-message');
        addMessage('Please type the name of the gallery you want to visit: Fish Gallery, Bird Gallery, Botany Gallery, Coin Gallery, Bronze Gallery.', 'bot-message');
    } else {
        addMessage('Please choose a language: English, Bengali, or Hindi.', 'bot-message');
    }
}

function handleGallerySelection(input) {
    const galleries = ['fish gallery', 'bird gallery', 'botany gallery', 'coin gallery', 'bronze gallery'];
    if (galleries.includes(input.toLowerCase())) {
        selectedGallery = input.toLowerCase();
        addMessage(`You've selected: ${selectedGallery}. Please choose a date to book your ticket.`, 'bot-message');
    } else {
        addMessage('Please select a valid gallery: Fish Gallery, Bird Gallery, Botany Gallery, Coin Gallery, Bronze Gallery.', 'bot-message');
    }
}

function handleDateSelection(input) {
    userDate = input; // Validate the date input here
    addMessage('Great! Now, choose the time you want to visit.', 'bot-message');
}

function handleTimeSelection(input) {
    userTime = input; // Validate the time input here
    addMessage('Please enter how many adults and children are visiting (e.g., "2 3").', 'bot-message');
}

function handleVisitorCount(input) {
    const [adults, children] = input.split(' ');
    visitorCount.adults = parseInt(adults);
    visitorCount.children = parseInt(children);

    if (isNaN(visitorCount.adults) || isNaN(visitorCount.children)) {
        addMessage('Please provide the number of adults and children in this format: "2 3".', 'bot-message');
    } else {
        displayBill();
    }
}

function displayBill() {
    const adultPrice = visitorCount.adults * 50;
    const childPrice = visitorCount.children * 10;
    const totalPrice = adultPrice + childPrice;

    addMessage(
        `<div>Bill Details:</div>
        <div>Gallery: ${selectedGallery}</div>
        <div>Adults: ${visitorCount.adults} x ₹50 = ₹${adultPrice}</div>
        <div>Children: ${visitorCount.children} x ₹10 = ₹${childPrice}</div>
        <div>Total Price: ₹${totalPrice}</div>
        <button id="pay-btn">Pay</button>`,
        'bot-message'
    );

    document.getElementById('pay-btn').addEventListener('click', initiatePayment);
}

function initiatePayment() {
    fetch('/pay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: userDate,
            time: userTime,
            adults: visitorCount.adults,
            children: visitorCount.children,
            gallery: selectedGallery
        })
    }).then(response => response.json())
    .then(data => {
        if (data.sessionUrl) {
            window.location.href = data.sessionUrl;
        } else {
            console.error('Error:', data.error);
            addMessage('Failed to create payment session. Please try again.', 'bot-message');
        }
    }).catch(error => {
        console.error('Error:', error);
        addMessage('Failed to initiate payment. Please try again.', 'bot-message');
    });
}

function handlePaymentProcess() {
    addMessage('Please click on the "Pay" button to complete the booking.', 'bot-message');
}
