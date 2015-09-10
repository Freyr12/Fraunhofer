function logout() {
  $.ajax({
    url: "../../Login/logout.php",
    type: "POST"
  }).done(function() {
    // redirect the user to the login page
    // this is done so you loose access to the site you are at
    // when you log out.
    window.location = "../../Login/login.php";
  });
}
function addFeedback() {
  var name = $('#name').val();
  var comment = $('#comment').val();
  $.ajax({
    url: "../InsertPHP/addFeedback.php",
    type: "POST",
    data: {
      name: name,
      comment: comment
    },
    success: function(data, status, xhr) {
      window.location.reload(true);
    }
  });
}
function setSessionIDSearch(order_ID){
    $.ajax({
        url : "../UpdatePHP/setSessionID.php",
        type: "POST",
        data : {order_ID : order_ID},
    });
}

function supplierSuggestions() {
  $('#output').html();
  var supplier_name = $('#supplier_name').val();
  var supplier_contact = $('#supplier_contact').val();
  var supplier_phone = $('#supplier_phone').val();
  var supplier_email = $('#supplier_email').val();
  var supplier_address = $('#supplier_address').val();
  $.ajax({
    url: '../SearchPHP/supplier_search_suggestions.php',
    type: 'POST',
    data: {supplier_name : supplier_name,
           supplier_contact: supplier_contact,
           supplier_phone: supplier_phone,
           supplier_email: supplier_email,
           supplier_address: supplier_address
    },
    success: function(data, status, xhr) {
      $("#output").html(data);
    }
  });
}

function overview(){
  var department = $('#department').val();
  var cost_code = $('#cost_code').val();
  var timeInterval = $('#group_by_select').val();
  var date_from = $('#date_from').val();
  var date_to = $('#date_to').val();
  $.ajax({
    url: '../SearchPHP/overview.php',
    type: 'POST',
    data: {department   : department,
           cost_code    : cost_code,
           timeInterval : timeInterval,
           date_from    : date_from,
           date_to      : date_to},
    success: function(data, status, xhr) {
      $("#output").html(data);
    }
  });
}

function forecast(){
  var supplier_name = $('#supplier_name').val();
  var order_name = $('#order_name').val();
  var date_from = $('#date_from').val();
  var date_to = $('#date_to').val();
  $.ajax({
    url: '../SearchPHP/forecast.php',
    type: 'POST',
    data: {supplier_name: supplier_name,
           order_name   : order_name,
           date_from    : date_from,
           date_to      : date_to},
    success: function(data, status, xhr) {
      $("#output").html(data);
    }
  });
}

function purchaseSuggestions() {
  $('#output').html();
  var order_name = $('#order_name').val();
  var supplier_name = $('#supplier_name').val();
  var first_date = $('#first_date').val();
  var last_date  = $('#last_date').val();
  var notReceived;
  if($('#notReceived').is(':checked')){
    notReceived = $('#notReceived').val();
  }
  var noFinalInspection;
  if($('#noFinalInspection').is(':checked')){
    noFinalInspection = $('#noFinalInspection').val();
  }

  $.ajax({
    url: '../SearchPHP/purchase_search_suggestions.php',
    type: 'POST',
    data: {order_name : order_name,
           supplier_name : supplier_name,
           first_date : first_date,
           last_date  : last_date,
           noFinalInspection  : noFinalInspection,
           notReceived: notReceived},
    success: function(data, status, xhr) {
      $("#output").html(data);
    }
  });
}
function orderItemSuggestions() {
  $('#output').html();
  var part_number = $('#part_number').val();
  var description = $('#description').val();
  var department = $('#department').val();
  var first_date = $('#first_date').val();
  var last_date  = $('#last_date').val();

  var noFinalInspection;
  if($('#noFinalInspection').is(':checked')){
    noFinalInspection = $('#noFinalInspection').val();
  }

  $.ajax({
    url: '../SearchPHP/order_item_suggestions.php',
    type: 'POST',
    data: {part_number : part_number,
           description : description,
           department : department,
           first_date : first_date,
           last_date  : last_date,
           noFinalInspection  : noFinalInspection},
    success: function(data, status, xhr) {
      $("#output").html(data);
    }
  });
}

