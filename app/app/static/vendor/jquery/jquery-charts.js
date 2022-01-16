var schart;
var chart;

$(document).ready(function () {
    var date_collected;
    var price_banner;
    var stock_graph;
    var crypto_graph; 
    $.ajax({
        type: 'GET',
        url: $('.banna').data('url'),
        dataType: "json",
        success: function(response) {
            console.log(response);
            date_collected = response.FinanceData;
            console.log('Received Stock Data up to: ' + date_collected);
            price_banner = response.priceBanner;
            stock_graph = response.stockGraph;
            crypto_graph = response.cryptoGraph;
            $('#stockbanner').empty();
            $('#stockbanner').text(price_banner);  
            iDependOnThis(response);     
        }, 
        error: function() {
            console.log("an error occurred on getting the financial data.")
        },
    });

    $('#investfolder').on('touchstart mousedown', function () {
        iDependOnThis($(this));
    })
    
    $('#investfolder').on('tap click', function () {
        $(this).data('clicked', true);
    })

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
      var startTimeInMs = Date.now();
      (function loopSearch() {
        if ($(selector).is(':visible')) {
            callback();
            return;
        } 
        else if ($('#investfolder').data('clicked') == true) {
            callback();
            return;
        } 
        else {
          setTimeout(function () {
            if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                return;
            loopSearch();
          }, checkFrequencyInMs);
        }
      })();
    }
    


    function iDependOnThis(e) {
        waitForElementToDisplay('#i1', function () {
        if ($('#i1').css("display") != "none") {
            window.x = stock_graph;
            //var data = response.stockGraph
            var data = Object.values(window.x);
            for (var i = 0; i < data.length; i++) {
                    var myJSONObject = data[i];
                    for (var f = 0; f < myJSONObject["dataPoints"].length; f++) {
                        var k = myJSONObject["dataPoints"][f]["x"];
                        var j = myJSONObject["dataPoints"][f]["y"]
                        myJSONObject["dataPoints"][f]["x"] = new Date(k);
                        if (j === 0) {
                            myJSONObject["dataPoints"][f]["y"] = null;
                        };
                };
            };
                console.log(data);
                setTimeout(function() {
                    var schart = new CanvasJS.Chart("chartContainer", {
                    backgroundColor: "transparent",	
                    animationEnabled: true,
                    zoomEnabled: true,
                    axisX: {
                    valueFormatString: "MMM YYYY",
                    labelFontColor: "#e6e1d1",
                    lineColor: "#e6e1d1",
                    tickColor: "#e6e1d1",

                    },
                    axisY2: {
                        suffix: "%",
                        labelFontColor: "#e6e1d1",
                        lineColor: "#e6e1d1",
                        tickColor: "#e6e1d1",
                        gridColor: "#e6e1d1",
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        fontColor: "#99968b",
                    },
                    
                    data: data // from ajax
                        });
                    
                schart.render();
                    }, 100);
            $("#loading").remove()  
        };
        
        if ($('#i2').css("display") != "none") {
            var cdata = Object.values(crypto_graph);
                for (var i = 0; i < cdata.length; i++) 
                    {
                        var myJSONObject = cdata[i];
                        for (var f = 0; f < myJSONObject["dataPoints"].length; f++) {
                            var k = myJSONObject["dataPoints"][f]["x"];
                            var j = myJSONObject["dataPoints"][f]["y"]
                            myJSONObject["dataPoints"][f]["x"] = new Date(k);
                            if (j === 0) {
                                myJSONObject["dataPoints"][f]["y"] = null;
                            };
                    };
                    };			
                    setTimeout(function() {
                        var cchart = new CanvasJS.Chart("chartContainer2", {
                        backgroundColor: "transparent",
                        animationEnabled: true,
                            zoomEnabled: true,
                            axisX: {
                                valueFormatString: "MMM YYYY",
                                labelFontColor: "#e6e1d1",
                                lineColor: "#e6e1d1",
                                tickColor: "#e6e1d1",
                            },
                            axisY2: {
                                suffix: "%",
                                labelFontColor: "#e6e1d1",
                                lineColor: "#e6e1d1",
                                tickColor: "#e6e1d1",
                                gridColor: "#e6e1d1",
                            },
                            toolTip: {
                                shared: true
                            },
                            legend: {
                                fontColor: "#99968b",
                            },
                            
                            data: cdata // from ajax
                        });   
                    cchart.render();
                    }, 100);
                $("#loading").remove(); 
                
            };  
        },2000, 90000);                    
        };
});
