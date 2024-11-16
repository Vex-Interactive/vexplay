var challengeMode = prompt("Enter Challenge Mode (0/def = No Challenge, 1 = True Neverclick, 2 = No Golden Cookies, 3 = No Legacy)", "0")
var versionDisp = document.getElementById("versionNumber")
if (challengeMode != null && challengeMode != 0) {
	if (versionDisp != null) {
		versionDisp.style.bottom = "22px"
		versionDisp.outerHTML = versionDisp.outerHTML + '<div id="versionNumber" class="title challengeMode" style="color:#f00">???</div>'
	}
	var gameVersion = ""
	if (versionDisp == null) gameVersion = 1
	else if (versionDisp.innerHTML.slice(0,3) == "v.1") {
		if (versionDisp.innerHTML.slice(8,9) == "" || versionDisp.innerHTML.slice(8,10) == " <") gameVersion = versionDisp.innerHTML.slice(2,8)-0
		else if (versionDisp.innerHTML.slice(7,8) == "" || versionDisp.innerHTML.slice(7,9) == " <") gameVersion = versionDisp.innerHTML.slice(2,7)-0
		else if (versionDisp.innerHTML.slice(6,7) == "" || versionDisp.innerHTML.slice(6,8) == " <") gameVersion = versionDisp.innerHTML.slice(2,6)-0
		else if (versionDisp.innerHTML.slice(5,6) == "" || versionDisp.innerHTML.slice(5,7) == " <") gameVersion = versionDisp.innerHTML.slice(2,5)-0
	}
	else if (versionDisp.innerHTML.slice(8,9) == "<" || versionDisp.innerHTML.slice(8,9) == "") gameVersion = versionDisp.innerHTML.slice(3,8)-0
	else if (versionDisp.innerHTML.slice(7,8) == "<" || versionDisp.innerHTML.slice(7,8) == "") gameVersion = versionDisp.innerHTML.slice(3,7)-0
	else if (versionDisp.innerHTML.slice(9,10) == "<" || versionDisp.innerHTML.slice(9,10) == "") gameVersion = versionDisp.innerHTML.slice(3,9)-0
	if (challengeMode == 1) {
		document.getElementById("bigCookie").outerHTML = null
		if (versionDisp != null) document.getElementsByClassName("challengeMode")[0].innerHTML = "True Neverclick"
	}
	else if (challengeMode == 2) {
		if (gameVersion > 1.9) Game.shimmer = function(){Game.Notify("No Golden Cookies!","A golden cookie just tried to spawn, but this challenge prevented it."+'</a>',[10,14])}
		else Game.goldenCookie.spawn = function(){Game.Notify("No Golden Cookies!","A golden cookie just tried to spawn, but this challenge prevented it."+'</a>',[10,14])}
		if (versionDisp != null) document.getElementsByClassName("challengeMode")[0].innerHTML = "No Golden Cookies"
	}
	else if (challengeMode == 3) {
		if (gameVersion > 2.031) {
			Game.Ascend = function(){Game.Notify("No Legacy!","This button is disabled for this challenge."+'</a>',[21,6])}
			document.getElementById("legacyButton").getElementsByClassName("subButton")[0].innerHTML = "No Legacy"
		}
		else if (gameVersion >= 1.9) {
			Game.Ascend = function(){Game.Notify("No Legacy!","This button is disabled for this challenge."+'</a>',[21,6])}
			document.getElementById("legacyButton").innerHTML = "No " + document.getElementById("legacyButton").innerHTML
		}
		else if (gameVersion >= 1.0501) {
			Game.ShowLegacy = function(){Game.Notify("No Legacy!","This button is disabled for this challenge."+'</a>',[3,5])}
			Game.Ascend = function(){Game.Notify("No Legacy!","This button is disabled for this challenge."+'</a>',[3,5])}
			document.getElementById("legacyButton").innerHTML = "No " + document.getElementById("legacyButton").innerHTML
		}
		else Game.Reset = function(){Game.Popup('No Legacy! This button is disabled for this challenge.')}
		if (versionDisp != null) document.getElementsByClassName("challengeMode")[0].innerHTML = "No Legacy"
	}
}