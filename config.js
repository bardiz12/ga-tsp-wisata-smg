window.config = {
    cities:[],
    totalCities:20,
    recordDistance:Infinity,
    iter:0,
    maxIter:1000,
    bestPath:null,
    logging:false,
    worstPath:null,
    KM:{
        bestPath:0,
        worstPath:0
    }
}
var logs = "";



const printCities = () => {
    var html = "<ul>";
    config.cities.forEach((element,i) => {
        html+= "<li>"+ coords[i].name+" <code>"+(element.x)+", "+(element.y)+"</code></li>";
    });
    $("#cities_coordinate").html(html + "</ul>");
}

const ntoa = order => {
    let ar = [];
    order.forEach((item,index) => {
        ar[index] = String.fromCharCode(item + 97)
    });
    return ar;
}

const getName = order => {
    let ar = [];
    order.forEach((item,index) => {
        ar[index] = coords[item].name;
    });
    return ar;
}

const printIterationInfo = () => {
    //if(!config.logging) return ;
    var html = "";
    html+="Iteration Number: " + config.iter +" of " + config.maxIter;
    html+="<div class='d-block'>";
    html+="<h3>Best Route</h3>";
    html+= (getName(config.bestPath.order)).join("<br/>");
    html+= "<br/>Distance : " + config.KM.bestPath + " Km";
    html+="<h3>Worst Route</h3>";
    html+= (getName(config.worstPath.order)).join("<br/>");
    html+= "<br/>Distance : " + ( config.worstPath ? config.KM.worstPath : '') + " Km";
    html+="</div>";
    $("#iteration").html(html);
}

const addToLog = text => {
    logs+=(text + "\n");
    if(!config.logging) return;
    $("#log").append(text + "\n");
    
}