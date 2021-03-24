package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.elasticsearch.script.Script;

@Getter
@AllArgsConstructor
public class AggregateQuery {

    int size;
    Query termsQuery;
    Query sumQuery;
    Query maxQuery;
    Query minQuery;
    Query avgQuery;
    Query filterQuery;

    public AggregateQuery() {
        size = 1000;
        termsQuery = new Query();
        sumQuery = new Query();
        maxQuery = new Query();
        minQuery = new Query();
        avgQuery = new Query();
        filterQuery = new Query();
    }

    public void setSize(int size) { this.size = size; }

    public void putTermsQuery(String name, String field) { this.termsQuery.putTerms(name, field); }

    public void putTermsQuery(String name, Script code) { this.termsQuery.putScript(name, code); }

    public void putSumQuery(String name, String field) { this.sumQuery.putTerms(name, field); }

    public void putSumQuery(String name, Script code) { this.sumQuery.putScript(name, code); }

    public void putFilterQuery(String name, String field) { this.filterQuery.putTerms(name, field); }

    public void putFilterQuery(String name, Script code) { this.filterQuery.putScript(name, code); }

    public void putMaxQuery(String name, String field) { this.maxQuery.putTerms(name, field); }

    public void putMaxQuery(String name, Script code) { this.maxQuery.putScript(name, code); }

    public void putMinQuery(String name, String field) { this.minQuery.putTerms(name, field); }

    public void putMinQuery(String name, Script code) { this.minQuery.putScript(name, code); }

    public void putAvgQuery(String name, String field) { this.avgQuery.putTerms(name, field); }

    public void putAvgQuery(String name, Script code) { this.avgQuery.putScript(name, code); }





}
