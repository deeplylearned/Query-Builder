package com.vassarlabs.querybuilder.proj.elasticsearch.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.AggregateQuery;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.RangeSet;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.SearchQuery;

import java.io.IOException;

public class Test {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) throws IOException {
        ElasticSearchService elasticSearchService = new ElasticSearchService();
        SearchQuery query = new SearchQuery("student_master");
        query.setSize(0);

//        elasticSearchService.testScriptAggregation(query);

//        query.setSize(0);
//        query.putMatch("monthData.1.cfmsStatus.keyword", "3");
//        query.putMatch("acYear.keyword", "2018-19");
//
//        AggregateQuery aggregateQuery6 = new AggregateQuery();
//        aggregateQuery6.setSize(1000);
//        aggregateQuery6.putTerms("acYear", "acYear.keyword");
//        aggregateQuery6.putTerms("deptCode", "deptCode");
//        aggregateQuery6.putTerms("collegeCode", "collegeCode");
//        aggregateQuery6.putTerms("mtfProceedingNo_month6", "monthData.6.proceedingsNo.keyword");
//        aggregateQuery6.putTerms("billGeneratedDate_month6", "monthData.6.billGeneratedDate");
//        aggregateQuery6.putTerms("billSubmittedDate_month6", "monthData.6.tbrDate");
//        aggregateQuery6.putTerms("transactionCompletedDate_month6", "monthData.6.transCompletedDate");
//
//        aggregateQuery6.putSum("mtfReleaseAmount_month6", "monthData.6.mtfRelease");
//        AggregateQuery aggregateQuery1 = new AggregateQuery();
//        aggregateQuery1.setSize(1000);
//        aggregateQuery1.putTerms("acYear", "acYear.keyword");
//        aggregateQuery1.putTerms("deptCode", "deptCode");
//        aggregateQuery1.putTerms("collegeCode", "collegeCode");
//        aggregateQuery1.putTerms("mtfProceedingNo_month1", "monthData.1.proceedingsNo.keyword");
//        aggregateQuery1.putTerms("billGeneratedDate_month1", "monthData.1.billGeneratedDate");
//        aggregateQuery1.putTerms("billSubmittedDate_month1", "monthData.1.tbrDate");
//        aggregateQuery1.putTerms("transactionCompletedDate_month1", "monthData.1.transCompletedDate");
//
//        aggregateQuery1.putSum("mtfReleaseAmount_month1", "monthData.1.mtfRelease");
//
//        query.putAggregate("my_buckets_month1", aggregateQuery1);

//          query.setSize(0);
//          query.putMatch("acYear.keyword", "2018-19");
//
//
//          AggregateQuery aggregateQuery = new AggregateQuery();
//          aggregateQuery.putTerms("acYear", "acYear.keyword");
//          aggregateQuery.setSize(1000);
//          aggregateQuery.putTerms("collegeCode", "collegeCode");
//          aggregateQuery.putTerms("studentId", "entityId.keyword");
//          aggregateQuery.putTerms("studentName", "entityName.keyword");
//          aggregateQuery.putTerms("courseCode", "courseCode");
//          aggregateQuery.putTerms("courseYear", "courseYear");
//
//          ScriptQuery scriptQuery = new ScriptQuery();
//          scriptQuery.setScriptType(ScriptType.INLINE);
//          scriptQuery.setLanguage("painless");
//          scriptQuery.setCode("int total = 0; " +
//                "if(doc.containsKey('monthData.1.mtfDemand') && !(doc['monthData.1.mtfDemand'].size()==0)) {" +
//                "total += doc['monthData.1.mtfDemand'].value" +
//                "}");
//          scriptQuery.setParams(Collections.emptyMap());
//
//          Script script = new Script(scriptQuery.getScriptType(),scriptQuery.getLanguage(),scriptQuery.getCode(),scriptQuery.getParams());
//
//          aggregateQuery.putScript("mtfReleaseSum", script);
//
//          query.putAggregate("my_buckets", aggregateQuery);

//          AggregateQuery aggQuery = new AggregateQuery();
//          aggQuery.setSize(1000);
//
//          ScriptQuery scriptQuery = new ScriptQuery();
//          scriptQuery.setScriptType(ScriptType.INLINE);
//          scriptQuery.setLanguage("painless");
//          scriptQuery.setCode("int total = 0; " +
//                "if(doc.containsKey('monthData.1.mtfDemand') && !(doc['monthData.1.mtfDemand'].size()==0)) {" +
//                "total += doc['monthData.1.mtfDemand'].value" +
//                "}");
//          scriptQuery.setParams(Collections.emptyMap());
//
//          Script script = new Script(scriptQuery.getScriptType(),scriptQuery.getLanguage(),scriptQuery.getCode(),scriptQuery.getParams());
//
//          aggQuery.putTermsQuery("acYear", "acYear.keyword");
//          aggQuery.putTermsQuery("studentId", "entityId.keyword");
//          aggQuery.putSumQuery("mtfReleaseAmount_month1", "monthData.1.mtfRelease");
//          aggQuery.putTermsQuery("mtfReleasesSum", script);
//          aggQuery.putSumQuery("sumQuery1", script);
//
//          query.putAggregate("my_buckets",aggQuery);
//
//          elasticSearchService.compositeAggregation(query);

        query.putMatch("acYear.keyword", "2018-19");
       // query.putRangeQuerySet("month", new RangeSet(1,4));

        for (int month = 1; month < 3; month++) {

            AggregateQuery aggregateQuery = new AggregateQuery();
            aggregateQuery.setSize(1000000);
            aggregateQuery.putTermsQuery("acYear", "acYear.keyword");
            aggregateQuery.putTermsQuery("deptCode", "deptCode");
            aggregateQuery.putTermsQuery("collegeCode", "collegeCode");
            aggregateQuery.putTermsQuery("mtfProceedingNo", "monthData."+month+".proceedingsNo.keyword");
            aggregateQuery.putTermsQuery("billGenetbrDateratedDate", "monthData."+month+".billGeneratedDate");
            aggregateQuery.putTermsQuery("billSubmittedDate", "monthData."+month+".");
            aggregateQuery.putTermsQuery("transactionCompletedDate", "monthData."+month+".transCompletedDate");

            aggregateQuery.putSumQuery("mtfReleaseAmount", "monthData."+month+".mtfRelease");
            aggregateQuery.putFilterQuery("monthData."+month+".cfmsStatus.keyword", "3");

            query.putAggregate(month+"", aggregateQuery);
        }

        try {
            System.out.println(mapper.writeValueAsString(query));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
