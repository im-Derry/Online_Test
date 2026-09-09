import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmKqbovKv1e72a7mUlGIi1Tu8BnMyoL_A",
  authDomain: "human-eye-mcq-test.firebaseapp.com",
  projectId: "human-eye-mcq-test",
  storageBucket: "human-eye-mcq-test.firebasestorage.app",
  messagingSenderId: "1081982023377",
  appId: "1:1081982023377:web:ef9b458516ffcc6a6b37f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const questions = [
  {q:"Which part of the eye controls the amount of light entering the eye?",o:["Iris","Retina","Cornea","Lens"]},
  {q:"Most of the refraction of light entering the eye occurs at the:",o:["Eye lens","Retina","Iris","Outer surface of cornea"]},
  {q:"The curvature of the eye lens can be:",o:["Only increased","Only decreased","Kept constant","Increased or decreased as required"]},
  {q:"The light-sensitive screen of the eye is the:",o:["Cornea","Iris","Lens","Retina"]},
  {q:"Which pair admits different amounts of light into the eye?",o:["Iris and pupil","Cornea and retina","Lens and retina","Iris and lens"]},
  {q:"To see a nearby object clearly, the ciliary muscles:",o:["Contract and the lens becomes thicker","Relax and the lens becomes thinner","Contract and the lens becomes thinner","Relax and the lens becomes thicker"]},
  {q:"The image of an object in the human eye is formed on the:",o:["Retina","Iris","Cornea","Pupil"]},
  {q:"The change in focal length of the eye lens is caused by:",o:["Retina","Pupil","Ciliary muscles","Cornea"]},
  {q:"The focal length of the eye lens increases when the ciliary muscles are:",o:["Relaxed and the lens is thinner","Contracted and the lens is thicker","Contracted and the lens is thinner","Relaxed and the lens is thicker"]},
  {q:"The sensation produced by light from an event remains in the eye for about:",o:["1/16 second","1/10 second","1/2 second","1 second"]},
  {q:"The transparent outer layer of the eye is called:",o:["Retina","Iris","Cornea","Pupil"]},
  {q:"The image formed on the retina is:",o:["Virtual and erect","Virtual and inverted","Real and erect","Real and inverted"]},
  {q:"Rods in the retina mainly help in:",o:["Colour vision","Sharp vision in bright light","Vision in dim light / responding to light intensity","Changing focal length"]}
];

let current=0, answers=Array(questions.length).fill(null), timerId=null, secondsLeft=600, started=false, submitted=false;
const $=id=>document.getElementById(id);

window.startTest=()=>{
 const name=$("studentName").value.trim(), roll=$("rollNo").value.trim();
 if(!name||!roll){alert("Please enter your name and roll number.");return;}
 $("guidance").classList.remove("hidden");
 started=true; $("startScreen").classList.add("hidden"); $("testScreen").classList.remove("hidden"); $("bottomNav").classList.remove("hidden");
 render(); startTimer();
};

function startTimer(){
 updateTimer();
 timerId=setInterval(()=>{secondsLeft--;updateTimer();if(secondsLeft<=0){clearInterval(timerId);submitTest(true)}},1000);
}
function updateTimer(){const m=String(Math.floor(secondsLeft/60)).padStart(2,'0'),s=String(secondsLeft%60).padStart(2,'0');$("timer").textContent=`${m}:${s}`;$("smallTimer").textContent=`${m}:${s}`;}
function render(){
 const item=questions[current]; $("questionCounter").textContent=`${current+1}/${questions.length}`; $("questionText").textContent=item.q; $("progressBar").style.width=`${((current+1)/questions.length)*100}%`;
 const box=$("options");box.innerHTML="";
 item.o.forEach((text,i)=>{const b=document.createElement("button");b.className="option"+(answers[current]===i?" selected":"");b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}.</span><span>${text}</span>`;b.onclick=()=>{answers[current]=i;render()};box.appendChild(b)});
 $("previousBtn").disabled=current===0; $("nextBtn").textContent=current===questions.length-1?"Submit":"Next";
}
window.nextQuestion=()=>{if(current===questions.length-1){submitTest(false);return}current++;render()};
window.previousQuestion=()=>{if(current>0){current--;render()}};
window.goBack=()=>{if(!started)return; if(confirm("Leave the test? Your current progress will be lost.")) location.reload()};

window.submitTest=async function(auto=false){
 if(submitted||!started)return;
 if(!auto && !confirm("Submit your test now?"))return;
 submitted=true;clearInterval(timerId);
 const name=$("studentName").value.trim(), rollNo=$("rollNo").value.trim();
 try{
   await addDoc(collection(db,"submissions"),{name,rollNo,answers,submittedAt:serverTimestamp(),questionCount:questions.length,remainingSeconds:secondsLeft});
   location.href="submitted.html";
 }catch(err){
   submitted=false;
   console.error(err);
   alert("Your response could not be submitted. Please check the Firebase setup/rules and try again.");
 }
};
