document.addEventListener('DOMContentLoaded', function () {
    // When the document content is loaded, this function will execute.

    var expandPdfButton = document.getElementById('expandpdf');
    // Get the element with the ID 'expandpdf'.

    expandPdfButton.addEventListener('click', function () {
        // When the 'expandpdf' button is clicked, this function will execute.

        var mainElement = document.querySelector('main');
        // Get the 'main' element.

        mainElement.classList.toggle('expandsec');
        // Toggle the class 'expandsec' on the 'main' element.

        const pdfZoomRange1 = document.getElementById('pdf-inp-rng1');
        const pdfZoomRange2 = document.getElementById('pdf-inp-rng2');
        // Get the input element with the class 'pdf-inp-rng'.

        if (mainElement.classList.contains('expandsec')) {
            // If 'main' has the class 'expandsec', set the value to '0.9'.
            pdfZoomRange1.value = '0.9';
            pdfZoomRange2.value = '0.9';
            expandPdfButton.querySelector('i').classList.remove('bi-arrows-angle-expand');
            expandPdfButton.querySelector('i').classList.add('bi-arrows-angle-contract');
            expandPdfButton.setAttribute('title', 'Shrink');
            
            bindPDFOnScreen1(pdfZoomRange1.value);
            bindPDFOnScreen2(pdfZoomRange2.value);
            
        } else {
            // If 'main' does not have the class 'expandsec', set the value to '0.6'.
            pdfZoomRange1.value = '0.6';
            pdfZoomRange2.value = '0.6';
            expandPdfButton.querySelector('i').classList.remove('bi-arrows-angle-contract');
            expandPdfButton.querySelector('i').classList.add('bi-arrows-angle-expand');
            expandPdfButton.setAttribute('title', 'Expand');
            
            bindPDFOnScreen1(pdfZoomRange1.value);
            bindPDFOnScreen2(pdfZoomRange2.value);
           
        }
    });
});