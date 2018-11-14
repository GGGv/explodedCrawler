$(function(){
    let url = "http://18.221.29.244:8080/";
    let account;
    let containerDom = $('#containers > span');
    let containerRes;
    let container;
    let objectRes;
    /*$(document).ready(function (){
        $('#getAll').empty();
        $.get("/api/urls/getAll", function(data, status){
            console.log(data);
            for(let i = 0; i < data.length; i++){
                console.log(data[i].url);
                let a = document.createElement("a");
                let li = document.createElement("li");
                a.setAttribute("href", data[i].url);
                $(a).text(data[i].url);
                li.appendChild(a);

                // let appendToUl = '<li><a href=' + data[i].url + '>' + bbb + '</a></li>    ';
                $("#getAll").append(li);
                // console.log(appendToUl);
            }
        });
    });
    $('#account input').on('change', function() {
        account = ($('input[name=accountName]:checked', '#account').val()); 
        $.get("/api/container?name="+account, function(data, status){
            console.log(data);
            containerRes = data.split("\n");
            $('#containers').children().remove();
            $('#objects').children().remove();
            for(let i = 0; i < containerRes.length - 1; i++){
                //$('#bontainers').append("<input type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                
                $('#containers').append('<label class="radio-label" id="' + containerRes[i] + '"></label>');
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<input name='containerName' type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<span class='inner-label'>" + containerRes[i] + "&nbsp&nbsp&nbsp&nbsp&nbsp</span>");
            }
        });
    });
    */
    function updateUrl(data){
            $("#getAll").empty();
            console.log(data);
            console.log(data.length);
            data = JSON.parse(data);
            for(let i = 0; i < data.length; i++){
                console.log(data[i]);
                let a = document.createElement("a");
                let li = document.createElement("li");
                a.setAttribute("href", data[i]);
                $(a).text(data[i]);
                li.appendChild(a);

                // let appendToUl = '<li><a href=' + data[i].url + '>' + bbb + '</a></li>    ';
                $("#getAll").append(li);
                // console.log(appendToUl);
            }

    }
    $('#containers').on('change', 'input[name=containerName]:radio', function() {
        container = ($('input[name=containerName]:checked', '#containers').val()); 
        $.get("/api/object?name="+account+"&container="+container, function(data, status){
            console.log(data);
            objectRes = data.split("\n");
            $('#objects').children().remove();
            for(let i = 0; i < objectRes.length - 1; i++){
                /*$('#objects').append($('<input />', {
                    'type': 'radio',
                    'name': 'objectName',
                    'id':   i,
                    'value': objectRes[i],
                }));*/
                //$('#objects').append('<label for="' + i + '">' + " " + objectRes[i] + " " + '</label><br>');
                $('#objects').append("<a class='objs' target='_blank' href=" + url + "v1/" + account + "/" + container + "/" + objectRes[i] + ">" + objectRes[i] + "</a>");
            }
        });
    });
    let addConName;
    let delConName;
    let delObjName;

    $('#delCon').on('click', function(){
        delConName = $('#delConN').text();
        $.get("/api/container/delete?name="+account+"&container="+delConName, function(data, status){
            updateContainer();
        });
    });

    $('#delObj').on('click', function(){
        delObjName = $('#delObjN').text();
        $.get("/api/object/delete?name="+account+"&container="+container+"&object="+delObjName, function(data, status){
            updateObject();
        });

    });
    let addObjName;
    $('#delCon').on('click', function(){
        let delConName = $('#delConN').text();
        // $.get("/api/container/create?name="+account+"&container="+addConName, function(data, status){

            // updateContainer();
        //});
        $.post( "/api/urls/delete", { url : delConName })
        .done(function( data ) {
            console.log(data);
            data = JSON.parse(data);
            updateUrl(data);
        });

    });
    $('#addSite').on('click', function(){
        let addSiteName = $('#addSiteN').text();
        console.log(addSiteName);
        // $.get("/api/container/create?name="+account+"&container="+addConName, function(data, status){

            // updateContainer();
        //});
        $.get("/api/urls/crawlSite?site="+addSiteName, function(data, status){
            // data = '["' + data + '"]';
            console.log(data);
            updateUrl(data);
        });

    });
    $('#addCon').on('click', function(){
        let account = ($('input[name=accountName]:checked', '#account').val()); 
        let site = ($('input[name=siteName]:checked', '#site').val()); 
        console.log(account);
        addConName = $('#addConN').text();
        console.log(addConName);
        // $.get("/api/container/create?name="+account+"&container="+addConName, function(data, status){

            // updateContainer();
        //});
        $.get("/api/urls/getServer?server="+account+"&number="+addConName+"&site="+site, function(data, status){
            console.log(data);
            updateUrl(data);
        });

    });
    let uploadON;
    let uploadOE;
    $('#uploadS').on('click', function(e){
        uploadON = $('#uploadN').text();
        uploadOE = $('#uploadE').text();
        //$('#uploadF').attr('action', "http://192.168.2.150:8080/v1/"+account+"/"+container+"/"+uploadON);
        $('#uploadF').attr('action', "/api/object/create?name="+account+"&container="+container+"&object="+uploadON+"&effect="+uploadOE);
    });    

    $('#refresh').on('click', function(){
        updateObject();
    });
    let object;

    /*$('#objects').on('change', 'input[name=objectName]:radio', function() {
        object = ($('input[name=objectName]:checked', '#objects').val()); 
        $.get("/api/object/download?name="+account+"&container="+container+"&object="+object, function(data, status){

        });
    });*/

function updateContainer(){

        $.get("/api/container?name="+account, function(data, status){
            console.log(data);
            containerRes = data.split("\n");
            $('#containers').children().remove();
            $('#objects').children().remove();
            for(let i = 0; i < containerRes.length - 1; i++){
                //$('#bontainers').append("<input type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                
                $('#containers').append('<label class="radio-label" id="' + containerRes[i] + '"></label>');
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<input name='containerName' type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<span class='inner-label'>" + containerRes[i] + "&nbsp&nbsp&nbsp&nbsp&nbsp</span>");
            }
        });

}
function updateObject(){
        $.get("/api/object?name="+account+"&container="+container, function(data, status){
            console.log(data);
            objectRes = data.split("\n");
            $('#objects').children().remove();
            for(let i = 0; i < objectRes.length - 1; i++){
                /*$('#objects').append($('<input />', {
                    'type': 'radio',
                    'name': 'objectName',
                    'id':   i,
                    'value': objectRes[i],
                }));*/
                //$('#objects').append('<label for="' + i + '">' + " " + objectRes[i] + " " + '</label><br>');
                $('#objects').append("<a class='objs' target='_blank' href=" + url + "v1/" + account + "/" + container + "/" + objectRes[i] + ">" + objectRes[i] + "</a>");
            }
        });
}
});
