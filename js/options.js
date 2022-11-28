// options list
const optionsList = document.getElementById('options-list').querySelectorAll('.option')

// iterate over options
optionsList.forEach(option => {
    // option key
    const key = option.getAttribute('data-key')
    // option element
    const element = option.querySelector('.value')
    // option value
    const value = localStorage.getItem(key) || element.value

    // set option value from localstorage if exist else use element value
    option.querySelector('.value').value = value
    // set key value from localstorage if exist else use element value
    localStorage.setItem(key, value)

    // listen for input events
    element.addEventListener('input', event => {
        // get option key
        const key = event.target.parentElement.getAttribute('data-key')
        // get option value
        const value = event.target.value

        // set key value from element value
        localStorage.setItem(key, value)

        optionsUpdateCallback()
    })
})

// options update
let optionsUpdateCallback
export function optionsUpdate(callback) {
    optionsUpdateCallback = callback
}
