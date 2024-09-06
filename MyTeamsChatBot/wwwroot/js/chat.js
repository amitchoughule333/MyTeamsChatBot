//window.onload = handleKeyPress;

var questionArray = [];
var answerArray = [];

function toggleNavList() {
    var navList = document.getElementById("navList");
    var hamburgerIcon = document.querySelector(".hamburger-icon");
    navList.style.display = navList.style.display === "block" ? "none" : "block";
    hamburgerIcon.classList.toggle("rotate");
}

function goToUploadpage(screenType) {
    const type = screenType;
    window.location.href = "/Fileupload/Index?screenType=" + encodeURIComponent(screenType);
}

function bindSidenavQuestions() {
    $("#questionsList").html(""); // Clear existing content
    let htmlContent = ""; // Initialize an empty string to store the HTML content

    questionArray = JSON.parse(sessionStorage.getItem(sessionStorageKey));

    if (questionArray != null && questionArray != undefined && questionArray.length > 0) {
        questionArray.forEach(function (n, i) {
            // Encode double quotes in the tooltip using &quot; HTML entity
            let tooltipText = n.question.replace(/"/g, '&quot;');
            // Build the HTML string for each question with a tooltip
            htmlContent += `<li data-toggle="tooltip" title="${tooltipText}">${n.question.length > 30
                ? n.question.substring(0, 30) + "..."
                : n.question
                }</li>`;
        });
        $("#questionsList").html(htmlContent); // Set the HTML content after the loop

        // Initialize tooltips after updating the content
        $('[data-toggle="tooltip"]').tooltip();
    }

}

function chatHistory() {
    const intro_msg = document.querySelector(".intro_msg");
    intro_msg.style.display = "none";
    intro_msg.style.visibility = "hidden";
    $("#chatbotContainer").show();

    const chatbotContainer = document.getElementById("chatbotContainer");

    var chatConvo = JSON.parse(sessionStorage.getItem(sessionStorageKey));

    if (chatConvo != null && chatConvo != undefined && chatConvo.length > 0) {
        questionArray = chatConvo;
        bindSidenavQuestions();
        chatConvo.forEach(function (n, i) {

            const htmlTagsRegex = /<[^\s<>]*>[\s\S]*?<\/[^\s<>]*>/i.test(n.response);

            // Create a container for the user question
            const userQuestionContainer = document.createElement("div");
            userQuestionContainer.className = "user-message-container";
            userQuestionContainer.innerHTML = `
    <div class="loggedin_user">
      <strong>JD</strong>
    </div>
    <p class="question-container">
      <span style="display: flow;">${n.question}</span>
       <span class="timestamp">${n.timestamp}</span>
    </p>`;

            chatbotContainer.appendChild(userQuestionContainer);

            // Check if there's an image in n.answer
            const hasImage = n.image && n.image.startsWith('data:image') && !n.image.includes('null');
            const encodedImage = hasImage ? n.image : '';

            // Create a container for the chatbot response
            const chatbotResponseContainer = document.createElement("div");
            chatbotResponseContainer.className = "message-container";
            chatbotResponseContainer.innerHTML = `
            <div class="loggedin_bot">
                <img src="/icons/boticon.png"/>
            </div>
            <div class="response-container">
                <div class="feedback-icons">
                    <img src="/icons/thumbs-up.svg" class="thumbs-up" alt="Thumbs Up">
                    <img src="/icons/thumbs-down.svg" class="thumbs-down" alt="Thumbs Down">
                </div>
                ${htmlTagsRegex ? '<p>' + n.response + '</p>' : createNumberedList(n.response)}
                ${encodedImage ? '<img src="' + encodedImage + '" alt="Image">' : ""}
                <span class="timestamp">${n.timestamp}</span>
            </div>`;

            chatbotContainer.appendChild(chatbotResponseContainer);
        });
    }

}

function toggleSendButton() {
    const questionInput = document.getElementById("question");
    const sendButton = document.querySelector("#askQuestion");

    // Enable the button if there is text in the input box, disable otherwise
    sendButton.disabled = !questionInput.value.trim();
}

function handleKeyPressPermitParsing(event) {
    // Get the input element and the submit button
    const questionInput = document.getElementById("question");
    const submitButton = document.getElementById("askQuestion");

    // If Enter key is pressed
    if (event.key === "Enter") {
        questionInput.blur();

        // Trigger askQuestion() function if the input box has text
        if (questionInput.value.trim() !== "") {
            askQuestion("permit-parsing");
        }
    }

    // Enable or disable the submit button based on whether the input box has text
    submitButton.disabled = questionInput.value.trim() === "";
}
function handleKeyPressPermitComparison(event) {
    // Get the input element and the submit button
    const questionInput = document.getElementById("question");
    const submitButton = document.getElementById("askQuestion");

    // If Enter key is pressed
    if (event.key === "Enter") {
        questionInput.blur();

        // Trigger askQuestion() function if the input box has text
        if (questionInput.value.trim() !== "") {
            askQuestion("permit-comparison");
        }
    }

    // Enable or disable the submit button based on whether the input box has text
    submitButton.disabled = questionInput.value.trim() === "";
}

//TestChatbot Trigger
function handleKeyPressTest(event) {
    // Get the input element and the submit button
    const questionInput = document.getElementById("question");
    const submitButton = document.getElementById("askQuestion");

    // If Enter key is pressed
    if (event.key === "Enter") {
        questionInput.blur();

        // Trigger askQuestion() function if the input box has text
        if (questionInput.value.trim() !== "") {
            askTestQuestion();
        }
    }

    // Enable or disable the submit button based on whether the input box has text
    submitButton.disabled = questionInput.value.trim() === "";

}

//SQL Chatbot
function handleKeyPressSQL(event) {
    // Get the input element and the submit button
    const questionInput = document.getElementById("question");
    const submitButton = document.getElementById("askQuestion");

    // If Enter key is pressed
    if (event.key === "Enter") {
        questionInput.blur();

        // Trigger askQuestion() function if the input box has text
        if (questionInput.value.trim() !== "") {
            askSQLQuestion();
        }
    }

    // Enable or disable the submit button based on whether the input box has text
    submitButton.disabled = questionInput.value.trim() === "";

}

function handleKeyPressAzure(event) {
    // Get the input element and the submit button
    const questionInput = document.getElementById("question");
    const submitButton = document.getElementById("askQuestion");

    // If Enter key is pressed
    if (event.key === "Enter") {
        questionInput.blur();

        // Trigger askQuestion() function if the input box has text
        if (questionInput.value.trim() !== "") {
            askAzureQuestion();
        }
    }

    // Enable or disable the submit button based on whether the input box has text
    submitButton.disabled = questionInput.value.trim() === "";

}

function permitParsingClicked() {
    askQuestion("permit-parsing");
}

function permitComparisonClicked() {
    askQuestion("permit-comparison");
}

function testChatbotClicked() {
    askTestQuestion();
}

function SQLChatbotClicked() {
    askSQLQuestion();
}

function AzureChatbotClicked() {
    askAzureQuestion();
}

function askQuestion(screenType) {
    const intro_msg = document.querySelector(".intro_msg");
    intro_msg.style.display = "none";
    intro_msg.style.visibility = "hidden";
    $("#chatbotContainer").show();

    const questionInput = document.getElementById("question");
    const chatbotContainer = document.getElementById("chatbotContainer");

    const question = questionInput.value;
    console.log(question);

    const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    //Trimming the question to display on screen
    let displayQuestion = question.replace(/\bin html\b/g, '');
    console.log(displayQuestion);

    const questionData = {
        question: displayQuestion,
        timestamp: timestamp,
    };

    // Display the user question immediately with timestamp
    const userTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Create a container for the user question
    const userQuestionContainer = document.createElement("div");
    userQuestionContainer.className = "user-message-container";
    userQuestionContainer.innerHTML = `
    <div class="loggedin_user">
      <strong>JD</strong>
    </div>
    <p class="question-container">
      <span style="display: flow;">${displayQuestion}</span>
       <span class="timestamp">${userTimestamp}</span>
    </p>`;

    chatbotContainer.appendChild(userQuestionContainer);

    // Clear the input field
    questionInput.value = "";

    // Show typing animation immediately
    const typingAnimationContainer = document.createElement("div");
    typingAnimationContainer.className = "message-container";
    typingAnimationContainer.innerHTML = `
    <div class="loggedin_bot">
            <img src="/icons/boticon.png"/>
            </div>
    <lottie-player src="/Animation/typing.json"
                     speed="1"
                     style="width: 63px; height: 30px"
                     loop
                     autoplay>
    </lottie-player>`;
    chatbotContainer.appendChild(typingAnimationContainer);

    // Simulate delay (you can replace this with your actual API call)

    // Call the API to fetch response

    let url;
    if (screenType === "permit-parsing") {
        url = "/PermitParsing/FetchDocumentResponse";
    } else if (screenType === "permit-comparison") {
        url = "/PermitComparison/FetchDocumentResponse";
    }

    $.post(url, { chatMessage: question }, function (data) {

        data = data.replace(/```html/g, '');
        data = data.replace(/```/g, '');

        typingAnimationContainer.remove();
        const htmlTagsRegex = /<[^\s<>]*>[\s\S]*?<\/[^\s<>]*>/i.test(data);
        console.log(htmlTagsRegex);

        // Create a container for the chatbot response
        const chatbotResponseContainer = document.createElement("div");
        chatbotResponseContainer.className = "message-container";
        chatbotResponseContainer.innerHTML = `
            <div class="loggedin_bot">
                <img src="/icons/boticon.png"/>
            </div>
            <div class="response-container">
                <div class="feedback-icons">
                    <img src="/icons/thumbs-up.svg" class="thumbs-up" alt="Thumbs Up">
                    <img src="/icons/thumbs-down.svg" class="thumbs-down" alt="Thumbs Down">
                </div>
                ${htmlTagsRegex ? '<p>' + data + '</p>' : createNumberedList(data)}
                <span class="timestamp">${userTimestamp}</span>
            </div>`;

        chatbotContainer.appendChild(chatbotResponseContainer);

        // Scroll to the bottom to show the latest messages
        chatbotContainer.scrollTop = chatbotContainer.scrollHeight;

        questionData.response = data;
        questionArray.push(questionData);
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(questionArray));

        console.log(questionArray);
        bindSidenavQuestions();
        toggleModal();
    });
}

