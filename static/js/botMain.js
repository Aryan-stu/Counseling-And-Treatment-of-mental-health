
(function() {
    "use strict";
  
    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }
  
    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight
  
      if (!header.classList.contains('header-scrolled')) {
        offset -= 16
      }
  
      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }
  
    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  
    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })
  
    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
      }
    }, true)
  
    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
        e.preventDefault()
  
        let navbar = select('#navbar')
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile')
          let navbarToggle = select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        scrollto(this.hash)
      }
    }, true)
  
    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });
  
    /**
     * Preloader
     */
    let preloader = select('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove()
      });
    }
  
    
  
    
  

  
  })()
  //password icon
  var a;
  let pass=()=>{
      if(a==1){
          document.getElementById('passwordInp').type="password";
          document.getElementById('pass-icon').name="lock-closed";
          a=0;
      }
      else{
          document.getElementById('passwordInp').type="text";
          document.getElementById('pass-icon').name="lock-open";
          a=1;
      }
  }
  
  var a1;
  let pass1=()=>{
      if(a1==1){
          document.getElementById('passwordInp1').type="password";
          document.getElementById('pass-icon1').name="lock-closed";
          a1=0;
      }
      else{
          document.getElementById('passwordInp1').type="text";
          document.getElementById('pass-icon1').name="lock-open";
          a1=1;
      }
  }
  
   /**
     * User profile menu
     */
   let subMenu= document.getElementById("subMenu");
   let menuButton = document.getElementById("menuButton");
  
  
        // Open or close menu when profile button is clicked
        menuButton.addEventListener('click', function () {
          subMenu.classList.toggle('open-menu');
        });
  
        // Close menu when clicking outside of it
        document.addEventListener('click', function (event) {
          if (!subMenu.contains(event.target) && event.target !== menuButton) {
            subMenu.classList.remove('open-menu');
          }
        });
  



        const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');

document.addEventListener('DOMContentLoaded', function () {
    appendMessage('Bot: Hello, how are you doing today?');


    document.getElementById('chat-form').addEventListener('submit', function (event) {
        event.preventDefault();
        sendMessage();
    });


});


document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});


function sendMessage() {
    const userMessage = document.getElementById('user_message').value;
    if (userMessage.trim() === '') return;
    appendMessage('You: ' + userMessage);
    document.getElementById('user_message').value = '';

    // Send the user message to the server
    fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `user_message=${encodeURIComponent(userMessage)}`,
        })
        .then(response => response.json())
        .then(data => {
            appendMessage(data);
            if (!userMessage.endsWith("?") && data.startsWith("Bot:")) {
                const optionButtons = document.createElement('div');
                optionButtons.classList.add('option-buttons');

                const yesButton = document.createElement('button');
                yesButton.textContent = 'Yes';
                yesButton.value = 'yes';
                yesButton.classList.add('option-button');
                yesButton.onclick = sendAction;

                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.value = 'no';
                noButton.classList.add('option-button');
                noButton.onclick = sendAction;

                optionButtons.appendChild(yesButton);
                optionButtons.appendChild(noButton);

                appendMessage(optionButtons);
            }
        })
        .catch(error => console.error('Error:', error));
}

function sendAction(event) {
    const action = event.target.value;
    fetch('/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=${action}`,
        })
        .then(response => response.json())
        .then(data => appendMessage(data))
        .catch(error => console.error('Error:', error));
}

function sendStartRequest() {
    fetch('/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=start',
    })
    .then(response => response.json())
    .then(data => {
        appendMessage(data);
        // Add your further steps here
    })
    .catch(error => console.error('Error:', error));
}

function appendMessage(message) {
    if (typeof message === 'string') {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message;
        if (message.startsWith("Bot:")) {
            messageDiv.classList.add('bot-message');
        } else {
            messageDiv.classList.add('user-message');
        }
        chatContainer.appendChild(messageDiv);
    } else {
        chatContainer.appendChild(message);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
  
    document.getElementById("popup").style.display = "none";
}


document.getElementById('download').addEventListener('click', () => {
  fetch('/generate_pdf')
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
});