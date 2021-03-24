export const demoCons = {
  tableInfo: {
    type: 'dataTable',
    title: 'Student Table',
  },
  css: {
    // tableClass: 'table table-bordered align-items-center',
    // theadClass: 'thead-dark text-center'
  },
  sortOptions: {
    sortIndex: 0,
    sortType: 'desc'
  },
  searchFilter: true,
  downloadOptions: {
    downloadType: 'xls',
    downloadFileName: 'Student_Table',
    downloadAll: true, //pass false if only current page data is to be downloaded
    metaData: true //pass true if meta data needs to be added in excel (Option only for excel and all data needs to be downloaded)
  },
  paginatorOptions: {
    limit: 5,
    maxSize: 5, // Max pages to display on the link
    // directionLinks: 'false',
    // autoHide: 'false',
    // previousLabel: 'prev',
    // nextLabel: 'nex',
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
        value: 25,
        display: '25'
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
    show: true,
    class: 'tc-bg-01'
  },
  columns: [{
      jsonKey: {
        type: 'dynamic'
      },
      dataType: 'LOCATION',
      defaultValue: '-',
      // sortOrderList : ['SRIKAKULAM', 'VIZIANAGARAM', 'VISAKHAPATNAM', 'EAST GODAVARI', 'WEST GODAVARI', 'KRISHNA', 'GUNTUR', 'PRAKASAM', 'NELLORE', 'CHITTOOR', 'KADAPA', 'Y.S.R KADAPA', 'ANANTHAPUR', 'ANANTAPUR', 'KURNOOL']
    },
    {
      name: 'Student ID',
      jsonKey: {
        path: 'stuId'
      },
      dataType: 'TEXT',
      defaultValue: '-',
      class: 'tc-bg-03'
    },
    {
      name: 'Student Name',
      jsonKey: {
        path: 'stuName'
      },
      dataType: 'POPUP',
      defaultValue: '-',
      class: 'tc-bg-04',
      popupInfo: {
        component: 'modalDemo',
        instanceObject: {
          level : "state"
        }
      }
    },
    {
      name: 'Marks',
      class: 'tc-bg-05',
      childs: [{
          name: 'Sub 1',
          jsonKey: {
            path: 'marks.sub1.val##marks.sub1.perc'
          },
          dataType: 'NUMBER##PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-05'
        },
        {
          name: 'Sub 2',
          jsonKey: {
            path: 'marks.sub2.val##marks.sub2.perc'
          },
          dataType: 'NUMBER##PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-05'
        },
        {
          name: 'Sub 3',
          jsonKey: {
            path: 'marks.sub3.val##marks.sub3.perc'
          },
          dataType: 'NUMBER##PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-05'
        },
      ]
    },
    {
      name: 'Attendance',
      class: 'tc-bg-06',
      childs: [{
          name: 'Jan',
          jsonKey: {
            path: 'attd.jan'
          },
          dataType: 'PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-06'
        },
        {
          name: 'Feb',
          jsonKey: {
            path: 'attd.feb'
          },
          dataType: 'PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-06'
        },
        {
          name: 'March',
          jsonKey: {
            path: 'attd.mar'
          },
          dataType: 'PERCENTAGE',
          defaultValue: '-',
          class: 'tc-bg-06'
        },
      ]
    },
  ]
}