/**
* @esri/cedar - v1.0.0-rc.1 - Fri Dec 21 2018 20:11:16 GMT-0800 (PST)
* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
* Apache-2.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-feature-service')) :
    typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-feature-service'], factory) :
    (factory((global.cedar = {}),global.arcgisRest));
}(this, (function (exports,arcgisRestFeatureService) { 'use strict';

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
        return Array.isArray(val) ? [] : {}
    }

    function cloneIfNecessary(value, optionsArgument) {
        var clone = optionsArgument && optionsArgument.clone === true;
        return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
    }

    function defaultArrayMerge(target, source, optionsArgument) {
        var destination = target.slice();
        source.forEach(function(e, i) {
            if (typeof destination[i] === 'undefined') {
                destination[i] = cloneIfNecessary(e, optionsArgument);
            } else if (isMergeableObject(e)) {
                destination[i] = deepmerge(target[i], e, optionsArgument);
            } else if (target.indexOf(e) === -1) {
                destination.push(cloneIfNecessary(e, optionsArgument));
            }
        });
        return destination
    }

    function mergeObject(target, source, optionsArgument) {
        var destination = {};
        if (isMergeableObject(target)) {
            Object.keys(target).forEach(function(key) {
                destination[key] = cloneIfNecessary(target[key], optionsArgument);
            });
        }
        Object.keys(source).forEach(function(key) {
            if (!isMergeableObject(source[key]) || !target[key]) {
                destination[key] = cloneIfNecessary(source[key], optionsArgument);
            } else {
                destination[key] = deepmerge(target[key], source[key], optionsArgument);
            }
        });
        return destination
    }

    function deepmerge(target, source, optionsArgument) {
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var options = optionsArgument || { arrayMerge: defaultArrayMerge };
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

        if (!sourceAndTargetTypesMatch) {
            return cloneIfNecessary(source, optionsArgument)
        } else if (sourceIsArray) {
            var arrayMerge = options.arrayMerge || defaultArrayMerge;
            return arrayMerge(target, source, optionsArgument)
        } else {
            return mergeObject(target, source, optionsArgument)
        }
    }

    deepmerge.all = function deepmergeAll(array, optionsArgument) {
        if (!Array.isArray(array) || array.length < 2) {
            throw new Error('first argument should be an array with at least two elements')
        }

        // we are sure there are at least 2 values, so it is safe to have no initial value
        return array.reduce(function(prev, next) {
            return deepmerge(prev, next, optionsArgument)
        })
    };

    var deepmerge_1 = deepmerge;

    var area = {
        type: 'serial',
        theme: 'calcite',
        chartCursor: {
            categoryBalloonEnabled: false,
            valueLineBalloonEnabled: true
        },
        graphs: [{
                bullet: 'circle',
                bulletAlpha: 1,
                bulletBorderAlpha: 0.8,
                bulletBorderThickness: 0,
                dashLengthField: 'dashLengthLine',
                fillAlphas: 0.5,
                useLineColorForBulletBorder: true
            }],
        legend: {
            horizontalGap: 10,
            position: 'bottom',
            useGraphSettings: true,
            markerSize: 10
        },
        valueAxes: [{
                stackType: 'regular'
            }],
        export: {
            enabled: true
        }
    };

    var bar = {
        type: 'serial',
        rotate: false,
        theme: 'calcite',
        chartCursor: {
            categoryBalloonEnabled: false
        },
        graphs: [{
                type: 'column',
                newStack: true
            }],
        legend: {
            valueAlign: 'left',
            spacing: 25
        },
        valueAxes: [{
                stackType: 'regular'
            }],
        export: {
            enabled: true
        }
    };

    var barHorizontal = {
        type: 'serial',
        theme: 'calcite',
        rotate: true,
        chartCursor: {
            leaveCursor: true,
            valueLineEnabled: true,
            categoryBalloonEnabled: false
        },
        graphs: [{
                type: 'column',
            }],
        legend: {},
        valueAxes: [{
                gridAlpha: 0.2,
                stackType: 'regular'
            }],
        export: {
            enabled: true
        }
    };

    var line = {
        type: 'serial',
        theme: 'calcite',
        chartCursor: {
            categoryBalloonEnabled: false,
            valueLineBalloonEnabled: true
        },
        graphs: [{
                bullet: 'circle',
                bulletAlpha: 1,
                bulletBorderAlpha: 0.8,
                bulletBorderThickness: 0,
                // bulletColor: '#FFFFFF',
                dashLengthField: 'dashLengthLine',
                fillAlphas: 0,
                useLineColorForBulletBorder: true
            }],
        legend: {
            // horizontalGap: 10,
            position: 'bottom',
            useGraphSettings: true
        },
        export: {
            enabled: true
        }
    };

    var pie = {
        type: 'pie',
        theme: 'calcite',
        innerRadius: '0%',
        startDuration: 0,
        graphs: [{}],
        groupPercent: 5,
        balloon: {
            fixedPosition: true
        },
        legend: {
            enabled: false
        },
        export: {
            enabled: true
        }
    };

    var radar = {
        type: 'radar',
        valueAxes: [{
                gridType: 'circles',
                minimum: 0
            }],
        polarScatter: {
            minimum: 0,
            maximum: 400,
            step: 1
        },
        startDuration: 0,
        graphs: [{ graphFillAlpha: 0 }],
        groupPercent: 5,
        balloon: {
            fixedPosition: true
        },
        legend: {
            position: 'right',
            marginRight: 100,
            autoMargins: false
        },
    };

    var scatter = {
        type: 'xy',
        theme: 'calcite',
        valueAxes: [{
                axisAlpha: 0.8,
                gridAlpha: 0.2,
                position: 'bottom',
            }, {
                axisAlpha: 0.8,
                gridAlpha: 0.2,
                position: 'left'
            }],
        chartScrollbar: {
            scrollbarHeight: 5,
            offset: -1,
            backgroundAlpha: 0.1,
            backgroundColor: '#888888',
            selectedBackgroundColor: '#67b7dc',
            selectedBackgroundAlpha: 1,
            dragIconWidth: 15,
            dragIconHeight: 15,
        },
        chartCursor: {
            categoryBalloonEnabled: true,
            cursorAlpha: 0.3,
            valueLineAlpha: 0.3,
            valueLineBalloonEnabled: true
        },
        graphs: [{
                fillAlphas: 0,
                lineAlpha: 0,
                bullet: 'circle',
                bulletBorderAlpha: 0.2,
                bulletAlpha: 0.8,
                valueField: null,
                xField: null,
                yField: null,
            }],
        export: {
            enabled: true
        }
    };

    var timeline = {
        type: 'serial',
        theme: 'calcite',
        chartCursor: {
            categoryBalloonEnabled: false,
            valueLineBalloonEnabled: true
        },
        graphs: [{
                bullet: 'circle',
                bulletAlpha: 1,
                bulletBorderAlpha: 0.8,
                bulletBorderThickness: 0,
                // bulletColor: '#FFFFFF',
                dashLengthField: 'dashLengthLine',
                fillAlphas: 0,
                useLineColorForBulletBorder: true
            }],
        legend: {
            // horizontalGap: 10,
            position: 'bottom',
            useGraphSettings: true
        },
        categoryAxis: {
            parseDates: true
        },
        export: {
            enabled: true
        }
    };

    var specs = {
        bar: bar,
        'bar-horizontal': barHorizontal,
        line: line,
        area: area,
        pie: pie,
        radar: radar,
        scatter: scatter,
        timeline: timeline
    };

    // TODO: how to have access to IDefinition
    function renderChart(elementId, definition, data) {
        if (definition.type === 'custom') {
            var chart_1 = AmCharts.makeChart(elementId, definition.specification);
            return chart_1;
        }
        // Clone/copy spec and data
        // Longer than normal conditional so setting as its own const
        var hasSpecAndIsntString = definition.specification && typeof definition.specification !== 'string';
        // ternary checking to see if there is a def.spec and that it is NOT a string (url)
        // if true than return def.spec. If not true than fetch a premade spec
        var spec = hasSpecAndIsntString ? clone(definition.specification) : fetchSpec(definition.type);
        var copyData = clone(data);
        // Set the spec's data
        spec.dataProvider = copyData;
        // Apply the series
        if (!!definition.datasets) {
            spec = fillInSpec(spec, definition);
        }
        // Apply overrides
        if (definition.overrides) {
            // NOTE: this counts on using deepmerge < 2.x
            // see: https://github.com/KyleAMathews/deepmerge#arraymerge
            spec = deepmerge_1(spec, definition.overrides, { clone: true });
        }
        var chart = AmCharts.makeChart(elementId, spec);
        // If it is a pie chart
        if (definition.type === 'pie') {
            // Set pie chart balloonText
            chart.balloonText = getPieBalloonText(definition);
        }
        return chart;
    }
    function getPieBalloonText(definition) {
        // Set label based on whether or not there actually is a category label
        var categoryLabel = !!definition.series[0].category.label ? definition.series[0].category.label + ": " : '';
        // Set label based on whether or not there actually is a value label
        var valueLabel = !!definition.series[0].value.label ? definition.series[0].value.label + ": " : '';
        // return balloonText
        return "<div>" + categoryLabel + "[[title]]</div><div>" + valueLabel + "[[percents]]% ([[value]])</div>";
    }
    function fillInSpec(spec, definition) {
        // Grab the graphSpec from the spec
        var graphSpec = spec.graphs.pop();
        var isJoined = definition.datasets.length > 1;
        // category field will be 'categoryField' in the case of joined datasets
        // otherwise get it from the first series
        spec.categoryField = isJoined ? 'categoryField' : definition.series[0].category.field;
        // Add a legend in case it's not on the spec
        if (!spec.legend) {
            spec.legend = {};
        }
        // TODO This is needed as 'legend.enable' has been renamed 'legend.visible'. We are only introducing
        // breaking changes on major releases.
        // Remove the line below on next breaking change
        /* istanbul ignore next since we're going to remove this */
        if (definition.legend && definition.legend.hasOwnProperty('enable')) {
            definition.legend.visible = definition.legend.enable;
        }
        // adjust legend and axis labels for single series charts
        if (definition.series.length === 1 && (definition.type !== 'pie' && definition.type !== 'radar')) {
            // don't show legend by default for single series charts
            spec.legend.enabled = false;
            // get default axis labels from series
            var categoryAxisTitle_1 = definition.series[0].category.label;
            var valueAxisTitle_1 = definition.series[0].value.label;
            if (spec.type === 'xy' && Array.isArray(spec.valueAxes)) {
                // for xy charts we treat the x axis as the category axis
                // and the y axis as the value axis
                spec.valueAxes.forEach(function (axis) {
                    /* istanbul ignore else since we can only be smart about bottom/left axis labels */
                    if (axis.position === 'bottom') {
                        axis.title = categoryAxisTitle_1;
                    }
                    else if (axis.position === 'left') {
                        axis.title = valueAxisTitle_1;
                    }
                });
            }
            else {
                // line/area specs don't define axes
                if (!spec.valueAxes) {
                    spec.valueAxes = [{}];
                }
                spec.valueAxes[0].title = definition.series[0].value.label;
                spec.valueAxes[0].position = 'left';
                /* istanbul ignore else until we have a test for a timeline definition/spec */
                if (!spec.categoryAxis) {
                    spec.categoryAxis = {};
                }
                spec.categoryAxis.title = categoryAxisTitle_1;
            }
        }
        // Handle Legend in case.
        if (definition.legend) {
            var legend = definition.legend;
            var supportedLegendPositions = ['top', 'bottom', 'left', 'right'];
            if (legend.hasOwnProperty('visible')) {
                spec.legend.enabled = legend.visible;
            }
            if (legend.position && supportedLegendPositions.indexOf(legend.position) > -1) {
                spec.legend.position = legend.position;
            }
        }
        // Handle styles...
        /* istanbul ignore if */
        if (definition.style) {
            // snag out style
            var style = definition.style;
            // handle margins
            /* istanbul ignore if */
            if (style.padding) {
                var padding = style.padding;
                // Assume we need to set auto margins false
                spec.autoMargins = false;
                if (padding.hasOwnProperty('top')) {
                    spec.marginTop = padding.top;
                }
                if (padding.hasOwnProperty('bottom')) {
                    spec.marginBottom = padding.bottom;
                }
                if (padding.hasOwnProperty('left')) {
                    spec.marginLeft = padding.left;
                }
                if (padding.hasOwnProperty('right')) {
                    spec.marginRight = padding.right;
                }
            }
            // If there is a pie property
            /* istanbul ignore if */
            if (style.pie) {
                var pie = style.pie;
                // A range from 0 - n where n is the inner radius of the pie chart. Anything above a 0
                // turns the chart into a donut chart. Can be a number for pixels or a percent.
                if (pie.hasOwnProperty('innerRadius')) {
                    spec.innerRadius = pie.innerRadius;
                }
                // How far a pie chart slice will pull out when selected. Can be a number for pixels or a percent
                if (pie.hasOwnProperty('expand')) {
                    spec.pullOutRadius = pie.expand;
                }
            }
            if (style.colors && Array.isArray(style.colors)) {
                spec.colors = style.colors;
            }
        }
        // Iterate over datasets
        definition.datasets.forEach(function (dataset, d) {
            var datasetName = dataset.name;
            // For each dataset iterate over series
            definition.series.forEach(function (series, s) {
                if (dataset.name === series.source) {
                    var graph = clone(graphSpec);
                    // use the value field label for the graph's title
                    graph.title = series.value.label;
                    // value field will contain dataset name if joined
                    graph.valueField = isJoined ? datasetName + "_" + series.value.field : series.value.field;
                    // TODO: map other fields besides value like color, size, etc
                    // tooltip
                    graph.balloonText = "<div>" + series.category.label + ": [[" + spec.categoryField + "]]</div><div>" + graph.title + ": [[" + graph.valueField + "]]</div>";
                    // Group vs. stack
                    if (!!series.stack && graph.newStack) {
                        graph.newStack = false;
                    }
                    // special props for pie charts
                    if (definition.type === 'pie') {
                        spec.titleField = spec.categoryField;
                        spec.valueField = graph.valueField;
                    }
                    // special props for x/y types (scatter, bubble)
                    if (spec.type === 'xy' && !!series.category && !!series.value) {
                        graph.xField = series.category.field;
                        graph.yField = series.value.field;
                        graph.balloonText = "<div>" + series.category.label + ": [[" + series.category.field + "]]</div><div>" + series.value.label + ": [[" + series.value.field + "]]</div>";
                        // bubble
                        if (spec.type === 'xy' && series.size) {
                            graph.valueField = series.size.field;
                            graph.balloonText = graph.balloonText + "<div>" + series.size.label + ": [[" + graph.valueField + "]]</div>";
                        }
                        else {
                            delete graph.valueField;
                        }
                    }
                    spec.graphs.push(graph);
                }
            });
        });
        return spec;
    }
    function fetchSpec(type) {
        var spec = type;
        if (spec === 'time') {
            console.warn("'time' is no longer a supported type. Please use 'timeline' instead");
            spec = 'timeline';
        }
        else if (spec === 'bubble') {
            console.warn("'bubble' is no longer a supported type. Please use 'scatter' instead");
            spec = 'scatter';
        }
        else if (spec === 'grouped') {
            console.warn("'grouped' is no longer a supported type. Please use 'bar' instead");
            spec = 'bar';
        }
        return clone(specs[spec]);
    }
    function clone(json) {
        return JSON.parse(JSON.stringify(json));
    }
    // TODO: remove
    var render = {
        renderChart: renderChart,
        fillInSpec: fillInSpec,
        fetchSpec: fetchSpec
    };

    function cedarAmCharts(elementId, definition, data) {
        if ((!elementId || !definition || !data) && (definition.type && definition.type !== 'custom')) {
            var err = new Error('Element Id, definition, and data are all required.');
            throw err;
        }
        if (definition.type && definition.type === 'custom') {
            return render.renderChart(elementId, definition);
        }
        return render.renderChart(elementId, definition, data);
    }

    // if it's a feature set, return the array of features
    // otherwise just return the array of objects that was passed in
    function getFeatures(data) {
        return data.features ? data.features : data;
    }
    // if it's a feature, return the attributes
    // otherwise return the entire object that was passed in
    function getAttributes(row) {
        /* istanbul ignore else since that only happens when features are mixed with rows */
        if (row.attributes) {
            return row.attributes;
        }
        else {
            return row;
        }
    }
    // get an array of value field names from a dataset's series
    function getDatasetValueFields(datasetName, series) {
        return series.reduce(function (fields, s) {
            if (s.source === datasetName && s.value) {
                fields.push(s.value.field);
            }
            return fields;
        }, []);
    }
    // get a unique field (property) name for a dataset/value field
    function getDatasetValueFieldName(datasetName, valueField) {
        return datasetName + "_" + valueField;
    }
    function getDatasetData(dataset, datasetsData, name) {
        var datasetName = dataset.name || name;
        return dataset.data || datasetsData[datasetName];
    }
    // if data is a feature set or array of features
    // return only the attributes for each feature
    function flattenData(data) {
        var features = getFeatures(data);
        if (features.length > 0 && features[0].attributes) {
            // these really are features, flatten them before
            return features.map(getAttributes);
        }
        else {
            // assume this is an array of objects and don't
            return features;
        }
    }
    // join data from multiple datasets into a single table
    function joinData(datasets, series, datasetsData) {
        // first build a hash whose keys for each of the
        // unique values in the join columns of the datasets
        // and the value of each is a row with the joined values
        var hashTable = datasets.reduce(function (index, dataset, i) {
            // get the attribute that this dataset will be joined on
            var joinKey = dataset.join;
            // TODO: what if no joinKey, throw error? skip this dataset?
            // if dataset doesn't have inline data use data that was passed in
            var datasetData = getDatasetData(dataset, datasetsData);
            // TODO: what if no datasetData, throw error? skip this dataset?
            // get the value fields for this dataset from it's series
            var datasetName = dataset.name;
            var valueFields = getDatasetValueFields(datasetName, series);
            // TODO: what if no valueFields, throw error? skip this dataset?
            getFeatures(datasetData).forEach(function (feature) {
                // get the value of the column that this dataset should be joined on
                var attrs = getAttributes(feature);
                var joinValue = attrs[joinKey];
                // start a new row for this value if there isn't one already
                if (index[joinValue] === undefined) {
                    // use this value for the categoryField
                    index[joinValue] = { categoryField: joinValue };
                }
                // get the remaining values for this row
                valueFields.reduce(function (row, valueField) {
                    // add a property to the row for this dataset and value field
                    row[getDatasetValueFieldName(datasetName, valueField)] = attrs[valueField];
                    // valueFields.splice(i, 1)
                    return row;
                }, index[joinValue]);
            });
            return index;
        }, {});
        // return the rows of joined values from the hash table
        return Object.keys(hashTable).map(function (key) { return hashTable[key]; });
    }
    // flatten data from all datasets into a single table
    function getChartData(datasets, options) {
        if (!datasets) {
            return;
        }
        if (datasets.length < 1) {
            return [];
        }
        var datasetsData = options && options.datasetsData;
        if (datasets.length > 1) {
            // TODO: what if no series? throw error?
            var series = options && options.series;
            // TODO: support other ways of merging (append, etc), but for now just
            // join the feature sets into a single table
            return joinData(datasets, series, datasetsData);
        }
        // just flatten the feature set into a table
        // TODO: make name required on datasets, or required if > 1 dataset?
        var datasetData = getDatasetData(datasets[0], datasetsData, 'dataset0');
        return flattenData(datasetData);
    }

    var config = {
        fetch: undefined
    };

    function defaultQuery() {
        return {
            where: '1=1',
            returnGeometry: false,
            returnDistinctValues: false,
            returnIdsOnly: false,
            returnCountOnly: false,
            outFields: '*',
            sqlFormat: 'standard',
            f: 'json'
        };
    }
    function createQueryParams(query) {
        if (query === void 0) { query = {}; }
        // start w/ default query params
        var queryParams = defaultQuery();
        // Handle bbox
        if (query.bbox) {
            // make sure a geometry was not also passed in
            if (query.geometry) {
                throw new Error('Dataset.query can not have both a geometry and a bbox specified');
            }
            // Get the bbox (w,s,e,n)
            var bboxArr = query.bbox.split(',');
            // Remove it so it's not serialized as-is
            delete query.bbox;
            // cook it into a json string
            query.geometry = JSON.stringify({
                xmin: Number(bboxArr[0]),
                ymin: Number(bboxArr[1]),
                xmax: Number(bboxArr[2]),
                ymax: Number(bboxArr[3])
            });
            // set spatial ref as geographic
            query.inSR = '4326';
        }
        // override defaults w/ params that were passed in
        Object.keys(query).reduce(function (params, key) {
            var param = query[key];
            queryParams[key] = typeof param === 'object' ? JSON.stringify(param) : param;
            return params;
        }, queryParams);
        return queryParams;
    }

    function queryDatasets(datasets) {
        var names = [];
        var requests = [];
        if (datasets) {
            datasets.forEach(function (dataset, i) {
                // only query datasets that don't have inline data
                if (dataset.url) {
                    // TODO: make name required on datasets, or required if > 1 dataset?
                    names.push(dataset.name || "dataset" + i);
                    var queryParams = createQueryParams(dataset.query);
                    var options_1 = {
                        url: dataset.url,
                        params: queryParams
                    };
                    requests.push(arcgisRestFeatureService.queryFeatures(options_1)
                        .then(function (queryResponse) {
                        var domains = dataset.domains;
                        var fields = domains && Object.keys(domains).map(function (name) { return ({ name: name, domain: domains[name] }); });
                        // for now, we only decode CVDs when an array of fields is passed describing codes and names
                        if (fields && fields.length > 0) {
                            var decodeOptions = {
                                url: options_1.url,
                                queryResponse: queryResponse,
                                // TODO: decodeValues() should take `domains?: IDomains` as an alternative to `fields?: IField[]`
                                fields: fields,
                                fetch: config.fetch
                            };
                            return arcgisRestFeatureService.decodeValues(decodeOptions);
                        }
                        else {
                            return queryResponse;
                        }
                    }));
                }
            });
        }
        return Promise.all(requests)
            .then(function (responses) {
            // turn the array of responses into a hash keyed off the dataset names
            var responseHash = responses.reduce(function (hash, response, i) {
                hash[names[i]] = response;
                return hash;
            }, {});
            return Promise.resolve(responseHash);
        });
    }

    function clone$1(json) {
        return JSON.parse(JSON.stringify(json));
    }
    /**
     * An instance of a cedar chart that will be rendered at a given DOM node (container).
     */
    var Chart = /** @class */ (function () {
        /**
         *
         * @param container The DOM node where the chart will be rendered
         * @param definition Defines how the data will be rendered in the chart
         */
        function Chart(container, definition) {
            if (!container) {
                throw new Error('A container is required');
            }
            this._container = container;
            if (definition) {
                // set the definition
                this.definition(clone$1(definition));
            }
        }
        Chart.prototype.definition = function (newDefinition) {
            if (newDefinition === undefined) {
                return this._definition;
            }
            else {
                this._definition = newDefinition;
                return this;
            }
        };
        Chart.prototype.datasets = function (newDatasets) {
            return this._definitionAccessor('datasets', newDatasets);
        };
        Chart.prototype.series = function (newSeries) {
            return this._definitionAccessor('series', newSeries);
        };
        Chart.prototype.type = function (newType) {
            return this._definitionAccessor('type', newType);
        };
        Chart.prototype.specification = function (newSpecification) {
            return this._definitionAccessor('specification', newSpecification);
        };
        Chart.prototype.overrides = function (newOverrides) {
            return this._definitionAccessor('overrides', newOverrides);
        };
        Chart.prototype.legend = function (newLegend) {
            return this._definitionAccessor('legend', newLegend);
        };
        /**
         * Get the chart's styles
         */
        Chart.prototype.style = function (newStyle) {
            return this._definitionAccessor('style', newStyle);
        };
        /**
         * Get the internal copy of the data used to render the chart
         */
        Chart.prototype.data = function () {
            return this._data;
        };
        /**
         * Get a dataset from the definition by name
         * @param datasetName The name of the dataset to get
         */
        Chart.prototype.dataset = function (datasetName) {
            var datasets = this.datasets();
            var match;
            if (datasets) {
                datasets.some(function (dataset) {
                    if (dataset.name === datasetName) {
                        match = dataset;
                        return true;
                    }
                });
            }
            return match;
        };
        /**
         * Query data for all non-inline datasets
         */
        Chart.prototype.query = function () {
            return queryDatasets(this.datasets());
        };
        // update chart from inline data and query responses
        Chart.prototype.updateData = function (datasetsData) {
            var datasets = this.datasets();
            var options = {
                datasetsData: datasetsData,
                series: this.series()
            };
            this._data = getChartData(datasets, options);
            return this;
        };
        /**
         * Re-draw the chart based on the current data and definition
         */
        Chart.prototype.render = function () {
            cedarAmCharts(this._container, this.definition(), this.data());
            return this;
        };
        /**
         * Execute the query(), updateData(), and render() functions
         */
        Chart.prototype.show = function () {
            var _this = this;
            return this.query()
                .then(function (response) {
                return _this.updateData(response).render();
            });
        };
        // implementation for all setters/getters for definition properties
        Chart.prototype._definitionAccessor = function (propertyName, newPropertyValue) {
            var definition = this._definition;
            if (newPropertyValue === undefined) {
                return definition ? definition[propertyName] : undefined;
            }
            else {
                if (definition) {
                    definition[propertyName] = newPropertyValue;
                    return this;
                }
                else {
                    var newDefinition = {};
                    newDefinition[propertyName] = newPropertyValue;
                    return this.definition(newDefinition);
                }
            }
        };
        return Chart;
    }());

    /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
     * Apache-2.0 */

    exports.Chart = Chart;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cedar.js.map
