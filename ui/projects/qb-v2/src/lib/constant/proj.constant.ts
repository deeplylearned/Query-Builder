export const ProjConstants = {
  LOCATION_HIE: {
      DEFAULT_HIE: ['state', 'district', 'mandal', 'village', 'borewell'],
      GEO: ['state', 'district', 'mandal', 'college','student']
    },
    LOCATION_CONSTANT_OPTIONS: {
      url: ['entityName', 'entityId'],
      dataType: 'FINALLOCATION',
      child: 'district',
      jsonkey: 'entityName',
      name: 'District'
    },
    DEMO_CONS:  {
      tableInfo: {
        type: 'dataTable',
        title: 'Student Table',
      },
      css: {
        // tableClass: 'table table-bordered align-items-center',
        // theadClass: 'text-center'
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
        visible: true,
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
          dataType: 'TEXT',
          defaultValue: '-',
          class: 'tc-bg-04',
          popupInfo: {
            component: 'modalDemo'
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
    },
    DEMO_DATA: [
      {
          entityId: 1,
          entityName: 'Srikakulam',
          stuId: 2015001,
          stuName: 'Tendua Jr',
          marks: {
              sub1: {
                  val: 10,
                  perc: 20,
              },
              sub2: {
                  val: 30,
                  perc: 40,
              },
              sub3: {
                  val: 50,
                  perc: 60,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 2,
          entityName: 'VISAKHAPATNAM',
          stuId: 2015002,
          stuName: 'Bhatia',
          marks: {
              sub1: {
                  val: 70,
                  perc: 80,
              },
              sub2: {
                  val: 90,
                  perc: 95,
              },
              sub3: {
                  val: 10,
                  perc: 15,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 3,
          entityName: 'Kurnool',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 4,
          entityName: 'Guntur',
          stuId: 2015003,
          stuName: 'S',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 5,
          entityName: 'West Godavari',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 6,
          entityName: 'East Godavari',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 7,
          entityName: 'Viziangaram',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 8,
          entityName: 'Prakasam',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: 9,
          entityName: 'Krishna',
          stuId: 2015003,
          stuName: 'Sai',
          marks: {
              sub1: {
                  val: 15,
                  perc: 16,
              },
              sub2: {
                  val: 75,
                  perc: 80,
              },
              sub3: {
                  val: 65,
                  perc: 70,
              },
          },
          attd: {
              jan: 80,
              feb: 75,
              mar: 100
          }
      },
      {
          entityId: -1,
          entityName: 'TOTAL',
          marks: {
              sub1: {
                  val: 95,
                  perc: 100,
              },
              sub2: {
                  val: 195,
                  perc: 100,
              },
              sub3: {
                  val: 125,
                  perc: 100,
              },
          },
          attd: {
              jan: 100,
              feb: 100,
              mar: 100
          }
      }
  ]
  
}