//TestChatbot Ask Question
function askTestQuestion() {
    const intro_msg = document.querySelector(".intro_msg");
    intro_msg.style.display = "none";
    intro_msg.style.visibility = "hidden";
    $("#chatbotContainer").show();

    const questionInput = document.getElementById("question");
    const chatbotContainer = document.getElementById("chatbotContainer");

    const question = questionInput.value;
    console.log(question);

    const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    //Trimming the question to display on screen
    let displayQuestion = question.replace(/\bin html\b/g, '');
    console.log(displayQuestion);

    const questionData = {
        question: displayQuestion,
        timestamp: timestamp,
    };

    // Display the user question immediately with timestamp
    const userTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Create a container for the user question
    const userQuestionContainer = document.createElement("div");
    userQuestionContainer.className = "user-message-container";
    userQuestionContainer.innerHTML = `
    <div class="loggedin_user">
      <strong>JD</strong>
    </div>
    <p class="question-container">
      <span style="display: flow;">${displayQuestion}</span>
       <span class="timestamp">${userTimestamp}</span>
    </p>`;

    chatbotContainer.appendChild(userQuestionContainer);

    // Clear the input field
    questionInput.value = "";

    // Show typing animation immediately
    const typingAnimationContainer = document.createElement("div");
    typingAnimationContainer.className = "message-container";
    typingAnimationContainer.innerHTML = `
    <div class="loggedin_bot">
            <img src="/icons/boticon.png"/>
            </div>
    <lottie-player src="/Animation/typing.json"
                     speed="1"
                     style="width: 63px; height: 30px"
                     loop
                     autoplay>
    </lottie-player>`;
    chatbotContainer.appendChild(typingAnimationContainer);

    // Simulate delay (you can replace this with your actual API call)

    // Call the API to fetch response

    let url = getApiUrl("FetchDocumentResponse");
    let postObj = { question: question }

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(postObj)
    })
    .done(
            function (data) {

                data = data.replace(/```html/g, '');
                data = data.replace(/```/g, '');

                typingAnimationContainer.remove();
                const htmlTagsRegex = /<[^\s<>]*>[\s\S]*?<\/[^\s<>]*>/i.test(data);
                console.log(htmlTagsRegex);

                //Store formatted Response
            let formattedRes = marked.parse(data);

                // Create a container for the chatbot response
                const chatbotResponseContainer = document.createElement("div");
                chatbotResponseContainer.className = "message-container";
                chatbotResponseContainer.innerHTML = `
            <div class="loggedin_bot">
                <img src="/icons/boticon.png"/>
            </div>
            <div class="response-container">
                <div class="feedback-icons">
                    <img src="/icons/thumbs-up.svg" class="thumbs-up" alt="Thumbs Up">
                    <img src="/icons/thumbs-down.svg" class="thumbs-down" alt="Thumbs Down">
                </div>
                ${htmlTagsRegex ? '<p>' + formattedRes + '</p>' : formattedRes}
                <span class="timestamp">${userTimestamp}</span>
            </div>`;

                chatbotContainer.appendChild(chatbotResponseContainer);

                // Scroll to the bottom to show the latest messages
                chatbotContainer.scrollTop = chatbotContainer.scrollHeight;

                questionData.response = formattedRes;
                questionArray.push(questionData);
                sessionStorage.setItem(sessionStorageKey, JSON.stringify(questionArray));

                console.log(questionArray);
                bindSidenavQuestions();
                toggleModal();
        })
        .fail(function (e) {
            console.error(e);
        });
}

