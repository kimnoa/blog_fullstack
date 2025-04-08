package com.timeblock.myblog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        corsRegistry.addMapping("/**")
                .allowedOrigins("*") //어떤 출처이든 허락
                .allowedHeaders("*") //모든 헤더 허락
                .allowedMethods("*"); //어떤 메소드이든 허락

//        source.registerCorsConfiguration("/**",corsRegistry.);
    }
}
