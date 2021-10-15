$(function () {
  Duck = new Ducky2Arduino();
  var consoleError = console.error;
  console.error = function () {
    var message = [].join.call(arguments, " ");
    $("#console").text(message);
    consoleError.apply(console, arguments);
  };
  var consoleLog = console.log;
  console.log = function () {
    var message = [].join.call(arguments, " ");
    $("#console").text(message);
    consoleLog.apply(console, arguments);
  };
  var editor = CodeMirror.fromTextArea(document.getElementById("arduiCode"), {
    lineNumbers: true,
    mode: "text/x-c++src",
    theme: "monokai"
  });
  var editor2 = CodeMirror.fromTextArea(document.getElementById("duckyScript"), {
    lineNumbers: true,
    mode: "text/vbscript",
    theme: "monokai"
  });
  $("#compileThis").click(function () {
    console.clear();
    $('#console').html('&nbsp;');
    editor.getDoc().setValue(Duck.compile(editor2.getValue()));
  });
  $("#download").click(function () {
    var payloadName = $("#payloadName").val();
    var payloadValue = editor.getValue();
    if (payloadValue == undefined || payloadName == undefined || payloadValue == '' || payloadName == '' || payloadValue == 'Error! Please Look At The Console.....') {
      alert('[!]Payload Name Or Code Is Empty!!!');
      return;
    }
    $("<a />", {
      download: payloadName + ".ino",
      href: URL.createObjectURL(
        new Blob([payloadValue], {
          type: "text/plain"
        }))
    })
      .appendTo("body")[0].click();
    $(window).one("focus", function () {
      $("a").last().remove()
    })
  });
});