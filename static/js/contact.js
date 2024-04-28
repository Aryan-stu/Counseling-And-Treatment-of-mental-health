const form = document.querySelector('.php-email-form');
const fullName = document.getElementById("names");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
function sendEmail(){
    const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Message: ${message.value}`;

    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "mindpathmentalhealth@gmail.com",
        Password : "09CAB801CB59905EB37A10907EE96BCA2BE2",
        To : 'mindpathmentalhealth@gmail.com',
        From : "mindpathmentalhealth@gmail.com",
        Subject : subject.value,
        Body : bodyMessage
    }).then(
      message => {
        if (message == "OK"){
            Swal.fire({
                title: "Thank You!",
                text: "We have recieved your message!",
                icon: "success"
              });
        }
      }
    );
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmail();
});