import { optionsUpdate } from './options.js'


// elements
const elements = {
    fileUpload: document.getElementById('file-upload'),
    fileUploadButton: document.getElementById('button-file-upload'),
    fileRefreshButton: document.getElementById('button-file-refresh'),
    fileRemoveButton: document.getElementById('button-files-remove'),
    fontList: document.getElementById('font-list'),
    codeBlock: document.getElementById('code-block'),
    codeCopyButton: document.getElementById('button-copy-to-clipboard'),
    fileDownloadButton: document.getElementById('button-file-download')
}

// files
let fontFiles = []

// upload
elements.fileUploadButton.addEventListener('click', () => {
    elements.fileUpload.click()
})

// copare regexp
function testForRegExp(key, string) {
    let flags = localStorage.getItem(key).replace(/.*\/([gimy]*)$/, '$1')
    let pattern = localStorage.getItem(key).replace(new RegExp('^/(.*?)/'+flags+'$'), '$1')
    return new RegExp(pattern, flags).test(string)
}

// generate font file object
function generateFontFile(name) {

    // default font file object
    const fontFile = {
        name: name,
        fontStyle: 'normal',
        fontWeight: 400
    }

    // font style
    if (testForRegExp('regexp-oblique', fontFile.name)) fontFile.fontStyle = 'oblique'
    else if (testForRegExp('regexp-italic', fontFile.name)) fontFile.fontStyle = 'italic'
    else if (testForRegExp('regexp-normal', fontFile.name)) fontFile.fontStyle = 'normal'
    else fontFile.fontStyle = 'normal'

    // font weight
    if (testForRegExp('regexp-font-weight-100', fontFile.name)) fontFile.fontWeight = 100
    else if (testForRegExp('regexp-font-weight-200', fontFile.name)) fontFile.fontWeight = 200
    else if (testForRegExp('regexp-font-weight-300', fontFile.name)) fontFile.fontWeight = 300
    else if (testForRegExp('regexp-font-weight-400', fontFile.name)) fontFile.fontWeight = 400
    else if (testForRegExp('regexp-font-weight-500', fontFile.name)) fontFile.fontWeight = 500
    else if (testForRegExp('regexp-font-weight-600', fontFile.name)) fontFile.fontWeight = 600
    else if (testForRegExp('regexp-font-weight-700', fontFile.name)) fontFile.fontWeight = 700
    else if (testForRegExp('regexp-font-weight-800', fontFile.name)) fontFile.fontWeight = 800
    else if (testForRegExp('regexp-font-weight-900', fontFile.name)) fontFile.fontWeight = 900
    else fontFile.fontWeight = 400

    return fontFile
}

