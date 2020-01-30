$(document).ready(function () {
	window.caldayOBJ = new Date();

    $('input[type="radio"]').click(function() {
    	//console.log("asjkdbaskjldha")
        var inputValue = $(this).attr("value");
        var target = $("." + inputValue);
        $(".hideme").not(target).hide();
        $(target).show();
    });
    $('.calbutton').click(function() {
    	var mode = this.id.split("-")[1];
    	if (mode == "prev") {
    		window.caldayOBJ.setMonth(window.caldayOBJ.getMonth()-1);
    		popCalendar(window.caldayOBJ);
    	}
    	if (mode == "next") {
    		window.caldayOBJ.setMonth(window.caldayOBJ.getMonth()+1);
    		popCalendar(window.caldayOBJ);
    	}
    });
    $(".customRadio").click(function() {
    	var elems = document.getElementsByClassName("customRadio");
    	Array.prototype.forEach.call(elems, function (el) {
    		//console.log((el.checked?"checked":"what"));
    		if (el.checked) {
    			el.setAttribute("checked", "checked")
    		}
    		else {
    			el.removeAttribute("checked");
    		}
    	});
    });
    $("#makeReservation").click(function(){
    	//$("#modal-body").scrollTop(0);
    	$('#modal-body').animate({
        	scrollTop : 0
    	}, 'slow');
    });
    //https://stackoverflow.com/a/35008979
    $('.modal-body').scroll(function() {
  		var disable = $('#modal-list-group').height() != ($(this).scrollTop() + $(this).height());
  		$('#IUnderstand-btn').prop('disabled', disable);
	});

    var todayOBJ = new Date();
    //console.log(daysInMonth(todayOBJ.getMonth(), todayOBJ.getFullYear()));
    //var foo = new Date();
    //foo.setFullYear(foo.getFullYear() - 1);
    //popCalendar(foo);
    popCalendar(todayOBJ);
    
});

