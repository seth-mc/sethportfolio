/* hide windows on load */
$(document).ready(function () {
  $(".widget").each(function () {
    $(this).position({
      of: $(window)
    });
  });
  $(".widget").hide().animate({ opacity: 0 }, "fast");
  $(".dialogbox").hide().animate({ opacity: 0 }, "fast");
  if (os.isWin) {
    $(".page").css("line-height", "2.0");
  };  
});

/* windows function */
var os = (function() {
  var ua = navigator.userAgent.toLowerCase();
  return {
      isWin: /windows/.test(ua),
      isMac: /mac/.test(ua)
  };
}());

/* contact box */
$("#contact").on("tap click", function () {
  $("#contact").css("color", "#0837b3");
  $(".dialogbox").show().animate({ opacity: 1 }, "fast");
});

/* **TEMP** shop coming soon */
$("#shop").on("tap click", function () {
  $(".comingsoon").show().animate({ opacity: 1 }, "fast");
});

/* shopping cart */
$(".carticon").on("tap click", function () {
  $(".cart").show().animate({ opacity: 1 }, "fast");
});

$("#crypgif").on({
  "mouseenter tap click": function () {
    var src = $(this).attr("src");
    $(this).attr("src", src.replace(/\.jpg$/i, ".gif"));
  },
  "mouseleave": function () {
    var src = $(this).attr("src");
    $(this).attr("src", src.replace(/\.gif$/i, ".jpg"));
  }
});

/* keyboard shortcuts for contact dropdown */
$(document).keydown(function (event) {
  if (event.which == "17")
    $(document).keydown(function (event) {
      if (event.which == "76") {
        window.open("https://ca.linkedin.com/in/seth-mcclimans", "_blank");
      } else if (event.which == "84") {
        window.open("https://twitter.com/seth_mcc", "_blank");
      } else if (event.which == "71") {
        window.open("https://github.com/seth-mc", "_blank");
      } else if (event.which == "69") {
        window.open("mailto:seth@mcclimans.ca", "_blank");
      }
    });
});

/* 'deselect' folder/icon/contact when document is clicked anywhere */
$(document).on("tap click", function (event) {
  if (!$(event.target).closest(".widgets").length) {
    $(".widgets > li > p").removeAttr("id");
  }
  if (
    !$(event.target).closest("#contact").length &&
    !$(event.target).closest(".dialogbox").length
  ) {
    $("#contact").css("color", "black");
    $(".dialogbox").hide().animate({ opacity: 0 }, "fast");
  }
  if (!$(event.target).closest(".carticon").length) {
    $(".cart").hide().animate({ opacity: 0 }, "fast");
  }
  if (!$(event.target).closest("#shop").length) {
    $(".comingsoon").hide().animate({ opacity: 0 }, "fast");
  }
  if (!$(event.target).closest(".lifeicons").length) {
    $(".lifeicons > p").removeAttr("id");
  }
  if (
    !$(event.target).closest("#playermenu").length &&
    !$(event.target).closest("#mySidenav").length
  ) {
    $("#mySidenav").css("width", 0);
    $("#playermenu").css("right", 0);
  }
});

/* widget functions: */
$(function () {
  $(".widget").draggable({ containment: "window" });
  /* move windows up/down on click */
  $(".widget").on("touchstart mousedown", function () {
    var target = $(this).text();
    $(".widget").each(function () {
      if ($(this).text() == target) {
        $(this).css("z-index", 3);
        $(this).data("clicked", true);
      } else if ($(this).data("clicked")) {
        $(this).data("clicked", false);
        $(this).css("z-index", 2);
      } else {
        $(this).css("z-index", 1);
      }
    });
  });

  /* make trash button work */
  $(".widget").on("tap click", ".fa-trash", function () {
    $(this)
      .parents(".widget")
      .animate({ opacity: 0 }, "fast", function () {
        $(this).hide();
      });
  });

  /* send to SC */
  $(".player-title").on("tap click", function () {
    url = $(this).attr("href");
    window.open(url, "_blank");
  });
  
  $("#numbergan").on("tap click", function () {
    url = $(this).attr("href");
    window.open(url, "_blank");
  });

  $(".book").on("tap click", function () {
    url = $(this).attr("href");
    window.open(url, "_blank");
  });

  /* select folder name when mouse is pressed down  */
  $(".widgets").on("mousedown touchstart", "li", function () {
    $(".widgets > li > p").attr("id", "n");
    $(this).find("p").attr("id", "sel");
  });

  /* select icon name when mouse is pressed down  */
  $(".lifeicons").on("mousedown touchstart", function () {
    $(".lifeicons > p").attr("id", "n");
    $(this).find("p").attr("id", "sel");
  });

  /* open widget  */
  $(".widgets").on("tap click", "li", function () {
    var target = $(this)
      .text()
      .replace(/(\r\n|\n|\r|\s)/gm, "");

    $(".widget__header__title").each(function () {
      if ($(this).text() == target) {
        $(this).parents(".widget").show().animate({ opacity: 1 }, "fast");
        /* set index also when the folder is clicked */
        var target2 = $(this).parents(".widget").text();
        $(".widget").each(function () {
          if ($(this).text() == target2) {
            $(this).css("z-index", 3);
            $(this).data("clicked", true);
          } else if ($(this).data("clicked")) {
            $(this).data("clicked", false);
            $(this).css("z-index", 2);
          } else {
            $(this).css("z-index", 1);
          }
        });
      }
    });
  });
});

