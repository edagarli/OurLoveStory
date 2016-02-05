/**
 * Created by jhp-android on 16/2/5.
 */

// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, interval);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);

function getDaysInMonth(month) {
    var data = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return data[month];
}

function timeElapse(date, mode) {
    var current = new Date();
    var years = NaN;
    var months = NaN;
    var days = NaN;
    var hours = NaN;
    var minutes = NaN;
    var seconds = NaN;
    seconds = current.getSeconds() - date.getSeconds();
    if (seconds < 0) {
        seconds += 60;
        current.setMinutes(current.getMinutes() - 1);
    }
    minutes = current.getMinutes() - date.getMinutes();
    if (minutes < 0) {
        minutes += 60;
        current.setHours(current.getHours() - 1);
    }
    hours = current.getHours() - date.getHours();
    if (hours < 0) {
        hours += 24;
        current.setDate(current.getDate() - 1);
    }
    if (mode == 1) {
        days = current.getDate() - date.getDate();
        if (days < 0) {
            days += getDaysInMonth(current.getMonth());
            current.setDate(current.getDate() - 1);
        }
        months = current.getMonth() - date.getMonth();
        if (months < 0) {
            months += 12;
            current.setYear(current.getFullYear() - 1);
        }
        years = current.getFullYear() - date.getFullYear();
    } else {
        days = Math.floor((current.getTime() - date.getTime()) / (1000 * 3600 * 24));
    }

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = (years > 0 ? "<span class=\"digit\">" + years + "</span> year ":"")
    result += (months >= 0 ? "<span class=\"digit\">" + months + "</span> month ":"");
    result += "<span class=\"digit\">" + days + "</span> day ";
    result += "<span class=\"digit\">" + hours + "</span> hr "
    result += "<span class=\"digit\">" + minutes + "</span> min "
    result += "<span class=\"digit\">" + seconds + "</span> sec";

    $("#elapseClock").html(result);
}

function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
    $('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
}