//function formatResponseContent(content) {
//    // Replace headers
//    content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
//    content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
//    content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');

//    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

//    // Handle ordered list items correctly
//    content = content.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');
//    content = content.replace(/<\/li>\s*<li>/gim, '</li><li>'); // Ensure proper list item formatting
//    content = content.replace(/(<li>.*<\/li>)/gim, '<ol>$1</ol>');

//    // Handle remaining unordered list items correctly
//    content = content.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
//    content = content.replace(/<\/li>\s*<li>/gim, '</li><li>'); // Ensure proper list item formatting
//    content = content.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

//    // Replace bold text that starts with - **text**: (only bold the text between **)
//    content = content.replace(/- \*\*(.*?)\*\*:\s*(.*$)/gim, '<strong>$1:</strong> $2');

//    // Replace bold text that should be headings (treat as headings without bullets)
//    content = content.replace(/- \*\*(.*?)\*\*/gim, '<strong>$1</strong>');

//    // Replace new lines with paragraph tags
//    content = content.replace(/\n\n/gim, '</p><p>');
//    content = content.replace(/\n/gim, '<br>');

//    // Wrap the entire content in a paragraph tag if not already wrapped
//    content = '<p>' + content.trim() + '</p>';

//    return content;
//}

//function parseMarkdown(content) {
//    // Split the content into lines
//    const lines = content.split('\n');
//    const htmlLines = [];
//    const listStack = [];
//    let currentListType = null; // 'ol' or 'ul'

