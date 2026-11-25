var items = JSON.parse(localStorage.getItem("tracker")) || [];
var filter = "all";

// status: done, overdue ya pending
function status(i) {
  if (i.done) return "done";
  return new Date(i.due) < new Date() ? "overdue" : "pending";
}

function show() {
  var html = "", pending = 0, late = 0, done = 0;

  items.forEach(function (i) {
    var s = status(i);
    if (s == "done") done++;
    if (s == "overdue") late++;
    if (s == "pending") pending++;

    // filter ke hisaab se dikhao
    if (filter == "all" || filter == s || filter == i.type ||
        (filter == "pending" && s != "done")) {
      html += '<div class="item ' + i.type + (i.done ? " done" : "") + '">' +
        '<input type="checkbox" ' + (i.done ? "checked" : "") +
        ' onchange="toggle(' + i.id + ')">' +
        '<div class="body"><div class="t">' + i.title + '</div>' +
        '<div class="m">' + i.subject + ' | Due: ' + i.due.replace("T", " ") + '</div>' +
        '<span class="' + (s == "overdue" ? "bad" : s == "done" ? "ok" : "warn") + '">' + s + '</span></div>' +
        '<button class="del" onclick="removeItem(' + i.id + ')">✕</button></div>';
    }
  });

  list.innerHTML = html || "<p>Koi assignment nahi hai</p>";
  sTotal.innerHTML = items.length;
  sPend.innerHTML = pending + late;
  sLate.innerHTML = late;
  sDone.innerHTML = done;
  localStorage.setItem("tracker", JSON.stringify(items));   // save
}

// tick lagao ya hatao
function toggle(id) {
  items.forEach(function (i) { if (i.id == id) i.done = !i.done; });
  show();
}

// delete
function removeItem(id) {
  items = items.filter(function (i) { return i.id != id; });
  show();
}

// naya assignment add
f.addEventListener("submit", function (e) {
  e.preventDefault();
  items.push({ id: Date.now(), title: title.value, subject: subject.value,
               type: type.value, due: due.value, done: false });
  f.reset();
  show();
});

// filter tabs
tabs.addEventListener("click", function (e) {
  if (e.target.tagName != "BUTTON") return;
  filter = e.target.dataset.f;
  document.querySelectorAll("#tabs button").forEach(function (b) {
    b.classList.remove("on");
  });
  e.target.classList.add("on");
  show();
});

theme.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("theme") == "dark") {
  document.body.classList.add("dark");
}

show();
