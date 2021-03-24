package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.lucene.util.fst.PairOutputs;

import java.util.*;

@Getter
@AllArgsConstructor
public class SearchQuery {

    String index;
    int from;
    int size;
    String source;
    String result;
    Map<String, String> match;
    Map<String, Boolean> boolMatch;
    Map<String, Integer> intMatch;
    Map<String, RangeSet> rangeQuerySet;
    Map<String, Number> term;
    Map<String, Set<Number>> terms;
    Map<String, Set<String>> termsString;
    Map<String, AggregateQuery> aggregateQueryMap;
    Map<String,String> stringTerm;

    public SearchQuery() {
        from = 0;
        size = 1000;
        result= new String();
        match = new HashMap<>();
        boolMatch = new HashMap<>();
        intMatch = new HashMap<>();
        term = new HashMap<>();
        terms = new HashMap<>();
        termsString= new HashMap<>();
        stringTerm= new HashMap<>();
        rangeQuerySet= new HashMap<>();
        aggregateQueryMap = new HashMap<>();
        
    }

    public SearchQuery(String index) {
        this.index = index;
        from = 0;
        size = 1000;
        result= new String();
        match = new HashMap<>();
        boolMatch = new HashMap<>();
        intMatch = new HashMap<>();
        term = new HashMap<>();
        terms = new HashMap<>();
        termsString= new HashMap<>();
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

    public void putTerms(String key, Set<Number> val) {
        this.terms.put(key, val);
    }
    
    public void putTermsString(String key, Set<String> val) {
        this.termsString.put(key, val);
    }


    public void putAggregate(String key, AggregateQuery val) {
        this.aggregateQueryMap.put(key, val);
    }

    public void putStringTerm(String key, String value) {
        this.stringTerm.put(key,value);
    }

	public void setIndex(String index) {
		this.index = index;
	}
	
	public void setResult(String result) {
		this.result = result;
	}

	public void setFrom(int from) {
		this.from = from;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public void setMatch(Map<String, String> match) {
		this.match = match;
	}

	public void setBoolMatch(Map<String, Boolean> boolMatch) {
		this.boolMatch = boolMatch;
	}

	public void setIntMatch(Map<String, Integer> intMatch) {
		this.intMatch = intMatch;
	}

	public void setRangeQuerySet(Map<String, RangeSet> rangeQuerySet) {
		this.rangeQuerySet = rangeQuerySet;
	}

	public void setTerm(Map<String, Number> term) {
		this.term = term;
	}

	public void setTerms(Map<String, Set<Number>> terms) {
		this.terms = terms;
	}

	public void setTermsString(Map<String, Set<String>> termsString) {
		this.termsString = termsString;
	}

	public void setAggregateQueryMap(Map<String, AggregateQuery> aggregateQueryMap) {
		this.aggregateQueryMap = aggregateQueryMap;
	}

	public void setStringTerm(Map<String, String> stringTerm) {
		this.stringTerm = stringTerm;
	}


}
