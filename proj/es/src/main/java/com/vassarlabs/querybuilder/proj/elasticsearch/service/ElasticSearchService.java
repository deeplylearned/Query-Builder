package com.vassarlabs.querybuilder.proj.elasticsearch.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.*;

import org.elasticsearch.action.admin.cluster.health.ClusterHealthRequest;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsRequest;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.common.collect.ImmutableOpenMap;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.script.Script;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.*;
import org.elasticsearch.search.aggregations.bucket.composite.CompositeAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.composite.CompositeValuesSourceBuilder;
import org.elasticsearch.search.aggregations.bucket.composite.ParsedComposite;
import org.elasticsearch.search.aggregations.bucket.composite.TermsValuesSourceBuilder;

import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.avg.ParsedAvg;
import org.elasticsearch.search.aggregations.metrics.max.ParsedMax;
import org.elasticsearch.search.aggregations.metrics.min.ParsedMin;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;

import com.github.wnameless.json.flattener.JsonFlattener;

@Service
public class ElasticSearchService {

	private static final ObjectMapper mapper = new ObjectMapper();
	private static final int BULK = 1000;

	@Autowired
	private RestHighLevelClient client;

	public IndexResponse indexDocument(SourceDocument document) throws IOException {

		IndexRequest indexRequest = new IndexRequest(document.getIndex()).id(document.getId()).source(document.getSource(), document.getType());
		IndexResponse indexResponse = client.index(indexRequest, RequestOptions.DEFAULT);
		return indexResponse;
	}

	public BulkResponse bulkIndexDocument(List<SourceDocument> documents) throws IOException {

		BulkRequest bulkRequest = new BulkRequest();
		for (SourceDocument document : documents) {
			IndexRequest indexRequest = new IndexRequest(document.getIndex()).id(document.getId()).source(document.getSource(), document.getType());
			bulkRequest.add(indexRequest);
		}
		BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
		return bulkResponse;
	}

	public SourceDocument findById(String index, String id) throws IOException {

		//todo uncomment this for final version
		//GetRequest getRequest = new GetRequest(index, id);
		GetRequest getRequest = new GetRequest(index,"_doc",id);
		GetResponse getResponse = client.get(getRequest, RequestOptions.DEFAULT);

		return new SourceDocument(getResponse.getId(), getResponse.getIndex(), getResponse.getSourceAsMap());
	}

	public List<SourceDocument> findAll() throws IOException {

		SearchRequest searchRequest = new SearchRequest();
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		searchSourceBuilder.query(QueryBuilders.matchAllQuery());
		searchRequest.source(searchSourceBuilder);
		SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
		return getSearchResult(searchResponse);
	}

	//TODO Rename this method and insert orignal boolSearch function

	public FlattenedPOJO getFormattedRecordsWithSchema(SearchQuery query) throws IOException{

		int totalHits = 0;
		List<Object> test= new ArrayList<>();

		SearchRequest searchRequest = new SearchRequest(query.getIndex());
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

		QueryBuilder queryBuilder = getBoolQueryBuilder(query);
		String [] include=null;
		String [] exclude = new String[]{};
		if(query.getSource()!=null && query.getSource().length()!=0) {
			include=query.getSource().split("~");//todo change the token
			searchSourceBuilder.query(queryBuilder).size(10000).fetchSource(include, exclude);
		}
		else{
			searchSourceBuilder.query(queryBuilder).size(10000);
		}

		searchRequest.source(searchSourceBuilder).scroll(new TimeValue(60000));
		SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
		for (SearchHit hit : response.getHits()) {
			test.add(hit.getSourceAsMap());
			totalHits++;
		}

		while(totalHits == 10000) {
			totalHits = 0;
			response = client.searchScroll(new SearchScrollRequest(response.getScrollId()).scroll(new TimeValue(60000)), RequestOptions.DEFAULT);
			for (SearchHit hit : response.getHits()) {
				test.add(hit.getSourceAsMap());
				totalHits++;
			}
		}
		return FormatList(test);
	}

