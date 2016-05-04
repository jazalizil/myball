/**
 * Created by jazalizil on 19/04/2016.
 */

(function () {
  'use strict';
  angular.module('myBall')
    .controller('DashboardController', DashboardController);
  /** @ngInject */
  function DashboardController(UserService, $scope, MatchesService, gettextCatalog, $log) {
    var vm = this;
    vm.data = {
      identity: UserService.getIdentity()
    };

    var initChart = function() {
      //This is not a highcharts object. It just looks a little like one!
      vm.data.chartConfig = {
        credits: {
          href: 'http://www.weball.fr',
          text: 'weBall ©'
        },
        chart: {
          type: 'column',
          backgroundColor: '#1D1D26',
          borderColor: '#000000'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        },
        title: '',
        plotOptions: {
          column: {
            borderColor: '#000000'
          },
          series: {
            stacking: 'normal'
          }
        },
        legend: {
          verticalAlign: 'top',
          align: 'right',
          layout: 'vertical',
          labelFormat: '{name}',
          floating: true
        },
        series: [{
          color: {
            radialGradient: { cx: 0.5, cy: -0.5, r: 1.5 },
            stops: [
              [0, '#fbd249'],
              [1, '#f5a623']
            ]
          },
          name: gettextCatalog.getString('Matchs en attente'),
          data: [1, 2, 4, 1, 5]
        },
        {
          color: {
            radialGradient: { cx: 0.5, cy: -0.5, r: 1.5 },
            stops: [
              [0, '#b4ec51'],
              [1, '#429321']
            ]
          },
          name: gettextCatalog.getString('Matchs complets'),
          data: [10, 15, 12, 8, 7]
        }],
        xAxis: {
          lineColor: '#000000',
          tickWidth: 0,
          currentMin: 0,
          currentMax: 20
        },
        yAxis: {
          gridLineColor: '#000000'
        },
        useHighStocks: false
        // size: {
        //   width: 200,
        //   height: 100
        // }
      };
    };

    var init = function() {
      var params = {};
      params.startDate = new Date(2015, 0, 1);
      params.endDate = new Date(2042, 12, 31);
      $scope.$emit('loading', true);
      MatchesService.fetchAll(params).then(function(res){
        vm.data.matches = res;
        $log.debug(res);
        $scope.$emit('loading', false);
      });
      vm.data.imgs = [{
        src: vm.data.identity.five.photo,
        titles: [vm.data.identity.five.name]
      }];
      initChart();
    };
    init();
  }
})();