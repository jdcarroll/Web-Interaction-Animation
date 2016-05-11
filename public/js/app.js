if (!Modernizr.canvas) {
    alert("This browser does not supports HTML5 canvas! please use a browser that does");
}


angular.module("netWork", ["ngRoute"])
    .config(function($routeProvider){
        $routeProvider
            .when("/",{
                templateUrl: "views/home.html",
                controller: "homeController"
            })
            .when("/new", {
                templateUrl: "views/form.html",
                controller: "formController"
            })
            .when("/edit/:itemIdx", {
                templateUrl: "views/form.html",
                controller: "editController"
            })
            .when("/list", {
                templateUrl: "views/list.html",
                controller: "listController"
            })
            .when("/details/:detailsIdx", {
                templateUrl: "views/details.html",
                controller: "detailsController"
            })
            .otherwise({
                redirectTo: "/list"
            })
    }).controller("navController", function(){

    })
    .controller("homeController", function($scope, networkService){




    })
    .controller("formController", function($scope, networkService){
        $scope.device = {};

        $scope.onSave = function(){
            networkService.addComputer($scope.device);

            $scope.device = {}

            document.location.hash = "/list"

        }

    })
    .controller("editController", function($scope, networkService, $routeParams){
        d3.select('button').html("edit Item")

        var editIdx = $routeParams.itemIdx

        $scope.device = networkService.getDeviceAt(editIdx)

        $scope.onSave = function(){
            networkService.editDevice($scope.device, editIdx)




            document.location.hash = "/list"
        }



    })
    .controller("listController", function($scope, networkService){

        $scope.deviceArray = networkService.getDevices()

        $scope.removeItemAt = function(idx){

            console.log('hello')

            console.log("ran idx: " + idx)

            networkService.removeItem(idx);

            //canvas.transition().style("margin-top", 50 +'px');

            message.style("height", 0)
                .transition().duration(500)
                .style("height", realheight)
                .style("padding", '5px')
                .select('.wrapper p')
                .transition().duration(500)
                .text(messageText)
                .style('padding', '0px');

            message.select('.wrapper a')
                .transition().duration(500)
                .text('x');



//

        }

        function lineGraph() {
            var canvas= document.getElementById("canvas");
            var ctx = canvas.getContext("2d");



            var lineChartData = {
                labels : ["January","February","March","April","May","June"],
                datasets : [{
                    fillColor : "rgba(253,138,37,0.5)",
                    strokeColor : "rgba(253,138,37,1)",
                    pointColor : "rgba(253,138,37,1)",
                    pointStrokeColor : "#fff",
                    data: [34,24,32,26,18,39,4]
                },
                    {
                        fillColor : "rgba(3,40,85,0.7)",
                        strokeColor : "rgba(3,40,85,1)",
                        pointColor : "rgba(3,40,85,1)",
                        pointStrokeColor : "#fff",
                        data: [10,20,15,23,12,9,28]
                    }

                ]
            }

            var options = {
                onAnimationComplete: done
                //responsive: true
            }



            var myLine = new Chart(ctx).Line(lineChartData, options);

            function done(){

                var dataURL = canvas.toDataURL();
                //document.querySelector('#canvasImg').src = dataURL;
                //$('#canvas').hide()

            }

        }
        lineGraph()

        var message = d3.select("#notification");

        var messageText = 'Device Removed';



        var realheight = 30 + 'px';

    })
    .controller("detailsController", function($scope, networkService, $routeParams){
        var detailsIdx = $routeParams.detailsIdx;

        $scope.device = networkService.getDeviceAt(detailsIdx);

        networkService.createChart();



    })
    .service("networkService", function(){

        var deviceArray = [{
            name :'JDC-Mac',
            type :'MacBookPro',
            Ip : '10.2.0.34',
            Mac : 'ac:cd:ef:gh:jk',
            connect: 'Wireless'
        }];

        this.addComputer = function(pitem){

            deviceArray.push(pitem);

            var str = JSON.stringify(deviceArray);

            localStorage.setItem('network', str)

        }

        this.getDevices = function(){
            var str = localStorage.getItem('network');
            deviceArray = JSON.parse(str) || deviceArray;
            return deviceArray
        }

        this.removeItem = function(pitem){

            deviceArray.splice(pitem,1);

            var str = JSON.stringify(deviceArray);

            localStorage.setItem('network', str)
        }

        this.getDeviceAt = function(pidx){
            var devices = this.getDevices();
            return devices[pidx];
        }

        this.editDevice = function(pitem, pidx){

            deviceArray.splice(pidx,1,pitem);

            console.log(deviceArray);

            var str = JSON.stringify(deviceArray);

            localStorage.setItem('network', str);
        };

        this.createChart = function() {
            var bardata   = [];
            for (var i = 0; i < 24; i++){
                bardata.push(Math.round(Math.random()*25)+5)
            }

//            bardata.sort(function CompareNumbers(a, b){
//                return a - b;
//            })

            var margin = {
                top: 30,
                right: 30,
                bottom: 40,
                left: 50
            }

            var height    = 270 - margin.top - margin.bottom,
                width     = 480 - margin.right - margin.left;

            var colors = d3.scale.linear()
                .domain([0, bardata.length *.33, bardata.length *.66, bardata.length])
                .range(['#B58929','#c61c6F','#268bd2','#85992c']);



            var yScale = d3.scale.linear()
                .domain([0, d3.max(bardata)])
                .range([0, height]);

            var xScale = d3.scale.ordinal()
                .domain(d3.range(0, bardata.length))
                .rangeBands([0, width],.5)

            var tooltip = d3.select('body').append('div')
                .style('position','absolute')
                .style('padding','0 10px')
                .style('background','white')
                .style('opacity','0')

            var myChart = d3.select('#chart').append('svg')

                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate('+ margin.left + ',' + margin.top +')')
                .selectAll('rect').data(bardata)
                .enter().append('rect')
                .style('fill', function(d,i){
                    return colors(i)
                })
                .attr('width', xScale.rangeBand())

                .attr('x', function(d,i){
                    return xScale(i)
                })
                .attr('height', 0)
                .attr('y', height)
                .on('mouseover', function(d){

                    tooltip.transition()
                        .style('opacity',.9)

                    tooltip.html(d)
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY) + 'px')

                    d3.select(this)
                        .transition()
                        .style('opacity',.5)
                })
                .on('mouseout', function(d){
                    d3.select(this)
                        .transition()
                        .style('opacity', 1)
                })

            myChart.transition()
                .attr('height', function(d){
                    return yScale(d)
                })
                .attr('y', function(d){
                    return height - yScale(d);
                })
                .delay(function(d, i){
                    return i * 20;
                })
                .duration(800)
                .ease('elastic')

                var vGuideScale = d3.scale.linear()
                    .domain([ 0, d3.max(bardata)])
                    .range([height, 0]);

                var vAxis = d3.svg.axis()
                    .scale(vGuideScale)
                    .orient('left')
                    .ticks(7)

                var vGuide = d3.select('svg').append('g')
                    vAxis(vGuide)

                vGuide.attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')

                vGuide.selectAll('path')
                    .style({fill: 'none', stroke: '#000'})
                vGuide.selectAll('line')
                    .style({ stroke: '#000'})

                var hAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickValues(xScale.domain().filter(function(d,i){
                            return !(i % (bardata.length/6));
                        })
                    )
                var hGuide = d3.select('svg').append('g')
                        hAxis(hGuide)
                        hGuide.attr('transform', 'translate('+ margin.left + ',' + (height + margin.top) + ')')
                    hGuide.selectAll('path')
                        .style({fill: 'none', stroke: '#000'});
                    hGuide.selectAll('line')
                        .style({ stroke: '#000'})
        }

    })
