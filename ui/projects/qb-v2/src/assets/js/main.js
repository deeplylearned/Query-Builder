var selectedAttributes = [];
var attributes = [
  {
    "id": 1,
    "key": 'academicYear',
    "name": "Academic Year",
    "added": 0,
    "dataType": "String",
    "valueType": "dropdown",
    "values": ['2018-19', '2019-20'],
    "attributeType": "single"
  },
  {
    "id": 2,
    "key": "mcStatusId",
    "name": 'MC Status Id',
    "dataType": "int",
    "valueType": "dropdown",
    "values": {13: "Approved", 12: "Rejected By Approver"},
    "attributeType": "single"
  },
  {
    "id": 3,
    "key": "cahFlag",
    "name": "CAH Flag",
    "dataType": "boolean",
    "valueType": "dropdown",
    "values": {'true': "True", "false": "False"},
    "attributeType": "single"
  }
];

var possibleOperationsForDataType = {
  'string': ['Match'],
  'int': ['Match'],
  'boolean': ['Match']
}
var aggregateOperations = ['count', 'sum'];

var bodyContentRef = document.getElementById('attribute-list');
var indexRef = document.getElementById("index");
var filterPreviewRef = document.getElementById('filter-preview');
var aggFieldsListRef = document.getElementById('aggregateFieldSuggestions');
var aggFiltersPreviewRef = document.getElementById('agg_filters_preview');

function indexChanged(ev) {
  var val = ev.target.value;
  if(val != '-1') {
    getAttributesForIndex(val, 'bodyContentRef');
  }else{
    bodyContentRef.innerHTML = '';
    filterPreviewRef.innerHTML = '';
  }
}

function getAttributesForIndex(val, ref) {
  for(var attr of attributes) {
    var node = generateDoM(attr, ref);
    if(ref == 'bodyContentRef'){
      bodyContentRef.appendChild(node);
    }else if(ref == 'aggFieldsListRef'){
      aggFieldsListRef.appendChild(node);
    }
    /*  We can use this also. */
    // var card = '<div class="card"><div class="card-body py-0 px-3"><div class="custom-control custom-checkbox">';
    // card += '<input class="custom-control-input" id="'+attr.name+'" type="checkbox"><label class="custom-control-label" for="'+attr.name+'">'+attr.name+'</label>';
    // card += '</div></div></div>';
    // bodyContentRef.innerHTML += card;
  }
  addEventListenerForAcc();
}

function generateDoM(attr, ref) {
  var card = generateDiv('card mt-2 shadow-sm');
  var cardBody = generateDiv('card-body py-0 px-3');

  var childNode;
  if(attr.attributeType == 'single') {
    childNode = generateCheckboxDom(attr, ref);  
  }else {
    childNode = generateAccordionDOM(attr, ref);
  }

  if(ref == 'bodyContentRef'){
    cardBody.appendChild(childNode);
    card.appendChild(cardBody);
    return card;
  }else if(ref == 'aggFieldsListRef') {
    var div = generateTag('div', 'col-12 mb-3', null);
    div.appendChild(childNode);
    return div;
  }
}

function generateCheckboxDom(attr, ref) {
  var checkboxDiv = generateDiv('custom-control custom-checkbox');

  var inputNode = document.createElement ('input');
  inputNode.setAttribute('type', 'checkbox');
  inputNode.setAttribute('class', "custom-control-input");
  inputNode.setAttribute('value', attr.name);
  inputNode.setAttribute('id', attr.id+(ref == 'aggFieldsListRef' ? '_agg' : ''));

  var label = document.createElement("label");
  label.setAttribute("class", "custom-control-label");
  label.setAttribute('for', attr.id+(ref == 'aggFieldsListRef' ? '_agg' : ''));
  label.textContent = attr.name;

  checkboxDiv.appendChild(inputNode);
  checkboxDiv.appendChild(label);
  return checkboxDiv;
}

