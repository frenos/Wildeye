/**
 * Created by Frenos on 24.05.2016.
 */

function createList(){
    $("#joblist").empty();
    var apiPath = window.location.protocol + "//" + window.location.host+"/jobs";

    jQuery.ajax ({
        type: "GET",
        url: apiPath,
        dataType: "json",
        success: function(resp){
            $.each(resp, function(i,item){
                var newElement = "<tr>" +
                    "<td>"+item.id+"</td>" +
                    "<td>"+item.name+"</td>" +
                    "<td>"+item.state+"</td>" +
                    "<td>"+item.coordinates.length+"</td>" +
                    "<td><span class='glyphicon glyphicon-remove' aria-hidden='true' style='cursor: pointer; color: darkred;' onclick='deletefunc("+item.id+")'></span></td>" +
                    "</tr>";
                $(newElement).hide().appendTo("#joblist").fadeIn(550+i*250);
            });
            console.log(resp);
        },
        error: function(e){
            console.log("ERROR!");
            console.log(e);
        }
    });
}
function deletefunc(id){
    var apiPath = window.location.protocol + "//" + window.location.host+ "/jobs";
    $.ajax({
        url: apiPath+"/"+id,
        type: 'DELETE',
        success: function(result) {
            console.log("ok " + result);
            createList()
        } ,
        failure: function(result){
            console.log("fail "+ result);
        }
    });
}