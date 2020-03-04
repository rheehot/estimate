// 장바구니 자료구조
let bucket = {
	"date":"",
	"author":"",
	"person":"",
	"email":"",
	"project":"",
	"comment":"",
	"startdate":"",
	"enddate":"",
	"items":[],
	"frames":[],
	"total":0,
	"unit":"",
};

// 장바구니에 들어가는 아이템 자료구조
const item = {
	"id":"", // date로 설정할것. 나중에 삭제할 키로 사용하기
	"basicCost" : 200000.0, // KRW model, 기본가격
	"totalShotNum" : 0, // 총 샷수
	"objectTrackingRigidCost" : 250000.0, // KRW model
	"objectTrackingRigid" : 0,
	"objectTrackingNoneRigidCost" : 350000.0, // KRW model
	"objectTrackingNoneRigid" : 0,
	"rotoanimationBasicCost" : 500000.0, // KRW model
	"rotoanimationBasic" : 0,
	"rotoanimationSoftDeformCost" : 700000.0, // KRW model
	"rotoanimationSoftDeform" : 0,
	"layoutCost" : 150000.0, // KRW model
	"layout" : 0,
	"frametotal" : 0,
	"framenum" : 0,
	"attributes" : [],
	"total": 0,
	"unit":"",
};

// 아이템에 종속되는 어트리뷰트 자료구조
const attributeStruct = {
	"id":"",
	"value":1.0,
};

//init Write infomation
document.getElementById("date").innerHTML = today();
document.getElementById("startdate").value = todayRFC3339();
document.getElementById("enddate").value = todayRFC3339();


	
	
// Callback
document.getElementById('addBucket').addEventListener('click', addBucket);

