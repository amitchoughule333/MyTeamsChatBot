var pdfData1, pdfData2;
var resolution1 = 1, resolution2 = 1; //Set Resolution to Adjust PDF clarity.
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';


// Initialize PDF.js viewer
const pdfUrl1 = '/Pdf/Permit2024.pdf'; // Replace with the URL of your PDF file
const pdfUrl2 = '/Pdf/Permit2016.pdf'; // Replace with the URL of your PDF file

const pdfContainer1 = document.getElementById('pdf-container1');
const pdfContainer2 = document.getElementById('pdf-container2');

const pdfZoomRange1 = document.getElementById('pdf-inp-rng1');
const pdfZoomRange2 = document.getElementById('pdf-inp-rng2');

pdfZoomRange1.addEventListener("change", (e) => {
    bindPDFOnScreen1(pdfZoomRange1.value);
});

pdfZoomRange2.addEventListener("change", (e) => {
    bindPDFOnScreen2(pdfZoomRange2.value);
});

pdfjsLib.getDocument(pdfUrl1).promise.then(pdf => {
    pdfData1 = pdf;
    bindPDFOnScreen1(pdfZoomRange1.value);
});

pdfjsLib.getDocument(pdfUrl2).promise.then(pdf => {
    pdfData2 = pdf;
    bindPDFOnScreen2(pdfZoomRange2.value);
});

function bindPDFOnScreen1(scaleVal) {
    pdfContainer1.innerHTML = "";
    for (let pageNum = 1; pageNum <= pdfData1.numPages; pageNum++) {
        pdfData1.getPage(pageNum).then(page => {
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
            pdfContainer1.appendChild(canvas);
            page.render(renderCtx);
        });
    }
}

function bindPDFOnScreen2(scaleVal) {
    pdfContainer2.innerHTML = "";
    for (let pageNum = 1; pageNum <= pdfData2.numPages; pageNum++) {
        pdfData2.getPage(pageNum).then(page => {
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
            pdfContainer2.appendChild(canvas);
            page.render(renderCtx);
        });
    }
}