function orderRequest(){
  var request_supplier     = $('#request_supplier').val();
  var department           = $('#department').val();
  var cost_code           = $('#cost_code').val();
  var orderTimeframe       = $('#orderTimeframe').val();
  var approved_by_employee = $('#approved_by_employee').val();
  var request_description  = $('#request_description').val();
  var employee_ID          = $('#employee_ID').val();
  var part_number          = $('#part_number').val();
  var quantity             = $('#quantity').val();
  if(request_description === ""){
    $("#invalidRequest").html("<div class='alert alert-danger fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Missing information: Description</div>");
  } else{
    $.ajax({
      url: '../InsertPHP/addNewRequest.php',
      type: 'POST',
      data: {
        request_supplier     : request_supplier,
        department           : department,
        cost_code            : cost_code,
        orderTimeframe       : orderTimeframe,
        approved_by_employee : approved_by_employee,
        request_description  : request_description,
        employee_ID          : employee_ID,
        part_number          : part_number,
        quantity             : quantity
      },
      success: function(data, status, xhr){
        window.location.reload();
      }
    });
  }
}
function activeRequest(element){
  if(!element){
    $("#output").html("");
    return;
  }
  var request_ID    = $(element).parent().find('#request_ID').text();
  var employee_name = $(element).parent().find('#employee_name').text();

  $.ajax({
    url: '../SearchPHP/showRequest.php',
    type: 'POST',
    data: {
      request_ID    : request_ID,
      employee_name : employee_name
    },
    success: function(data, status, xhr){
      $("#output").html(data);
    }
  });
}

function delRequest(request_ID){
  var r = confirm("Are you sure you want to delete this request? \nThis has not yet been ordered");
  if(r === true){
    $.ajax({
      url: '../DeletePHP/deleteRequest.php',
      type: 'POST',
      data:{
        request_ID : request_ID
      },
      success: function(data, status, xhr){
        window.location.reload();
      }
    });
  }
}
function delOrderItem(order_item_ID){
  var r = confirm("Are you sure you want to delete this line item?");
  if(r === true){
    $.ajax({
      url: '../DeletePHP/deleteOrderItem.php',
      type: 'POST',
      data:{
        order_item_ID : order_item_ID
      },
      success: function(data, status, xhr){
        window.location.reload();
      }
    });
  }
}

function createPurchaseOrder(){
  // function to find the correct value from the datalist
  var employee_name = $("input[name='employeeList']").on('input', function(e){
    var $input = $(this),
        val = $input.val(),
        list = $input.attr('list'),
        match = $('#'+list + ' option').filter(function() {
           return ($(this).val() === val);
       });
  });

  // function to find the correct value from the datalist
  var supplier_name = $("input[name='supplierList']").on('input', function(e){
    var $input = $(this),
        val = $input.val(),
        list = $input.attr('list'),
        match = $('#'+list + ' option').filter(function() {
           return ($(this).val() === val);
       });
  });
  employee_name   = employee_name.val();
  supplier_name   = supplier_name.val();
  var employee_ID = $('#employee_ID').val();
  var approved_by = $('#approved_by').val();
  var request_ID  = $('#activeRequest').text();

  if(!employee_name){
    $("#invalidPO").html("<div class='alert alert-danger fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Missing information: Employee</div>");
  } else if (!supplier_name){
    $("#invalidPO").html("<div class='alert alert-danger fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Missing information: Supplier</div>");
  } else{
    $.ajax({
      url: '../InsertPHP/addNewPurchaseOrder.php',
      type: 'POST',
      data:{
        employee_name : employee_name,
        employee_ID   : employee_ID,
        supplier_name : supplier_name,
        request_ID    : request_ID,
        approved_by   : approved_by
      },
      success: function(data, status, xhr){
        window.location = "../views/addOrderItem.php";
      }
    });
  }
}
function addOrderItem(){
  var quantity    = $('#quantity').val();
  var part_number = $('#part_number').val();
  var unit_price  = $('#unit_price').val();
  var description = $('#description').val();
  var department  = $('#department').val();
  var cost_code   = $('#cost_code').val();
  $.ajax({
    url: '../InsertPHP/addNewOrderItem.php',
    type: 'POST',
    data:{
      quantity    : quantity,
      part_number : part_number,
      unit_price  : unit_price,
      department  : department,
      cost_code   : cost_code,
      description : description
    },
    success: function(data, status, xhr){
      window.location.reload();
      //console.log(data);
    }
  });
}
function showPOInfo(order_ID) {
  $.ajax({
    url: "../SelectPHP/POInfoForOrderItem.php",
    type: "POST",
    data: {
      order_ID: order_ID
    },
    success: function(data, status, xhr) {
      $("#poinfo").html(data);
    }
  });
}
function showPOInfoAndRefreshImage(order_ID) {
  $.ajax({
    url: "../SelectPHP/POInfoForOrderItem.php",
    type: "POST",
    data: {
      order_ID: order_ID
    },
    success: function(data, status, xhr) {
      $("#poinfo").html(data);
      window.location.reload(true);
    }
  });
}