function numberWithCommas(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 오늘 날짜를 문자열로 출력한다.
function today() {
	let date = new Date();
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	return `Pre-Estimate System, Date: ${y}. ${m}. ${d}`;
}

// pad 함수는 숫자를 받아서 필요한 자리수만큼 "0"을 붙힌다.
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// 오늘 날짜를 문자열로 출력한다.
function todayRFC3339() {
	let date = new Date();
	let y = date.getFullYear();
	let m = pad(date.getMonth() + 1,2);
	let d = pad(date.getDate(),2);
	return `${y}-${m}-${d}`;
}

function removeItem(e) {
	id = e.target.parentElement.getAttribute("id");
	for (i = 0; i < bucket.items.length; i++) {
		if ( bucket.items[i].id == id ) {
			// console.log(id);
			bucket.items.splice(i,1);
		}
	}
	bucketRender()
}

// 장바구니를 렌더링한다.
function bucketRender() {
	bucket.total = 0;
	bucket.unit = "￦";
	document.getElementById("bucket").innerHTML = "";
	//attribute 가격
	for (let i = 0; i < bucket.items.length; i++) {
		let div = document.createElement("div");
		div.setAttribute("id", bucket.items[i].id);
		div.innerHTML += `${bucket.items[i].totalShotNum} Shot,`;
		div.innerHTML += ` ${bucket.items[i].attributes.length} Attrs`;
		titles = [];
		for (let j = 0; j < bucket.items[i].attributes.length; j++) {
			titles.push(bucket.items[i].attributes[j].id);
		}
		div.setAttribute("title", titles.join(","));
		div.innerHTML += bucket.unit + numberWithCommas(Math.round(bucket.items[i].total)) + "<br>";
		//frame 가격
		div.innerHTML += ` ${bucket.items[i].framenum} frame` + "<br>";
		div.innerHTML += bucket.unit + numberWithCommas(Math.round(bucket.items[i].frametotal)) + "<br>";
		//아이템 전체 가격
		itemtotal = bucket.items[i].total + bucket.items[i].frametotal;
		div.innerHTML += `total:` + numberWithCommas(itemtotal);
		div.innerHTML += ` <i class="far fa-times-circle btn-outline-danger"></i>`;
		div.innerHTML += ` <hr>`;
		div.onclick = removeItem;
		document.getElementById("bucket").appendChild(div);
		bucket.total += bucket.items[i].total;
		bucket.total += bucket.items[i].frametotal;
	}
	// 장바구니 아이템 개수와 장바구니 전체 가격
	document.getElementById("numOfItem").innerHTML = "Bucket: " + bucket.items.length;
	document.getElementById("total").innerHTML = "Total: " + bucket.unit + numberWithCommas(Math.round(bucket.total));
}

// 매치무브 샷 조건을 장바구니에 넣는다.
function addBucket() {
	if (document.getElementById("author").value == "") {
		alert("회사명 또는 작성자 이름을 입력해주세요.");
		return
	}
	if (document.getElementById("person").value == "") {
		alert("담당자의 이름을 입력해주세요.\nPlease enter name of the person in charge.");
		return
	}
	if (document.getElementById("email").value == "") {
		alert("E-mail을 입력해주세요.");
		return
	}
	if (document.getElementById("project").value == "") {
		alert("프로젝트의 간략한 특징을 설명해주세요.");
		return
	}

	if (!document.getElementById("privacy").checked) {
		alert("개인정보 수집 동의항목을 체크해주세요.");
		return
	}
	if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(document.getElementById("email").value)) {
		alert("이메일 형식이 아닙니다.");
		return
	}
	
	let shot = Object.create(item);
	let attrs = document.getElementsByTagName("input");
	let currentDate = new Date();
	shot.id = currentDate.getTime();
	shot.unit = "￦";
	shot.attributes = []; // 기존의 Attrbute를 초기화 한다.

	for (let i = 0; i < attrs.length; i++) {
		type = attrs[i].getAttribute("type")
		if (!(type == "radio" || type=="checkbox")){
			continue;
		};
		if (attrs[i].checked) {
			if (attrs[i].id === "privacy") {
				continue
			}
			attr = Object.create(attributeStruct);
			attr.id = attrs[i].id;
			attr.value = attrs[i].value;
			shot.attributes.push(attr)
		};
	}
	shot.totalShotNum = document.getElementById("totalShotNum").value;
	shot.objectTrackingRigid = document.getElementById("objectTrackingRigid").value;
	shot.objectTrackingNoneRigid = document.getElementById("objectTrackingNoneRigid").value;
	shot.rotoanimationBasic = document.getElementById("rotoanimationBasic").value;
	shot.rotoanimationSoftDeform = document.getElementById("rotoanimationSoftDeform").value;
	shot.layout = document.getElementById("layout").value;
	// 비용산출
	shot.total += shot.basicCost * shot.totalShotNum;
	shot.total += shot.objectTrackingRigidCost * shot.objectTrackingRigid;
	shot.total += shot.objectTrackingNoneRigidCost * shot.objectTrackingNoneRigid;
	shot.total += shot.rotoanimationBasicCost * shot.rotoanimationBasic;
	shot.total += shot.rotoanimationSoftDeformCost * shot.rotoanimationSoftDeform;
	shot.total += shot.layoutCost * shot.layout;
	// 적용된 속성을 곱한다.
	for (let n = 0; n < shot.attributes.length; n++) {
		shot.total *= shot.attributes[n].value;
	}
	//마지막으로 프레임 개수를 구하고, 전체 가격에 프레임 가격을 더한다. 
	shot.framenum = bucket.frames.length;
	for(let i in bucket.frames){
		shot.frametotal += frameNum2Cost(bucket.frames[i]);
	}

	bucket.items.push(shot);

	// 데이터전송
	if (document.getElementById("privacy").checked) {
		shot.date = today();
		shot.author = document.getElementById("author").value;
		shot.person = document.getElementById("person").value;
		shot.email = document.getElementById("email").value;
		shot.project = document.getElementById("project").value;
		shot.startdate = document.getElementById("startdate").value;
		shot.enddate = document.getElementById("enddate").value;
		shot.comment = document.getElementById("comment").value;
		shot.unit = "￦";
		$.ajax({
			url: "https://5c9y2kwd9k.execute-api.ap-northeast-2.amazonaws.com/estimate_bucket",
			type: 'POST',
			data: JSON.stringify(shot),
			dataType: 'json',
			crossDomain: true,
			contentType: 'application/json',
			success: function(data) {
				console.log(JSON.stringify(data));
			},
			error: function(e) {
				console.log("failed:" + JSON.stringify(e));
			}
		});
	}

	bucketRender()
}

function printMode() {
	// 계산기를 숨긴다.
	let cal = document.getElementById("calculator");
	cal.style.display = "none";
	// 출력한다.
	window.print();
}

