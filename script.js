const connToken = "90935248|-31949236575137798|90958485";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";

$("#roll").blur(function () {
  checkStudent();
});

function enableFields() {
  $("#name, #class, #birth, #address, #enroll").prop("disabled", false);
}

function disableFields() {
  $("#name, #class, #birth, #address, #enroll").prop("disabled", true);
}

function checkStudent() {
  let roll = $("#roll").val();

  let getReq = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify({ "Roll-No": roll }));

  jQuery.ajaxSetup({async: false});
  let res = executeCommandAtGivenBaseUrl(getReq, "http://api.login2explore.com:5577", "/api/irl");
  jQuery.ajaxSetup({async: true});

  if (res.status === 400) {
    // New user
    enableFields();
    $("#saveBtn, #resetBtn").prop("disabled", false);
    $("#updateBtn").prop("disabled", true);
  } else {
    // Existing user
    let data = JSON.parse(res.data).record;

    $("#name").val(data["Full-Name"]);
    $("#class").val(data["Class"]);
    $("#birth").val(data["Birth-Date"]);
    $("#address").val(data["Address"]);
    $("#enroll").val(data["Enrollment-Date"]);

    enableFields();
    $("#roll").prop("disabled", true);

    $("#updateBtn, #resetBtn").prop("disabled", false);
    $("#saveBtn").prop("disabled", true);
  }
}

$("#saveBtn").click(function () {
  let data = {
    "Roll-No": $("#roll").val(),
    "Full-Name": $("#name").val(),
    "Class": $("#class").val(),
    "Birth-Date": $("#birth").val(),
    "Address": $("#address").val(),
    "Enrollment-Date": $("#enroll").val()
  };

  let req = createPUTRequest(connToken, JSON.stringify(data), dbName, relName);

  jQuery.ajaxSetup({async: false});
  executeCommandAtGivenBaseUrl(req, "http://api.login2explore.com:5577", "/api/iml");
  jQuery.ajaxSetup({async: true});

  $("#msg").text("✅ Saved Successfully").fadeIn().delay(2000).fadeOut();
  resetForm();
});

$("#updateBtn").click(function () {
  let data = {
    "Roll-No": $("#roll").val(),
    "Full-Name": $("#name").val(),
    "Class": $("#class").val(),
    "Birth-Date": $("#birth").val(),
    "Address": $("#address").val(),
    "Enrollment-Date": $("#enroll").val()
  };

  let req = createUPDATERecordRequest(connToken, JSON.stringify(data), dbName, relName, $("#roll").val());

  jQuery.ajaxSetup({async: false});
  executeCommandAtGivenBaseUrl(req, "http://api.login2explore.com:5577", "/api/iml");
  jQuery.ajaxSetup({async: true});

  $("#msg").text("✏️ Updated Successfully").fadeIn().delay(2000).fadeOut();
  resetForm();
});

$("#resetBtn").click(function () {
  resetForm();
});

function resetForm() {
  $("#studentForm")[0].reset();
  $("#roll").prop("disabled", false).focus();
  disableFields();

  $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
}