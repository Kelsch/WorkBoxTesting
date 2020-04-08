// function createNode(element) {
//     return document.createElement(element); 
// }

// function append(parent, el) {
//     return parent.appendChild(el); 
// }

// const ul = document.getElementById('people');

// fetch('userTestJson.json')
//     .then(response => response.json())
//     .then(data => {
//         let people = data;
//         return people.map(function(person) {
//             let li = createNode('li')
//             span = createNode('span');

//             li.innerHTML = person.name;
//             span.innerHTML = person.email;

//             append(li, span);
//             append(ul, li);

//         });
//     });

// const apiURL = 'https://142.11.229.62:45455';
const apiURL = 'https://pdwebapi-mf5.conveyor.cloud';

function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}