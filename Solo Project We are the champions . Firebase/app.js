import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const textArea = document.getElementById("endorsement")
const inputFrom = document.getElementById("from")
const inputTo = document.getElementById("to")
const publishBtn = document.getElementById("publish")
const myList = document.querySelector(".list")

const appSettings = {
    databaseURL: "https://endorsements-c1030-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const myApp = initializeApp(appSettings)
const database = getDatabase(myApp)
const databaseINfirebase = ref(database, "endorsements")

function getTextData() {
    if (textArea.value && inputFrom.value && inputTo.value) {
        let myObject = {
            comment: textArea.value,
            sender: inputFrom.value,
            receiver: inputTo.value
        }
        push(databaseINfirebase, myObject)
        clearAllInputs()
    }
}

function clearAllInputs() {
    textArea.value = ""
    inputFrom.value = ""
    inputTo.value = ""
}

function createElements(from, text, to, key) {
    let listItem = document.createElement("li")
    listItem.classList = "list-item flex"

    let firstSpan = document.createElement("span")
    firstSpan.classList = "reciever"
    firstSpan.textContent = `To ${to}`

    let secondSpan = document.createElement("span")
    secondSpan.classList = "comment"
    secondSpan.textContent = text

    let thirdSpan = document.createElement("span")
    thirdSpan.classList = "sender"
    thirdSpan.textContent = `From ${from}`

    listItem.append(firstSpan, secondSpan, thirdSpan)

    listItem.addEventListener("click", function () {
        let dataLocation = ref(database, `endorsements/${key}`)
        remove(dataLocation)
    })


    myList.appendChild(listItem)
}

onValue(databaseINfirebase, function (snapshot) {

    if (snapshot.exists()) {
        let myObjectEntries = Object.entries(snapshot.val())

        myList.innerHTML = ""

        for (let i = 0; i < myObjectEntries.length; i++) {
            let allSenders = myObjectEntries[i][1].sender
            let allComents = myObjectEntries[i][1].comment
            let allReceivers = myObjectEntries[i][1].receiver
            let allIDs = myObjectEntries[i][0]
            createElements(allSenders, allComents, allReceivers, allIDs)
        }
    } else {
        myList.innerHTML = ""
    }
})

publishBtn.addEventListener("click", getTextData)