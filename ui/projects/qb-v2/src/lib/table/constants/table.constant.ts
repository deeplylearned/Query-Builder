export const TableDefaultConstants = {
  dataTypes: ['LOCATION', 'FINALLOCATION', 'TEXT', 'NUMBER', 'PERCENTAGE', 'DATE', 'FLOAT', 'ICON', 'IMAGE', 'ACTIONS'],
  dataTypesHavingClick: ['LOCATION', 'CLICK', 'CALLBACK', 'POPUP'],
  sortOptions: { sortIndex: 0 },
  searchFilterOptions: '',
  districtSortOrderList: ['SRIKAKULAM', 'VIZIANAGARAM', 'VISAKHAPATNAM', 'VISHAKAPATNAM', 'EAST GODAVARI', 'WEST GODAVARI', 'KRISHNA', 'GUNTUR', 'PRAKASAM', 'NELLORE', 'CHITTOOR', 'KADAPA', 'Y.S.R KADAPA', 'ANANTHAPUR', 'ANANTAPUR', 'KURNOOL'],

  tableBasicConfig: {
    tableInfo: {
      type: 'dataTable'
    },
    css: {
      tableClass: '',
      theadClass: '',
      tbodyClass: '',
    },
    defaultSort: true,
    searchFilter: false,
    downloadOptions: 'xlsx',
    paginator: 'false',
    tableHeaderFixerInfo: {
      headerFix: false,
      colFix: true
    },
    totalRow: {
      name: 'TOTAL',
      jsonKey: '-1'
    }
  },

  columnConstantDefaultValues: {
    name: '',
    sortable: true,
    filter: false,
    editable: false,
    sortOrderList: [],
    dataType: 'TEXT',
    jsonKey: '',
    class: '',
    jsonInfo: { type: null, path: null, operation: null },
    popupInfo: { component: null },
    storeValues: {}
  }
}

export const TableConstantSkeletonObject = {
  cons: {
    tableInfo: {
      type: 'dataTable',
      title: 'Default Table',
    },
    css: {
      tableClass: 'table table-bordered align-items-center',
      theadClass: 'text-center'
    },
    sortOptions: {
      sortIndex: 0,
      sortType: 'desc'
    },
    searchFilter: true,
    downloadOptions: {
      downloadType: 'xls',
      downloadFileName: 'Default_Table',
      downloadAll: true, //pass false if only current page data is to be downloaded
      metaData: false //pass true if meta data needs to be added in excel (Option only for excel and all data needs to be downloaded)
    },
    paginatorOptions: {
      visible: false,
      limit: 5,
      maxSize: 5,
      dropdownOptions: [{
        value: 5,
        display: '5'
      },
      {
        value: 10,
        display: '10'
      },
      {
        value: 15,
        display: '15'
      },
      {
        value: 20,
        display: '20'
      },
      {
        value: -1,
        display: 'All'
      }
      ]
    },
    tableHeaderFixerInfo: {
      headerFix: true,
      colFix: true,
      noOfCol: 2
    },
    totalRow: {
      name: 'total',
      jsonKey: '-1'
    },
    indexCons: {
      show: false,
      class: 'tc-bg-01'
    },
    columns: []
  },
  defaultQueryParams: {
    parent: 'parent',
    child: 'child',
    location: 'location'
  }
}