	public List<SourceDocument> boolSearch(SearchQuery query) throws IOException {

		SearchRequest searchRequest = new SearchRequest(query.getIndex());
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		QueryBuilder queryBuilder = getBoolQueryBuilder(query);

		searchSourceBuilder.query(queryBuilder).size(query.getSize());
		searchRequest.source(searchSourceBuilder);
		SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
		return getSearchResult(response);
	}


	public List<AggregateDocument> compositeAggregation(SearchQuery query) throws IOException {

		SearchRequest searchRequest = new SearchRequest(query.getIndex());
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

		for (Map.Entry<String, AggregateQuery> aggregateQueryEntry: query.getAggregateQueryMap().entrySet()) {
			List<CompositeValuesSourceBuilder<?>> sources = new ArrayList<>();

			//Terms Query - Terms
			if(aggregateQueryEntry.getValue().getTermsQuery()==null) {
				List<AggregateDocument> nullList=new ArrayList<>();
				AggregateDocument nullValue = new AggregateDocument();
				nullValue.setName("improper Aggregation Query ");
				nullList.add(nullValue);
				return nullList;
			}

			Query termsQuery = aggregateQueryEntry.getValue().getTermsQuery();

			if(termsQuery!=null&&termsQuery.getTerms()!=null&& termsQuery.getTerms().size()!=0){
				for (Map.Entry<String, String> termsSourceEntry : termsQuery.getTerms().entrySet()) {
					TermsValuesSourceBuilder source = new TermsValuesSourceBuilder(termsSourceEntry.getKey());
					source.field(termsSourceEntry.getValue()).missingBucket(true);
					sources.add(source);
				}}

			//CompositeAggregationBuilder compositeQuery = AggregationBuilders.composite(aggregateQueryEntry.getKey(), sources);
			//this logic works  1 aggregation query key value pair

			CompositeAggregationBuilder compositeQuery = new CompositeAggregationBuilder(aggregateQueryEntry.getKey(), sources);
			compositeQuery.size(aggregateQueryEntry.getValue().getSize());
			Query sumQuery=null,filterQuery=null, maxQuery = null, minQuery = null, avgQuery=null;
			if(aggregateQueryEntry.getValue().getSumQuery()!=null)
				sumQuery= aggregateQueryEntry.getValue().getSumQuery();
			if(aggregateQueryEntry.getValue().getMaxQuery()!=null)
				maxQuery= aggregateQueryEntry.getValue().getMaxQuery();
			if(aggregateQueryEntry.getValue().getMinQuery()!=null)
				minQuery= aggregateQueryEntry.getValue().getMinQuery();
			if(aggregateQueryEntry.getValue().getAvgQuery()!=null)
				avgQuery= aggregateQueryEntry.getValue().getAvgQuery();
			if(aggregateQueryEntry.getValue().getFilterQuery()!=null)
				filterQuery = aggregateQueryEntry.getValue().getFilterQuery();

			//Filter Query - Terms
			if(filterQuery!=null&&filterQuery.getTerms()!=null && filterQuery.getTerms().size()!=0){
				for (Map.Entry<String,String> filterSourceEntry: filterQuery.getTerms().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.sum(filterSourceEntry.getKey()).field(filterSourceEntry.getValue());

					compositeQuery.subAggregation(subAggregation);
				}}
			//Sum Query - Terms
			if(sumQuery!=null&&sumQuery.getTerms()!=null && sumQuery.getTerms().size()!=0){
				for (Map.Entry<String,String> sumSourceEntry: sumQuery.getTerms().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.sum(sumSourceEntry.getKey()).field(sumSourceEntry.getValue());
					compositeQuery.subAggregation(subAggregation);
				}}
			//Max Query - Terms
			if(maxQuery!=null && maxQuery.getTerms()!=null && maxQuery.getTerms().size()!=0){
				for (Map.Entry<String,String> maxSourceEntry: maxQuery.getTerms().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.max(maxSourceEntry.getKey()).field(maxSourceEntry.getValue());
					compositeQuery.subAggregation(subAggregation);
				}}
			//Min Query - Terms
			if(minQuery!=null && minQuery.getTerms()!=null && minQuery.getTerms().size()!=0){
				for (Map.Entry<String,String> minSourceEntry: minQuery.getTerms().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.min(minSourceEntry.getKey()).field(minSourceEntry.getValue());
					compositeQuery.subAggregation(subAggregation);
				}}
			//Avg Query - Terms
			if(avgQuery!=null && avgQuery.getTerms()!=null && avgQuery.getTerms().size()!=0){
				for (Map.Entry<String,String> avgSourceEntry: avgQuery.getTerms().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.avg(avgSourceEntry.getKey()).field(avgSourceEntry.getValue());
					compositeQuery.subAggregation(subAggregation);
				}}
			//Terms Query - Script
			if(termsQuery.getScript()!=null && termsQuery.getScript().size()!=0){
				for (Map.Entry<String,Script> termsScriptEntry: termsQuery.getScript().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.terms(termsScriptEntry.getKey()).script(termsScriptEntry.getValue());

					compositeQuery.subAggregation(subAggregation);
				}}

			//Sum Query - Script
			if(sumQuery!=null&&sumQuery.getScript()!=null&& sumQuery.getScript().size()!=0){
				for (Map.Entry<String,Script> sumScriptEntry: sumQuery.getScript().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.sum(sumScriptEntry.getKey()).script(sumScriptEntry.getValue());

					compositeQuery.subAggregation(subAggregation);
				}}
			//Filter Query - Script
			if(filterQuery!=null&&filterQuery.getScript()!=null && filterQuery.getScript().size()!=0){
				for (Map.Entry<String,Script> filterScriptEntry: filterQuery.getScript().entrySet()){
					AggregationBuilder subAggregation = AggregationBuilders.sum(filterScriptEntry.getKey()).script(filterScriptEntry.getValue());
					compositeQuery.subAggregation(subAggregation);
				}}
			searchSourceBuilder.aggregation(compositeQuery);
		}
		BoolQueryBuilder queryBuilder = getBoolQueryBuilder(query);
		searchSourceBuilder.query(queryBuilder).size(query.getSize());
		searchRequest.source(searchSourceBuilder);
		System.out.println("final query is "+ searchRequest);
		SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
		return getCompositeAggregations(response);
	}


