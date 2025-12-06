// yo browser, can you hear me?
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition;

var textArea = document.getElementById('my-text-area');
var statusText = document.getElementById('status-text');
var notesList = document.getElementById('notes-list');

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    
    // setup the listening stuff "i never used it lol"
    recognition.continuous = true; // don't stop til I say so cuz i da boss
    recognition.interimResults = true; // show me the words as they come i paranoid abt wht 

    // boom! we got words
    recognition.onresult = function(event) {
        var currentText = "";
        
        // spin through the words
        for(var i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
        }
        
        textArea.value = currentText;

        // Easter Egg Check
        var lowerText = currentText.toLowerCase();
        if (lowerText.includes("six seven") || lowerText.includes("67") || lowerText.includes("6 7")) {
            var egg = document.getElementById("easter-egg");
            egg.style.display = "flex"; // Show it
            statusText.innerText = "OMG IS THAT A 67 REFERENCE?!";
            
            // Hide after 5 seconds
            setTimeout(function() {
                egg.style.display = "none";
            }, 5000);
        }
    };

    // microphone is ON LESS GOOOOOOOOOOOOOOOOO
    // microphone is ON LESS GOOOOOOOOOOOOOOOOO
    recognition.onstart = function() {
        var listeningStatuses = [
            "Listening... Speak now!",
            "I'm all ears 👂",
            "Spill the tea ☕",
            "Go ahead, I'm listening...",
            "Mic check 1, 2, 3...",
            "Say something funny!",
            "Listening intently 🧐"
        ];
        var randomStatus = listeningStatuses[Math.floor(Math.random() * listeningStatuses.length)];
        statusText.innerText = randomStatus;
    };

    // shhhhhhhhh
    recognition.onend = function() {
        setRandomIdleStatus();
    };

    // ahs shi here wo go again
    recognition.onerror = function(event) {
        console.log("Error occurred: " + event.error);
        statusText.innerText = "Error: " + event.error;
    };

} else {
    console.log("Speech Recognition Not Supported");
    statusText.innerText = "Browser not supported. Try Chrome.";
    alert("Your browser does not support speech recognition. Please try Google Chrome.");
}

// fresh start
window.onload = function() {
    displayNotes();
    setRandomIdleStatus();
};

function setRandomIdleStatus() {
    var idleStatuses = [
        "Not listening...",
        "Zzzzz...",
        "I'm bored.",
        "Waiting for you...",
        "Silence is golden.",
        "Did you hear something?",
        "I'm on a break."
    ];
    var randomStatus = idleStatuses[Math.floor(Math.random() * idleStatuses.length)];
    statusText.innerText = randomStatus;
}

function startRecording() {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    // Random attitude check (10% chance)
    if (Math.random() < 0.1) {
        var attitudes = [
            "Nah, I don't feel like listening right now.",
            "I'm on my coffee break. Come back later.",
            "Say 'please' first!",
            "Ugh, do I have to?",
            "I'm ignoring you."
        ];
        var randomAttitude = attitudes[Math.floor(Math.random() * attitudes.length)];
        statusText.innerText = randomAttitude;
        alert(randomAttitude);
        return;
    }

    try {
        recognition.start();
    } catch (error) {
        console.log("Recognition already started or error: " + error);
    }
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

function saveNote() {
    var noteContent = textArea.value;
    
    if(noteContent == "") {
        alert("Text area is empty!");
        return;
    }

    // grab the stash
    var notes = getNotesFromStorage();
    
    // shove it in the pile
    notes.push(noteContent);
    
    // save it for later
    localStorage.setItem("myNotes", JSON.stringify(notes));
    
    // show me what you got brudda
    displayNotes();
    
    // Auto copy to clipboard
    copyToClipboard();
    
    // begone text!
    textArea.value = "";
    alert("Note saved and copied to clipboard!");
}

function copyToClipboard() {
    var noteContent = textArea.value;
    if(noteContent == "") {
        alert("Nothing to copy!"); 
        return; 
    }
    
    navigator.clipboard.writeText(noteContent).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function getNotesFromStorage() {
    var notesStr = localStorage.getItem("myNotes");
    if (notesStr == null) {
        return [];
    } else {
        return JSON.parse(notesStr);
    }
}

function displayNotes() {
    var notes = getNotesFromStorage();
    notesList.innerHTML = ""; // nuke the list
    
    for(var i = 0; i < notes.length; i++) {
        var note = notes[i];
        
        var li = document.createElement("li");
        
        // the actual words
        var span = document.createElement("span");
        span.innerText = note;
        li.appendChild(span);
        
        // fix my typos
        var editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.className = "note-btn edit-btn";
        editBtn.setAttribute("onclick", "editNote(" + i + ")");
        li.appendChild(editBtn);
        
        // YEEEEEEEEEEEEEEEEEET
        var delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.className = "note-btn delete-btn";
        delBtn.setAttribute("onclick", "deleteNote(" + i + ")");
        li.appendChild(delBtn);
        
        notesList.appendChild(li);
    }
}

function deleteNote(index) {
    var notes = getNotesFromStorage();
    notes.splice(index, 1); // bye bye
    localStorage.setItem("myNotes", JSON.stringify(notes));
    displayNotes();
}

function editNote(index) {
    var notes = getNotesFromStorage();
    var newContent = prompt("Edit your note goofy:", notes[index]);
    
    if (newContent != null && newContent != "") {
        notes[index] = newContent;
        localStorage.setItem("myNotes", JSON.stringify(notes));
        displayNotes();
    }
}

function clearAllNotes() {
    if(confirm("Are you sure you want to delete ALL notes?")) {
        localStorage.removeItem("myNotes");
        displayNotes();
    }
}
