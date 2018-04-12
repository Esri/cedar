/* globals global:false */
/* globals AmCharts:false */
import { } from 'jest'
import { fetchSpec, fillInSpec, getPieBalloonText, renderChart } from '../../src/render/render'
import bar from '../../src/specs/bar'
import scatter from '../../src/specs/scatter'
import timeline from '../../src/specs/timeline'
import builtBarSpec from '../data/builtBarSpec'
import * as definitions from '../data/definitions'

describe('Spec gets fetched properly', () => {
  test('fetch spec properly gets spec...', () => {
    const grabbedSpec = fetchSpec('bar')
    expect(grabbedSpec).toEqual(bar)
  })
  test('time is properly converted to timeline', () => {
    const convertedSpec = fetchSpec('time')
    expect(convertedSpec).toEqual(timeline)
  })
  test('bubble is properly converted to scatter', () => {
    const convertedSpec = fetchSpec('bubble')
    expect(convertedSpec).toEqual(scatter)
  })
  test('grouped is properly converted to bar', () => {
    const convertedSpec = fetchSpec('grouped')
    expect(convertedSpec).toEqual(bar)
  })
})

describe('when filling in a bar spec', () => {
  test('it should get filled in properly', () => {
    const definition = definitions.bar
    const spec = fetchSpec(definition.type)
    // we're not testing the data provider here
    spec.dataProvider = builtBarSpec.dataProvider
    const result = fillInSpec(spec, definition)
    expect(result).toEqual(builtBarSpec)
  })
})

describe('when filling in a scatter spec', () => {
  let result
  beforeAll(() => {
    const spec = (scatter as any)
    result = fillInSpec(spec, definitions.scatter)
  })
  test('it should set the graph xField field', () => {
    expect(result.graphs[0].xField).toEqual('TotalPop2015')
  })
  test('it should set the graph yField field', () => {
    expect(result.graphs[0].yField).toEqual('MedianHHIncome2015')
  })
  test('should set x axis title', () => {
    const xAxis = result.valueAxes[0]
    expect(xAxis.title).toEqual('Population')
    expect(xAxis.position).toEqual('bottom')
  })
  test('should set y axis title', () => {
    const yAxis = result.valueAxes[1]
    expect(yAxis.title).toEqual('Median Median Household Income')
    expect(yAxis.position).toEqual('left')
  })
})

describe('when filling in a bubble spec', () => {
  let result
  let definition
  beforeAll(() => {
    const spec = (scatter as any)
    definition = definitions.scatter
    // turn this into a bubble
    definition.series[0].size = { field: 'Not_Taught', label: 'Number not Taught' }
    definition.legend = {
      position: 'left'
    }
    result = fillInSpec(spec, definition)
  })
  test('it should set value field', () => {
    expect(result.graphs[0].valueField = definition.series[0].size.field)
  })
  test('it should have only updated legend position, not visibility', () => {
    expect(result.legend.enabled).toBe(false)
  })
  afterAll(() => {
    // clean up
    delete definition.series[0].size
    delete definition.legend
  })
})

describe('when filling in a stacked bar spec', () => {
  let result
  let definition
  beforeAll(() => {
    definition = definitions.barJoined
    const spec = fetchSpec(definition.type)
    result = fillInSpec(spec, definition)
  })
  test('it should set category field', () => {
    expect(result.categoryField).toEqual('categoryField')
  })
  test('it should set graph stack and value field properties', () => {
    expect(result.graphs.length).toEqual(3)
    result.graphs.forEach((graph, i) => {
      expect(graph.newStack).toBe(false)
      expect(graph.valueField).toEqual(`${definition.series[i].source}_Number_of_SUM`)
    })
  })
  test('it should disable legend if passed in by definition', () => {
    expect(result.legend.enabled).toBe(false)
  })
})

describe('when overriding legend defaults', () => {
  let result
  let definition
  beforeAll(() => {
    definition = definitions.bar
    definition.legend = {
      visible: true,
      position: 'right'
    }
    const spec = fetchSpec(definition.type)
    result = fillInSpec(spec, definition)
  })
  test('Legend should be true if visible: true passed in', () => {
    expect(result.legend.enabled).toBe(true)
  })
  test('Legend position should be right when position: right is passed in', () => {
    expect(result.legend.position).toEqual('right')
  })
  afterAll(() => {
    // clean up
    delete definition.legend
  })
})

describe('when filling in a line spec', () => {
  let result
  beforeAll(() => {
    const definition = definitions.line
    const spec = fetchSpec(definition.type)
    result = fillInSpec(spec, definitions.line)
  })
  test('should have graphed the series', () => {
    /* tslint:disable quotemark object-literal-key-quotes */
    const expected = [{"balloonText": "Minor Injuries [[EXPR_1]]: <b>[[MINORINJURIES_SUM]]</b>", "bullet": "circle", "bulletAlpha": 1, "bulletBorderAlpha": 0.8, "bulletBorderThickness": 0, "dashLengthField": "dashLengthLine", "fillAlphas": 0, "title": "Minor Injuries", "useLineColorForBulletBorder": true, "valueField": "MINORINJURIES_SUM"}]
    /* tslint:enable */
    expect(result.graphs).toEqual(expected)
  })
})

