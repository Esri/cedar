import * as d3 from 'd3';
import { mixin } from './utils';
import { defaultQuery } from './specUtils';

/**
 * Takes in params, iterates over them, encodes and returns stringified and encoded query
 *
 * @param {object} params - merged default and user defined parameters
 *
 * @returns {string} - stringified and encoded query
 */
function serializeQueryParams(params) {
  const str = [];
  for (const param in params) {
    if(params.hasOwnProperty(param)) {
      let val = params[param];
      if (typeof val !== "string") {
        val = JSON.stringify(val);
      }
      str.push(`${encodeURIComponent(param)}=${encodeURIComponent(val)}`);
    }
  }
  const queryString = str.join("&");
  return queryString;
}

/**
 * Helper function to request JSON from a url
 * @param  {string}   url      URL to request from
 * @param  {Function} callback Callback function
 * @param  {number}   timeout  Timeout on request
 * @return {object}            Response object
 */
export function getJson(url, callback, timeout) {
  const cb = (err, data) => {
    // if timeout error then return a timeout error
    if (err && err.response === '') {
      callback(new Error('This service is taking too long to respond, unable to chart'));
    } else if (err) {
      // Other errors return generic error.
      callback(new Error(`Error loading ${url} with a response of: ${err.message}`));
    } else {
      callback(null, JSON.parse(data.responseText));
    }
  };
  if (url.length > 2000) {
    const uri = url.split('?');
    d3.xhr(uri[0])
      .on('beforesend', (xhr) => { xhr.timeout = timeout; xhr.ontimeout = xhr.onload; })
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .post(uri[1], cb);
  } else {
    d3.xhr(url)
      .on('beforesend', (xhr) => { xhr.timeout = timeout; xhr.ontimeout = xhr.onload; })
      .get(cb);
  }
}

/**
 * Given a dataset hash create a feature service request
 * @param  {object} dataset       Dataset object
 * @param  {object} queryFromSpec Query passed in by the user
 * @return {string}               url string
 */
export function createFeatureServiceRequest(dataset, queryFromSpec) {
  const mergedQuery = mixin({}, defaultQuery(), queryFromSpec);

  // Handle bbox
  if (!!mergedQuery.bbox) {
    // make sure a geometry was not also passed in
    if (!!mergedQuery.geometry) {
      throw new Error('Dataset.query can not have both a geometry and a bbox specified');
    }
    // Get the bbox (w,s,e,n)
    const bboxArr = mergedQuery.bbox.split(',');

    // Remove it so it's not serialized as-is
    delete mergedQuery.bbox;

    // cook it into a json string
    mergedQuery.geometry = JSON.stringify({
      xmin: bboxArr[0],
      ymin: bboxArr[2],
      xmax: bboxArr[1],
      ymax: bboxArr[3]
    });
    // set spatial ref as geographic
    mergedQuery.inSR = '4326';
  }

  if (!mergedQuery.groupByFieldsForStatistics && !!dataset.mappings.group) {
    mergedQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  if (!mergedQuery.outStatistics && !!dataset.mappings.count) {
    // TODO Why are we explicitlystating _SUM as a stats type?
    mergedQuery.orderByFields = `${dataset.mappings.count.field}_SUM`;
    mergedQuery.outStatistics = JSON.stringify([{
      statisticType: 'sum',
      onStatisticField: dataset.mappings.count.field,
      outStatisticFieldName: `${dataset.mappings.count.field}_SUM`
    }]);
  }



    //iterate the mappings keys to check for sort
    //-----------------------------------------------------------------
    //This approach would seem 'clean' but if there are multiple fields
    //to sort by, the order would be determined by how javascript decides to
    //iterate the mappings property hash.
    //Thus, using mappings.sort gives the developer explicit control
    //-----------------------------------------------------------------
    // var sort = [];
    // for (var property in dataset.mappings) {
    //   if (dataset.mappings.hasOwnProperty(property)) {
    //     if(dataset.mappings[property].sort){
    //       //ok - build up the sort
    //       sort.push(dataset.mappings[property].field + ' ' + dataset.mappings[property].sort);
    //     }
    //   }
    // }
    // if(sort.length > 0){
    //   mergedQuery.orderByFields = sort.join(',');
    // }
    //-----------------------------------------------------------------
    //check for a sort passed directly in
  if (!!dataset.mappings.sort) {
    mergedQuery.orderByFields = dataset.mappings.sort;
  }

  let url = `${dataset.url}/query?${serializeQueryParams(mergedQuery)}`;

  if (!!dataset.token) {
    url = `${url}&token=${dataset.token}`;
  }

  return url;
}

const requestUtils = {
  getJson,
  createFeatureServiceRequest
};

export default requestUtils;
