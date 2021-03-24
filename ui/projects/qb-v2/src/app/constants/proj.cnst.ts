const apiMapping = {
    GET_INDEXES: 'getIndices',
    GET_ATTRIBUTES_FOR_INDEX: 'mapping/REPLACE_WITH_INDEX',
    GET_OPTIONS_FOR_ATTRIBUTE: 'getValuesOfAttribute/REPLACE_WITH_INDEX/ATTRIBUTE',
    GET_QUERY: 'getData',
    GET_EXCEL: 'getFile'
}

const RequestFormat = {
  "index": "REPLACE_WITH_INDEX",
  "from": 0,
  "size": 0, //todo size has to change in future
  "source":"REPLACE_WITH_ATTRIBUTES_SELECTED_TO_BE_DISPLAYED_WITH_~",
  "match": {},
  "boolMatch": {},
  "intMatch": {},
  "rangeQuerySet": {},
  "term": {},
  "terms": {},
  "stringTerm":{},
  "termsString": {},
  "aggregateQueryMap": {}
}

const aggregateFormat = {
  "1": {
    "size": 10000,
    "termsQuery": {
      "terms": {},
      "script": {}
    },
    "sumQuery": {
      "terms": {},
      "script": {}
    },
    "filterQuery": {
      "terms": {},
      "script": {}
    }
  }
}

const toastrCnst = {
    closeButton : true,
    timeOut : 3000,
    extendedTimeOut : 2000
};

const locationKeys = [
  'entityType'
]

const hie = {
  geo: [
    {level: 'state', attribute: 'state'}, 
    {level: 'district', attribute: 'district'}, 
    {level: 'mandal', attribute: 'mandal'}, 
    {level: 'college', attribute: 'college'}, 
    {level: 'student', attribute: 'student'}
  ]
}

export const QBV2Cnst = {
    BASE_URL: 'http://192.168.1.249:9999/es/',
    // BASE_URL:  'http://aba2cc94.ngrok.io/es/',
    API_MAPPING: apiMapping,
    TOASTR_CNST: toastrCnst,
    REQUEST_FORMAT: RequestFormat,
    AGGREGATE_FORMAT: aggregateFormat,
    HIE: hie,
    locationKeys: locationKeys
}
