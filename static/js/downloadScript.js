
/**
 * import firebase
 */

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Initialize Firebase app


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2fxyHrAHrB8k9PzLF4MIaDde6W09wn_4",
    authDomain: "mental-health-7c08f.firebaseapp.com",
    databaseURL: "https://mental-health-7c08f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mental-health-7c08f",
    storageBucket: "mental-health-7c08f.appspot.com",
    messagingSenderId: "184742629329",
    appId: "1:184742629329:web:184d9591d35607c4d29af0"
};






/**
* Firebase register
*/


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
let downloadURL;



/**
* add
*/


let RememberMeCheckbox = document.getElementById('rememberMeCheckbox');
let EmailInp = document.getElementById('emailInp');
let EmailInp2 = document.getElementById('emailInp2');
let PassInp = document.getElementById('passwordInp');
let MainForm = document.getElementById('MainForm');
let MainForm2 = document.getElementById('MainForm2');




document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in based on stored data
    const storedUserInfo = JSON.parse(localStorage.getItem("user-info")) || JSON.parse(sessionStorage.getItem("user-info"));
    const storedUserCreds = JSON.parse(localStorage.getItem("user-creds")) || JSON.parse(sessionStorage.getItem("user-creds"));




    if (storedUserInfo && storedUserCreds) {
        // The user is already logged in
        const userId = storedUserCreds.uid;
        const ageRef = ref(db, `UserInformation/${userId}/age`);
        const genderRef = ref(db, `UserInformation/${userId}/sex`);
        const locationRef = ref(db, `UserInformation/${userId}/city`);
        const phoneRef = ref(db, `UserInformation/${userId}/phone`);
        const professionRef = ref(db, `UserInformation/${userId}/profession`);

        Promise.all([
            get(ageRef),
            get(genderRef),
            get(locationRef),
            get(phoneRef),
            get(professionRef)
        ]).then((snapshots) => {
            const age = snapshots[0].val();
            const gender = snapshots[1].val();
            const location = snapshots[2].val();
            const phone = snapshots[3].val();
            const profession = snapshots[4].val();

            console.log("Age:", age);
            console.log("Gender:", gender);
            console.log("Location:", location);
            document.getElementById('age').textContent = `Age: ${age}`;
            document.getElementById('gender').textContent = `Sex: ${gender}`;
            document.getElementById('location').textContent = `City: ${location}`;
            document.getElementById('phone').textContent = `Phone: ${phone}`;
            document.getElementById('profession').textContent = `Profession: ${profession}`;

            //

        }).catch((error) => {
            console.error("Error getting user information:", error);
        });
        const assessmentRef = ref(db, `LAssessment/${userId}`);
const container = document.getElementById("dataContainer"); // Assuming you have a container in your HTML with id "dataContainer"

onValue(assessmentRef, (snapshot) => {
  const data = snapshot.val();
  displayData(data);
}, (error) => {
  console.error("Error getting assessment data:", error);
});

function mapValue(value) {
  switch (value) {
    case -1:
      return "Bad";
    case 0:
      return "Moderate";
    case 1:
      return "Good";
    default:
      return "Moderate";
  }
}

function displayData(data) {
  const customLabels = {
    alcohol: "Alcohol avoidance",
    ciggarette: "Cigarette avooidance",
    exersice: "Regulated Exercising",
    fastFood: "Fast Food avoidance",
    redMeat: "Red Meat avoidance",
    screen: "Screen Time",
    sleep: "Sleep hours",
    social: "Social Interaction",
    stress: "Stress management skills",
    sugarDrinks: "Sugar Drinks avoidance",
    total: "Total",
    unprocessedFood: "Unprocessed Food avoidance"
  };

  const displaySequence = [
    "alcohol",
    "ciggarette",
    "exersice",
    "fastFood",
    "redMeat",
    "screen",
    "sleep",
    "social",
    "stress",
    "sugarDrinks",
    "unprocessedFood",
    "total"
  ];

  displaySequence.forEach((key) => {
    const value = mapValue(data[key]);
    const label = customLabels[key] || key;
    const listItem = document.createElement("li");
    listItem.textContent = `${label}: ${value}`;
    container.appendChild(listItem);
  });
  const proRef = ref(db, `selfCounseling/${userId}/problem/problem`);
  const spro1Ref = ref(db, `selfCounseling/${userId}/problem/subproblem1`);
  const spro2Ref = ref(db, `selfCounseling/${userId}/problem/subproblem2`);
  const whenRef = ref(db, `selfCounseling/${userId}/when/when`);


  Promise.all([
      get(proRef),
      get(spro1Ref),
      get(spro2Ref),
      get(whenRef)

  ]).then((snapshots) => {
      const pro = snapshots[0].val();
      const spro1 = snapshots[1].val();
      const spro2 = snapshots[2].val();
      const when = snapshots[3].val();


      document.getElementById('pro').textContent = `${pro}`;
      document.getElementById('sp1').textContent = `${spro1}`;
      document.getElementById('sp2').textContent = `${spro2}`;
      document.getElementById('since').textContent = `${when}`;
      
      generatePDF();
      //

  }).catch((error) => {
      console.error("Error getting user information:", error);
  });
}

        document.getElementById('name').textContent = `Name: ${storedUserInfo.username}`;


        function generatePDF() {
            const pdfContent = document.querySelector('#content');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [595, 842]
            });

            window.html2canvas(pdfContent, {
                scale: 2, // Increase the scale to improve resolution
                onrendered: function (canvas) {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    pdf.save('report.pdf');
                    setTimeout(function () {

                        window.close();
                    }, 2000);
                }
            });
        }


        // Reference to the sum value in the database under LAssessment path










    } else {
        console.log("no user");
        window.location.href = "/?redirected=true";
        alert("Please login to avail this facility.")

        Out.classList.remove('active');
        In.classList.remove('active');
        // The user is not logged in
        // You may want to show the login/register form
    }


});








/*
 *signout
 */


// Get the user ID from authentication





