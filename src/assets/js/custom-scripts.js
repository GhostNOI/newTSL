



(function ($) {
    "use strict";
    var mainApp = {

        initFunction: function () {
            /*MENU 
            ------------------------------------*/
            $('#main-menu').metisMenu();
			
            $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });
        },

        initialization: function () {
            mainApp.initFunction();
        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.initFunction(); 
		$("#sideNav").click(function(){
			if($(this).hasClass('closed')){
				$('.navbar-side').animate({left: '0px'});
				$(this).removeClass('closed');
				$('#page-wrapper').animate({'margin-left' : '200px'});
				
			}
			else{
			    $(this).addClass('closed');
				$('.navbar-side').animate({left: '-200px'});
				$('#page-wrapper').animate({'margin-left' : '0px'}); 
			}
		});
        var show = document.getElementById("clock");
            setInterval(function () {
                var time = new Date();
                var hour = time.getHours();
                var min = time.getMinutes();
                var sec = time.getSeconds();
                if(hour<10) hour = "0" + hour;
                if(min<10) min = "0" + min;
                if(sec<10) sec = "0" + sec;
                var t = hour + " : " + min + " : " + sec;
                show.innerHTML = t;
            }, 1000);
    });

}(jQuery));
