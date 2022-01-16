$('.arrow').on("tap click", function () {
    var x = $(this).parents('.widget').children('.widget__body').children('div').map(function() {return this.id}).toArray();
    var total = x.length;
    var arwTitle = $(this).attr("title");
    $.each(x, function(index, value) {
        
        var e_id = "#" + value;
        if ($(e_id).css('display') != 'none') {
            $(e_id).data("paged", true);
        };
        $(e_id).hide();
    });
    $.each(x, function(index, value) {
        var e_id = "#" + value;
        if ($(e_id).data("paged")) {
            var letter = value.charAt(0);
            if (arwTitle == 'Next') {
                if (parseInt(value.charAt(1)) === total) {
                    num = value.charAt(1);
                } else {
                var num = parseInt(value.charAt(1)) + 1
                };
            } else if (arwTitle == 'Previous') {
                if (parseInt(value.charAt(1)) === 1) {
                    num = value.charAt(1);
                } else {
                var num = parseInt(value.charAt(1)) - 1};
                };
            var on = "#" + letter + num;
            $(on).show();
        $(e_id).data("paged", false);    
        };
    }); 
});