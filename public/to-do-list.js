$(document).ready(function () {
  //Adding task by users input
  $(".addBtn").click(function () {
    if ($("#nameInput").val() == "" || $("#descrInput").val() == "") {
      $(".error-message").text("Please write somthing!");
    } else {
      $(".error-message").text("");
      time = new Date();
      date =
        time.getFullYear() +
        "-" +
        ("0" + (time.getMonth() + 1)).slice(-2) +
        "-" +
        time.getDate();

      //post to database
      $.ajax({
        url: "/addtask",
        method: "POST",
        data: {
          title: $("#nameInput").val(),
          description: $("#descrInput").val(),
          date: date,
          status: "unfinished",
        },
        dataType: "json",
        success: function (res) {
          //display task in task panel

          $(".myList").append(
            "<li id='task" +
              res.id +
              "' class='unfinished' ><span>" +
              $("#nameInput").val() +
              "</span><button class= 'dBtn'>X</button><button class='detailBtn'>Detail</button></li>"
          );

          //display activity in history panel
          $(".myHistory").prepend(
            "<li><span class='addTask'>ADD TASK</span> " +
              $("#nameInput").val() +
              "<div class='date'>" +
              date +
              "</div></li>"
          );
          //reset input
          $("#nameInput").val("");
          $("#descrInput").val("");
        },
      });
    }
  });

  // task deleting btn
  $(".myList").on("click", ".dBtn", function () {
    time = new Date();
    date =
      time.getFullYear() +
      "-" +
      ("0" + (time.getMonth() + 1)).slice(-2) +
      "-" +
      time.getDate();
    taskTitle = $(this).parent().children("span").text();

    taskId = $(this).parent().attr("id").slice(4);

    $(this).parent().remove();
    $.ajax({
      url: "/deltask/" + taskId,
      method: "POST",
      data: { title: taskTitle, date: date },
      dataType: "json",
      success: function (res) {
        $(".myHistory").prepend(
          "<li><span class='dTask'>DELETE</span> " +
            taskTitle +
            "<div class='date'>" +
            date +
            "</div></li>"
        );
      },
    });
  });

  // clear all tasks
  $(".clearList").click(function () {
    if (
      confirm(
        "this action cannnot be undone. Are you sure you want delete all tasks?"
      )
    ) {
      $(".myList").empty();
      $.ajax({
        url: "/cleartasks",
        method: "POST",
        data: {},
        success: function (res) {},
      });
    }
  });
  // clear history
  $(".clearHistory").click(function () {
    if (
      confirm(
        "this action cannnot be undone. Are you sure you want delete all history?"
      )
    ) {
      $(".myHistory").empty();
      $.ajax({
        url: "/clearhistory",
        method: "POST",
        data: {},
        success: function (res) {},
      });
    }
  });
  //mark done
  $(".myList").on("click", "li", function (e) {
    //prevent detailBtn from execution
    if ($(e.target).hasClass("detailBtn")) {
      e.preventDefault();
      return;
    }
    //mark
    var status = "unfinished";
    if ($(this).hasClass("finished")) {
      $(this).removeClass("finished");
    } else {
      $(this).addClass("finished");
      status = "finished";
    }
    //update status to database
    taskId = $(this).attr("id").slice(4);
    $.ajax({
      url: "/updatestatus/" + taskId,
      method: "POST",
      data: { status: status },
      success: function (res) {},
    });
  });

  //task info dashboard
  $(".myList").on("click", ".detailBtn", function () {
    taskId = $(this).parent().attr("id").slice(4);
    console.log("1");
    $.ajax({
      url: "/retrive/" + taskId,
      method: "GET",
      success: function (res) {
        $(".infoTitle").text(res.title);
        $(".infoDate").text(res.date);
        $(".infoDescr").text(res.description);
      },
    });
  });
});
