// JavaScript part
document.getElementById("downloadBtn").addEventListener("click", function () {
    // URL of the PDF file relative to the root directory
    const pdfUrl = "/Pdf/Permit2024.pdf"; // Ensure the path matches the file location

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = pdfUrl;

    // Set the download attribute with a desired file name
    link.download = "downloaded-Permit2024.pdf"; // The name for the downloaded file

    // Append the link to the body (necessary for some browsers)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
});