function generateAccordionDOM(attr, ref) {
  var parentNode =  generateDiv('atribute-group');
  // parentNode.setAttribute('id', attr.id);

  var accHeader = generateDiv('group-header d-flex align-items-center');

  var accBody = generateDiv('collapse group-body');
  accBody.setAttribute('id', attr.id+(ref == 'aggFieldsListRef' ? '_agg' : '')+"_group");
  accBody.setAttribute('aria-labelledby', attr.name);
  accBody.setAttribute('data-parent', '#'+attr.id+(ref == 'aggFieldsListRef' ? '_agg' : ''));

  var accIcon = document.createElement('a');
  accIcon.setAttribute('class', 'collapsebtn collapsed');
  accIcon.setAttribute('id', attr.id+(ref == 'aggFieldsListRef' ? '_agg' : ''));
  accIcon.setAttribute('data-toggle', 'collapse');
  accIcon.setAttribute('data-target', '#'+attr.id+(ref == 'aggFieldsListRef' ? '_agg' : '')+'_group');
  accIcon.setAttribute('aria-expanded', false);
  accIcon.setAttribute('aria-controls', attr.id+(ref == 'aggFieldsListRef' ? '_agg' : '')+"_group");
  accIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';

  var checkboxDiv = generateCheckboxDom(attr);

  accHeader.appendChild(accIcon);
  accHeader.appendChild(checkboxDiv);

  for(var child of attr.childs) {
    var childNode = null;
    if(!!child.childs && child.childs.length > 0) {
      childNode = generateAccordionDOM(child);
    }else {
      childNode = generateCheckboxDom(child);
    }
    accBody.appendChild(childNode);
  }

  parentNode.appendChild(accHeader);
  parentNode.appendChild(accBody);
  return parentNode;
}

function generateDiv(cls) {
  var div = document.createElement('div');
  div.setAttribute('class', cls);
  return div;
}

function addEventListenerForAcc() {
  var ac = document.getElementsByClassName('collapsebtn');
  for(var i=0; i< ac.length; i++) {
    ac[i].addEventListener('click', function() {
      this.classList.toggle('active')
      this.setAttribute('aria-expanded', true);
      var id = this.getAttribute('id');
      document.getElementById(id+"_group").classList.toggle("show");
    });
  }
}

function addAttributes() {
  if(indexRef.value != '-1'){
    var inputNodes = document.querySelectorAll("input.custom-control-input");
    inputNodes.forEach((node) => {
      var id = node.getAttribute('id')
      var filterExists = document.getElementById(id+"_filter_preview");
      if(node.checked) {
        if(!!filterExists) {
        }else{
          var filterRow = generateDiv('form-row');
          filterRow.setAttribute('id', id+'_filter_preview');
          var filterTitle = generateDiv('col-3 align-self-center font-weight-600');
          filterTitle.textContent = node.value;
          var filterOp = generateDiv('col-3');
          filterOp.innerHTML = getOperationsForFilter(id);
          var filterVal = generateTag('div', null, id+'_filter_val');
          var filterTrash = generateDiv('col-auto');
          filterTrash.innerHTML = '<button class="btn btn-sm btn-outline-danger delete-attribute-icon" id ="'+(id+'_delte')+'"><i class="far fa-trash-alt"></i></button>';

          var hr = generateTag('hr', 'my-3 bg-border', id+"_gap");

          filterRow.appendChild(filterTitle);
          filterRow.appendChild(filterOp);
          filterRow.appendChild(filterVal);
          filterRow.appendChild(filterTrash);
          filterPreviewRef.appendChild(filterRow);
          filterPreviewRef.appendChild(hr);
        }
      }else {
        if(!!filterExists) {
          filterPreviewRef.removeChild(filterExists);
        }
      }
    })
    addEventListenerForOp();
    addDeleteEventListenerForFilter();
  }else{  
    // console.log("Please Select Index First");
  }
}

function getOperationsForFilter(id) {
  var selectNode = '<select name="" class="form-control form-control-sm operation-types" id="'+(id+"_op")+'">';
  var attrInfo = getAttributeById(id);
  var options = possibleOperationsForDataType[attrInfo.dataType.toLowerCase()];
  var optionsStr = "<option value='-1'>Select Operation</option>";
  for(var op of options) {
    optionsStr += '<option value="'+op+'">'+op+'</option>';
  }
  selectNode += optionsStr;
  selectNode += '</select>';
  return selectNode;
}