//    function closeList() {
//        if (listStack.length > 0) {
//            htmlLines.push(`</${listStack.pop()}>`);
//        }
//    }

//    lines.forEach(line => {
//        // Handle headings
//        if (line.startsWith('### ')) {
//            htmlLines.push(`<h3>${line.slice(4).trim()}</h3>`);
//        } else if (line.startsWith('## ')) {
//            htmlLines.push(`<h2>${line.slice(3).trim()}</h2>`);
//        } else if (line.startsWith('# ')) {
//            htmlLines.push(`<h1>${line.slice(2).trim()}</h1>`);
//        } else if (line.startsWith('1. ') || line.startsWith('2. ')) {
//            // Handle ordered list
//            if (currentListType !== 'ol') {
//                closeList();
//                htmlLines.push('<ol>');
//                listStack.push('ol');
//                currentListType = 'ol';
//            }
//            htmlLines.push(`<li>${processText(line.slice(3).trim())}</li>`);
//        } else if (line.startsWith('- ')) {
//            // Handle unordered list
//            if (currentListType !== 'ul') {
//                closeList();
//                htmlLines.push('<ul>');
//                listStack.push('ul');
//                currentListType = 'ul';
//            }
//            htmlLines.push(`<li>${processText(line.slice(2).trim())}</li>`);
//        } else if (line.trim() === '') {
//            // Handle empty lines (end of list or paragraph)
//            closeList();
//            htmlLines.push('<p></p>');
//        } else {
//            // Handle paragraphs or non-listed text
//            closeList();
//            htmlLines.push(`<p>${processText(line.trim())}</p>`);
//        }
//    });

