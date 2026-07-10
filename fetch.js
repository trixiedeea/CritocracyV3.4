window.onload = function() {
     fetch('cards.json')

 .then(function(response) {

return response.json();

 })

 .then(function(json) {

var tableCode = '<table><caption>Card Examples</caption><thead><tr><th>Deck</th><th>Name</th><th>Description</th><th>Effects</th></tr></thead><tbody>';

for (var i = 0; i < json.length; i++) {

 tableCode += '<tr><td>' + json[i].deck + '</td><td>' + json[i].name + '</td><td>' + json[i].description + '</td><td>' + json[i].effects + '</td></tr>';

 }

 tableCode += '</tbody><tfoot><tr><td colspan="4">Source: Critocracy Online Board Game</td></tr></tfoot></table>';

 document.getElementById('cards').innerHTML = tableCode;

 })

 }