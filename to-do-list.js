$(document).ready(function () {
  var $addBtn = $(".addBtn");
  var $nameInput = $("#nameInput");
  var $descrInput = $("#descrInput");
  var $myHistory = $(".myHistory");

  //create new item and add it to ul
  function createItem() {
    //add item into List
    $newItem = $("<li>");
    $newItem.text($nameInput.val());

    //add delete Button
    $newItem.append(
      "<button class= 'dBtn'>X</button><button class='detailBtn'>Detail</button>"
    );

    $(".myList").append($newItem);

    var currentTime = getTime();

    //store data
    $newItem.data("title", $nameInput.val());
    $newItem.data("addDate", currentTime);
    $newItem.data("description", $descrInput.val());
    //Save to history panel
    $myHistory.prepend(
      "<li><span class='addTask'>ADD TASK</span>" +
        $nameInput.val() +
        "<div class='date'>" +
        currentTime +
        "</div></li>"
    );
    //reset
    $nameInput.val("");
    $descrInput.val("");
  }

  //show error message when input value is blank
  function addItem() {
    if ($nameInput.val() == "" || $descrInput.val() == "") {
      $(".error-message").text("Please write somthing!");
    } else {
      $(".error-message").text("");
      createItem();
    }
  }
  //  delete btn event
  $(".myList").on("click", ".dBtn", function () {
    text = $(this).parent().text();
    $myHistory.prepend(
      "<li><span class='dTask'>DELETE</span>" +
        text.slice(0, -7) +
        "<div class='date'>" +
        getTime() +
        "</div></li>"
    );

    $(this).parent().hide();
  });

  // detail btm event
  $(".myList").on("click", ".detailBtn", function () {
    $(".infoTitle").text($(this).parent().data("title"));
    $(".infoDate").text($(this).parent().data("addDate"));
    $(".infoDescr").text($(this).parent().data("description"));
  });

  // add Item when btn clicked
  $addBtn.click(function () {
    addItem();
  });

  // add Item when enter key pressed
  $nameInput.keypress(function (e) {
    if (e.which == "13") {
      addItem();
    }
  });

  $descrInput.keypress(function (e) {
    if (e.which == "13") {
      addItem();
    }
  });

  // mark done when click
  $(".myList").on("click", "li", function (e) {
    if ($(e.target).hasClass("detailBtn")) {
      e.preventDefault();
      return;
    }

    if ($(this).hasClass("done")) {
      $(this).removeClass("done");
    } else {
      $(this).addClass("done");
      console.log($(this).data());
    }
  });

  // clear all item in List
  $(".clearList").click(function () {
    $(".myList li").remove();
  });

  //? create history panel

  function getTime() {
    time = new Date();
    return (
      time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
    );
  }

  //clear History
  $(".clearHistory").click(function () {
    $(".myHistory li").remove();
  });

  //? create Detail panel
});
