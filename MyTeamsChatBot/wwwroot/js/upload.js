//Upload/Delete Code

document.addEventListener('DOMContentLoaded', () => {
    fetch('/Fileupload/FetchBlobStorageFiles')
        .then(response => response.json())
        .then(data => {
            const fileListDiv = document.getElementById('fileList');
            data.forEach(fileName => {
                const fileNameElement = document.createElement('div');
                fileNameElement.className = "listed-file";
                fileNameElement.textContent = fileName;

                // Create the delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.id = 'delete-button';
                deleteButton.onclick = function () {

                    showModal(fileName);

                    deleteBtn.onclick = function () {
                        deleteFileFromStorage(fileName);
                        fileNameElement.remove();
                        console.log(fileName + " file Deleted successfully!");
                        hideModal();
                    }
                };


                // Append the delete button to the div
                fileNameElement.appendChild(deleteButton);

                fileListDiv.appendChild(fileNameElement);
            });
        })
        .catch(error => {
            console.error('Error fetching filenames:', error);
        });
});


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileList = document.getElementById('fileList');

    uploadBtn.addEventListener('click', () => {
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/Fileupload/UploadFileToBlob', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);

                    // append the uploaded file to the file list
                    const div = document.createElement('div');
                    div.className = "listed-file";
                    div.textContent = file.name;

                    location.reload();

                    // Create the delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = function () {

                        showModal(fileName);

                        deleteBtn.onclick = function () {
                            deleteFileFromStorage(fileName);
                            fileNameElement.remove();
                            console.log(fileName + " file Deleted successfully!");
                            hideModal();
                        }
                    };


                    // Append the delete button to the div
                    div.appendChild(deleteButton);

                    fileList.appendChild(div);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.error('No file selected.');
        }
    });
});


//Modal Working

const modal = document.getElementById('modal');
//const showModalBtn = document.getElementsByClassName('delete-button');
const cancelBtn = document.getElementById('cancelBtn');
const deleteBtn = document.getElementById('deleteBtn');

cancelBtn.addEventListener('click', hideModal);
deleteBtn.addEventListener('click', deleteFileFromStorage);

// Show modal function
function showModal(fileName) {
    const clickedFile = document.getElementById('clicked-file');
    console.log("Delete this file? ", fileName);
    modal.style.display = 'flex';
    clickedFile.innerHTML = "" + fileName;
}

function hideModal() {
    modal.style.display = 'none';
}


function deleteFileFromStorage(fileName) {
    // Send an API request to delete the file with the given fileName
    fetch(`/Fileupload/DeleteBlobStorageFiles?fileName=${fileName}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
            console.log('File deleted successfully:', fileName);
        })
        .catch(error => {
            console.error('Error deleting file:', error);
        });
}

function goToChatPage() {
  window.location.href = "/permitParsing/index";
}
function onLogoutClick() {
    Cookies.remove("authCookie");
    window.location.href = "./login.html";
}

function toggleNav() {
    $(".specs").toggleClass("withmenu");
    let width = $("#mySidenav").width();
    let mgLeft = $("#main").css("margin-left");

    if (window.innerWidth < 440) {
        if (width === 0) {
            $("#mySidenav").css("width", "50%");
            $("#main").css("margin-left", "0");
        } else {
            $("#mySidenav").css("width", "0");
            $("#main").css("margin-left", "0");
        }
    } else if (window.innerWidth < 660) {
        if (width === 0) {
            $("#mySidenav").css("width", "40%");
            $("#main").css("margin-left", "0");
        } else {
            $("#mySidenav").css("width", "0");
            $("#main").css("margin-left", "0");
        }
    } else if (window.innerWidth < 767) {
        if (width === 0) {
            $("#mySidenav").css("width", "35%");
            $("#main").css("margin-left", "35%");
        } else {
            $("#mySidenav").css("width", "0");
            $("#main").css("margin-left", "0");
        }
    } else if (window.innerWidth < 980) {
        if (width === 0) {
            $("#mySidenav").css("width", "30%");
            $("#main").css("margin-left", "30%");
        } else {
            $("#mySidenav").css("width", "0");
            $("#main").css("margin-left", "0");
        }
    } else {
        if (width === 0) {
            $("#mySidenav").css("width", "20%");
            $("#main").css("margin-left", "20%");
        } else {
            $("#mySidenav").css("width", "0");
            $("#main").css("margin-left", "0");
        }
    }
    setTimeout(() => {
        if ($(".chatinput") != "undefined" && $(".chatinput") != null) {
            var widthVal = $("#main-content").width();
            $(".chatinput").css({ width: widthVal + "px" });
        }
    }, "600");

    //if ($(".chatinput")) $(".chatinput").toggleClass("panelActive");
}

function bodyLoadEvent() {
    if (window.innerWidth > 980) {
        toggleNav();
        //$(".chatinput").addClass("panelActive");
    }
}


// Call toggleNav on window resize
$(window).on("resize", toggleNav);

// Call bodyLoadEvent on document ready
//bodyLoadEvent();

$(document).ready(function () {
    $("#login_initials").click(function () {
        $(".menubar").slideToggle();
    });
    $(".newchat").on("click", function () {
        window.location.reload();
    });

    $("#chatbotContainer").hide();
    var widthVal = $("#main-content").width();
    $(".chatinput").css({ width: widthVal + "px" });
});

function toggleNavList() {
    var navList = document.getElementById("navList");
    var hamburgerIcon = document.querySelector(".hamburger-icon");
    navList.style.display = navList.style.display === "block" ? "none" : "block";
    hamburgerIcon.classList.toggle("rotate");
}
