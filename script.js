var EOP_viscosity = 0;
var Hypo_viscosity = 0;
var Loose_pulp_viscosity = 0;
var Hypo_addition_Input = 0;
var delta2_prev= -69.8
var Target_hypo_Input = 0
var target_loose_pulp_viscosity = 450
var eop_prev1 = 592
var eop_prev2 = 592

function showInfo() {
	EOP_viscosity = document.getElementById('eopViscosity').value;
	Hypo_viscosity = document.getElementById('hypoViscosity').value;
	Loose_pulp_viscosity = document.getElementById('loosePulpViscosity').value;
	Hypo_addition_Input = document.getElementById('hypoAddition').value;
	Target_hypo_Input = document.getElementById('prevTargetHypo').value;
	target_loose_pulp_viscosity = document.getElementById('targetLoosePulpViscosity').value; //450 by default

	var eop_predicted = 0.516*eop_prev1 + 0.1574*eop_prev2 + 193.51
	var hypo_addition = -16.66141573 + 0.07253*eop_predicted
	var delta3 = Loose_pulp_viscosity - Hypo_viscosity
	var delta3_percent = -delta3/Hypo_viscosity
	var target_hypo_viscosity = 450/(1-delta3_percent)
	var delta2 = Hypo_viscosity - EOP_viscosity

	var str = "";
	str += "<h2>Target Loose Pulp Viscosity = " + target_loose_pulp_viscosity + "<br></h2>";

	str += "<h2>Predicted delta3 = "+delta3+"<br>";
	
	if (delta3_percent > 0.14 || delta3_percent < 0.06){
	  str += "<h2 style='color: red;'>WARNING : Delta3 change is out of range<br></h2>";
	}
	else{
		str += "<h2 style='color: green;'>Delta3 change in range<br></h2>";
	}
	str += "<h2> Predicted EOP value = "+eop_predicted+"<br>";
	str += "Target Hypo Viscosity = " + target_hypo_viscosity.toFixed(3) + "<br>";
	str += "Predicted delta2 = "+ delta2 +"<br></h2>";
	if (hypo_addition < 0.0){
	  str += "<h2>Recommended Hypo Dosage Value less than zero<br></h2>";
	}
	else{
		// if(corrected_hypo_solution>40){
		// 	corrected_hypo_solution=40;
		// }
	  str += "<h2>Recommended Hypo Dosage: "+ hypo_addition.toFixed(3) +" L/min<br></h2>";
	}
	delta2_prev = delta2;
	eop_prev2 = eop_prev1;
	eop_prev1 = EOP_viscosity;
	Target_hypo = target_hypo_viscosity.toFixed(3);
	document.getElementById('info').innerHTML = str;
	document.getElementById('inputInfo').style.display = "none";
	document.getElementById('outputInfo').style.display = "block";
	var data = {
		EOP_viscosity: EOP_viscosity,
		Hypo_viscosity: Hypo_viscosity,
		Loose_pulp_viscosity: Loose_pulp_viscosity,
		Hypo_addition_Input: Hypo_addition_Input,
		Target_hypo_Input: Target_hypo_Input,
		Target_hypo:Target_hypo,
		target_loose_pulp_viscosity: target_loose_pulp_viscosity,
		delta3: delta3, 
		delta3_percent: delta3_percent,
		target_hypo_viscosity: target_hypo_viscosity,
		eop_predicted:eop_predicted,
		hypo_addition:hypo_addition,
		delta2: delta2,
		delta2_prev : delta2_prev,
		eop_prev1: eop_prev1,
		eop_prev2: eop_prev2,
	};
	console.log(data)
	postData('https://checkproject2-337711.el.r.appspot.com/main/dosage/all', data).then(() => console.log("OK"));
}

async function postData(url, data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
		'Content-Type': 'application/json'
		// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response; // parses JSON response into native JavaScript objects
  }
  

function resetForm() {
	document.getElementById('inputInfo').style.display = "block";
	document.getElementById('outputInfo').style.display = "none";

	document.getElementById("inputForm").reset();
	document.getElementById('prevTargetHypo').value = Target_hypo;
	document.getElementById('targetLoosePulpViscosity').value = 450;
}

document.getElementById('outputInfo').style.display = "none";