// Function to edit the order number of a purchase order
function editOrderNumber(){
  var order_name = $('#order_name').val();
  $.ajax({
    url: "../UpdatePHP/editOrderNumber.php",
    type: "POST",
    data: {
      order_name: order_name
    },
    success: function(data, status, xhr) {
      window.location.reload();
    }
  });
}

// if this function returns false the file is not added
function checkSize(max_img_size) {
  console.log("yoyo");
  var input = document.getElementById("fileToUpload");
  if (input.files && input.files.length == 1) {
    if (input.files[0].size > max_img_size) {
      alert("The file size must be less than " + (max_img_size / 1024) + "KB");
      return false;
    }
  } else {
    alert("No image chosen.");
    return false;
  }

  return true;
}

function showOrderItems(order_ID){
  $.ajax({
    url: "../SelectPHP/showOrderItems.php",
    type: "POST",
    data: {
      order_ID: order_ID
    },
    success: function(data, status, xhr) {
      $("#orderItems").html(data);
    }
  });
}
function addNewSupplier(){
  var supplier_name    = $('#supplier_name').val();
  var supplier_address = $('#supplier_address').val();
  var supplier_phone   = $('#supplier_phone').val();
  var supplier_fax     = $('#supplier_fax').val();
  var supplier_email   = $('#supplier_email').val();
  var supplier_contact = $('#supplier_contact').val();
  var supplier_website = $('#supplier_website').val();
  var supplier_login   = $('#supplier_login').val();
  var supplier_password = $('#supplier_password').val();
  var supplier_accountNr = $('#supplier_accountNr').val();
  var net_terms        = $('#net_terms').val();
  var supplier_notes = $('#supplier_notes').val();
  if(!supplier_name){
    $("#invalidSupplier").html("<div class='alert alert-danger fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Missing information: Supplier name</div>");
  } else{
    $.ajax({
      url: "../InsertPHP/addNewSupplier.php",
      type: "POST",
      data: {
        supplier_name    : supplier_name,
        supplier_address : supplier_address,
        supplier_phone   : supplier_phone,
        supplier_fax     : supplier_fax,
        supplier_email   : supplier_email,
        supplier_contact : supplier_contact,
        supplier_login   : supplier_login,
        supplier_password : supplier_password,
        supplier_accountNr : supplier_accountNr,
        net_terms        : net_terms,
        supplier_website : supplier_website,
        supplier_notes : supplier_notes
      },
      success: function(data, status, xhr) {
        window.location = '../Views/supplierList.php';
      }
    });
  }
}

function updateCostCode(){
  var department_name = $('#department').val();
  var group_by_select = $('#group_by_select').val();
  $.ajax({
    url: "../UpdatePHP/costCode.php",
    type: "POST",
    data: {
      department_name : department_name,
      group_by_select : group_by_select
    },
    success: function(data, status, xhr) {
      $('.result').html(data);
    }
  });
}
function updateModalCostCode(element){
  var department_name = $(element).parent().find('#department').val();
  console.log(department_name);
  $.ajax({
    url: "../UpdatePHP/costCode.php",
    type: "POST",
    data: {
      department_name : department_name
    },
    success: function(data, status, xhr) {
      $('.result').html(data);
    }
  });
}

