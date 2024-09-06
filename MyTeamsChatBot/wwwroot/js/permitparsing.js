var pdfData;
var resolution = 1; //Set Resolution to Adjust PDF clarity.

var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// Initialize PDF.js viewer
const pdfUrl = '/Pdf/Taylorsville finalp1671979.pdf'; // Replace with the URL of your PDF file
const pdfContainer = document.getElementById('pdf-container');
const prntPdfContainer = document.getElementById('prnt-pdf-container');
const pdfZoomRange = document.getElementById('pdf-inp-rng');

pdfZoomRange.addEventListener("change", (e) => {
    bindPDFOnScreen(pdfZoomRange.value);
   
});

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
    pdfData = pdf;
    bindPDFOnScreen(pdfZoomRange.value);
});

function bindPDFOnScreen(scaleVal) {
    pdfContainer.innerHTML = "";
    for (let pageNum = 1; pageNum <= pdfData.numPages; pageNum++) {
        pdfData.getPage(pageNum).then(page => {
            const scale = scaleVal;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = scaleVal * viewport.height;
            canvas.width = scaleVal * viewport.width;
            canvas.className = "cnv-pdf"
            const renderCtx = {
                canvasContext: ctx,
                viewport: viewport,
                transform: [scaleVal, 0, 0, scaleVal, 0, 0]
            };
            pdfContainer.appendChild(canvas);
            page.render(renderCtx);
        });
    }
}

