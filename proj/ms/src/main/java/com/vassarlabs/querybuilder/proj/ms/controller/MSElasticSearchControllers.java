package com.vassarlabs.querybuilder.proj.ms.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.vassarlabs.querybuilder.proj.elasticsearch.api.AggregateDocument;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.ApiResponse;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.ApiResponseFactory;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.FlattenedPOJO;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.SearchQuery;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.SourceDocument;
import com.vassarlabs.querybuilder.proj.elasticsearch.service.ElasticSearchService;
import com.vassarlabs.querybuilder.proj.ms.api.Result;
import com.vassarlabs.querybuilder.proj.ms.service.CreateExlFile;
import com.vassarlabs.querybuilder.proj.ms.service.IndexMappingService;

@CrossOrigin(origins="*", allowedHeaders = "*")
@RestController
public class MSElasticSearchControllers {


	@Autowired
	private ElasticSearchService elasticSearchService;

	@Autowired
	private IndexMappingService indexMappingService;

	@Autowired
	private CreateExlFile createExlFile;

	@RequestMapping(value = "es/index/", method = RequestMethod.POST)
	@ResponseBody
	public ApiResponse indexDocument(@RequestBody SourceDocument document)  {
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.indexDocument(document));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Could not index data due to internal server error!");
		}
	}

	@RequestMapping(value = "es/bulk/", method = RequestMethod.POST)
	@ResponseBody
	public ApiResponse bulkIndexDocument(@RequestBody List<SourceDocument> documents)  {
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.bulkIndexDocument(documents));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Could not index data due to internal server error!");
		}

	}

	@RequestMapping(value = "es/search/{index}/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse findById(@PathVariable("index") String index, @PathVariable("id") String id)  {
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.findById(index, id));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Could not index data due to internal server error!");
		}

	}

	@RequestMapping(value = "es/search", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse boolSearch(@RequestBody SearchQuery query)  {
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.boolSearch(query));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Could not index data due to internal server error!");
		}

	}

	//		@RequestMapping(value = "es/excel", method = RequestMethod.GET)
	//		@ResponseBody
	//		public ApiResponse MainMethod()  {
	//			try {
	//				return ApiResponseFactory.createResponse(createExlFile.createExcel());
	//			} catch (IOException e) {
	//				e.printStackTrace();
	//				return ApiResponseFactory.createErrorResponse(500, "Could not index data due to internal server error!");
	//			}
	//	
	//		}


	@RequestMapping(value = "es/test", method = RequestMethod.GET)
	@ResponseBody
	public String test() throws IOException {
		String x="hello";
		return x;
	}

	@RequestMapping(value = "es/mapping/{index}", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse getIndexMapping(@PathVariable("index") String index)  {

		try {
			return ApiResponseFactory.createResponse(indexMappingService.getMappingForIndex(index));
		} catch (IOException | JSONException | ClassNotFoundException | ParseException e){
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Internal server error!");

		}
	}


	@RequestMapping(value = "es/getValuesOfAttribute/{index}/{attribute}", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse getValuesOfAttribute(@PathVariable("index") String index, @PathVariable("attribute") String attribute)  {
		try {

			return ApiResponseFactory.createResponse(elasticSearchService.getAllPossibleValuesOfAttribute(index,attribute));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Internal server error!");
		}
	}

	@RequestMapping(value = "es/getIndices", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse getIndices() throws IOException {
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.getAllIndexes());
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Internal server error!");

		}
	}

	@RequestMapping(value = "es/getIndexMapping/{index}", method = RequestMethod.GET)
	@ResponseBody
	public String getTest(@PathVariable("index") String index) throws IOException {

		return elasticSearchService.getMappingOfIndex(index);

	}

	//	@RequestMapping(value = "es/getData", method = RequestMethod.POST)
	//	public Result getData(@RequestBody SearchQuery query)  {
	//
	//		try{
	//			Result result = new Result();
	//			HttpHeaders headers = new HttpHeaders();
	//			headers.add("Content-Disposition", "attachment; filename=report.xlsx");
	//
	//			if(!elasticSearchService.checkIfCompositeQuery(query)) {
	//				FlattenedPOJO flattenedReportData = new FlattenedPOJO();
	//				flattenedReportData = elasticSearchService.getFormattedRecordsWithSchema(query);
	//
	//				if(query.getResult().equals(ConstantFile.FILE)) {
	//					byte[] in = null;
	//					in = createExlFile.createExcelForFilter(flattenedReportData);
	//					result.setFile(ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/xlsx"))
	//							.body(in));
	//
	//				} else if(query.getResult().equals(ConstantFile.DATA)) {
	//					List<LinkedHashMap<String, Object>> reportData = flattenedReportData.getFormatList();
	//					result.setData(ApiResponseFactory.createResponse(flattenedReportData));
	//
	//				} else if(query.getResult().equals(ConstantFile.FILE_DATA)) {
	//					byte[] in = null;
	//					in = createExlFile.createExcelForFilter(flattenedReportData);
	//					List<LinkedHashMap<String, Object>> reportData = flattenedReportData.getFormatList();
	//					result.setData(ApiResponseFactory.createResponse(reportData));
	//					result.setFile(ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/xlsx"))
	//							.body(in));
	//				}
	//			} else{
	//				List<AggregateDocument> aggregateList = new ArrayList<>();
	//				aggregateList = elasticSearchService.compositeAggregation(query);
	//
	//				if(query.getResult().equals(ConstantFile.FILE)) {
	//					byte[] in = null;
	//					in = createExlFile.createExcelForAggregation(aggregateList);
	//					result.setFile(ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/xlsx"))
	//							.body(in));
	//
	//				} else {
	//
	//					List<LinkedHashMap<String,Object>> objectList = new ArrayList<LinkedHashMap<String,Object>>();
	//					objectList = createExlFile.getAggregateListForReport(aggregateList);
	//					FlattenedPOJO flattenedReportData = new FlattenedPOJO();
	//					Map<String,Integer> columnMap = new HashMap<>();
	//					int i=0;
	//					for(String string : objectList.get(0).keySet()) {
	//						columnMap.put(string, i);
	//						i++;
	//					}
	//
	//					flattenedReportData.setFormatList(objectList);
	//					flattenedReportData.setColumnMap(columnMap);
	//					result.setData(ApiResponseFactory.createResponse(flattenedReportData));
	//
	//					System.out.println("result is : " +  flattenedReportData);
	//
	//					if(query.getResult().equals(ConstantFile.FILE_DATA)){
	//						byte[] in = null;
	//						in = createExlFile.createExcelForAggregation(aggregateList);
	//						result.setFile(ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/xlsx"))
	//								.body(in));
	//					}
	//				}			
	//			}
	//			return result;
	//		} catch (IOException e) {
	//			e.printStackTrace();
	//			return null;
	//		}
	//	}

	@RequestMapping(value = "es/getData", method = RequestMethod.POST)
	public Result getData(@RequestBody SearchQuery query)  {

		try{
			Result result = new Result();
			if(!elasticSearchService.checkIfCompositeQuery(query)) {
				FlattenedPOJO flattenedReportData = new FlattenedPOJO();
				flattenedReportData = elasticSearchService.getFormattedRecordsWithSchema(query);

				List<LinkedHashMap<String, Object>> reportData = flattenedReportData.getFormatList();
				result.setData(ApiResponseFactory.createResponse(flattenedReportData));

			} else {
				List<AggregateDocument> aggregateList = new ArrayList<>();
				aggregateList = elasticSearchService.compositeAggregation(query);

				List<LinkedHashMap<String,Object>> objectList = new ArrayList<LinkedHashMap<String,Object>>();
				objectList = createExlFile.getAggregateListForReport(aggregateList);
				FlattenedPOJO flattenedReportData = new FlattenedPOJO();
				Map<String,Integer> columnMap = new HashMap<>();
				int i=0;
				for(String string : objectList.get(0).keySet()) {
					columnMap.put(string, i);
					i++;
				}
				flattenedReportData.setFormatList(objectList);
				flattenedReportData.setColumnMap(columnMap);
				result.setData(ApiResponseFactory.createResponse(flattenedReportData));

			}			
			return result;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@RequestMapping(value = "es/getFile", method = RequestMethod.POST, produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	@ResponseBody
	public ResponseEntity<byte[]> getFile(@RequestBody SearchQuery query)  {
		
		try{
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Disposition", "attachment; filename=report.xlsx");
			byte[] in = null;

			if(!elasticSearchService.checkIfCompositeQuery(query)) {
				FlattenedPOJO flattenedReportData = new FlattenedPOJO();
				flattenedReportData = elasticSearchService.getFormattedRecordsWithSchema(query);
				in = createExlFile.createExcelForFilter(flattenedReportData);
			} else {
				List<AggregateDocument> aggregateList = new ArrayList<>();
				aggregateList = elasticSearchService.compositeAggregation(query);
				in = createExlFile.createExcelForAggregation(aggregateList);
			}
			
			return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/xlsx"))
					.body(in);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@RequestMapping(value = "es/prefix/search", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse prefixboolSearch() throws IOException {

		List<String> esKeyList = new ArrayList<>();
		esKeyList.add("parcelId");
		esKeyList.add("aId");
		esKeyList.add("wardNumber");

		String searchKeyword = String.valueOf(11);
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.prefixboolSearch(esKeyList,searchKeyword));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Internal server error!");

		}
	}

	@RequestMapping(value = "es/search/document", method = RequestMethod.GET)
	@ResponseBody
	public ApiResponse mustMatchboolSearch() throws IOException {

		String esKey = "parcelId";

		String searchKeyword = String.valueOf(111133);
		try {
			return ApiResponseFactory.createResponse(elasticSearchService.mustMatchboolSearch(esKey,searchKeyword,"bluis_db1"));
		} catch (IOException e) {
			e.printStackTrace();
			return ApiResponseFactory.createErrorResponse(500, "Internal server error!");

		}
	}


}