//    closeList(); // Ensure all lists are closed

//    return htmlLines.join('\n');
//}

//function processText(text) {
//    // Replace bold text with <strong> tags
//    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//}



function askSQLQuestion() {
    const intro_msg = document.querySelector(".intro_msg");
    intro_msg.style.display = "none";
    intro_msg.style.visibility = "hidden";
    $("#chatbotContainer").show();

    const questionInput = document.getElementById("question");
    const chatbotContainer = document.getElementById("chatbotContainer");

    const question = questionInput.value;
    console.log(question);

    const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    //Trimming the question to display on screen
    let displayQuestion = question.replace(/\bin html\b/g, '');
    console.log(displayQuestion);

    const questionData = {
        question: displayQuestion,
        timestamp: timestamp,
    };

    // Display the user question immediately with timestamp
    const userTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Create a container for the user question
    const userQuestionContainer = document.createElement("div");
    userQuestionContainer.className = "user-message-container";
    userQuestionContainer.innerHTML = `
    <div class="loggedin_user">
      <strong>JD</strong>
    </div>
    <p class="question-container">
      <span style="display: flow;">${displayQuestion}</span>
       <span class="timestamp">${userTimestamp}</span>
    </p>`;

    chatbotContainer.appendChild(userQuestionContainer);

    // Clear the input field
    questionInput.value = "";

    // Show typing animation immediately
    const typingAnimationContainer = document.createElement("div");
    typingAnimationContainer.className = "message-container";
    typingAnimationContainer.innerHTML = `
    <div class="loggedin_bot">
            <img src="/icons/boticon.png"/>
            </div>
    <lottie-player src="/Animation/typing.json"
                     speed="1"
                     style="width: 63px; height: 30px"
                     loop
                     autoplay>
    </lottie-player>`;
    chatbotContainer.appendChild(typingAnimationContainer);

    // Simulate delay (you can replace this with your actual API call)

    // Call the API to fetch response

    let url = "api/FetchSQLResponse";
    //let postObj = { question: question }

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(question)
    })
        .done(
            function (data) {

                data = data.replace(/```html/g, '');
                data = data.replace(/```/g, '');

                typingAnimationContainer.remove();
                const htmlTagsRegex = /<[^\s<>]*>[\s\S]*?<\/[^\s<>]*>/i.test(data);
                console.log(htmlTagsRegex);

                //let parsedResponse = typeof data === 'string' ? JSON.parse(data) : data;
                let answer = JSON.parse(data).answer;

                // Regular expression to match the pattern
                const regex = /.*charts\/[a-zA-Z0-9\-]+\.png.*\n?/g;
                const markdownPattern = /^```markdown\s+|```$/g;

                // Remove lines that match the pattern
                answer = answer.replace(regex, '').replace(markdownPattern, '').trim();

                let image = JSON.parse(data).image;
                
                let encodedImage = "data:image/png;base64," + image;

                let finalRes = marked.parse(answer);
                //console.log(answer);

                // Create a container for the chatbot response
                const chatbotResponseContainer = document.createElement("div");
                chatbotResponseContainer.className = "message-container";
                chatbotResponseContainer.innerHTML = `
            <div class="loggedin_bot">
                <img src="/icons/boticon.png"/>
            </div>
            <div class="response-container">
                <div class="feedback-icons">
                    <img src="/icons/thumbs-up.svg" class="thumbs-up" alt="Thumbs Up">
                    <img src="/icons/thumbs-down.svg" class="thumbs-down" alt="Thumbs Down">
                </div>
                ${finalRes}
                ${image ? '<img src="' + encodedImage + '" alt="Image">' : ''}
                <span class="timestamp">${userTimestamp}</span>
            </div>`;

                chatbotContainer.appendChild(chatbotResponseContainer);

                // Scroll to the bottom to show the latest messages
                chatbotContainer.scrollTop = chatbotContainer.scrollHeight;

                questionData.response = finalRes;
                questionData.image = encodedImage;
                questionArray.push(questionData);
                sessionStorage.setItem(sessionStorageKey, JSON.stringify(questionArray));

                console.log(questionArray);
                bindSidenavQuestions();
                toggleModal();
            })
        .fail(function (e) {
            console.error(e);
        });
}

