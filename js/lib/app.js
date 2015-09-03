(function () {

	require.config({ baseUrl: '' });
    require(['src/requirejs.config'],function(){
    require(['vpos'], function (vpos) {
        return vpos;
    });
  });
  
})();