// This function preserves the session order_ID
function POInfo(order_ID){
  $.ajax({
    url: '../SelectPHP/POInfo.php',
    type: "POST",
    data:{
      order_ID: order_ID
    },
    success: function(data, status, xhr) {
      window.location = "../Views/addOrderItem.php";
    }
  });
}
// This function preserves the session order_ID
function printoutInfo(order_ID){
  $.ajax({
    url: '../SelectPHP/POInfo.php',
    type: "POST",
    data:{
      order_ID: order_ID
    },
    success: function(data, status, xhr) {
      window.location = "../Printouts/purchaseOrder.php";
    }
  });
}
// Function for setting the session supplier ID
function setSupplierID(element){
  var supplier_ID = $(element).parent().prev().find("#supplier_ID").val();
  $.ajax({
    url: '../UpdatePHP/setSupplierID.php',
    type: "POST",
    data:{
      supplier_ID : supplier_ID
    },
    success: function(data, status, xhr) {
     window.location="../Views/editSupplier.php";
    }
  });
}

// Function for editing the supplier
function editSupplier(){
  var r = confirm("Are you sure you want to edit this supplier?");
  if(r === true){
    var supplier_name = $("#supplier_name").val();
    var supplier_phone = $("#supplier_phone").val();
    var supplier_fax = $("#supplier_fax").val();
    var net_terms   = $("#net_terms").val();
    var supplier_email = $("#supplier_email").val();
    var supplier_address = $("#supplier_address").val();
    var supplier_contact = $("#supplier_contact").val();
    var supplier_accountNr = $("#supplier_accountNr").val();
    var supplier_website = $("#supplier_website").val();
    var supplier_login = $("#supplier_login").val();
    var supplier_password = $("#supplier_password").val();
    var supplier_notes = $("#supplier_notes").val();
    $.ajax({
      url: '../UpdatePHP/editSupplier.php',
      type: "POST",
      data:{
        supplier_name : supplier_name,
        supplier_phone : supplier_phone,
        supplier_fax : supplier_fax,
        net_terms : net_terms,
        supplier_email : supplier_email,
        supplier_address : supplier_address,
        supplier_contact : supplier_contact,
        supplier_accountNr : supplier_accountNr,
        supplier_website : supplier_website,
        supplier_login : supplier_login,
        supplier_password : supplier_password,
        supplier_notes : supplier_notes
      },
      success: function(data, status, xhr) {
       window.location="../Views/supplierList.php";
      }
    });
  }
}

// Delete Purchase Scan
function deletePurchaseScan(scan_ID){
  var r = confirm("Are you sure you want to delete this scan?");
  if(r === true){
    $.ajax({
      url: '../DeletePHP/deleteScan.php',
      type: "POST",
      data:{
        scan_ID : scan_ID
      },
      success: function(data, status, xhr) {
        window.location.reload();
      }
    });
  }
}

// Set the rating and receiving date of the purchase order
function packageReceived(order_ID, element){
  var receiveDate = $(element).parent().find("#receiveDate").val();
  var rating_timeliness = $("#rating_timeliness").val();
  e                     = document.getElementById("rating_quality");
  var rating_quality    = e.options[e.selectedIndex].value;
  e                     = document.getElementById("rating_price");
  var rating_price      = e.options[e.selectedIndex].value;
  var order_final_inspection = $('#order_final_inspection').val();

  $.ajax({
    url: '../UpdatePHP/packageReceived.php',
    type: "POST",
    data:{
      order_ID          : order_ID,
      receiveDate       : receiveDate,
      order_final_inspection : order_final_inspection,
      rating_timeliness : rating_timeliness,
      rating_price      : rating_price,
      rating_quality    : rating_quality
    },
    success: function(data, status, xhr) {
      window.location = "../Views/purchasing.php";
    }
  });
}
//This adds the comment to the purchase order
function addCommentToPO(){
  var order_final_inspection = $('#order_final_inspection').val();
  $.ajax({
    url: '../UpdatePHP/updatePOComment.php',
    type: "POST",
    data:{
      order_final_inspection : order_final_inspection
    },
    success: function(data, status, xhr) {
      window.location.reload();
    }
  });
}