function askAzureQuestion() {
    const intro_msg = document.querySelector(".intro_msg");
    intro_msg.style.display = "none";
    intro_msg.style.visibility = "hidden";
    $("#chatbotContainer").show();

    const questionInput = document.getElementById("question");
    const chatbotContainer = document.getElementById("chatbotContainer");

    const question = questionInput.value;
    console.log(question);

    const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    //Trimming the question to display on screen
    let displayQuestion = question.replace(/\bin html\b/g, '');
    console.log(displayQuestion);

    const questionData = {
        question: displayQuestion,
        timestamp: timestamp,
    };

    // Display the user question immediately with timestamp
    const userTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Create a container for the user question
    const userQuestionContainer = document.createElement("div");
    userQuestionContainer.className = "user-message-container";
    userQuestionContainer.innerHTML = `
    <div class="loggedin_user">
      <strong>JD</strong>
    </div>
    <p class="question-container">
      <span style="display: flow;">${displayQuestion}</span>
       <span class="timestamp">${userTimestamp}</span>
    </p>`;

    chatbotContainer.appendChild(userQuestionContainer);

    // Clear the input field
    questionInput.value = "";

    // Show typing animation immediately
    const typingAnimationContainer = document.createElement("div");
    typingAnimationContainer.className = "message-container";
    typingAnimationContainer.innerHTML = `
    <div class="loggedin_bot">
            <img src="/icons/boticon.png"/>
            </div>
    <lottie-player src="/Animation/typing.json"
                     speed="1"
                     style="width: 63px; height: 30px"
                     loop
                     autoplay>
    </lottie-player>`;
    chatbotContainer.appendChild(typingAnimationContainer);

    // Simulate delay (you can replace this with your actual API call)

    // Call the API to fetch response

    let url = "api/GetChatResponseAsync";
    //let postObj = { question: question }

    $.ajax({
        url: url,
        type: "GET",
        data: { question: question }
    })
        .done(
            function (data) {

                data = data.replace(/```html/g, '');
                data = data.replace(/```/g, '');

                typingAnimationContainer.remove();
                const htmlTagsRegex = /<[^\s<>]*>[\s\S]*?<\/[^\s<>]*>/i.test(data);
                console.log(htmlTagsRegex);

                //let parsedResponse = typeof data === 'string' ? JSON.parse(data) : data;
                let answer = JSON.parse(data).answer;
                //console.log(typeof(answer));
                
                let finalRes = marked.parse(answer);
                //console.log(finalRes);

                // Create a container for the chatbot response
                const chatbotResponseContainer = document.createElement("div");
                chatbotResponseContainer.className = "message-container";
                chatbotResponseContainer.innerHTML = `
            <div class="loggedin_bot">
                <img src="/icons/boticon.png"/>
            </div>
            <div class="response-container">
                <div class="feedback-icons">
                    <img src="/icons/thumbs-up.svg" class="thumbs-up" alt="Thumbs Up">
                    <img src="/icons/thumbs-down.svg" class="thumbs-down" alt="Thumbs Down">
                </div>
                ${htmlTagsRegex ? '<p>' + finalRes + '</p>' : finalRes}
                <span class="timestamp">${userTimestamp}</span>
            </div>`;

                chatbotContainer.appendChild(chatbotResponseContainer);

                // Scroll to the bottom to show the latest messages
                chatbotContainer.scrollTop = chatbotContainer.scrollHeight;

                questionData.response = finalRes;
                questionArray.push(questionData);
                sessionStorage.setItem(sessionStorageKey, JSON.stringify(questionArray));

                console.log(questionArray);
                bindSidenavQuestions();
                toggleModal();
            })
        .fail(function (e) {
            console.error(e);
        });
}


