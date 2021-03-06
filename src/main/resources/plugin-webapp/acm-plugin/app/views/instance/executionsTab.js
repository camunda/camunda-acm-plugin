define(['angular'], function(angular) {

  var ExecutionsCtrl = [ '$scope', 'camundaService', function($scope, camundaService) {
    'use strict';

    /*
     * Filter all running executions 
     */
    $scope.filterRunningActivities = function(execution) {
      return execution.activityName != null && execution.active == true;
    };
    
    // retrieve from parent scope
    var caseData = $scope.caseData.newChild($scope);
	
    caseData.observe([ 'executions', function(executions) {
      $scope.caseInstanceExecutions = executions;
      
      console.log($scope.caseInstanceExecutions);
    } ]);

    caseData.provide( 'historyExecutions', ['instance', function(instance) {
      return camundaService.caseHistory(instance.id);
    } ]);

    caseData.observe([ 'historyExecutions', function(historyExecutions) {
      $scope.caseHistoryExecutions = historyExecutions;
    } ]);

    
	// starts execution of a task
	$scope.startExecution = function(caseExecutionId) {
		camundaService.startExecution(caseExecutionId).then(function(result) {
			$scope.ExecutionStartResult = result;
			caseData.changed('executions');
		});
	};
		
	// completes execution of a task
	$scope.completeExecution = function(caseExecutionId) {
		camundaService.completeExecution(caseExecutionId).then(function(result) {
		  caseData.changed('executions');
		});
	};
		
	// opens human task form
	$scope.openTaskForm = function(task) {
		  console.log(task);
	};

  } ];

  var module = angular.module('cockpit.plugin.acm-plugin.views');
  module.config([ 'ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.caseInstance.runtime.tab', {
      id : 'case-steps-table',
      label : 'Task Overview',
      url : 'plugin://acm-plugin/static/app/views/instance/executionsTab.html',
      controller : ExecutionsCtrl,
      priority : 30
    });
  } ]);

  return module;
});