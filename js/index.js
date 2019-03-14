var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keyzeNxuB0yshK7V6' }).base('appjdSMSZP61JTDRk');
var container = document.getElementById('records-container');
var placeholders = document.getElementById('placeholders');
var localRecords = [];
var recordslist = [];
var storage = window.sessionStorage;

if (storage.getItem('records') == null || undefined) {
  fetchFromAirtable(callRender)
} else {
  callRender();
  console.log('aaaaa')

}

function fetchFromAirtable(callback) {
  base('learn').select({
    view: "Grid view",
    filterByFormula: `{available} = "sim"`
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function (record) {
      localRecords.push(record.fields);
    });

    fetchNextPage();

  }, function done(err, ) {
    storage.setItem('records', JSON.stringify(localRecords));
    console.log('aaaaa')
    callback(localRecords)
    if (err) { console.error(err); return; }
  });
}
console.log('aaaaa')

// Callback and get localstorage items
function callRender(records) {
  recordslist = JSON.parse(storage.getItem('records'));

  if (!records) { records = recordslist }

  renderRecords(records, 'renderHTML');
}
// Map and render
function renderRecords(records, htmlVar) {
  console.table(records)

  var htmlVar = '';
  records.forEach(function (item) {
    htmlVar += `
    <a href="${item.link}" class="record-item">
      <img src="${item.image[0].url}"/>
      <h2>${item.name}</h2>
      <p class="author-name">por ${item.author}</p>
      <span class="tag">${item.type == "curso" ? "Curso" : "Livro"}</span>
      <span class="tag">${item.level}</span>
    </a>
    `;
  })
  placeholders.style.display = 'none';
  container.innerHTML = htmlVar;
  console.log(records);
}
// Filter records
function filterBy(filter, arg) {
  var filteredResults = recordslist.filter(function (item) { return item[filter] == arg });
  renderRecords(filteredResults, 'renderFilteredResults')
}

//add active to tsag-buttons
const tagButtons = Array.from(document.querySelectorAll('.tag-button'));
tagButtons.forEach(function (tagButton) {
  return tagButton.addEventListener('click', function (e) {
    tagButtons.some(function (i) {
      if (i.classList.contains('active')) {
        return i.classList.remove('active')
      }
    })
    e.target.classList.add('active');
  });
});