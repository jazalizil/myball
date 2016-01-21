describe('controllers', function() {
  var vm;
  vm = void 0;
  beforeEach(module('myBall'));
  beforeEach(inject(function($controller, webDevTec, toastr) {
    spyOn(webDevTec, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);
    spyOn(toastr, 'info').and.callThrough();
    return vm = $controller('MainController');
  }));
  it('should have a timestamp creation date', function() {
    return expect(vm.creationDate).toEqual(jasmine.any(Number));
  });
  it('should define animate class after delaying timeout ', inject(function($timeout) {
    $timeout.flush();
    return expect(vm.classAnimation).toEqual('rubberBand');
  }));
  it('should show a Toastr info and stop animation when invoke showToastr()', inject(function(toastr) {
    vm.showToastr();
    expect(toastr.info).toHaveBeenCalled();
    return expect(vm.classAnimation).toEqual('');
  }));
  return it('should define more than 5 awesome things', function() {
    expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
    return expect(vm.awesomeThings.length === 5).toBeTruthy();
  });
});