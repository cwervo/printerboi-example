import PB from 'https://unpkg.com/printerboi@0.1.1/index.js';
import 'https://unpkg.com/@google/model-viewer@0.7.2/dist/model-viewer.js';

function setAttributeBlank(el, attribute) {
    el.setAttribute(attribute, '')
}

let mvEl = document.createElement('model-viewer');
mvEl.setAttribute('src', './gameboy.glb')
mvEl.setAttribute('background-color', '#FFFFFF')
setAttributeBlank(mvEl, 'auto-rotate')
setAttributeBlank(mvEl, 'camera-controls')
setAttributeBlank(mvEl, 'auto-rotate')
document.body.appendChild(mvEl)

function addPrinterButton() {
    let printerButton = document.createElement('button')
    printerButton.classList.add('printerButton')
    printerButton.innerHTML = `<img src="printer.png" alt="printer image"/>`
    document.body.appendChild(printerButton)
    return printerButton
}

let pb = new PB(document.querySelector('model-viewer').shadowRoot.querySelector('canvas'))
// console.log(pb, pb.version())
// pb.autoclose(false)
pb.orientation('landscape')

let printerButtonEl = addPrinterButton()
printerButtonEl.onclick = () => {
    pb.printPopup()
}