// update font files array
function updateFontFilesList() {

    // remove all elements
    while (elements.fontList.lastChild) {
        elements.fontList.lastChild.remove()
    }
    while (elements.codeBlock.lastChild) {
        elements.codeBlock.lastChild.remove()
    }

    fontFiles.forEach(fontFile => {

        // create list element
        const li = document.createElement('li')
        li.classList.add('font')
        
        // create input element
        const input = document.createElement('input')
        input.classList.add('name')
        input.type = 'text'
        input.value = fontFile.name
        input.spellcheck = 'false'
        // change font name
        input.addEventListener('change', event => {
            fontFile.name = event.target.value
            updateFontFilesList()
        })

        // create select element
        const select = document.createElement('select')
        select.classList.add('font-style')
        select.innerHTML = `
            <option value="normal"${fontFile.fontStyle == 'normal' ? 'selected' : ''}>Normal</option>
            <option value="italic"${fontFile.fontStyle == 'italic' ? 'selected' : ''}>Italic</option>
            <option value="oblique"${fontFile.fontStyle == 'oblique' ? 'selected' : ''}>Oblique</option>
            `
        // change font style
        select.addEventListener('input', event => {
            fontFile.fontStyle = event.target.value
            sortFontFiles()
            updateFontFilesList()
        })

        // create input button element
        const inputButton = document.createElement('input')
        inputButton.classList.add('button-remove')
        inputButton.type = 'button'
        inputButton.value = 'Remove'
        inputButton.title = 'Remove font'
        // remove font file object from array
        inputButton.addEventListener('click', () => {
            fontFiles.splice(fontFiles.indexOf(fontFile), 1)
            updateFontFilesList()
        })

        // append select and input element to list element
        li.append(input, select, inputButton)

        // append list element to font list
        elements.fontList.append(li)

        const comments = localStorage.getItem('comments')
        const code = `
            ${comments == 'minimal' ? `<code><i data-token="comment">// ${fontFile.name}</i></code>` : comments == 'all' ? `<code><i data-token="comment">// ${fontFile.name} (${fontFile.fontStyle}, ${fontFile.fontWeight})</i></code>` : ''}
            <code><i data-token="keyword">@font-face</i> {</code>
            <code>    font-family: <i data-token="string">'${localStorage.getItem('font-family')}'</i>;</code>
            <code>    src: <i data-token="definition">url(<i data-token="string">'${localStorage.getItem('path') + fontFile.name}'</i>)</i>;</code>
            <code>    font-style: ${fontFile.fontStyle};</code>
            <code>    font-weight: <i data-token="number">${fontFile.fontWeight}</i>;</code>
            <code>}</code>
            `.trim().replace(/^ */gm, '')
        
        // append new code
        elements.codeBlock.innerHTML += code + '\n'
    })

    console.log('Font files:')
    console.table(fontFiles)
}

// sort font files
function sortFontFiles() {
    
    switch (localStorage.getItem('sort-font')) {
        default:
        case 'name':
            fontFiles.sort((a, b) => a.name.localeCompare(b.name))
            break;

        case 'name-reverse':
            fontFiles.sort((b, a) => a.name.localeCompare(b.name))
            break;

        case 'style':
            fontFiles.sort((a, b) => a.fontStyle.localeCompare(b.fontStyle))
            break;

        case 'style-reverse':
            fontFiles.sort((b, a) => a.fontStyle.localeCompare(b.fontStyle))
            break;
        
        case 'weight':
            fontFiles.sort((a, b) => a.fontWeight - b.fontWeight)
            break;

        case 'weight-reverse':
            fontFiles.sort((b, a) => a.fontWeight - b.fontWeight)
            break;
    }
}

// uploaded
elements.fileUpload.addEventListener('input', () => {

    // iterate over files
    for (const file of elements.fileUpload.files) {

        // generate font file object and add font file object to font files array
        fontFiles.push(generateFontFile(file.name))
    }

    sortFontFiles()
    updateFontFilesList()
})

// refresh font files
elements.fileRefreshButton.addEventListener('click', () => {
    sortFontFiles()
    updateFontFilesList()
})

// remove all font files
elements.fileRemoveButton.addEventListener('click', () => {
    fontFiles = []
    updateFontFilesList()
})

// options update
optionsUpdate(() => {
    sortFontFiles()
    updateFontFilesList()
})

// copy to clipboard
elements.codeCopyButton.addEventListener('click', () => {
    const code = elements.codeBlock.innerText.trim()
    
    // if no code is generated
    if (code == '') {
        window.alert('No code generated!')
    } else {
        navigator.clipboard.writeText(code).then(() => {
            window.alert('Copied to clipboard!')
        })
    }
})

// download file
elements.fileDownloadButton.addEventListener('click', () => {
    const code = elements.codeBlock.innerText.trim()

    // if no code is generated
    if (code == '') {
        window.alert('No code generated!')
    } else {
        // create new blob (file)
        const blob = new Blob(
            [code], 
            {
                type: 'text/csv'
            });
        
        // create download link
        const downloadLink = window.document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = localStorage.getItem('file-name');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
})