	private BoolQueryBuilder getBoolQueryBuilder(SearchQuery query) {

		BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
		if(query.getMatch().entrySet().size()!=0 ) {
			for (Map.Entry<String, String> entry : query.getMatch().entrySet()) {
				queryBuilder.must(QueryBuilders.matchQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getTermsString().entrySet().size()!=0) {
			for (Map.Entry<String, Set<String>> entry : query.getTermsString().entrySet()) {
				BoolQueryBuilder queryBuilder1 = new BoolQueryBuilder();
				for(String termString : entry.getValue()) {
					queryBuilder1.should(QueryBuilders.matchQuery(entry.getKey(), termString));
				}
				queryBuilder.must(queryBuilder1);
			}
		}

		if(query.getBoolMatch().entrySet().size()!=0) {
			for(Map.Entry<String,Boolean> entry: query.getBoolMatch().entrySet()) {
				queryBuilder.must(QueryBuilders.matchQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getIntMatch().entrySet().size()!=0) {
			for (Map.Entry<String, Integer> entry : query.getIntMatch().entrySet()) {
				queryBuilder.must(QueryBuilders.matchQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getTerm().entrySet().size()!=0) {
			for (Map.Entry<String, Number> entry : query.getTerm().entrySet()) {
				queryBuilder.must(QueryBuilders.termQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getTerms().entrySet().size()!=0) {
			for (Map.Entry<String, Set<Number>> entry : query.getTerms().entrySet()) {
				queryBuilder.must(QueryBuilders.termsQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getStringTerm().entrySet().size()!=0) {
			for (Map.Entry<String, String> entry : query.getStringTerm().entrySet()) {
				queryBuilder.must(QueryBuilders.termQuery(entry.getKey(), entry.getValue()));
			}
		}

		if(query.getRangeQuerySet().entrySet().size()!=0) {
			for (Map.Entry<String, RangeSet> entry : query.getRangeQuerySet().entrySet()) {
				//queryBuilder.must(QueryBuilders.rangeQuery(entry.getKey()).from(entry.getValue().getLower()).to(entry.getValue().getHigher()).includeLower(true).includeUpper(true));

				if(entry.getValue().getLte() != -9999)
					queryBuilder.must(QueryBuilders.rangeQuery(entry.getKey()).from(entry.getValue().getGte()).to(entry.getValue().getLte()).includeLower(true).includeUpper(true));


				else if(entry.getValue().getLt() != -9999)
					queryBuilder.must(QueryBuilders.rangeQuery(entry.getKey()).from(-9999).to(entry.getValue().getLt()).includeLower(false).includeUpper(false));

				else if(entry.getValue().getGt() != -9999)
					queryBuilder.must(QueryBuilders.rangeQuery(entry.getKey()).from(entry.getValue().getGt()).includeLower(false));
			}
		}
		return queryBuilder;
	}

	private List<SourceDocument> getSearchResult(SearchResponse searchResponse) {

		List<SourceDocument> sourceDocuments = new ArrayList<>();
		searchResponse.getHits().forEach(hit ->
		sourceDocuments.add(new SourceDocument(hit.getId(), hit.getIndex(), hit.getSourceAsMap())));
		return sourceDocuments;
	}

	private FlattenedPOJO getOnlySourceFromSearchResult(SearchResponse searchResponse) {

		List<Object> test= new ArrayList<>();
		searchResponse.getHits().forEach(hit ->
		test.add(hit.getSourceAsMap()));
		//return test;
		//return sourceDocuments;
		return FormatList(test);
	}

	private FlattenedPOJO FormatList(List<Object> test) {

		List<LinkedHashMap<String, Object> > formatList= new ArrayList<>();
		Set<String > Columnsset = new TreeSet<>();
		Map<String,Integer> ColumnsMap = new HashMap<>();int pos=0;
		for (Object i:test) {
			Map<String,String> x = (Map<String,String>) i;
			ObjectMapper mapper = new ObjectMapper();
			try {
				String json = mapper.writeValueAsString(x);
				JSONObject jsonObject = new JSONObject();
				String flattenedJson = JsonFlattener.flatten(json);
				LinkedHashMap<String, Object> flattenedJsonMap = (LinkedHashMap<String, Object>) JsonFlattener.flattenAsMap(json);
				formatList.add(flattenedJsonMap);
				Columnsset.addAll(flattenedJsonMap.keySet());
				Iterator<Map.Entry<String, Object>> it = flattenedJsonMap.entrySet().iterator();
				while(it.hasNext()){
					Map.Entry<String, Object> entry = it.next();
					if(!ColumnsMap.containsKey(entry.getKey())){
						ColumnsMap.put(entry.getKey(),pos);pos++;
					}
				}
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}

		}
		FlattenedPOJO flattenedPOJO= new FlattenedPOJO();
		flattenedPOJO.setColumnMap(ColumnsMap);
		flattenedPOJO.setFormatList(formatList);
		return flattenedPOJO;
	}

	private List<AggregateDocument> getCompositeAggregations(SearchResponse searchResponse) {


		List<AggregateDocument> aggregateDocuments = new ArrayList<>();
		for (Aggregation agg: searchResponse.getAggregations()) {
			ParsedComposite multiBucketAgg = (ParsedComposite) agg;
			List<? extends ParsedComposite.ParsedBucket> buckets = multiBucketAgg.getBuckets();
			for (int i=0; i<buckets.size(); i++) {
				AggregateDocument document = new AggregateDocument();
				document.setName(multiBucketAgg.getName());
				ParsedComposite.ParsedBucket bucket = buckets.get(i);
				document.setKey(bucket.getKey());
				document.setDocCount(bucket.getDocCount());
				Aggregations x = bucket.getAggregations();
				List<Aggregation> aggregationsListp= x.asList();
				for (Aggregation p:aggregationsListp) {
					Map<String,Object> valueMap = new HashMap<>();
					if(p.getType()=="sum"){
						//valueMap.put(p.getName(), ((ParsedSum)p).getValue());
						document.putValue(p.getName().concat("(sum)"),((ParsedSum)p).getValue());
					}
					else if(p.getType()=="max"){
						valueMap.put(p.getName(), ((ParsedMax)p).getValue());
						document.putValue("max",valueMap);
					}
					else if(p.getType()=="min"){
						valueMap.put(p.getName(), ((ParsedMin)p).getValue());
						document.putValue("min",valueMap);
					}
					else if(p.getType()=="avg"){
						valueMap.put(p.getName(), ((ParsedAvg)p).getValue());
						document.putValue("avg",valueMap);
					}
				}
				aggregateDocuments.add(document);
			}
		}

//		List<Map<String,Object>> aggregateList = new ArrayList<Map<String,Object>>();
//
//		for (AggregateDocument i : aggregateDocuments) {
//			System.out.println("document is : " + i);
//			Map<String,Object> aggregateMap = new HashMap<>();
//			for (Map.Entry<String,Object> entry : i.getKey().entrySet()) {
//				aggregateMap.put(entry.getKey(), entry.getValue());}
//
//			aggregateMap.put("record_count", i.getDocCount());
//			
//			if(i.getValue() != null && i.getValue().size() != 0) {
////				if(i.getValue().get("sum") != null) {
////					Entry<String,Object> objectMap = i.getValue().entrySet().iterator().next();
////					System.out.println("objectMap is : " + objectMap);
////					aggregateMap.put(objectMap.getKey().concat("(sum)"), objectMap.getValue());
////				} else if(i.getValue().get("max") != null) {
////					Entry<String,Object> objectMap = i.getValue().entrySet().iterator().next();;
////					aggregateMap.put(objectMap.getKey().concat("(max"), objectMap.getValue());
////				} else if(i.getValue().get("min") != null) {
////					Entry<String,Object> objectMap = i.getValue().entrySet().iterator().next();;
////					aggregateMap.put(objectMap.getKey().concat("(min"), objectMap.getValue());
////				} else if(i.getValue().get("avg") != null) {
////					Entry<String,Object> objectMap = i.getValue().entrySet().iterator().next();;
////					aggregateMap.put(objectMap.getKey().concat("(avg"), objectMap.getValue());
////				}
////				
//				Entry<String,Object> object = i.getValue().entrySet().iterator().next();
//				aggregateMap.put(object.getKey(), object.getValue());
//				
//			}
//			aggregateList.add(aggregateMap);
//			System.out.println("aggregateMap is : " + aggregateMap);
//		}
		return aggregateDocuments;
	}


	public Set<String> getAllIndexes () throws IOException {

		ClusterHealthRequest request = new ClusterHealthRequest();
		ClusterHealthResponse response = client.cluster().health(request, RequestOptions.DEFAULT);
		Set<String> indices = response.getIndices().keySet();
		return indices;
	}

	public String getMappingOfIndex (String indexName) throws IOException {

		GetMappingsRequest request = new GetMappingsRequest();
		request.indices(indexName);
		GetMappingsResponse mappingResponse = client.indices().getMapping(request, RequestOptions.DEFAULT);
		ImmutableOpenMap<String, MappingMetaData> allMappings = mappingResponse.getMappings().get(indexName);
		MappingMetaData indexMapping = allMappings.get(indexName);
		return mappingResponse.toString();
	}

	public List<SourceDocument> findByIndex(String indexName) throws IOException {

		SearchRequest searchRequest = new SearchRequest(indexName);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		searchSourceBuilder.query(QueryBuilders.matchAllQuery());
		searchRequest.source(searchSourceBuilder);
		SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
		return getSearchResult(searchResponse);
	}

	public Set<Object> getAllPossibleValuesOfAttribute (String indexName, String attributeName) throws IOException{

		Set<Object> setValues = new HashSet<>();
		String attName =attributeName;
		SearchRequest searchRequest = new SearchRequest(indexName);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		searchSourceBuilder.query(QueryBuilders.matchAllQuery());
		AggregationBuilder aggregation= AggregationBuilders.terms("source_aggs")
				.field(attName)
				.size(1000)
				.order(BucketOrder.count(true));

		searchSourceBuilder.aggregation(aggregation);
		searchRequest.source(searchSourceBuilder);
		SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

		Terms aggrega = searchResponse.getAggregations().get("source_aggs");
		for (Terms.Bucket entry : aggrega.getBuckets()) {
			setValues.add( entry.getKey());
		}
		return setValues;

	}

	public boolean checkIfCompositeQuery(SearchQuery query) throws IOException{

		if(query.getAggregateQueryMap()==null||query.getAggregateQueryMap().size()==0){
			return false;
		}
		else
			return true;
	}

	private BoolQueryBuilder getPrefixBoolQueryBuilder(String esKey,String searchKeyword) {

		BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
		queryBuilder.must(QueryBuilders.prefixQuery(esKey, searchKeyword));
		return queryBuilder;
	}
	
	private BoolQueryBuilder getmustMatchBoolQueryBuilder(String esKey,String searchKeyword) {

		BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
		queryBuilder.must(QueryBuilders.matchQuery(esKey, searchKeyword));
		return queryBuilder;
	}
	
	public List<SourceDocument> mustMatchboolSearch(String esKey,String searchKeyword,String index) throws IOException {

		SearchRequest searchRequest = new SearchRequest(index);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		
		String searchKey = esKey.concat(".keyword");
		QueryBuilder queryBuilder = getmustMatchBoolQueryBuilder(searchKey,searchKeyword);

		searchSourceBuilder.query(queryBuilder);
		searchRequest.source(searchSourceBuilder);
		SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
		return getSearchResult(response);
	}
	
	
	public Map<String,List<Object>> prefixboolSearch(List<String> esKeyList,String searchKeyword) throws IOException {

		SearchRequest searchRequest = new SearchRequest("bluis_db1");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		
		Map<String,List<Object>> resultMap = new HashMap<>();
		
		for(String esKey : esKeyList) {
			List<Object> resultList = new ArrayList<>();
			String searchKey = esKey.concat(".keyword");
			QueryBuilder queryBuilder = getPrefixBoolQueryBuilder(searchKey,searchKeyword);
			searchSourceBuilder.query(queryBuilder);
			
			String agg = "source_aggs";
			String aggName = agg.concat(esKey);
			
			AggregationBuilder aggregation= AggregationBuilders.terms(aggName)
					.field(searchKey)
					.size(5)
					.order(BucketOrder.count(true));

			searchSourceBuilder.aggregation(aggregation);
			searchRequest.source(searchSourceBuilder);
			System.out.println("final query is "+ searchRequest);

			SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

			Terms aggrega = searchResponse.getAggregations().get(aggName);
			for (Terms.Bucket entry : aggrega.getBuckets()) {
				resultList.add( entry.getKey());
			}
			resultMap.put(esKey, resultList);
		}
		
		return resultMap;
	}
	
	
	

}
