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
  console.log('ja tem records')
  callRender();
}

function fetchFromAirtable(callback) {
  base('learn').select({
    view: "Grid view",
    filterByFormula: `{available} != ""`
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function (record) {
      localRecords.push(record.fields);
    });

    fetchNextPage();

  }, function done(err, ) {
    storage.setItem('records', JSON.stringify(localRecords));
    callback(localRecords)
    if (err) { console.error(err); return; }
  });
}
// Callback and get localstorage items
function callRender(records) {
  recordslist = JSON.parse(storage.getItem('records'));

  if (!records) { records = recordslist }

  console.log('CallRender', records)
  renderRecords(records, 'renderHTML');
}
// Map and render
function renderRecords(records, htmlVar) {
  var htmlVar = '';
  records.forEach(function (item) {
    htmlVar += `
    <a href="${item.link}" class="record-item">
      <img src="${item.image[0].url}"/>
      <h2>${item.name}</h2>
      <span class="tag">${item.type == "curso" ? "Curso" : "Livro"}</span>
      <span class="tag">${item.level}</span>
    </a>
    `;
  })
  placeholders.style.display = 'none';
  container.innerHTML = htmlVar;
  console.log('Rendered!', htmlVar);
}
// Filter records
function filterBy(filter, arg) {
  var filteredResults = recordslist.filter(function (item) { return item[filter] == arg });
  console.log(filter, arg, filteredResults);
  renderRecords(filteredResults, 'renderFilteredResults')
}

//add active to tag-buttons
const tagButtons = document.querySelectorAll('.tag-button');
console.log(tagButtons);