$(document).ready(function () {
  var player = SC.Widget($("iframe.sc-widget")[0]);
  var pOffset = $(".waveform").offset();
  var pWidth = 200;
  var scrub;
  var playPause = document.querySelector(".player-button");

  player.pause()

  let playing = false;
  player.bind(SC.Widget.Events.READY, function () {
    setInfo();
    // player.play();
  }); //Set info on load

  player.bind(SC.Widget.Events.FINISH, function () {
    setInfo();
  }); //set info when song ends

  playPause.addEventListener("click", () => {
    player.toggle();
    playing = !playing;
    if (playing) {
      playPause.dataset.playing = "true";
      $(".player-button").html("PAUSE");
    } else
      (playPause.dataset.playing = "false"), $(".player-button").html("PLAY");
  });

  player.bind(SC.Widget.Events.PLAY_PROGRESS, function (e) {
    if (e.relativePosition <= 0.0) {
      setInfo();
    }
    //Event listener when track is playing
    $(".position").css("left", e.relativePosition * 100 + "%");
  });

  $(".waveform").click(function (e) {
    //Get position of mouse for scrubbing
    scrub = e.pageX - pOffset.left;
  });

  const waveform = document.querySelector(".waveform");
  waveform.onmousemove = function (e) {
    var t =
      ((e.pageX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth) *
      pWidth;
    $(".scrub-position").css("left", t);
  };
  

  $(document).ready(function () {
    //Use the position to seek when clicked
    $(".position").css("left", scrub + "px");
    var seek = player.duration * (scrub / pWidth);
    player.seekTo(seek);
  });

  // Function to change ms to XX:XX:XX
  var timecode = function (ms) {
    var hms = (function (ms) {
        return {
          h: Math.floor(ms / (60 * 60 * 1000)),
          m: Math.floor((ms / 60000) % 60),
          s: Math.floor((ms / 1000) % 60)
        };
      })(ms),
      tc = []; // Timecode array to be joined with ':'

    if (hms.h > 0) {
      tc.push(hms.h);
    }

    tc.push(hms.m < 10 && hms.h > 0 ? "0" + hms.m : hms.m);
    tc.push(hms.s < 10 ? "0" + hms.s : hms.s);

    return tc.join(":");
  };

  function setInfo() {
    player.getCurrentSound(function (song) {
      // Get the waveform image
      var waveformPng = song.waveform_url
        .replace("json", "png")
        .replace("wis", "w1");

      $(".waveform").css("background-image", "url('" + waveformPng + "')");

      // Set the track name
      var info = song.title;
      $(".player-title").html(info);

      // Set total duration
      var duration = timecode(song.duration);
      $(".duration").html(duration);

      // Set current time stamp
      player.bind(SC.Widget.Events.PLAY_PROGRESS, function (e) {
        var percent = e.relativePosition;
        var current = timecode(song.duration * percent);
        $(".current").html(current);
      });

      player.current = song;
    });

    player.getDuration(function (value) {
      player.duration = value;
    });

    player.isPaused(function isPaused(p) {
      if (p == true) {
          player.play();
      } else {
          player.seekTo(miliseconds);
      }
  });
  }
  setTimeout({}, 500);
  player.pause()
});

function openNav() {
  if ($("#mySidenav").data("opened") == null) {
    $("#mySidenav").css("width", "200px");
    $("#playermenu").css("right", "200px");
    $("#mySidenav").data("opened", true);
  } else if ($("#mySidenav").data("opened") == true) {
    $("#mySidenav").css("width", 0);
    $("#playermenu").css("right", 0);
    $("#mySidenav").data("opened", null);
  }
}