// Set the currency on the printout since not all purchase orders are in $
function setCurrency(){
  var currency = $('#currency').val()
  $.ajax({
    url: '../UpdatePHP/updateCurrency.php',
    type: "POST",
    data:{
      currency : currency
    },
    success: function(data, status, xhr) {
      window.location.reload();
    }
  });
}

// Function to edit the order item
function editOrderItem(order_item_ID, element){
  // Because we are fetching information from a modal, we need to use "this" or "element"
  // to find the correct modal
  // parent() is modal-footer
  // parent().prev() is modal-body
  // and from there we find the correct id's
  var quantity    = $(element).parent().prev().find("#quantity").val();
  var part_number = $(element).parent().prev().find('#part_number').val();
  var department  = $(element).parent().prev().find('#department').val();
  var unit_price  = $(element).parent().prev().find('#unit_price').val();
  var description = $(element).parent().prev().find('#description').val();
  $.ajax({
    url: '../UpdatePHP/editOrderItem.php',
    type: "POST",
    data:{
      order_item_ID : order_item_ID,
      quantity      : quantity,
      part_number   : part_number,
      department    : department,
      unit_price    : unit_price,
      description   : description
    },
    success: function(data, status, xhr) {
      window.location.reload();
    }
  });
}

// This function makes the request inactive
function finishRequest(request_ID){
  var r = confirm("Are you sure you are finished with this request?");
  if(r === true){
    $.ajax({
      url: '../UpdatePHP/finishRequest.php',
      type: 'POST',
      data:{
        request_ID : request_ID
      },
      success: function(data, status, xhr){
        window.location.reload();
      }
    });
  }
}

// Edit expected delivery date
function editExpectedDeliveryDate(){
  var expected_delivery_date = $('#expected_delivery_date').val();
  $.ajax({
    url: '../UpdatePHP/editExpectedDeliveryDate.php',
    type: 'POST',
    data:{
      expected_delivery_date : expected_delivery_date
    },
    success: function(data, status, xhr){
      window.location.reload();
    }
  });
}
// Edit net terms
function editNetTerms(){
  var net_terms = $('#net_terms').val();
  $.ajax({
    url: '../UpdatePHP/editNetTerms.php',
    type: 'POST',
    data:{
      net_terms : net_terms
    },
    success: function(data, status, xhr){
      window.location.reload();
    }
  });
}

// This function confirms the final inspection notes for every order item in this purchase order
function confirmFinalInspection(order_ID){

  var final_inspection;
  var order_item_ID;
  var ok;

  //Find how many rows we have in the table
  var cells = $('#finalInspectionTable > tbody > tr');
  var length = cells.length;

  //A function that goes through every row and finds final_inspection for each row
  $('#finalInspectionTable > tbody > tr').each(function(i) {
    if(i < length - 1){
      final_inspection = $(this).find('#final_inspection').val();
      order_item_ID    = $(this).find('#order_item_ID').val();
      ok               = $(this).find('#ok');
      if(ok.is(':checked')){
        ok = $('#ok').val();
      }else{
        ok = "";
      }
      $.ajax({
        url: '../UpdatePHP/setFinalInspectionNote.php',
        type: 'POST',
        data:{
          order_item_ID     : order_item_ID,
          order_ID          : order_ID,
          final_inspection  : final_inspection,
          ok                : ok
        }
      });
    }
  });
  window.location.reload();
}

// Update the final inspection for the order item
function updateFinalInspection(final_inspection, order_item_ID, element){

  // I need to use element and parent to get the correct table row
  // $('#ok') would always fetch the top row which is not what we want
  var ok = $(element).parent().find('#ok');

  if(ok.is(':checked')){
    ok = $('#ok').val();
  }else{
    ok = "";
  }
  $.ajax({
    url: '../UpdatePHP/setFinalInspectionNote.php',
    type: 'POST',
    data:{
      order_item_ID : order_item_ID,
      final_inspection : final_inspection,
      ok : ok
    },
    success: function(data, status, xhr) {
      window.location.reload();
    }
  });
}