describe('when filling in a pie spec', () => {
  let result
  beforeAll(() => {
    const definition = definitions.pie
    const spec = fetchSpec(definition.type)
    result = fillInSpec(spec, definition)
  })
  test('it should set type', () => {
    expect(result.type).toEqual('pie')
  })
  test('it should set title field', () => {
    expect(result.titleField).toEqual('Type')
  })
  test('it should set value field', () => {
    expect(result.valueField).toEqual('Number_of_SUM')
  })
})

describe('When rendering a pie chart', () => {
  beforeEach(() => {
    // @ts-ignore global
    global.AmCharts = {
      makeChart: jest.fn().mockReturnValue({
        balloonText: undefined
      })
    }
  })
  test('balloonText should be properly filled in', () => {
    const chart = renderChart('blah', definitions.pie, [])
    expect(chart.balloonText).toEqual('Type: [[title]] [[percents]]% (Number of Students [[value]])')
  })
  test('It should handle missing category labels', () => {
    const chart = renderChart('blah', definitions.pieMissingLabels, [])
    expect(chart.balloonText).toEqual('[[title]] [[percents]]% ([[value]])')
  })
  afterEach(() => {
    // clean up
    // @ts-ignore global
    delete global.AmCharts
  })
})

describe('when passed an interim (v0.9.x) bar definition', () => {
  let result
  beforeAll(() => {
    const definition = definitions.barInterim
    const spec = fetchSpec(definition.type)
    result = fillInSpec(spec, definition)
  })
  test('should use series category field ', () => {
    expect(result.categoryField).toEqual('Type')
  })
  test('single series chart should be disabled by default', () => {
    expect(result.legend.enabled).toEqual(false)
  })
  test('should set x axis', () => {
    expect(result.categoryAxis.title).toEqual('Facility Use')
  })
  test('should set y axis', () => {
    const yAxis = result.valueAxes[0]
    expect(yAxis.title).toEqual('Total Students')
    expect(yAxis.position).toEqual('left')
  })
})

describe('when passed an interim (v0.9.x) scatter definition', () => {
  let result
  beforeAll(() => {
    const spec = (scatter as any)
    result = fillInSpec(spec, definitions.scatterInterim)
  })
  test('should use series category field ', () => {
    expect(result.categoryField).toEqual('Number_of')
  })
  test('single series chart should have legend disabled by default', () => {
    expect(result.legend.enabled).toEqual(false)
  })
  test('should set x axis', () => {
    const xAxis = result.valueAxes[0]
    expect(xAxis.position).toEqual('bottom')
    expect(xAxis.title).toEqual('Student Enrollment (2008)')
  })
  test('should set y axis', () => {
    const yAxis = result.valueAxes[1]
    expect(yAxis.position).toEqual('left')
    expect(yAxis.title).toEqual('Fraction of Teachers')
  })
})

describe('when rendering a chart', () => {
  describe('bar chart', () => {
    beforeEach(() => {
      // @ts-ignore global
      global.AmCharts = {
        makeChart: jest.fn()
      }
    })
    describe('when passing a definition w/ overrides', () => {
      let expected
      let tempBalloonText
      beforeAll(() => {
        // add expected overrides to built bar spec
        expected = (builtBarSpec as any)
        expected.categoryAxis.labelRotation = -45
        tempBalloonText = expected.graphs[0].balloonText
        expected.graphs[0].balloonText = '[[categoryField]]: <b>[[Number_of_SUM]]</b>'
      })
      test('it calls makeChart with the correct arguments', () => {
        renderChart('blah', definitions.bar, builtBarSpec.dataProvider)
        // @ts-ignore global
        const makeChartArgs = global.AmCharts.makeChart.mock.calls[0]
        expect(makeChartArgs[0]).toBe('blah')
        expect(makeChartArgs[1]).toEqual(builtBarSpec)
      })
      afterAll(() => {
        // clean up
        delete expected.categoryAxis.labelRotation
        expected.graphs[0].balloonText = tempBalloonText
      })
    })
    describe('when passing a definition w/ a specification', () => {
      test('it calls makeChart with the correct arguments', () => {
        const definition = definitions.specification
        const expected = {
          dataProvider: [],
          ...definition.specification
        }
        renderChart('blah', definition, [])
        // @ts-ignore global
        const makeChartArgs = global.AmCharts.makeChart.mock.calls[0]
        expect(makeChartArgs[0]).toBe('blah')
        expect(makeChartArgs[1]).toEqual(expected)
      })
    })
    describe('when passing a custom definition w/ a specification', () => {
      test('it calls makeChart with the correct arguments', () => {
        const definition = definitions.custom
        renderChart('blah', definition)
        // @ts-ignore global
        const makeChartArgs = global.AmCharts.makeChart.mock.calls[0]
        expect(makeChartArgs[0]).toBe('blah')
        expect(makeChartArgs[1]).toBe(definition.specification)
      })
    })
    afterEach(() => {
      // clean up
      // @ts-ignore global
      delete global.AmCharts
    })
  })
})
