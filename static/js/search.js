summaryInclude = 60;
var resultsPerPage = 10; // Jumlah hasil per halaman
var currentPage = 1;
var searchResults = [];

var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.2, // Lebih toleran agar hasil lebih relevan
  tokenize: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "contents", weight: 0.5 },
    { name: "tags", weight: 0.3 },
    { name: "categories", weight: 0.3 },
    { name: "image", weight: 0.2 }
  ]
};

// Ambil data indeks JSON hanya sekali
var fuse;
$.getJSON("/index.json", function (data) {
  fuse = new Fuse(data, fuseOptions);
});

// Menjalankan pencarian saat mengetik
$("#search-query").on("input", function () {
  var searchQuery = $(this).val().trim();
  if (searchQuery.length > 0) {
    executeSearch(searchQuery);
  } else {
    $('#search-results').html("<p>Please enter a word or phrase above</p>");
  }
});

function executeSearch(searchQuery) {
  if (!fuse) return; // Pastikan data sudah dimuat

  var result = fuse.search(searchQuery);
  searchResults = result;

  if (searchResults.length > 0) {
    currentPage = 1; // Reset ke halaman pertama saat pencarian baru dilakukan
    displayPage(currentPage);
  } else {
    $('#search-results').html("<p>No matches found</p>");
  }
}

function displayPage(page) {
  $('#search-results').empty();
  var start = (page - 1) * resultsPerPage;
  var end = start + resultsPerPage;
  var paginatedResults = searchResults.slice(start, end);

  $.each(paginatedResults, function (key, value) {
    var templateDefinition = $('#search-result-template').html();
    var output = render(templateDefinition, {
      key: key,
      title: value.item.title,
      link: value.item.permalink,
      tags: value.item.tags,
      categories: value.item.categories,
      image: value.item.image,
      snippet: value.item.contents.substring(0, summaryInclude * 2)
    });
    $('#search-results').append(output);
  });

  renderPagination();
}

function renderPagination() {
  var totalPages = Math.ceil(searchResults.length / resultsPerPage);
  var paginationHtml = '<div class="pagination">';

  if (currentPage > 1) {
    paginationHtml += `<button class="page-btn" data-page="${currentPage - 1}">Previous</button>`;
  }

  for (var i = 1; i <= totalPages; i++) {
    paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  if (currentPage < totalPages) {
    paginationHtml += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
  }

  paginationHtml += '</div>';
  $('#pagination-container').html(paginationHtml);

  $('.page-btn').click(function () {
    currentPage = parseInt($(this).attr('data-page'));
    displayPage(currentPage);
  });
}

function render(templateString, data) {
  var conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
  var copy = templateString;

  while ((matches = conditionalPattern.exec(templateString)) !== null) {
    if (data[matches[1]]) {
      copy = copy.replace(matches[0], matches[2]);
    } else {
      copy = copy.replace(matches[0], '');
    }
  }

  for (var key in data) {
    var find = '\\$\\{\\s*' + key + '\\s*\\}';
    var re = new RegExp(find, 'g');
    copy = copy.replace(re, data[key]);
  }

  return copy;
}