function highlightBoldText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function createNumberedList(data) {

    const lines = data.split(/\n/);
    let listStarted = false;
    //let ollistStarted = false;
    //let ullistStarted = false;
    let formattedData = '';
    //let bulletStarted = false;

    for (let i = 0; i < lines.length; i++) {
        let section = lines[i].trim();

        if (section === '') {
            formattedData += `<br/>`;
        }
        else {
            const regex = /^\d+\.\s/;
            if (regex.test(section)) {
                section = section.replace(regex, "");
                if (listStarted) {
                    formattedData += `<li>${section}</li>`;
                } else {
                    listStarted = true;
                    formattedData += `<ol>`;
                    formattedData += `<li>${section}</li>`;
                }
            } else {
                if (section !== '') {
                    if (listStarted) {
                        formattedData += `</ol>`;
                        listStarted = false;
                    }
                    formattedData += `<p>${section}</p>`;
                }
            }
        }
    }

    //for (let i = 0; i < lines.length; i++) {
    //    let section = lines[i].trim();

    //    if (section === '') {
    //        formattedData += `<br/>`;
    //    }
    //    else {
    //        const regex = /^\d+\.\s/;
    //        if (regex.test(section)) {
    //            section = section.replace(regex, "");
    //            if (ollistStarted) {
    //                formattedData += `<li>${section}`;
    //                bulletStarted = true;
    //            } else {
    //                ollistStarted = true;
    //                formattedData += `<ol>`;
    //                formattedData += `<li>${section}`;
    //                bulletStarted = true;
    //            }
    //        }
    //        else if (section.trim().startsWith('- ')) {
    //            section = line.substring(2).trim();

    //            if (ullistStarted) {
    //                formattedData += `<li>${section}<li>`;
    //            } else {
    //                ollistStarted = true;
    //                formattedData += `<ol>`;
    //                formattedData += `<li>${section}<li>`;
    //            }

    //        }
    //        else {
    //            if (section !== '') {
    //                if (ollistStarted) {
    //                    formattedData += `</ol>`;
    //                    ollistStarted = false;
    //                }
    //                formattedData += `<p>${section}</p>`;
    //            }
    //        }
    //    }
    //}
    if (listStarted) {
        formattedData += `</ol>`;
    }

    return formattedData;
    console.log(formattedData);
}


const checkboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('mouseover', function () {
        this.nextElementSibling.style.backgroundColor = 'lightgray'; // Change background color on hover
    });
    checkbox.addEventListener('mouseout', function () {
        this.nextElementSibling.style.backgroundColor = ''; // Reset background color on mouseout
    });
});

