
var Cedar = Cedar || {}

Cedar.chart = function(params) {
  d3.json(params.style + ".json", function(spec) {
    var chart = JSON.stringify(spec).supplant(params);
    Cedar.parse(params.el, JSON.parse(chart));
  });
}
  
Cedar.parse = function(el, spec) {
  vg.parse.spec(spec, function(chart) { console.log(el, spec); chart({el: el}).update(); });
}


String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};