function addEventListenerForOp() {
  var opTypes = document.getElementsByClassName('operation-types');
  for(var i=0; i<opTypes.length; i++) {
    opTypes[i].onchange = function() {
      var id = this.getAttribute('id').split('_')[0];
      showRespectiveFilterValuesForOp(id, this.value);
    }
  }
}

function addDeleteEventListenerForFilter(ref) {
  var icon = (ref == 'aggFiltersPreviewRef' ? 'agg-delete-icons' : 'delete-attribute-icon');
  var filters = document.getElementsByClassName(icon);
  // console.log(icon,'ref: ',ref, filters.length);
  for(var i=0; i<filters.length; i++) {
    filters[i].onclick = function() {
      // console.log('delete operation: ',this.getAttribute('id'));
      var id = this.getAttribute('id');
      var delId = document.getElementById(id.split('_')[0]+(ref == 'aggFiltersPreviewRef' ? '_agg_filter' : '_filter_preview'));
      var delGap = document.getElementById(id.split('_')[0]+(ref == 'aggFiltersPreviewRef' ? "_agg_hr_gap" : "_gap"));

      if(ref == 'aggFiltersPreviewRef') {
        aggFiltersPreviewRef.removeChild(delId);
        document.getElementById(id.split('_')[0]+"_agg").checked = false;
      }else {
        filterPreviewRef.removeChild(delId);
        filterPreviewRef.removeChild(delGap);
        document.getElementById(id.split('_')[0]).checked = false;
      }
    }
  }
}

function showRespectiveFilterValuesForOp(id, val) {
  var attr = getAttributeById(id);
  var inputNode;
  switch(attr.valueType.toLowerCase()) {
    case 'dropdown':
      inputNode = generateTag('select', 'form-control form-control-sm', id+"_filter_value");
      var optionsStr = "";
      if(typeof attr.values == 'object' && attr.values instanceof Array) {
        for(var v of attr.values) {
          optionsStr += "<option value='"+v+"'>"+v+"</option>";
        }
      }else if(typeof attr.values == 'object') {
        for(var key in attr.values) {
          optionsStr += "<option value='"+key+"'>"+attr.values[key]+"</option>";
        }
      }else{
        // console.log("No Values found for this attribute");
      }
      inputNode.innerHTML = optionsStr;
      break;
    case 'input':
      inputNode = generateTag('input', 'form-control form-control-sm', id+"_filter_value");
      inputNode.setAttribute('type', 'text');
      break;
    default:
      // console.log("not yet implemented");
      break;
  }
  var filterValRef = document.getElementById(id+'_filter_val');
  filterValRef.innerHTML = '';
  if(val != '-1'){
    var classList = filterValRef.classList.value;
    if(classList.indexOf('col') == -1) {
      filterValRef.classList.add('col');
    }
    filterValRef.appendChild(inputNode);
  }else {
    filterValRef.classList.remove('col');
  }
}

function getAttributeById(id) {
  var a = id.toString().split('');
  var parent = attributes.filter((attr) => attr.id == a[0])[0];
  var curId = a[0].toString();
  if(a.length > 1){
    for(var i=1; i<a.length; i++) {
      curId += a[i];
      attr = parent.childs.filter((p) => p.id == parseInt(curId))[0];
      parent = attr;
    }
    return attr;
  }else{
    return parent;
  }
}

function generateTag(tagName, cls, id) {
  var tag = document.createElement(tagName);
  if(!!cls) {
    tag.setAttribute("class", cls);
  }
  if(!!id) {
    tag.setAttribute('id', id);
  }
  return tag;
}