//Feedback Modal
function toggleModal() {

    $('#chatbotContainer').on('click', '.thumbs-down', function () {
        $('#modal').css({
            display: 'flex'
        }).show();
    });

    $('body').on('click', '#cancelBtn', function () {
        event.preventDefault();
        $('#modal').hide();
    });

    //Form Submit

    const clickedCheckboxes = [];

    $('.checkbox-list input[type="checkbox"]').change(function () {
        const checkboxId = $(this).attr('id');
        if ($(this).prop('checked')) {
            clickedCheckboxes.push(checkboxId);
        } else {
            const index = clickedCheckboxes.indexOf(checkboxId);
            if (index !== -1) {
                clickedCheckboxes.splice(index, 1);
            }
        }
        console.log("Clicked Checkboxes:", clickedCheckboxes);
    });
    $('#feedback-form').submit(function (event) {
        event.preventDefault(); // Prevent form submission and page reload

        // Your form submission logic here
        console.log("Form submitted. Clicked Checkboxes:", clickedCheckboxes);
    });

    //console.log("inside toggle modal");
    //const modal = document.getElementById('modal');
    //const thumbsdown_clicked = document.getElementById('thumbs-down');
    //const cancelBtn = document.getElementById('cancelBtn');

    //if (thumbsdown_clicked) {
    //    console.log("Click captured");
    //    thumbsdown_clicked.addEventListener('click', showModal);
    //}
    //cancelBtn.addEventListener('click', hideModal);

}
function showModal() {
    console.log("Toggle button clicked");
    modal.style.display = 'flex';
}

function hideModal() {
    modal.style.display = 'none';
}

function onMarketingClick() {
    window.location.href = "Chat_page.html";
}

function goToHomePage() {
    window.location.href = "/home/index";
}

$(document).ready(function () {
    $(".newchat").on("click", function () {
        window.location.reload();
    });

    $("#chatbotContainer").hide();
    var widthVal = $("#main-content").width();
    $(".chatinput").css({ width: widthVal + "px" });

    chatHistory();
});
//function replaceWithInputField(container) {
//    // Get the text content
//    const text = container.textContent.trim();

//    //Function to extract and store the time
//    const trimmedTime = extractTrimmedTime(text);
//    console.log(trimmedTime);

//    const timestampRegex = /\s+\d{1,2}:\d{2}\s?[AP]M$/;

//    const formattedText = text.replace(timestampRegex, '').trim();
//    console.log(formattedText);

//    // Create an input element
//    const input = document.createElement('input');
//    input.type = 'text';
//    input.value = formattedText;
//    //removeTimestamp(text);
//    //console.log(text);

//    // Replace the text content with the input field
//    container.innerHTML = '';
//    container.appendChild(input);

//    // Focus on the input field
//    input.focus();

//    // Add event listener to handle editing
//    input.addEventListener('blur', () => {
//        // When the input field loses focus, update the text content
//        container.textContent = input.value.trim() + " " + trimmedTime;
//    });
//}


// Event listener for pencil icon click
//document.addEventListener('click', function (event) {
//    // Check if the clicked element is the pencil icon
//    if (event.target && event.target.matches('.edit-icon')) {
//        // Get the parent container of the icon
//        const container = event.target.closest('.user-message-container');

//        // Replace the text with an editable input field
//        if (container) {
//            replaceWithInputField(container.querySelector('.question-container'));
//        }
//    }
//});

//function extractTrimmedTime(promptString) {
//    // Define the regular expression pattern with capturing group for the timestamp
//    const regex = /\s+(\d{1,2}:\d{2}\s?[AP]M)$/;

//    // Execute the regular expression to extract the timestamp
//    const matches = promptString.match(regex);

//    // Check if a timestamp is found
//    if (matches && matches.length > 1) {
//        // Extract the timestamp from the captured group
//        const trimmedTime = matches[1];
//        return trimmedTime;
//    } else {
//        console.log("No timestamp found in the prompt string.");
//        return null;
//    }
//}


