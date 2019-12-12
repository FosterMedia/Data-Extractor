function objectToTable(object, dataArray) {
    // map needed fields to an object to insert into array
    var payment = {
        name: object.CustomerName ? object.CustomerName : 'N/A',
        amount: object.Amount ? object.Amount : 'N/A',
        tip: object.Tip ? object.Tip : 'N/A',
        date: object.TimeStamp ? object.TimeStamp : 'N/A',
    }

    // push record into array to display on table
    dataArray.push(payment);
}

function parseData(data) {

    $("#totalEntries").text(data.length);

    // count errors to print on page
    var salesCount = 0;
    var noPaymentCount = 0;
    var dataArray = [];

    for (var i = 0; i < data.length; i++) {

        //Check for seats                    
        if ('Seats' in data[i]) {

            //Check for seat
            if ('Seat' in data[i].Seats) {


                //NON SEAT Array method
                //check for payment record
                if ('PaymentRecord' in data[i].Seats.Seat) {

                    var paymentRecord = data[i].Seats.Seat.PaymentRecord;

                    if (paymentRecord.length > 1) {

                        // loop through multiple payment records
                        for (item in paymentRecord) {

                            objectToTable(item, dataArray);
                        }

                    } else {
                        objectToTable(paymentRecord, dataArray);
                    }

                } else {
                    noPaymentCount = (noPaymentCount + 1);
                }


                //SEAT Array method
                //check for payment record
                if (data[i].Seats.Seat.length > 0) {
                    var seatArray = data[i].Seats.Seat;

                    for (var x = 0; x < seatArray.length; x++) {

                        if ('PaymentRecord' in data[i].Seats.Seat[x]) {

                            var paymentArray = data[i].Seats.Seat[x].PaymentRecord[0];

                            if (paymentArray.length > 1) {

                                for (var p = 0; p < paymentArray.length; p++) {

                                    // loop through multiple payment records
                                    for (item in paymentArray[p]) {
                                        objectToTable(item, dataArray);
                                    }
                                }

                            } else {
                                objectToTable(paymentArray, dataArray);
                            }

                        }

                    }

                }

            } else {
                null
            }

        } else {
            salesCount = (salesCount + 1)
        }


        // print error counts to screen
        $("#salesCount").text(salesCount)
        $("#noPaymentCount").text(noPaymentCount)


    }
    
    updateTable(dataArray);
}

// json data converted to table
function json2table(json, $table) {
    var cols = Object.keys(json[1]);

    var headerRow = '';
    var bodyRows = '';

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $table.html('<thead><tr></tr></thead><tbody></tbody>');

    cols.map(function (col) {
        headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
    });

    json.map(function (row) {
        bodyRows += '<tr>';

        cols.map(function (colName) {
            bodyRows += '<td>' + row[colName] + '</td>';
        })

        bodyRows += '</tr>';
    });

    $table.find('thead tr').append(headerRow);
    $table.find('tbody').append(bodyRows);
}

function updateTable (data) {
    var dom = {
        $data: $('#data'),
        $table: $('#table'),
    };

    dom.$data.val(JSON.stringify(data));
    json2table(data, dom.$table);

    dom.$data.on('input', function() {
        json2table(JSON.parse(dom.$data.val()), dom.$table);
    });
}



