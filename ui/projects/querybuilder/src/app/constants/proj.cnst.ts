const apiMapping = {
    GET_INDEXES: 'getIndices',
    GET_ATTRIBUTES_FOR_INDEX: 'mapping/REPLACE_WITH_INDEX',
    GET_OPTIONS_FOR_ATTRIBUTE: 'getValuesOfAttribute/REPLACE_WITH_INDEX/ATTRIBUTE',
    GET_QUERY: 'getData'
}

const RequestFormat = {
  "index": "REPLACE_WITH_INDEX",
  "from": 0,
  "size": 0,//todo size has to change in future
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


const dummy_data  = {
    indexes: ["test","company1","indexname","company2","company3","company7","student_master","company8","customer"],
    attributeOfIndexes:  {"company1":{"mappings":{"properties":{"name":{"type":"text"},"experience":{"type":"long"},"age":{"type":"long"}}}}},
    options: []
}

const toastrCnst = {
    closeButton : true,
    timeOut : 5000,
    extendedTimeOut : 2000
};

export const QBCnst = {
    BASE_URL: 'http://192.168.1.249:9999/es/',
    API_MAPPING: apiMapping,
    TOASTR_CNST: toastrCnst,
    PATH_SEPARATOR: '##',
    KEY_SEPARATOR: '.',
    REQUEST_FORMAT: RequestFormat,
    AGGREGATE_FORMAT: aggregateFormat
}