function showListofSuggestions() {
  // console.log(aggFieldsListRef.childElementCount," is child elements count");
  if(aggFieldsListRef.childNodes.length <= 0) {
    if(indexRef.value != '-1'){
      getAttributesForIndex(indexRef.value, 'aggFieldsListRef');
    } else if(indexRef.value == '-1') {
      // console.log("index");
      // var divNode = generateTag('div', 'col-12');
      // divNode.innerHTML = '<h1 class="text-danger">Please select Index first.</h1>'
      // aggFieldsListRef.appendChild(divNode);
    }
  }
}

function addAggregateAttrs() {
  if(indexRef.value != '-1') {
    var allInputs = aggFieldsListRef.childNodes;
    allInputs.forEach((node) => {
      input = node.querySelectorAll('input')[0];
      var aggId = input.getAttribute('id');
      var ele = document.getElementById(aggId+"_filter");
      if(input.checked) {
        if(!ele){
          var aggFilterNode = getAggregateFilterDOM(aggId, input.value);
          aggFiltersPreviewRef.appendChild(aggFilterNode);
        }
      }else{
        if(!!ele) {
          aggFiltersPreviewRef.removeChild(ele);
        }
      }
    })
    addDeleteEventListenerForFilter('aggFiltersPreviewRef');
  }else {
    // console.log('Please select Index first');
  }
  // console.log("add aggregate attrs");
}

function getAggregateFilterDOM(id, name) {
  var filterId = id.split('_')[0];
  var node = generateTag('div', 'col col-md-6', filterId+"_agg_filter");
  var formRowNode = generateTag('div', 'form-row', null);
  var attrNameNode = generateTag('div', 'col-5 align-self-center font-weight-600', null);
  attrNameNode.innerHTML = name;
  var aggOperationNode = generateTag('div', 'col', null);
  aggOperationNode.appendChild(getOperationsForAggFilter(id))
  var aggTrashIcon = generateTag('div', 'col-auto', null);
  aggTrashIcon.innerHTML = '<button class="btn btn-sm btn-outline-danger agg-delete-icons" id="'+(filterId+"_agg_delete_icon")+'"><i class="far fa-trash-alt"></i></button>';

  var hrGap = generateTag('hr', 'my-3 bg-border', filterId+"_agg_hr_gap");

  formRowNode.appendChild(attrNameNode);
  formRowNode.appendChild(aggOperationNode);
  formRowNode.appendChild(aggTrashIcon);

  node.appendChild(formRowNode);
  node.appendChild(hrGap);
  return node;
}

function getOperationsForAggFilter(id) {
  var selectNode = generateTag('select', 'form-control form-control-sm agg-operation-type', id+"_agg_op_type");
  var optionsStr = "";
  for(var opt of aggregateOperations) {
    optionsStr += "<option value='"+opt+"'>"+opt+"</option>";
  }
  selectNode.innerHTML = optionsStr;
  return selectNode;
}

function generateQuery() {
  if(indexRef.value !== '-1') {
    var operationTypes = document.getElementsByClassName('operation-types');
    var aggOpTypes = document.getElementsByClassName('agg-operation-type');
    var filterQuery = {}, aggregateQuery = {};

    var postData = {
      index: indexRef.value,
      match: {},
      boolMatch: {},
      intMatch: {},
      aggregateQueryMap: {}
    }

    for(var i=0;i<operationTypes.length; i++) {
      op = operationTypes[i];
      var id = op.getAttribute('id').split('_')[0];
      var attrInfo = getAttributeById(id);
      var filterValRef = document.getElementById(id+"_filter_value");
      // filterQuery[attrInfo['id']] = {
      //   name: attrInfo.name,
      //   operationType: op.value,
      //   value: filterValRef.value
      // }  
      if(op.value.toLowerCase() == 'match') {
        postData.match[attrInfo.key+".keyword"] = filterValRef.value;
      }  
    }

    for(var j=0; j<aggOpTypes.length; j++) {
      op = aggOpTypes[j];
      var id = op.getAttribute('id').split('_')[0];
      var attrInfo = getAttributeById(id);

      aggregateQuery[id] = {
        name: attrInfo.name,
        operationType: op.value
      }
    }
    // console.log(postData);
    // document.getElementById('result_div').style.visibility = 'visible';
    // document.getElementById('result').innerText = postData;
  }
}