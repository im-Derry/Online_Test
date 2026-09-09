const questions = [
    {
        q: "The part of human eye which controls the amount of light entering into it:",
        options: ["Iris", "Cornea", "Ciliary muscle", "Pupil"],
        answer: 0
    },
    {
        q: "Most of the refraction for the light rays entering the eye occurs at:",
        options: ["Iris", "Pupil", "Crystalline lens", "Outer surface of cornea"],
        answer: 3
    },
    {
        q: "The curvature of eye lens of human eye:",
        options: ["is fixed.", "can be increased.", "can be decreased.", "increase or decrease as per the case"],
        answer: 3
    },
    {
        q: "The lens system of human eye forms an image on a light sensitive screen, which is called as:",
        options: ["Cornea", "Ciliary muscle", "Optic nerve", "Retina"],
        answer: 3
    },
    {
        q: "The pair of eye parts responsible for admitting different amount of light into the eyes is:",
        options: ["Iris and pupil", "Ciliary muscles and pupil", "Retina and Iris", "Ciliary muscles and cornea"],
        answer: 0
    },
    {
        q: "When you look at an object very close to your eyes, the:",
        options: [
            "Ciliary muscles of your eye contract and the eye lens becomes thick.",
            "Ciliary muscles of your eye get relaxed and the eye lens becomes thick.",
            "Ciliary muscles of your eye contract and the eye lens becomes thin.",
            "Ciliary muscles of your eye get relaxed and the eye lens becomes thin."
        ],
        answer: 0
    },
    {
        q: "The human eye forms the image of an object at its",
        options: ["Retina", "Pupil", "Cornea", "Iris"],
        answer: 0
    },
    {
        q: "The change in focal length of an eye lens is caused by the action of the",
        options: ["Pupil", "Retina", "Ciliary muscles", "Iris"],
        answer: 2
    },
    {
        q: "The focal length of the eye lens increases when eye muscles",
        options: [
            "are relaxed and lens becomes thinner",
            "contract and lens becomes thicker",
            "are relaxed and lens becomes thicker",
            "contract and lens becomes thinner"
        ],
        answer: 0
    },
    {
        q: "How long does the light from an event stay in our eye?",
        options: ["1/16 th of a second", "1/10 th of a second", "1/18 th of a second", "1/24 th of a second"],
        answer: 1
    },
    {
        q: "Light enters the eye through a thin membrane covering the front surface of the eyeball. What is this transparent outer layer called?",
        options: ["Pupil", "Sclera", "Cornea", "Crystalline lens"],
        answer: 2
    },
    {
        q: "What is the nature of the image formed on the retina of a human eye?",
        options: ["Virtual and erect", "Real and erect", "Virtual and inverted", "Real and inverted"],
        answer: 3
    },
    {
        q: "The retina contains two types of light-sensitive cells: rods and cones. What is the specific function of rod cells?",
        options: [
            "Respond to colour difference",
            "Control pupil contraction",
            "Respond to intensity of light (dim light vision)",
            "Adjust the focal length of the eye lens"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let selectedAnswers = new Array(questions.length).fill(null);
let studentName = "";
let rollNo = "";
let timeLeft = 10 * 60;
let timerInterval = null;
let testStarted = false;
let submitted = false;

function startTest() {
    studentName = document.getElementById("studentName").value.trim();
    rollNo = document.getElementById("rollNo").value.trim();

    if (!studentName || !rollNo) {
        alert("Please enter your name and roll number.");
        return;
    }

    testStarted = true;
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("testScreen").classList.remove("hidden");
    document.getElementById("bottomNav").classList.remove("hidden");
    startTimer();
    showQuestion();
}

function startTimer() {
    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest(true);
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    document.getElementById("timer").textContent = text;
    document.getElementById("smallTimer").textContent = text;
}

function showQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("questionCounter").textContent =
        `${currentQuestion + 1}/${questions.length}`;

    document.getElementById("progressBar").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    document.getElementById("questionText").textContent =
        `${currentQuestion + 1}. ${q.q}`;

    const container = document.getElementById("options");
    container.innerHTML = "";

    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "option";

        if (selectedAnswers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.onclick = () => {
            selectedAnswers[currentQuestion] = index;
            showQuestion();
        };

        container.appendChild(button);
    });

    document.getElementById("previousBtn").disabled =
        currentQuestion === 0;

    document.getElementById("nextBtn").textContent =
        currentQuestion === questions.length - 1 ? "Submit" : "Next";
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        submitTest(false);
    }
}

function submitTest(autoSubmitted = false) {
    if (submitted) return;

    if (!testStarted) {
        alert("Please start the test first.");
        return;
    }

    const unanswered = selectedAnswers.filter(a => a === null).length;

    if (!autoSubmitted && unanswered > 0) {
        const ok = confirm(
            `You have ${unanswered} unanswered question(s). Do you want to submit?`
        );
        if (!ok) return;
    }

    let score = 0;

    selectedAnswers.forEach((selected, index) => {
        if (selected === questions[index].answer) {
            score++;
        }
    });

    const result = {
        name: studentName,
        rollNo: rollNo,
        answers: selectedAnswers,
        score: score,
        total: questions.length,
        submittedAt: new Date().toISOString()
    };

    // TEMPORARY DEMO STORAGE.
    // This will later be replaced by Firebase so the teacher
    // receives every student's result online.
    const results = JSON.parse(
        localStorage.getItem("eyeTestResults") || "[]"
    );
    results.push(result);
    localStorage.setItem("eyeTestResults", JSON.stringify(results));

    submitted = true;
    clearInterval(timerInterval);

    // Open the submission confirmation as a separate page.
    window.location.href = "submitted.html";
}

function goBack() {
    if (!testStarted || submitted) return;

    const ok = confirm(
        "Going back may leave the test. Are you sure?"
    );

    if (ok) {
        location.reload();
    }
}
