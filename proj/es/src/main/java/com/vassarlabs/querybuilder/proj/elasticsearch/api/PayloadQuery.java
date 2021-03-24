package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
public class PayloadQuery {

    String index;
    int from;
    int size;
    Map<String, String> match;
    Map<String, Boolean> boolMatch;
    Map<String, Integer> intMatch;
    Map<String, RangeSet> rangeQuerySet;
    Map<String, Number> term;
    Map<String, String> terms;
    Map<String, AggregateQuery> aggregateQueryMap;
    Map<String,String> stringTerm;

    public PayloadQuery() {
        from = 0;
        size = 1000;
        match = new HashMap<>();
        boolMatch = new HashMap<>();
        intMatch = new HashMap<>();
        term = new HashMap<>();
        terms = new HashMap<>();
        stringTerm= new HashMap<>();
        rangeQuerySet= new HashMap<>();
        aggregateQueryMap = new HashMap<>();
    }

    public PayloadQuery(String index) {
        this.index = index;
        from = 0;
        size = 1000;
        match = new HashMap<>();
        boolMatch = new HashMap<>();
        intMatch = new HashMap<>();
        term = new HashMap<>();
        terms = new HashMap<>();
        stringTerm= new HashMap<>();rangeQuerySet= new HashMap<>();
        aggregateQueryMap = new HashMap<>();
    }

    public void setSize(int size) { this.size = size; }

    public void putMatch(String key, String val) {
        this.match.put(key, val);
    }

    public void putBoolMatch(String key, Boolean val) {this.boolMatch.put(key, val);}

    public void putIntMatch(String key, Integer val) {this.intMatch.put(key, val);}

    //public void putRangeFieldName(String fieldName) {this.rangeFieldName = fieldName;}

    public void putRangeQuerySet(String key, RangeSet val) {
        this.rangeQuerySet.put(key, val);
    }

    public void putTerm(String key, Number val) {
        this.term.put(key, val);
    }

    public void putTerms(String key, String val) {
        this.terms.put(key, val);
    }

    public void putAggregate(String key, AggregateQuery val) {
        this.aggregateQueryMap.put(key, val);
    }

    public void putStringTerm(String key, String value) {
        this.stringTerm.put(key,value);
    }


}