function resetForm() {
	// 계산기를 다시 띄운다.
	let cal = document.getElementById("calculator");
	cal.style.display = "block";
	// 폼을 리셋한다.
	document.getElementById("comment").value = "";
	document.getElementById("mono").checked = true;
	document.getElementById("anamorphicLens").checked = false;
	document.getElementById("stereo").checked = false;
	document.getElementById("vr").checked = false;
	document.getElementById("is4kOver").checked = false;
	document.getElementById("noneSurvey").checked = false;
	document.getElementById("noneOnsetInfo").checked = false;
	document.getElementById("totalShotNum").value = 1;
	document.getElementById("objectTrackingRigid").value = 0;
	document.getElementById("objectTrackingNoneRigid").value = 0;
	document.getElementById("rotoanimationBasic").value = 0;
	document.getElementById("rotoanimationSoftDeform").value = 0;
	document.getElementById("layout").value = 0;
	document.getElementById("totalFrame").innerHTML = 0;
	document.getElementById("calHistory").innerText = "";
	bucket.project = ""; 
	bucket.comment = "";
	bucket.items = [];
	bucket.unit = "￦";
	bucketRender();
}

function sendToEmail() {
	if ( bucket.items.length === 0 ) {
		alert("장바구니가 비어있습니다.\n데이터를 전송할 수 없습니다.");
		return
	}
	bucket.date = today();
	bucket.author = document.getElementById("author").value;
	bucket.person = document.getElementById("person").value;
	bucket.email = document.getElementById("email").value;
	bucket.project = document.getElementById("project").value;
	bucket.startdate = document.getElementById("startdate").value;
	bucket.enddate = document.getElementById("enddate").value;
	bucket.comment = document.getElementById("comment").value;
	bucket.unit = "￦";
	$.ajax({
		url: "https://b9mx1b8r59.execute-api.ap-northeast-2.amazonaws.com/estimate_send",
		type: 'POST',
		data: JSON.stringify(bucket),
		dataType: 'json',
		crossDomain: true,
		contentType: 'application/json',
		success: function(data) {
			console.log(JSON.stringify(data));
		},
		error: function(e) {
			console.log("failed:" + JSON.stringify(e));
		}
	});
	alert("데이터가 전송되었습니다.\n업무시간 기준 24시간 안에 연락드리겠습니다.");
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
	  textbox.addEventListener(event, function() {
		if (inputFilter(this.value)) {
		  this.oldValue = this.value;
		  this.oldSelectionStart = this.selectionStart;
		  this.oldSelectionEnd = this.selectionEnd;
		} else if (this.hasOwnProperty("oldValue")) {
		  this.value = this.oldValue;
		  this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
		}
	  });
	});
}

// checkCalculatorHistoryString은 계산기의 히스토리 문자열 예외처리를 한다.
function checkCalculatorHistoryString() {
	let input = document.getElementById("calHistory").innerText
	if (input[0] === '+') {
		alert("수식은 숫자로 시작해야합니다")
		return
	}
	if (input[input.length-1] === '+'){
		alert("수식은 +로 끝날 수 없습니다")
		return
	}
}

//계산기의 = 버튼을 누르면 작동하는 함수. + 를 기준으로 각 프레임의 가격을 계산한다.
function evaluateCal() {
	checkCalculatorHistoryString()
    let frame = document.getElementById("calHistory").innerText;
    let splitedFrames = frame.split('+');
    let total = 0;
    for (let i in splitedFrames){
        bucket.frames[i] = parseInt(splitedFrames[i].trim());
        total += parseInt(splitedFrames[i].trim());
    }
	document.getElementById("totalFrame").innerHTML = total;
	// 계산기 결과를 업데이트 한다.
	document.getElementById("calResult").innerText = total;
}

//프레임 개수에 따라 가중치를 고려해 가격을 반환하는 함수.
function frameNum2Cost(num){
    if(num <= 500){
        return 1000*num; // 프레임 당 1000원.
    }else if(num <= 1000){
        return 2000*num - 500000; //1000프레임일 때 프레임 당 2000원.
    }else if(num <= 2000){
        return 2500*num - 1000000; //2000프레임일 때 프레임 당 3000원.
    }
}

// Install input filters.
setInputFilter(document.getElementById("totalShotNum"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("objectTrackingRigid"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("objectTrackingNoneRigid"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("rotoanimationBasic"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("rotoanimationSoftDeform"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});
setInputFilter(document.getElementById("layout"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 3600);
});