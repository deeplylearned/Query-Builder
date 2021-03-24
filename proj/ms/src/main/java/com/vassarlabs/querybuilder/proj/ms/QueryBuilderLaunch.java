package com.vassarlabs.querybuilder.proj.ms;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.vassarlabs.querybuilder.proj.*"})
public class QueryBuilderLaunch {

    private static ConfigurableApplicationContext context;

    public static void main(String[] args) {

        context = new SpringApplicationBuilder(QueryBuilderLaunch.class)
                .web(WebApplicationType.REACTIVE)
                .build()
                .run(args);
    }

}