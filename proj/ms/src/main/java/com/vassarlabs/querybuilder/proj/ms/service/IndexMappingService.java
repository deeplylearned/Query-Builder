package com.vassarlabs.querybuilder.proj.ms.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.vassarlabs.querybuilder.proj.elasticsearch.service.ElasticSearchService;
import com.vassarlabs.querybuilder.proj.ms.api.Attribute;

@Service
public class IndexMappingService {


	@Autowired
	private ElasticSearchService elasticSearchService;

	@Value("${paths.configFilePath}")
	private String configFilePath;

	@Value("${paths.uiMappingFileKey}")
	private String uiMappingFileKey;

	public List<Attribute> getMappingForIndex(String indexName) throws JSONException, IOException, ClassNotFoundException, ParseException {
		
		JSONObject configProperties =  readPropertiesFromFile(configFilePath);
		JSONObject indexMappingObject = getIndexMappingObject(configProperties,indexName);

		String mappingString = elasticSearchService.getMappingOfIndex(indexName);
		JSONObject obj = new JSONObject(mappingString);
		JSONObject jsonObject = obj.getJSONObject(indexName).getJSONObject("mappings");
		return getKeysFromProperties(jsonObject,jsonObject.keys().next().toString(),configProperties,indexName,indexMappingObject);
	}

	private List<Attribute> getKeysFromProperties(JSONObject object,String innerKey,JSONObject configProperties,String indexName,JSONObject indexMappingObject) throws JSONException, IOException, ClassNotFoundException {
		
		List<Attribute> listOfAttributes = new ArrayList<>() ;
		JSONObject innerobject =  (JSONObject) object.get(innerKey);
		Iterator<String> inner1Keys = innerobject.keys();
		while(inner1Keys.hasNext()) {
			String inner2Key = inner1Keys.next();
			Attribute atrribute = new Attribute();
			atrribute.setFieldName(inner2Key);
			atrribute.setUiName(getUINameOfAttribute(inner2Key,indexMappingObject));

			JSONObject inner1object =  (JSONObject) innerobject.get(inner2Key);
			Iterator<String> inner2Keys = inner1object.keys();
			String inner3Key = inner2Keys.next();
			if(inner3Key.equals("type")) {
				atrribute.setDataType(inner1object.get(inner3Key).toString());
				atrribute.setFieldName(checkIfDataTypeIsText(inner1object.get(inner3Key).toString(),atrribute.getFieldName()));
				atrribute.setSearchTypeDropdown(checkIfSearchTypeIsDropdown(configProperties,inner2Key,indexName));
				listOfAttributes.add(atrribute);
				continue;
			}else if(inner3Key.equals("properties")) {						
				atrribute.setChildObject(getKeysFromProperties(inner1object,inner3Key,configProperties,indexName,indexMappingObject));
				listOfAttributes.add(atrribute);
			}
		}
		return listOfAttributes;	
	}

	private JSONObject readPropertiesFromFile(String filePath) throws IOException, ParseException, JSONException {
		
		Resource resource = new ClassPathResource(filePath);
		InputStream inputStream = resource.getInputStream();
		JSONParser jsonParser = new JSONParser();
		org.json.simple.JSONObject jsonObject = (org.json.simple.JSONObject)jsonParser.parse(
				new InputStreamReader(inputStream, "UTF-8"));

		return new JSONObject(jsonObject.toJSONString());
	}

	private boolean checkIfSearchTypeIsDropdown(JSONObject configProperties,String fieldName,String indexName) throws JSONException {
		
		if(configProperties.getJSONObject(indexName) != null) {
			if(configProperties.getJSONObject(indexName).has(fieldName) )
				return true;
			else
				return false;
		}
		return false;
	}

	private String getUINameOfAttribute (String name, JSONObject indexMappingObject) throws JSONException {
		
		if(indexMappingObject.has(name))
			return indexMappingObject.get(name).toString().replace("_"," ");
		else
			return null;
		/*throw new NullPointerException("ui name not present in indexMappingFile");*/
	}

	private String checkIfDataTypeIsText(String dataType,String fieldName){

		String finalFieldName = fieldName;
		if(dataType.equals("text")) {
			finalFieldName = fieldName.concat(".keyword");
		}
		return finalFieldName;
	}

	private JSONObject getIndexMappingObject(JSONObject configProperties,String indexName) throws JSONException, IOException, ParseException {
		
		if(configProperties.getJSONObject(indexName) != null) {
			if (configProperties.getJSONObject(indexName).get(uiMappingFileKey) != null) {
				String filePath = configProperties.getJSONObject(indexName).get(uiMappingFileKey).toString();
				return readPropertiesFromFile(filePath);
			}
			throw new NullPointerException("index mapping file path not present in config file");
		}
		throw new NullPointerException("this index name not present in config file");
	}


}