function openNav(elem) {
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

	var todayOBJ = new Date();
	var dayOfWeek = weekday[todayOBJ.getDay()];
	var curMonth = months[todayOBJ.getMonth()];
	//console.log((elem.id.split("-")[2]));
	var elemID = elem.id.split("-");
	var chosenDate = document.getElementById("chosenDate");
	chosenDate.innerHTML = (weekday[elemID[1]]+", "+months[elemID[2]]+" "+elemID[3]+", "+todayOBJ.getFullYear());
	chosenDate.setAttribute("class","chosenDate-"+elemID[1]+"-"+elemID[2]+"-"+elemID[3]+"-"+todayOBJ.getFullYear());
	document.getElementById("mySidenav").style.width = "25%";
	document.body.style.marginRight = "25%";
	//var list = document.getElementsByClassName("customRadio");
	//for (let element of list) {
	//	console.log(list);
  	//	element.setAttribute("checked", "");
	//}
	//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.body.style.marginRight= "0";
	document.body.style.backgroundColor = "white";
}
function addReservation() {
	// max reservations set to 10
	//the worst thing ever written (gets data attr from button thats active)
	var resTime = (Array.prototype.slice.call(document.getElementsByClassName("customRadio"))).map(function (x) {return x.checked?x.getAttribute("data"):null;}).filter(function (x) {return x != null;})[0];
	resTime = resTime.replace(/\s/g,'');
	var textnode = document.createTextNode((($("#chosenDate")[0].innerHTML)+" at "+resTime)); //unsecure
	var a = textnode.data.replace(/,/g, '').split(" ");
	a.splice(4,1);
	//the worst thing ever written (gets data attr from button thats active)
	var resList = (Array.prototype.slice.call(document.getElementsByClassName("cal-reservation-item"))).map(function (x) {x = x.id.split("-");x.shift();return x;});
	//only works if this is the only class in #chosenDate
	var chosenDate = $("#chosenDate").attr('class').split("-");
	chosenDate.shift();
	chosenDate.push(resTime);

	var dateConflict = resList.some(function (x) {
		return x.join("-") == chosenDate.join("-");
	});
	//check for date conflicts
	if (dateConflict) {
		alert("you already have a reservation at this!")
	}
	//max reservations = 10
	else if ($("#myReservationList").children().length > 10) {
		alert("you already have a reservation!");
	}
	else {
		var startElem = document.getElementById("myReservationList");

		var newRes = document.createElement("li");

		newRes.setAttribute("class", "bigtext cal-reservation-item list-group-item");

		newRes.setAttribute("id", "calResItem-"+chosenDate[0]+"-"+chosenDate[1]+"-"+chosenDate[2]+"-"+chosenDate[3]+"-"+chosenDate[4]);
		newRes.setAttribute("onclick", "editReservation(\'"+newRes.id+"\')");
		
		newRes.append(textnode);
		//newRes.onclick = editReservation;
		$("#myReservationList").append(newRes);
	}
}
function editReservation(id) {
	var elem = document.getElementById(id)
	$("#editReservationTitle").text("My Reservation on "+ elem.innerHTML);
	$("#editModalCenter").modal();
	$("#deleteReservation").attr("onclick", "removeReservation(\'"+id+"\')");

}
function removeReservation(id) {
	document.getElementById(id).remove();
	//$("#removeReservation")
}
function daysInMonth(m, y) {//m is 1-based, feb = 2
   return 31 - (--m ^ 1? m % 7 & 1:  y & 3? 3: y % 25? 2: y & 15? 3: 2);
}
function popCalendar(today) {
	//days ahead of today that you can reserve
	var resWindow = 60;
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	//set month title
	document.getElementById("monthOf").innerHTML = months[today.getMonth()]+" "+today.getFullYear();
	//remove old divs if we are repopulating
	for (var i = 0; i < 5; i++) {
		var node = document.getElementById("week"+i);
		if (node != null) {
			node.remove();
		}
		//console.log((node!=null)? ("deleting cal week "+(i+1)):("creating cal week "+(i+1)) );
	}
	var monthFirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	var dayOBJ = new Date(today.getFullYear(), today.getMonth());
	//curr date
	var todayOBJ = new Date();
	var tomorrowOBJ = new Date();
	tomorrowOBJ.setDate(tomorrowOBJ.getDate()+1);
	dayOBJ.setDate(monthFirstDay.getDate()-monthFirstDay.getDay());

	var calPopStartElem = document.getElementById("populateAbove");
	//populate cal
	for (var i = 1; i <= 5; i++) {
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "row week");
		newDiv.setAttribute("id", "week"+(i-1));
		calPopStartElem.parentNode.insertBefore(newDiv,calPopStartElem);

		for (var j = 1; j <= 7; j++) {
			//console.log(dayOBJ.getDate());

			var node = document.createElement("div");

			var nodeinner = document.createElement("div");

			var nodewrapper = document.createElement("div");

			var nodecontent = document.createElement("div");

			node.setAttribute("id", ("cal-"+[j-1]+"-"+dayOBJ.getMonth()+"-"+dayOBJ.getDate()+"-"+dayOBJ.getFullYear()));
			//console.log(weekday[j-1]+"-"+months[dayOBJ.getMonth()]+"-"+dayOBJ.getDate());
			//if (dayOBJ.getMonth()==todayOBJ.getMonth()) {
			var timeDif = Math.abs(dayOBJ.getTime() - todayOBJ.getTime());
			var fullDayDif = Math.floor(timeDif/86400000);
			//console.log("fulldaydif",fullDayDif);
			//console.log("date",dayOBJ.getDate() - todayOBJ.getDate());
			//var monthDif = ((dayOBJ.getMonth() - todayOBJ.getMonth()+1)+Math.abs((dayOBJ.getMonth() - todayOBJ.getMonth()+1)))/2;
			//console.log("monthDif",monthDif);
			//console.log(weekday[dayOBJ.getDay()],months[dayOBJ.getMonth()],dayOBJ.getDate()); 

			//if (monthDif && () && (fullDayDif < resWindow)) {
			if ((tomorrowOBJ.toJSON().slice(0, 10) <= dayOBJ.toJSON().slice(0, 10)) && fullDayDif < resWindow) {
				node.setAttribute("class", "col circle");
				node.setAttribute("onclick", "openNav(this)");
				nodeinner.setAttribute("class", "circle__inner");
				nodewrapper.setAttribute("class", "circle__wrapper");
				nodecontent.setAttribute("class", "circle__content");
			
			} 
			else {
				node.setAttribute("class", "col circle disabled");
				nodeinner.setAttribute("class", "circle__inner disabled");
				nodewrapper.setAttribute("class", "circle__wrapper disabled");
				nodecontent.setAttribute("class", "circle__content disabled");
			}
			var textnode = document.createTextNode(dayOBJ.getDate());

			nodecontent.appendChild(textnode);
			nodewrapper.appendChild(nodecontent);
			nodeinner.appendChild(nodewrapper);

			node.appendChild(nodeinner);
			newDiv.appendChild(node);

			dayOBJ.setDate(dayOBJ.getDate()+1);
		}
	};	
}