package com.vassarlabs.querybuilder.proj.elasticsearch.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Configuration
//@EnableElasticsearchRepositories(basePackages = "org/springframework/data/elasticsearch/repositories")
public class ElasticSearchConfig {

    @Autowired
    ElasticSearchConfigProperties elasticSearchConfigProperties;


    @Bean("elasticClient")
    public RestHighLevelClient client() {

        System.out.println("Elasticsearch client being initialized! = "+elasticSearchConfigProperties.getHosts()+":"+elasticSearchConfigProperties.getPorts());

        //https://www.elastic.co/guide/en/elasticsearch/client/java-rest/current/java-rest-high-getting-started-initialization.html

        Assert.notNull(elasticSearchConfigProperties.getHosts(), "please initialise configuration properly");
        Assert.notNull(elasticSearchConfigProperties.getPorts(), "please initialise configuration properly");

        List<HttpHost> httpHosts = new ArrayList<>();
        List<String> ipHosts = elasticSearchConfigProperties.getHosts();//Arrays.asList(hosts.split(","));
        List<String> ipPorts = elasticSearchConfigProperties.getPorts();//Arrays.asList(ports.split(","));

        Assert.isTrue(ipHosts.size() == ipPorts.size(), "please initialise configuration properly");

        for (int itr = 0; itr < ipHosts.size() ; itr++) {
            httpHosts.add(new HttpHost(ipHosts.get(itr), Integer.parseInt(ipPorts.get(itr)), "http"));
        }

        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(httpHosts.toArray(new HttpHost[httpHosts.size()]))
        );

        System.out.println("Elasticsearch client initialized!");
    	
//    	RestHighLevelClient client = new RestHighLevelClient(
//    			RestClient.builder(new HttpHost("localhost",9200,"http")));

        return client;
    }

}