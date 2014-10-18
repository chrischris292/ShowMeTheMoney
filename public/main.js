// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
}

// Returns the current time in "HH:MM XM" format
function theTime() {
  var newDate = new Date();
  var hh_mm = newDate.timeNow();
  if (newDate.getHours() >= 12) {
    hh_mm += " PM";
    if (newDate.getHours() > 12) {
      hh_mm = hh_mm.slice(2, hh_mm.length);
      hh_mm = (newDate.getHours() - 12) + hh_mm;
    }
  }
  else {
    hh_mm += " AM";
  }
  return hh_mm;
}

$('#time').text(theTime());