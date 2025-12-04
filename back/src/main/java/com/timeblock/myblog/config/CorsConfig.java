package com.timeblock.myblog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry corsRegistry) {

        
        corsRegistry.addMapping("/**")
                .allowedOriginPatterns("*") //패턴 기반 origin 허용 (credentials와 호환)
                .allowedHeaders("*") //모든 헤더 허락
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") //명시적 메소드 허용
                .allowCredentials(true) //인증 정보 허용
                .maxAge(3600); //preflight 요청 캐시 시간

        

    }
}
