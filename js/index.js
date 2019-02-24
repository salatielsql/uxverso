var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'keyzeNxuB0yshK7V6' }).base('appjdSMSZP61JTDRk');
var container = document.getElementById('records-container');
var placeholders = document.getElementById('placeholders');
var localRecords = [];
var storage = window.localStorage;

if (storage.getItem('records') == null || undefined) {
  console.log('Não tem!')
  base('learn').select({
    view: "Grid view",
    filterByFormula: `{available} != ""`
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function (record) {
      localRecords.push(record.fields);
    });

    fetchNextPage();

  }, function done(err) {
    console.log(localRecords);
    storage.setItem('records', JSON.stringify(localRecords));
    renderRecords()

    if (err) { console.error(err); return; }
  });
} else {
  renderRecords()
}

function renderRecords() {
  var recordslist = JSON.parse(storage.getItem('records'));
  var recordsHTML = '';
  recordslist.forEach(function (item) {
    recordsHTML += `
    <a href="${item.link}" class="record-item">
      <img src="${item.image[0].url}"/>
      <h2>${item.name}</h2>
      <span class="tag">${item.type == "curso" ? "Curso" : "Livro"}</span>
      <span class="tag">${item.level}</span>
    </a>
    `;
  })
  placeholders.style.display = 'none';
  container.innerHTML = recordsHTML;
  // recordsContent += `<div class="record-item"><h2>${record.get('name')}</h2></div>`
}

      // let name = record.get('name');
      // let imageUrl = record.get('image')[0].url;
      // let imageAlt = record.get('image')[0].filename;
      // let type = record.get('type');
      // let link = record.get('link');
      // let level = record.get('level');
      // console.log(index, name, imageUrl, imageAlt, type, link);